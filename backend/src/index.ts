import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json()); // Parse JSON bodies

const UPLOADS = path.join(process.cwd(), "uploads");
const GENERATED = path.join(process.cwd(), "generated");
if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS);
if (!fs.existsSync(GENERATED)) fs.mkdirSync(GENERATED);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOADS),
  filename: (_, file, cb) => {
    const safe = `${Date.now()}-${file.originalname.replace(
      /[^a-z0-9_.-]/gi,
      "_"
    )}`;
    cb(null, safe);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (_, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/html",
      "text/markdown",
      "text/plain",
    ];
    if (
      allowed.includes(file.mimetype) ||
      /\.(pdf|doc|docx|html|htm|md|txt)$/i.test(file.originalname)
    )
      cb(null, true);
    else cb(new Error("Invalid file type"));
  },
});

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function validateHtml(html: string): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  // Check for basic HTML structure
  if (!html.includes("<!doctype html>") && !html.includes("<html")) {
    missing.push("HTML document structure");
  }

  // Check for required navigation elements
  const requiredIds = [
    "prevBtn",
    "nextBtn",
    "submitQuiz",
    "progressFill",
    "retryBtn",
    "resetBtn",
  ];
  for (const id of requiredIds) {
    if (!html.includes(`id="${id}"`) && !html.includes(`id='${id}'`)) {
      missing.push(`${id} element`);
    }
  }

  // Check for quiz structure
  if (!html.includes("data-correct=")) {
    missing.push("data-correct attributes on questions");
  }
  if (!html.includes('type="radio"')) {
    missing.push("radio input elements for quiz");
  }

  return { valid: missing.length === 0, missing };
}

function sanitizeHtml(input: string) {
  let out = input;
  // Remove external script tags (with src=...)
  out = out.replace(
    /<script[^>]+src=["'][^"']+["'][^>]*>[\s\S]*?<\/script>/gi,
    ""
  );
  // Remove on* attributes (onclick, onerror, etc.)
  out = out.replace(/\son\w+=["'][\s\S]*?["']/gi, "");
  // Remove javascript: URIs in href/src
  out = out.replace(/(href|src)=["']javascript:[^"']*["']/gi, '$1="#"');
  return out;
}

app.use("/uploads", express.static(UPLOADS));
app.use("/generated", express.static(GENERATED));

// Download route: forces the browser to download the generated HTML file
app.get("/generated/:name/download", (req, res) => {
  try {
    const name = path.basename(req.params.name);
    const p = path.join(GENERATED, name);

    console.log("Download request for:", name);
    console.log("File path:", p);
    console.log("File exists:", fs.existsSync(p));

    if (!fs.existsSync(p)) {
      console.error("File not found:", p);
      return res.status(404).send("File not found");
    }

    const stats = fs.statSync(p);
    console.log("File size:", stats.size, "bytes");

    res.setHeader("Content-Disposition", `attachment; filename="${name}"`);
    res.setHeader("Content-Type", "text/html");
    return res.sendFile(p);
  } catch (err: any) {
    console.error("download error", err);
    return res.status(500).send("Download failed");
  }
});

app.post(
  "/api/generate",
  upload.fields([
    { name: "attachment", maxCount: 1 },
    { name: "template", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const moduleName = (req.body.moduleName || "").toString();
      const difficulty = (req.body.difficulty || "easy").toString();
      const numQuestions = Number(req.body.numQuestions || 10);
      const selectedTemplate = (req.body.selectedTemplate || "").toString();

      console.log("Received parameters:");
      console.log("- moduleName:", moduleName);
      console.log("- difficulty:", difficulty);
      console.log("- numQuestions:", numQuestions);
      console.log("- selectedTemplate:", selectedTemplate);

      let mediaItems: Array<{
        id: string;
        type: string;
        url: string;
        description: string;
      }> = [];
      if (req.body.mediaItems) {
        try {
          mediaItems =
            typeof req.body.mediaItems === "string"
              ? JSON.parse(req.body.mediaItems)
              : req.body.mediaItems;
        } catch {
          console.warn("Failed to parse mediaItems, using empty array");
          mediaItems = [];
        }
      }

      const files = (req as any).files || {};
      const attachmentFile = Array.isArray(files.attachment)
        ? files.attachment[0]
        : undefined;
      const templateFile = Array.isArray(files.template)
        ? files.template[0]
        : undefined;

      if (!moduleName)
        return res
          .status(400)
          .json({ ok: false, error: "moduleName required" });
      if (!attachmentFile)
        return res
          .status(400)
          .json({ ok: false, error: "attachment required" });

      const attachmentPath = `/uploads/${path.basename(attachmentFile.path)}`;

      // Extract text or HTML from the attachment (PDF/DOCX/HTML)
      let attachmentContent = "";
      try {
        const ext = path
          .extname(attachmentFile.originalname || "")
          .toLowerCase();
        if (ext === ".pdf") {
          // optional pdf extraction (pdf-parse may not be installed in every environment)
          let pdfParse: any = null;
          try {
            pdfParse = require("pdf-parse");
          } catch (e) {
            console.warn(
              "pdf-parse not installed; skipping PDF text extraction"
            );
          }
          if (pdfParse) {
            const dataBuffer = fs.readFileSync(attachmentFile.path);
            const parsed = await pdfParse(dataBuffer);
            attachmentContent = parsed.text || "";
          } else {
            attachmentContent = "";
          }
        } else if (ext === ".docx") {
          // optional docx extraction via mammoth
          let mammoth: any = null;
          try {
            mammoth = require("mammoth");
          } catch (e) {
            console.warn(
              "mammoth not installed; skipping DOCX to HTML conversion"
            );
          }
          if (mammoth && typeof mammoth.convertToHtml === "function") {
            const result = await mammoth.convertToHtml({
              path: attachmentFile.path,
            });
            attachmentContent = result.value || "";
          } else {
            attachmentContent = "";
          }
        } else if (ext === ".html" || ext === ".htm") {
          attachmentContent = fs.readFileSync(attachmentFile.path, "utf-8");
        } else {
          // fallback: try reading as utf-8 text
          try {
            attachmentContent = fs.readFileSync(attachmentFile.path, "utf-8");
          } catch {
            attachmentContent = "";
          }
        }
      } catch (ex) {
        console.warn("Attachment parsing failed", ex);
        attachmentContent = "";
      }

      // CRITICAL: Limit attachment content to prevent token overflow
      // Roughly 4 chars = 1 token, so 100k chars ≈ 25k tokens
      const maxContentLength = 100000; // ~25k tokens for content
      if (attachmentContent.length > maxContentLength) {
        console.warn(
          `Attachment content truncated from ${attachmentContent.length} to ${maxContentLength} chars`
        );
        attachmentContent =
          attachmentContent.substring(0, maxContentLength) +
          "\n\n[Content truncated due to size limits...]";
      }

      // Read design instructions based on selected template or uploaded file
      let designInstructions;
      try {
        if (templateFile && fs.existsSync(templateFile.path)) {
          // Custom template uploaded
          designInstructions = fs.readFileSync(templateFile.path, "utf-8");
          console.log(
            "Using uploaded design instructions:",
            templateFile.filename
          );
        } else if (selectedTemplate && selectedTemplate !== "custom") {
          // Map template IDs 1,2,3 to design files
          let templateFilename;
          if (selectedTemplate === "1") {
            templateFilename = "design1.md";
          } else if (selectedTemplate === "2") {
            templateFilename = "design2.md";
          } else if (selectedTemplate === "3") {
            templateFilename = "design3.md";
          } else {
            // For backward compatibility with design1, design2, etc.
            templateFilename = `${selectedTemplate}.md`;
          }

          const templatePath = path.join(
            process.cwd(),
            "templates",
            templateFilename
          );

          if (fs.existsSync(templatePath)) {
            designInstructions = fs.readFileSync(templatePath, "utf-8");
            console.log(
              `Using selected template: ${selectedTemplate} (${templateFilename})`
            );
          } else {
            throw new Error(
              `Template "${selectedTemplate}" (${templateFilename}) not found`
            );
          }
        } else {
          // Use default template (design2.md for better consistency)
          const templatesDir = path.join(process.cwd(), "templates");
          const enhancedDesignPath = path.join(templatesDir, "design2.md");
          const defaultDesignPath = path.join(templatesDir, "design1.md");

          // Fallback to root directory if templates directory doesn't exist
          const rootEnhancedPath = path.join(process.cwd(), "design2.md");
          const rootDefaultPath = path.join(process.cwd(), "design1.md");

          if (fs.existsSync(enhancedDesignPath)) {
            designInstructions = fs.readFileSync(enhancedDesignPath, "utf-8");
            console.log(
              "Using enhanced design instructions: templates/design2.md"
            );
          } else if (fs.existsSync(defaultDesignPath)) {
            designInstructions = fs.readFileSync(defaultDesignPath, "utf-8");
            console.log(
              "Using default design instructions: templates/design1.md"
            );
          } else if (fs.existsSync(rootEnhancedPath)) {
            designInstructions = fs.readFileSync(rootEnhancedPath, "utf-8");
            console.log("Using enhanced design instructions: design2.md");
          } else if (fs.existsSync(rootDefaultPath)) {
            designInstructions = fs.readFileSync(rootDefaultPath, "utf-8");
            console.log("Using default design instructions: design1.md");
          } else {
            throw new Error("No design instructions file found");
          }
        }
      } catch (ex) {
        console.error("Failed to read design instructions:", ex);
        return res.status(500).json({
          ok: false,
          error: "Failed to load design instructions",
        });
      }

      // Design instructions are critical - DO NOT truncate them
      // The complete instructions ensure consistent, functional modules
      console.log(
        `Using complete design instructions: ${designInstructions.length} characters`
      );

      const system = `You are an expert frontend developer creating educational modules. 

🚨 ABSOLUTE REQUIREMENTS - ZERO TOLERANCE FOR OMISSIONS:
1. EVERY WORD EXTRACTION: Extract and include EVERY SINGLE WORD, SENTENCE, PARAGRAPH from source
2. UNLIMITED SLIDES: Create 10, 15, 20+ slides if needed - NO SLIDE COUNT LIMITS EVER
3. ZERO CONDENSING: Never summarize, paraphrase, or shorten ANY content from source
4. WORD-FOR-WORD: Use exact language and complete sentences from source document
5. COMPLETE PROCEDURES: Include every step, substep, detail of any process
6. ALL EXAMPLES: Every case study, scenario, illustration must be included completely
7. CONSISTENCY: All modules must have identical layouts, spacing, and styling
8. PERFECT QUIZ LAYOUT: All quiz options must be properly aligned and spaced consistently
4. EXACT STRUCTURE: Follow DESIGN_INSTRUCTIONS precisely - no variations or shortcuts
5. MEDIA PLACEHOLDERS: Replace any placeholders like {{image:ID}} or {{video:ID}} found in source content with actual HTML elements using corresponding URLs from Media Items
6. MANDATORY LOCALSTORAGE: MUST include localStorage functionality for score and progress persistence

MANDATORY LOCALSTORAGE IMPLEMENTATION:
- MUST include localStorage.setItem("score", score.toString()) in submitQuiz function after score calculation
- MUST include localStorage.setItem("passed", "true") when quiz is passed (score >= 75%)
- MUST include localStorage.setItem("progress", this.currentSlide) in saveProgress function
- MUST include localStorage.getItem("score"), localStorage.getItem("passed"), and localStorage.getItem("progress") in loadProgress function
- This localStorage functionality is CRITICAL for user progress tracking and MUST be included in every generated module

MEDIA PLACEHOLDER PROCESSING - CONSISTENT SIZING:
- When you encounter {{image:ID}}, replace with: <div class="media-container"><img src="[URL_FOR_ID]" alt="[DESCRIPTION_FOR_ID]" class="responsive-image"></div>
- When you encounter {{video:ID}}, replace with: <div class="media-container"><video src="[URL_FOR_ID]" controls class="responsive-video">[DESCRIPTION_FOR_ID]</video></div>
- ALWAYS wrap images and videos in media-container div for consistent 300px height
- Match the ID in the placeholder with the corresponding Media Item to get the URL and description
- If no matching Media Item is found for an ID, replace with: <div class="media-placeholder">[Media: ID not found]</div>
- The CSS provides consistent sizing: all images/videos will be 300px height with proper aspect ratio maintained via object-fit: cover

OUTPUT REQUIREMENT: Generate EXACTLY ONE complete HTML document. Output ONLY the HTML - no explanations, no markdown fences, no extra text.

The HTML document must be fully functional and self-contained for student use.`;

      // Build enhanced user prompt with specific requirements
      let user = `DESIGN_INSTRUCTIONS (FOLLOW EXACTLY - NO DEVIATIONS):
${designInstructions}

MODULE_DATA:
- Name: ${moduleName}
- Difficulty: ${difficulty}  
- Questions: ${numQuestions}
- Media Items: ${JSON.stringify(mediaItems)}

CRITICAL REQUIREMENTS FOR THIS MODULE:
⚠️ COMPLETE JAVASCRIPT - Must include ModuleController class, all navigation functions, and event handlers
⚠️ WORKING BUTTONS - All navigation, quiz, retry, and reset buttons must be functional
⚠️ DO NOT TRUNCATE - Generate complete HTML file even if output is long
🚨 MANDATORY WORD-FOR-WORD EXTRACTION - Include EVERY single word from source document
🚨 UNLIMITED SLIDES REQUIRED - Create 10, 15, 20+ slides if source content demands it
🚨 ZERO EDITORIAL DECISIONS - Do not decide what is "important" vs "less important" - include everything
🚨 COPY-PASTE MENTALITY - Treat source as sacred text that cannot be altered or shortened
🚨 NO PARAPHRASING ALLOWED - Use exact language and terminology from source
🚨 COMPLETE EXTRACTION - Source word count should approximately equal slide content word count
⚠️ MAINTAIN LAYOUT CONSISTENCY - Use exact CSS dimensions and spacing as specified
⚠️ PERFECT QUIZ ALIGNMENT - Ensure all quiz options are properly formatted and aligned
⚠️ MANDATORY LOCALSTORAGE - MUST include localStorage.setItem for score, passed status, and progress tracking
⚠️ SCORE PERSISTENCE - After calculating quiz score, MUST save it: localStorage.setItem("score", score.toString())
⚠️ COMPLETION TRACKING - When quiz passed, MUST save: localStorage.setItem("passed", "true")

PRIMARY_CONTENT_SOURCE:
${
  attachmentContent ||
  `Content extraction failed. Use filename "${attachmentFile.originalname}" as reference for ${moduleName} module.`
}

🚨🚨 UNBREAKABLE CONTENT EXTRACTION RULES 🚨🚨:
🚨 EXTRACT EVERY SINGLE WORD from the source document above - count sentences to verify
🚨 CREATE UNLIMITED SLIDES (10, 15, 20+ slides) to accommodate all content
🚨 NEVER EVER condense, summarize, paraphrase, or skip even one sentence
🚨 PRESERVE ORIGINAL LANGUAGE - use exact phrasing from document
🚨 INCLUDE ALL DETAILS - every explanation, example, procedure, definition
🚨 NO SLIDE LIMITS - document length determines slide count, not arbitrary numbers
🚨 MENTAL MODEL: You are a court stenographer preserving every word, not an editor

MANDATORY CODE SNIPPETS TO INCLUDE:
The submitQuiz() function MUST contain these exact lines after score calculation:
  // Store score in localStorage
  localStorage.setItem("score", score.toString());
  
  // Store passed status if successful
  if (passed) {
    localStorage.setItem("passed", "true");
  }

The loadProgress() function MUST contain these exact lines:
  if (localStorage.getItem("passed") === "true") {
    const score = localStorage.getItem("score") || "75";
    // Show completion banner with actual score
  }

TASK: Generate a complete interactive educational HTML module following the DESIGN_INSTRUCTIONS above. Use the PRIMARY_CONTENT_SOURCE for all educational content and generate exactly ${numQuestions} quiz questions at ${difficulty} difficulty level.`;

      console.log(
        `Final prompt includes: ${numQuestions} questions at ${difficulty} difficulty`
      );

      // Estimate total tokens (rough: 4 chars = 1 token)
      const systemTokens = Math.ceil(system.length / 4);
      const userTokens = Math.ceil(user.length / 4);
      const totalInputTokens = systemTokens + userTokens;

      console.log(
        `Token estimates - System: ${systemTokens}, User: ${userTokens}, Total: ${totalInputTokens}`
      );

      if (totalInputTokens > 150000) {
        // Leave room for output tokens
        return res.status(400).json({
          ok: false,
          error: `Input too large (${totalInputTokens} tokens). Please use smaller documents or fewer media items.`,
        });
      }

      // Token estimation for debugging
      const systemPromptTokens = Math.ceil(system.length / 4);
      const userPromptTokens = Math.ceil(user.length / 4);
      const totalEstimatedTokens = systemPromptTokens + userPromptTokens;

      console.log("Token Estimation:", {
        systemPrompt: `${systemPromptTokens} tokens (${system.length} chars)`,
        userPrompt: `${userPromptTokens} tokens (${user.length} chars)`,
        totalEstimated: `${totalEstimatedTokens} tokens`,
      });

      // Generate HTML module
      console.log("Generating HTML module...");

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.3,
        max_completion_tokens: 16000, // Increased for complete HTML with full JavaScript
      });

      let html = completion.choices?.[0]?.message?.content || "";
      if (!html) {
        return res
          .status(500)
          .json({ ok: false, error: "Empty response from OpenAI" });
      }

      // Strip common markdown fences (```html ... ```)
      html = html.replace(/^\s*```(?:html)?\s*/i, "");
      html = html.replace(/\s*```\s*$/i, "");

      // Validate the generated HTML
      const validation = validateHtml(html);
      console.log("Validation result:", validation);

      if (!validation.valid) {
        console.warn(
          "Generated HTML missing required elements:",
          validation.missing
        );
        // Continue anyway - design instructions should have guided the model properly
      }

      // Apply basic sanitization
      const finalHtml = sanitizeHtml(html);

      const fileName = `module-${Date.now()}.html`;
      const fullPath = path.join(GENERATED, fileName);

      console.log("Generated HTML length:", finalHtml.length, "characters");
      console.log("Writing file to:", fullPath);

      fs.writeFileSync(fullPath, finalHtml, "utf-8");

      // Verify file was written
      const fileStats = fs.statSync(fullPath);
      console.log("File written successfully. Size:", fileStats.size, "bytes");

      // Return response structure expected by frontend
      return res.json({
        ok: true,
        filename: fileName,
        viewUrl: `/generated/${fileName}`,
        downloadUrl: `/generated/${fileName}/download`,
      });
    } catch (err: any) {
      console.error(err);
      return res
        .status(500)
        .json({ ok: false, error: err.message || String(err) });
    }
  }
);

const port = Number(process.env.PORT || 5174);
app.listen(port, () =>
  console.log(`backend listening on http://localhost:${port}`)
);
