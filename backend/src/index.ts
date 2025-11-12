import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import OpenAI from 'openai'

dotenv.config()

const app = express()
app.use(cors())
app.use(morgan('tiny'))

const UPLOADS = path.join(process.cwd(), 'uploads')
const GENERATED = path.join(process.cwd(), 'generated')
if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS)
if (!fs.existsSync(GENERATED)) fs.mkdirSync(GENERATED)

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOADS),
  filename: (_, file, cb) => {
    const safe = `${Date.now()}-${file.originalname.replace(/[^a-z0-9_.-]/gi, '_')}`
    cb(null, safe)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (_, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/html'
    ]
    if (allowed.includes(file.mimetype) || /\.(pdf|doc|docx|html|htm)$/i.test(file.originalname)) cb(null, true)
    else cb(new Error('Invalid file type'))
  }
})

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function validateHtml(html: string): { valid: boolean; missing: string[] } {
  const missing: string[] = []
  
  // Check for basic HTML structure
  if (!html.includes('<!doctype html>') && !html.includes('<html')) {
    missing.push('HTML document structure')
  }
  
  // Check for required navigation elements
  if (!html.includes('id="prevBtn"') && !html.includes("id='prevBtn'")) {
    missing.push('prevBtn element')
  }
  if (!html.includes('id="nextBtn"') && !html.includes("id='nextBtn'")) {
    missing.push('nextBtn element')
  }
  if (!html.includes('id="submitQuiz"') && !html.includes("id='submitQuiz'")) {
    missing.push('submitQuiz button')
  }
  if (!html.includes('id="retryBtn"') && !html.includes("id='retryBtn'")) {
    missing.push('retryBtn element')
  }
  if (!html.includes('id="reviewBtn"') && !html.includes("id='reviewBtn'")) {
    missing.push('reviewBtn element')
  }
  
  // Check for progress elements
  if (!html.includes('id="progressFill"') && !html.includes("id='progressFill'")) {
    missing.push('progressFill element')
  }
  
  // Check for quiz structure
  if (!html.includes('data-correct=')) {
    missing.push('data-correct attributes on questions')
  }
  if (!html.includes('type="radio"')) {
    missing.push('radio input elements for quiz')
  }
  
  // Check for script functionality
  const hasScript = /<script[\s\S]*?>[\s\S]*?<\/script>/i.test(html)
  if (!hasScript) {
    missing.push('JavaScript functionality')
  } else {
    // Check if script contains navigation functions
    const scriptContent = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/i)?.[1] || ''
    if (!scriptContent.includes('addEventListener') && !scriptContent.includes('onclick')) {
      missing.push('event listeners in JavaScript')
    }
  }
  
  return { valid: missing.length === 0, missing }
}

function sanitizeHtml(input: string) {
  let out = input
  // Remove external script tags (with src=...)
  out = out.replace(/<script[^>]+src=["'][^"']+["'][^>]*>[\s\S]*?<\/script>/gi, '')
  // For inline scripts, allow them only if they don't contain forbidden patterns (network calls)
  out = out.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, (m, code) => {
    const forbidden = /\b(fetch|XMLHttpRequest|WebSocket|EventSource|navigator\.sendBeacon|import\(|eval|new Function)\b/i
    if (forbidden.test(code)) return ''
    return `<script>${code}</script>`
  })
  // Remove on* attributes (onclick, onerror, etc.)
  out = out.replace(/\son\w+=["'][\s\S]*?["']/gi, '')
  // Remove javascript: URIs in href/src
  out = out.replace(/(href|src)=["']javascript:[^"']*["']/gi, '$1="#"')
  return out
}

function injectRequiredElements(html: string, validation: { valid: boolean; missing: string[] }): string {
  let updatedHtml = html
  
  // If HTML is completely malformed, regeneration is needed - don't inject hardcoded template
  if (validation.missing.includes('HTML document structure')) {
    console.log('HTML document structure is completely malformed - regeneration required')
    return html // Return as-is, let the retry logic handle it
  }
  
  // Inject missing navigation elements with minimal styling (let model's styles take precedence)
  const needsNavigation = validation.missing.some(item => 
    ['prevBtn element', 'nextBtn element', 'submitQuiz button', 'retryBtn element', 'reviewBtn element'].includes(item)
  )
  
  if (needsNavigation) {
    const navigationHtml = `
        <div class="navigation">
            <button id="prevBtn" style="display: none;">Previous</button>
            <button id="nextBtn">Next</button>
            <button id="submitQuiz" style="display: none;">Submit Quiz</button>
            <button id="retryBtn" style="display: none;">Retry Quiz</button>
            <button id="reviewBtn" style="display: none;">Review Module</button>
        </div>`
    
    if (updatedHtml.includes('</body>')) {
      updatedHtml = updatedHtml.replace('</body>', navigationHtml + '\n</body>')
    }
  }
  
  // Inject progress bar with minimal styling (let model's styles take precedence)
  if (validation.missing.includes('progressFill element')) {
    const progressHtml = `
        <div class="progress-bar">
            <div id="progressFill" style="width: 0%;"></div>
        </div>`
    
    // Try to inject after first heading or at start of body
    if (updatedHtml.includes('<h1')) {
      updatedHtml = updatedHtml.replace(/<h1[^>]*>.*?<\/h1>/i, match => match + progressHtml)
    } else if (updatedHtml.includes('<body')) {
      updatedHtml = updatedHtml.replace(/<body[^>]*>/i, match => match + progressHtml)
    }
  }
  
  // Inject comprehensive navigation script that overrides any incomplete model-generated scripts
  const navigationScript = `
<script>
// Force override any incomplete navigation functions
window.currentSlide = window.currentSlide || 0;
window.quizPassed = window.quizPassed || false;
const slides = document.querySelectorAll('[data-slide], .slide');
const progressFill = document.getElementById('progressFill');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitQuiz');
const retryBtn = document.getElementById('retryBtn');
const reviewBtn = document.getElementById('reviewBtn');

function showSlide(n) {
    slides.forEach((slide, index) => {
        if (slide.classList) {
            slide.classList.toggle('active', index === n);
        }
        slide.style.display = index === n ? 'block' : 'none';
    });
    updateProgress();
    updateButtons();
    updateSlideCounter();
}

function updateSlideCounter() {
    // Update slide counter display (look for common patterns)
    const counterElements = document.querySelectorAll('#slideCounter, .slide-counter, .section-counter, .progress-text');
    counterElements.forEach(counter => {
        if (counter) {
            const currentNum = currentSlide + 1;
            const totalNum = slides.length;
            // Update text content with current slide info
            if (counter.textContent && counter.textContent.includes('of')) {
                counter.textContent = counter.textContent.replace(/\d+\s*of\s*\d+/, \`\${currentNum} of \${totalNum}\`);
            } else if (counter.textContent && counter.textContent.includes('Section')) {
                counter.textContent = \`Section \${currentNum} of \${totalNum}\`;
            } else {
                counter.textContent = \`\${currentNum} / \${totalNum}\`;
            }
        }
    });
}

function updateProgress() {
    if (progressFill && slides.length > 0) {
        const progress = ((currentSlide + 1) / slides.length) * 100;
        progressFill.style.width = progress + '%';
    }
}

function updateButtons() {
    if (prevBtn) {
        prevBtn.disabled = currentSlide === 0;
        prevBtn.style.display = currentSlide === 0 ? 'none' : 'inline-block';
    }
    if (nextBtn) {
        const isLastSlide = currentSlide === slides.length - 1;
        if (isLastSlide && !quizPassed) {
            nextBtn.disabled = true;
            nextBtn.style.display = 'inline-block';
        } else if (isLastSlide && quizPassed) {
            nextBtn.textContent = 'Module Complete';
            nextBtn.disabled = false;
        } else {
            nextBtn.disabled = false;
            nextBtn.style.display = 'inline-block';
            nextBtn.textContent = 'Next';
        }
    }
    
    // Show/hide retry and review buttons based on quiz state
    if (retryBtn && reviewBtn) {
        const isLastSlide = currentSlide === slides.length - 1;
        if (isLastSlide && !quizPassed) {
            retryBtn.style.display = 'inline-block';
            reviewBtn.style.display = 'inline-block';
        } else {
            retryBtn.style.display = 'none';
            reviewBtn.style.display = 'none';
        }
    }
}

if (prevBtn) prevBtn.addEventListener('click', () => { 
    if (currentSlide > 0) { 
        currentSlide--; 
        showSlide(currentSlide); 
    } 
});

if (nextBtn) nextBtn.addEventListener('click', () => { 
    if (currentSlide < slides.length - 1) { 
        currentSlide++; 
        showSlide(currentSlide); 
    } else if (quizPassed) {
        alert('Module completed successfully!');
    }
});

if (submitBtn) submitBtn.addEventListener('click', () => {
    const questions = document.querySelectorAll('[data-correct], .quiz-question[data-correct]');
    let score = 0;
    let totalQuestions = questions.length;
    
    questions.forEach((question, index) => {
        const selectedAnswer = question.querySelector('input[type="radio"]:checked');
        const correctAnswer = question.getAttribute('data-correct');
        const isCorrect = selectedAnswer && selectedAnswer.value === correctAnswer;
        
        if (isCorrect) {
            score++;
        }
        
        // Visual feedback: ONLY mark the selected option with icon
        if (selectedAnswer) {
            const selectedOption = selectedAnswer.closest('.quiz-option, label');
            if (selectedOption) {
                // Add icon to indicate correct/incorrect
                const icon = isCorrect ? ' ✓' : ' ✗';
                if (!selectedOption.textContent.includes('✓') && !selectedOption.textContent.includes('✗')) {
                    selectedOption.textContent += icon;
                }
                
                // Light styling for selected option only
                if (isCorrect) {
                    selectedOption.style.backgroundColor = '#f0f9f0';
                    selectedOption.style.color = '#2d6a2d';
                } else {
                    selectedOption.style.backgroundColor = '#faf0f0';
                    selectedOption.style.color = '#6d2d2d';
                }
            }
        }
    });
    
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    quizPassed = percentage >= 75;
    updateButtons();
    
    alert(\`Quiz completed! Score: \${score}/\${totalQuestions} (\${percentage}%)\${quizPassed ? ' - You passed!' : ' - You need 75% to proceed. Use Retry or Review buttons.'}\`);
});

// Retry button functionality
if (retryBtn) retryBtn.addEventListener('click', () => {
    // Clear all radio button selections
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => input.checked = false);
    
    // Hide all feedback messages
    const feedbacks = document.querySelectorAll('.feedback, .result-banner, .quiz-message');
    feedbacks.forEach(feedback => {
        feedback.style.display = 'none';
        feedback.textContent = '';
    });
    
    // Clear visual feedback styling and icons
    const quizOptions = document.querySelectorAll('.quiz-option, label');
    quizOptions.forEach(option => {
        option.style.backgroundColor = '';
        option.style.borderColor = '';
        option.style.color = '';
        // Remove checkmark and X icons
        if (option.textContent) {
            option.textContent = option.textContent.replace(/ ✓$/, '').replace(/ ✗$/, '');
        }
    });
    
    // Reset quiz state
    quizPassed = false;
    updateButtons();
    
    alert('Quiz reset! You can now attempt the quiz again.');
});

// Review button functionality  
if (reviewBtn) reviewBtn.addEventListener('click', () => {
    currentSlide = 0;
    showSlide(0);
    alert('Returning to the beginning of the module for review.');
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (slides.length > 0) {
        showSlide(0);
        updateSlideCounter();
    }
});

// Fallback initialization and override incomplete model functions
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        showSlide(0);
        updateSlideCounter();
        // Override any incomplete updateSlide function from model
        if (typeof window.updateSlide === 'function') {
            const originalUpdateSlide = window.updateSlide;
            window.updateSlide = function() {
                originalUpdateSlide.apply(this, arguments);
                updateSlideCounter(); // Ensure slideCounter always gets updated
            };
        }
    });
} else {
    showSlide(0);
    updateSlideCounter();
    // Override any incomplete updateSlide function from model
    if (typeof window.updateSlide === 'function') {
        const originalUpdateSlide = window.updateSlide;
        window.updateSlide = function() {
            originalUpdateSlide.apply(this, arguments);
            updateSlideCounter(); // Ensure slideCounter always gets updated
        };
    }
}
</script>`

  // Only inject script if it's missing or incomplete
  if (validation.missing.includes('JavaScript functionality') || validation.missing.includes('event listeners in JavaScript')) {
    if (updatedHtml.includes('</body>')) {
      updatedHtml = updatedHtml.replace('</body>', navigationScript + '\n</body>')
    } else {
      updatedHtml += navigationScript
    }
  }
  
  return updatedHtml
}

app.use('/uploads', express.static(UPLOADS))
app.use('/generated', express.static(GENERATED))

// Download route: forces the browser to download the generated HTML file
app.get('/generated/:name/download', (req, res) => {
  try {
    const name = path.basename(req.params.name)
    const p = path.join(GENERATED, name)
    if (!fs.existsSync(p)) return res.status(404).send('Not found')
    res.setHeader('Content-Disposition', `attachment; filename="${name}"`)
    return res.sendFile(p)
  } catch (err: any) {
    console.error('download error', err)
    return res.status(500).send('Download failed')
  }
})

app.post('/api/generate', upload.fields([{ name: 'attachment', maxCount: 1 }, { name: 'template', maxCount: 1 }]), async (req, res) => {
  try {
    const moduleName = (req.body.moduleName || '').toString()
    const difficulty = (req.body.difficulty || 'easy').toString()
    const numQuestions = Number(req.body.numQuestions || 10)

    let urls: string[] = []
    if (req.body.urls) {
      try {
        urls = typeof req.body.urls === 'string' ? JSON.parse(req.body.urls) : req.body.urls
      } catch {
        // if it was sent as repeated fields, coerce into array
        urls = Array.isArray(req.body.urls) ? req.body.urls : [req.body.urls]
      }
    }

    const files = (req as any).files || {}
    const attachmentFile = Array.isArray(files.attachment) ? files.attachment[0] : undefined
    const templateFile = Array.isArray(files.template) ? files.template[0] : undefined

    if (!moduleName) return res.status(400).json({ ok: false, error: 'moduleName required' })
    if (!attachmentFile) return res.status(400).json({ ok: false, error: 'attachment required' })

    const attachmentPath = `/uploads/${path.basename(attachmentFile.path)}`

    // Extract text or HTML from the attachment (PDF/DOCX/HTML)
    let attachmentContent = ''
    try {
      const ext = path.extname(attachmentFile.originalname || '').toLowerCase()
      if (ext === '.pdf') {
          // optional pdf extraction (pdf-parse may not be installed in every environment)
          let pdfParse: any = null
          try {
            pdfParse = require('pdf-parse')
          } catch (e) {
            console.warn('pdf-parse not installed; skipping PDF text extraction')
          }
          if (pdfParse) {
            const dataBuffer = fs.readFileSync(attachmentFile.path)
            const parsed = await pdfParse(dataBuffer)
            attachmentContent = parsed.text || ''
          } else {
            attachmentContent = ''
          }
        } else if (ext === '.docx') {
          // optional docx extraction via mammoth
          let mammoth: any = null
          try {
            mammoth = require('mammoth')
          } catch (e) {
            console.warn('mammoth not installed; skipping DOCX to HTML conversion')
          }
          if (mammoth && typeof mammoth.convertToHtml === 'function') {
            const result = await mammoth.convertToHtml({ path: attachmentFile.path })
            attachmentContent = result.value || ''
          } else {
            attachmentContent = ''
          }
      } else if (ext === '.html' || ext === '.htm') {
        attachmentContent = fs.readFileSync(attachmentFile.path, 'utf-8')
      } else {
        // fallback: try reading as utf-8 text
        try { attachmentContent = fs.readFileSync(attachmentFile.path, 'utf-8') } catch { attachmentContent = '' }
      }
    } catch (ex) {
      console.warn('Attachment parsing failed', ex)
      attachmentContent = ''
    }

    // Read and sanitize template reference if provided
    let templateHtml = ''
    if (templateFile) {
      try {
        templateHtml = fs.readFileSync(templateFile.path, 'utf-8')
        // strip scripts from template
        templateHtml = templateHtml.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      } catch (ex) {
        console.warn('Template read failed', ex)
        templateHtml = ''
      }
    }

  const system = `You are an expert frontend developer and UX designer. Produce exactly one complete HTML document (including <!doctype html> and <html> root). Output only the HTML — no explanation, no markdown fences, no extra text.

CRITICAL CONTENT RULE: 
- ALL educational content must be extracted from the PRIMARY_CONTENT_SOURCE in the user prompt
- If DESIGN_REFERENCE is provided, use ONLY its visual styling (colors, fonts, layout) - NEVER copy its text content
- Create original educational content based on the source document provided

CRITICAL REQUIREMENTS - YOUR OUTPUT WILL BE VALIDATED:
1. Include EXACTLY these element IDs: prevBtn, nextBtn, submitQuiz, progressFill, retryBtn, reviewBtn
2. Include data-correct attributes on ALL quiz questions
3. DO NOT create your own slide counters - navigation counters will be handled by existing JavaScript
4. Include complete JavaScript with event listeners for navigation that:
   - Updates progressFill width correctly: ((currentSlide + 1) / totalSlides) * 100 + '%'
   - Updates slide counter display when navigating (if counter elements exist)
   - Disables prevBtn on first slide, disables nextBtn on last slide until quiz passed
   - Enables nextBtn only after quiz score >= 75%
   - Shows retryBtn and reviewBtn when quiz fails (< 75%)
   - retryBtn: clears quiz selections and feedback for new attempt
   - reviewBtn: navigates back to first slide (index 0) for content review
   - Quiz feedback: ONLY highlight the selected answer option with green checkmark (✓) or red X (✗)
   - DO NOT highlight entire questions or show correct answers - only mark selected options as right/wrong
5. Use radio inputs with type="radio" for quiz options
6. Structure must be valid HTML with proper <!doctype html> declaration

Use only self-contained inline JavaScript and CSS, no external scripts. Inline JavaScript must not perform network requests. The document will be consumed as a standalone downloadable module page.`

  // Build a strict user prompt with clear content separation
  let user = `Module metadata:
moduleName: ${moduleName}
difficulty: ${difficulty}
numQuestions: ${numQuestions}
mediaUrls: ${JSON.stringify(urls)}

PRIMARY_CONTENT_SOURCE_START
${attachmentContent || `Note: Attachment content could not be extracted. Use the attachment name (${attachmentFile.originalname}) as reference.`}
PRIMARY_CONTENT_SOURCE_END

${templateHtml ? `
DESIGN_REFERENCE_ONLY_START
${templateHtml}
DESIGN_REFERENCE_ONLY_END

CRITICAL: The above DESIGN_REFERENCE is ONLY for visual styling, colors, fonts, and layout inspiration. 
DO NOT copy any textual content from DESIGN_REFERENCE. 
ALL content must come from PRIMARY_CONTENT_SOURCE above.
` : ''}

REQUIREMENTS (read these carefully and implement them in the HTML):
1) Entire output must be a single complete HTML document. Return only the HTML. No markdown fences, no commentary.
2) CONTENT EXTRACTION RULES:
   - ALL educational content MUST come from PRIMARY_CONTENT_SOURCE above
   - Extract and elaborate on concepts, topics, definitions, examples from the source document
   - If DESIGN_REFERENCE is provided, use ONLY its visual styling (colors, fonts, layout) - NOT its text content
   - Create comprehensive educational slides based on the source material
   - Each slide should contain substantial content from the document (minimum 3-4 sentences per concept)
3) Page purpose: a single-module learning page for students. The page should present the module content first, then a quiz section at the end.
   - Detailed explanations (minimum 3-4 sentences per concept)
   - Key points, definitions, and examples from the source material  
   - Relevant details that help students understand the topic thoroughly
   - DO NOT create slides with only 1-2 lines - provide comprehensive learning content
3) Navigation/flow: Provide an in-page navigation experience with Previous/Next buttons that work correctly:
   - Progress bar with ID "progressFill" must update correctly as user navigates (calculate percentage: (currentSlide + 1) / totalSlides * 100)
   - Section counter display (e.g., "Section 1 of 8") must update as user navigates between slides
   - Previous button should be disabled/hidden on first slide
   - Next button should be disabled/hidden on the LAST slide (quiz page) until quiz is passed with >= 75%
   - Only show "Next Module" or completion message after successful quiz completion
   - Navigation must properly handle slide transitions.
4) Quiz: Generate exactly ${numQuestions} multiple-choice questions matching difficulty ${difficulty}. Each question must have four options labeled A, B, C, D. For each question, encode the correct answer in a machine-readable attribute on the question container (e.g., data-correct="B"). Provide radio inputs for options, visible option labels, and per-question feedback elements that are shown after submit.
5) Client-side grading & gating: Provide inline JavaScript that:
   - Grades the quiz entirely in the browser (no network calls)
   - Shows per-question feedback and summary (score % and pass/fail)
   - CRITICAL: Quiz feedback RULES:
     * ONLY highlight the selected answer option (not entire question)
     * Correct selections: add green checkmark icon (✓) to the selected option
     * Incorrect selections: add red X icon (✗) to the selected option
     * DO NOT show what the correct answer is - only mark if selection was right/wrong
     * DO NOT highlight entire question containers or unselected options
   - CRITICAL: Next button must be disabled on quiz page until score >= 75%
   - On quiz pass (>= 75%): Enable Next button or show "Module Complete" message
   - On quiz fail (< 75%): Keep Next button disabled, show TWO buttons:
     * "Retry Quiz" button - clears all selections and feedback, allows new attempt
     * "Review Module" button - takes user back to slide 0 to review content
   - Progress bar must properly reflect navigation state throughout
6) Accessibility: Use semantic HTML (main, header, nav, section, button). Ensure forms/inputs have labels or aria-labels. Keyboard navigation must work for quiz options and navigation controls.
7) Styling & design: Use an engaging, student-friendly layout (colors, contrast, readable typography, large tap/click targets). If TEMPLATE_HTML_REFERENCE is provided, CLOSELY FOLLOW its visual design, color scheme, typography, layout patterns, and CSS structure — but DO NOT copy its textual content. Extract and adapt the template's aesthetic elements (colors, fonts, spacing, component styles) to create a cohesive design. If no template is provided, create an engaging modern design.
8) Media embedding: Place mediaUrls content in the module where appropriate (embedded images or videos). Use safe embedding (img tags with alt text or <video> if mp4), but do not load remote scripts.
9) Offline friendliness: The file should be self-contained for the quiz behavior. Avoid remote dependencies for JS. Small assets can be used by direct URL, but do not rely on remote scripts.
10) Security: Do not include any analytics, trackers, or external scripts. Avoid inline eval or dynamic code loading. If you must include inline JS, it must be straightforward DOM manipulation and event handlers.
11) Content depth requirements: Each slide must contain substantial educational content:
    - Extract key concepts, definitions, examples, and detailed explanations from the attachment
    - Minimum 3-4 sentences per concept, with supporting details and context
    - Include practical examples, case studies, or applications where relevant
    - Break complex topics into digestible but comprehensive chunks
    - Ensure students get thorough understanding of each topic before moving to quiz
12) Behavior on missing attachment: If the attachment content is empty or not provided, create a clear content placeholder section and generate questions based on the moduleName and the attachment filename.
12) File readiness: The returned HTML must be immediately savable to disk (e.g., module-123.html) and render correctly in a browser.

OUTPUT FORMAT (strict):
- Output a single HTML file that includes:
  - A prominent title with the moduleName.
  - The module content (derived from the attachment content) - EXTRACT COMPREHENSIVE DETAILS from source material
  - Content broken into logical sections/slides with SUBSTANTIAL content (minimum 3-4 paragraphs per slide)
  - Media embeds for provided mediaUrls.
  - Quiz section with exactly ${numQuestions} MCQs, data-correct attributes, and a submit button.
  - Inline JS that grades and controls the Next Module control (pass threshold 75%).
  - If you include a slide counter element (like id="slideCounter"), ensure your JavaScript updateSlide function updates it with the current slide number
  - No additional text outside the HTML.
`

    // Attempt generation with validation and retry logic
    let finalHtml = ''
    let attemptCount = 0
    const maxAttempts = 3

    while (attemptCount < maxAttempts && !finalHtml) {
      attemptCount++
      console.log(`Generation attempt ${attemptCount}/${maxAttempts}`)

      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ],
        temperature: attemptCount === 1 ? 0.2 : 0.3, // Slightly higher temp on retries
        // Increased token allowance to reduce truncation
        max_completion_tokens: attemptCount === 1 ? 6000 : 8000
      })

      let html = completion.choices?.[0]?.message?.content || ''
      if (!html) {
        console.log(`Attempt ${attemptCount}: Empty response from model`)
        continue
      }

      // Strip common markdown fences (```html ... ```)
      html = html.replace(/^\s*```(?:html)?\s*/i, '')
      html = html.replace(/\s*```\s*$/i, '')

      // Validate the generated HTML
      const validation = validateHtml(html)
      console.log(`Attempt ${attemptCount}: Validation result:`, validation)

      if (validation.valid) {
        // HTML is valid, apply basic sanitization
        finalHtml = sanitizeHtml(html)
        console.log(`Attempt ${attemptCount}: Success - HTML is valid`)
        break
      } else {
        console.log(`Attempt ${attemptCount}: Invalid HTML, missing:`, validation.missing)
        
        // If this is the last attempt, try to fix the HTML
        if (attemptCount === maxAttempts) {
          console.log('Final attempt: Applying auto-fix')
          const sanitized = sanitizeHtml(html)
          finalHtml = injectRequiredElements(sanitized, validation)
          break
        } else {
          // Adjust the prompt for retry with specific feedback
          const missingElements = validation.missing.join(', ')
          user = user + `\n\nIMPORTANT RETRY FEEDBACK: The previous generation was missing: ${missingElements}. Please ensure you include ALL required elements, especially:
- Navigation buttons with IDs: prevBtn, nextBtn, submitQuiz
- Progress bar with ID: progressFill
- Quiz questions with data-correct attributes
- Complete JavaScript with event listeners
- Proper HTML document structure`
        }
      }
    }

    if (!finalHtml) {
      return res.status(500).json({ ok: false, error: 'Failed to generate valid HTML after multiple attempts' })
    }

    const fileName = `module-${Date.now()}.html`
    const fullPath = path.join(GENERATED, fileName)
    fs.writeFileSync(fullPath, finalHtml, 'utf-8')

  // Return both a view URL and a download URL (download endpoint forces attachment)
  return res.json({ ok: true, viewUrl: `/generated/${fileName}`, downloadUrl: `/generated/${fileName}/download` })
  } catch (err: any) {
    console.error(err)
    return res.status(500).json({ ok: false, error: err.message || String(err) })
  }
})

const port = Number(process.env.PORT || 5174)
app.listen(port, () => console.log(`backend listening on http://localhost:${port}`))
