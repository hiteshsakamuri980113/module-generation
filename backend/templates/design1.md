# 🎯 EDUCATIONAL MODULE GENERATION TEMPLATE v3.0 - DESIGN1 (BLUE THEME)

## 🔥 CRITICAL SUCCESS FACTORS (FOLLOW EXACTLY)

**MISSION**: Generate a complete, interactive, professional educational HTML module that is visually consistent, functionally perfect, and pedagogically effective.

### ⚡ MANDATORY REQUIREMENTS (NEVER COMPROMISE):

1. **SINGLE ARCHITECTURE** - Use ONLY the EducationalModule class, no standalone functions
2. **COMPLETE FUNCTIONALITY** - Every button, navigation, and quiz feature must work perfectly
3. **EXACT JAVASCRIPT** - Copy the complete JavaScript implementation exactly as written
4. **CONSISTENT BLUE THEME** - Use only the defined CSS variables (--primary, --secondary, --light-blue)
5. **COMPREHENSIVE CONTENT** - Extract ALL source material into 6-8 detailed slides
6. **PERFECT QUIZ SYSTEM** - 75% pass threshold with working localStorage
7. **RESPONSIVE DESIGN** - Works flawlessly on all screen sizes

### 🎯 ZERO-TOLERANCE RULES:

❌ **NEVER mix class methods with standalone functions**  
❌ **NEVER modify the JavaScript structure or variable names**  
❌ **NEVER use placeholder content or Lorem ipsum**  
❌ **NEVER skip localStorage implementation**  
❌ **NEVER use external dependencies or CDN links**

---

## 🚨 IMPLEMENTATION COMMANDMENTS (NON-NEGOTIABLE)

### 📋 JAVASCRIPT IMPLEMENTATION RULES

**RULE 1: SINGLE ARCHITECTURE**

- Use ONLY the `EducationalModule` class provided
- DO NOT add any standalone functions outside the class
- DO NOT modify class structure, method names, or variable names
- The class is complete and tested - use it exactly as written

**RULE 2: QUIZ DATA STRUCTURE**

- Populate `quizData` array with exact number from MODULE_DATA.quizQuestions
- Each question MUST have: `name`, `question`, `options` array, `correct` answer
- Options MUST be formatted as: `{ value: "A", text: "A. Option text" }`
- Correct answer MUST match option values exactly ("A", "B", "C", or "D")

**RULE 3: INITIALIZATION**

- Include the exact initialization code: `document.addEventListener("DOMContentLoaded", () => { window.educationalModule = new EducationalModule(); });`
- DO NOT modify this initialization code
- DO NOT add additional initialization functions

**RULE 4: HTML STRUCTURE**

- Use exact button IDs: `prevBtn`, `nextBtn`, `submitQuiz`, `retryBtn`, `resetBtn`
- Include exact container IDs: `quizQuestionsContainer`, `quizMessage`, `resultBanner`
- All slides MUST have class="slide" and sequential data-index attributes

### 🎨 CSS IMPLEMENTATION RULES

**RULE 5: COLOR CONSISTENCY**

- Use ONLY defined CSS variables: `--primary`, `--secondary`, `--light-blue`
- DO NOT use hardcoded colors or old variables (--teal, --aqua)
- All blue shades MUST come from the defined variable system

**RULE 6: RESPONSIVE DESIGN**

- Include exact responsive CSS provided
- Fixed navigation must stay at bottom on mobile
- Slide containers must have consistent height and scrolling

---

## 1️⃣ CONTENT EXTRACTION & STRUCTURE (MANDATORY)

### 📚 Content Requirements

```
✅ MINIMUM: 6-8 comprehensive content slides + 1 quiz slide
✅ DEPTH: Each slide = 300-500 words from source material
✅ COVERAGE: Extract ALL key concepts, no content left behind
✅ STRUCTURE: Logical flow from basic to advanced concepts
✅ EXAMPLES: Include all examples, case studies, procedures from source
```

### 📝 Slide Content Formula

**Each slide MUST contain:**

- **Heading**: Clear, descriptive title from source material
- **Introduction**: Context and relevance (1-2 sentences)
- **Main Content**: 3-4 detailed paragraphs with:
  - Key concepts and definitions
  - Examples and illustrations
  - Step-by-step procedures (if applicable)
  - Important details and context
- **Key Takeaways**: 2-3 bullet points summarizing main ideas

### 🎬 MEDIA PLACEHOLDER PROCESSING

**When you find placeholders in source content:**

- `{{image:logo}}` → `<img src="[URL]" alt="[description]" class="responsive-image">`
- `{{video:intro}}` → `<video src="[URL]" controls class="responsive-video">[description]</video>`
- Match placeholder ID with provided Media Items
- Use fallback `<div class="media-placeholder">[Media: ID not found]</div>` if no match

### 🚫 FORBIDDEN CONTENT

- Generic placeholder text
- "Lorem ipsum" or similar filler
- Vague statements without source backing
- Incomplete explanations

---

---

## 2️⃣ BLUE THEME DESIGN SYSTEM (EXACT SPECIFICATIONS)

### 🎨 Design Philosophy: Professional Blue Academic Theme

- **Primary**: Deep Blue (#1e40af) - Headers, navigation, primary buttons
- **Secondary**: Bright Blue (#3b82f6) - Accents, hover states, progress
- **Background**: Light Blue-Gray (#f8faff) - Page background
- **Content**: White (#ffffff) - Cards, content areas
- **Text**: Dark Navy (#1e293b) - Primary text
- **Muted**: Gray (#64748b) - Secondary text

### 📐 EXACT LAYOUT DIMENSIONS (NON-NEGOTIABLE)

```css
/* CORE CONTAINER LAYOUT */
.module-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px 100px 24px; /* Extra bottom for fixed nav */
}

/* SLIDE CONTAINER - FIXED SIZE */
.slides-container {
  background: var(--card);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  min-height: 600px;
  max-height: 600px;
  overflow-y: auto;
}

/* INDIVIDUAL SLIDES */
.slide {
  padding: 32px;
  display: none;
  min-height: 536px;
  line-height: 1.6;
}

.slide.active {
  display: block;
}
```

### Typography Consistency

```css
.slide h2 {
  color: var(--primary);
  font-size: 1.6rem; /* FIXED SIZE */
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 24px 0; /* CONSISTENT MARGINS */
  border-left: 3px solid var(--secondary);
  padding-left: 16px;
}

.slide p {
  line-height: 1.6;
  margin: 16px 0; /* CONSISTENT SPACING */
  font-size: 1rem;
}

.quiz-question .q {
  font-weight: 600;
  font-size: 1.1rem; /* CONSISTENT SIZE */
  margin: 0 0 16px 0;
  color: var(--text);
  line-height: 1.4;
}
```

---

---

## 3️⃣ QUIZ SYSTEM REQUIREMENTS (CRITICAL FUNCTIONALITY)

### 🎯 Quiz Success Criteria

```
✅ PASSING SCORE: 75% or higher required to proceed
✅ QUESTION COUNT: Generate EXACTLY the requested number
✅ DIFFICULTY: Match requested level (easy/medium/hard)
✅ SOURCE-BASED: All questions from provided content
✅ FEEDBACK: Immediate visual feedback on answers
```

### 📝 EXACT Quiz HTML Structure (MANDATORY)

```html
<!-- Use this EXACT structure for every question -->
<div class="quiz-question" data-correct="B">
  <p class="q">1. Question text from source material?</p>

  <label class="quiz-option">
    <input type="radio" name="q1" value="A" />
    <span>A. Option text from source</span>
  </label>

  <label class="quiz-option">
    <input type="radio" name="q2" value="B" />
    <span>B. Correct answer from source</span>
  </label>

  <label class="quiz-option">
    <input type="radio" name="q3" value="C" />
    <span>C. Plausible distractor</span>
  </label>

  <label class="quiz-option">
    <input type="radio" name="q4" value="D" />
    <span>D. Plausible distractor</span>
  </label>
</div>
```

### 🎨 Quiz Styling Requirements

```css
.quiz-form {
  margin-top: 20px;
}

.quiz-question {
  background: #faf5ff;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  border: 1px solid #e9d5ff;
}

.quiz-option {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 8px 0;
  background: #fff;
  border: 1px solid #e9d5ff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quiz-option:hover {
  border-color: var(--secondary);
  background: #faf5ff;
}

.quiz-option input {
  margin-right: 12px;
  margin-left: 0;
}

.quiz-option.selected {
  border-color: var(--primary);
  background: var(--light-blue);
}
```

---

---

## 4️⃣ COMPLETE HTML STRUCTURE TEMPLATE

### 📋 REQUIRED HTML Skeleton (COPY EXACTLY)

> **CRITICAL**: Use this exact structure. Do NOT deviate or reorganize.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>[Module Title from SOURCE]</title>
    <style>
      /* ALL CSS VARIABLES AND STYLES FROM SECTION 7 */
    </style>
  </head>
  <body>
    <div class="module-container">
      <header>
        <h1>[Extract Title from Source Material]</h1>
        <p><strong>Duration:</strong> [Extract from MODULE_DATA]</p>
      </header>

      <section class="progress-section">
        <div class="progress-header">
          <div class="progress-text" id="progressText">Section 1 of X</div>
          <div class="time-estimate">[Estimated time]</div>
        </div>
        <div id="progressBar">
          <div id="progressFill"></div>
        </div>
      </section>

      <main class="slides-container">
        <!-- CONTENT SLIDES: 6-8 comprehensive slides -->
        <article class="slide active" data-index="0">
          <h2>[Section Title]</h2>
          <!-- 3-5 paragraphs of detailed content from source -->
        </article>

        <!-- MORE CONTENT SLIDES... -->

        <!-- QUIZ SLIDE (ALWAYS LAST) -->
        <article class="slide" data-index="X">
          <h2>Assessment</h2>
          <p>
            Complete this quiz to demonstrate your understanding of the module
            content.
          </p>

          <form id="quizForm" class="quiz-form">
            <div id="quizQuestionsContainer">
              <!-- EXACT quiz structure from Section 3 -->
            </div>

            <div class="quiz-actions">
              <button type="button" id="submitQuiz" class="btn primary">
                Submit Assessment
              </button>
              <button
                type="button"
                id="retryBtn"
                class="btn primary"
                style="display: none"
              >
                Retry Quiz
              </button>
              <button type="button" id="resetBtn" class="btn secondary">
                Review Module
              </button>
            </div>

            <div id="quizMessage" class="quiz-message"></div>
          </form>

          <div id="resultBanner" class="result-banner"></div>
        </article>
      </main>

      <nav class="navigation">
        <div class="nav-buttons">
          <button id="prevBtn" class="btn secondary" disabled>Previous</button>
          <button id="nextBtn" class="btn primary">Next</button>
        </div>
        <div class="nav-info">
          <span id="slideCounter">1 / X</span>
        </div>
      </nav>
    </div>

    <script>
      /* ALL JAVASCRIPT FROM SECTION 6 */
    </script>
  </body>
</html>
```

---

## 5️⃣ COMPLETE CSS SYSTEM (EXACT BLUE THEME IMPLEMENTATION)

### 🎯 CRITICAL CSS REQUIREMENTS

```
✅ USE EXACT COLORS: Blue theme (#1e40af, #3b82f6)
✅ FIXED NAVIGATION: Bottom-positioned, always visible
✅ RESPONSIVE DESIGN: Mobile-friendly layout
✅ CONSISTENT SPACING: Exact margins and padding
✅ HOVER EFFECTS: Smooth transitions and feedback
```

### 🎨 CSS VARIABLES & BASE STYLES

```css
:root {
  /* BLUE THEME COLOR PALETTE */
  --primary: #1e40af; /* Deep Blue - Primary */
  --secondary: #3b82f6; /* Bright Blue - Accents */
  --bg: #f8faff; /* Light Blue-Gray Background */
  --text: #1e293b; /* Dark Navy Text */
  --muted: #64748b; /* Gray Secondary Text */
  --card: #ffffff; /* White Content Areas */
  --shadow: 0 4px 16px rgba(30, 64, 175, 0.15); /* Blue shadow */
  --radius: 12px;
  --light-blue: #eff6ff; /* Light Blue Highlights */
  --success: #10b981; /* Modern green */
  --error: #ef4444; /* Modern red */
  --warning: #f59e0b; /* Modern amber */
}

/* CONSISTENT TYPOGRAPHY */
* {
  box-sizing: border-box;
  font-family: "Inter", "Segoe UI", Roboto, Arial, sans-serif;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

.module-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px 100px 24px; /* Extra bottom padding for fixed navigation */
}

/* FIXED DIMENSIONS FOR CONSISTENCY */
.progress-section {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-text {
  font-weight: 500;
  color: var(--primary);
}

.time-estimate {
  font-size: 0.9rem;
  color: var(--muted);
}

#progressBar {
  height: 8px;
  background: #e9d5ff;
  border-radius: 4px;
  overflow: hidden;
}

#progressFill {
  height: 100%;
  width: 0%;
  background: var(--primary);
  transition: width 0.3s ease;
}

/* SLIDES WITH FIXED HEIGHT */
.slides-container {
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 24px;
  min-height: 500px;
}

.slide {
  padding: 32px;
  display: none;
  animation: fadeIn 0.3s ease;
}

.slide.active {
  display: block;
}

.slide h2 {
  color: var(--primary);
  margin: 0 0 24px;
  font-size: 1.6rem;
  font-weight: 600;
  border-left: 3px solid var(--secondary);
  padding-left: 16px;
  line-height: 1.3;
}

.slide p {
  line-height: 1.6;
  margin: 16px 0;
}

.slide ul,
.slide ol {
  margin: 16px 0;
  padding-left: 24px;
}

.slide li {
  margin-bottom: 8px;
}

/* QUIZ STYLING - EXACT TEMPLATE MATCH */
.quiz-form {
  margin-top: 16px;
}

.quiz-question {
  background: #faf5ff;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
}

.quiz-question .q {
  font-weight: 500;
  margin: 0 0 12px;
  color: var(--text);
}

.quiz-option {
  display: block;
  margin: 6px 0;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #e9d5ff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quiz-option:hover {
  border-color: var(--secondary);
  background: #faf5ff;
}

.quiz-option input {
  margin-right: 8px;
}

.quiz-option.selected {
  border-color: var(--primary);
  background: var(--light-blue);
}

.quiz-option.correct {
  border-color: var(--success);
  background: #e8f5e8;
}

.quiz-option.incorrect {
  border-color: var(--error);
  background: #ffebee;
}

/* QUIZ ACTIONS - EXACT TEMPLATE STYLING */
.quiz-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: center;
}

/* QUIZ MESSAGES - EXACT TEMPLATE STYLING */
.quiz-message {
  font-weight: 500;
  margin: 12px 0;
  padding: 8px;
  border-radius: 6px;
  text-align: center;
}

/* NAVIGATION - EXACT TEMPLATE STYLING */
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.nav-info {
  color: var(--muted);
  font-size: 0.9rem;
}

/* 🧭 NAVIGATION SYSTEM - FIXED BOTTOM LAYOUT */
.navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--card);
  border-top: 1px solid #e2e8f0;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.nav-buttons {
  display: flex;
  gap: 8px;
}

/* BUTTONS - EXACT TEMPLATE STYLING */
.btn {
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.btn.primary {
  background: var(--primary);
  color: #fff;
}

.btn.primary:hover {
  background: var(--secondary);
}

.btn.secondary {
  background: #eaf5f4;
  color: var(--primary);
}

.btn.secondary:hover {
  background: var(--light-blue);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* RESPONSIVE DESIGN - EXACT TEMPLATE MATCH */
@media (max-width: 700px) {
  .module-container {
    padding: 16px 16px 80px 16px;
  }

  .slide {
    padding: 24px 16px;
  }

  .navigation {
    padding: 12px 16px;
    flex-direction: row;
    gap: 8px;
  }

  .nav-buttons .btn {
    padding: 8px 12px;
    font-size: 0.85rem;
  }

  .progress-header {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
} /* ADDITIONAL TEMPLATE CLASSES - CRITICAL FOR FUNCTIONALITY */

/* Intro text */
.intro {
  color: var(--muted);
  font-style: italic;
  margin: 8px 0 24px;
}

/* Media elements */
.media {
  width: 100%;
  border-radius: 8px;
  margin: 16px 0;
  box-shadow: var(--shadow);
  background: #f0f8f7;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.media.loading {
  background: linear-gradient(90deg, #f0f8f7 25%, #e6fff9 50%, #f0f8f7 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

.media img {
  width: 100%;
  height: auto;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.media img.loaded {
  opacity: 1;
}

/* Video containers */
.video-container {
  width: 100%;
  border-radius: 8px;
  margin: 16px 0;
  box-shadow: var(--shadow);
  background: #000;
  position: relative;
  padding-bottom: 44.44%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
}

/* Highlight boxes */
.highlight {
  background: var(--light-blue);
  padding: 20px;
  border-radius: 8px;
  margin: 16px 0;
  border-left: 3px solid var(--primary);
}

.highlight h3 {
  margin: 0 0 12px;
  color: var(--primary);
}

/* TABLES - EXACT TEMPLATE STYLING */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.data-table th {
  background: var(--light-blue);
  padding: 12px;
  text-align: left;
  font-weight: 500;
  color: var(--primary);
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f8f7;
}

.data-table td[contenteditable]:hover {
  background: #faf5ff;
}

.data-table td[contenteditable]:focus {
  background: var(--light-blue);
  outline: none;
}

/* RESULT BANNERS - EXACT TEMPLATE STYLING */
.result-banner {
  margin-top: 16px;
  padding: 16px;
  border-radius: 8px;
  display: none;
}

.result-banner.success {
  background: var(--light-blue);
  border-left: 3px solid var(--primary);
  color: #06463f;
}

.result-banner.fail {
  background: #fff1f1;
  border-left: 3px solid #e53935;
  color: #6a1b1b;
}

/* ANIMATIONS */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* 🎬 MEDIA ELEMENTS - RESPONSIVE DESIGN */
.responsive-image {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin: 16px 0;
  display: block;
}

.responsive-video {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin: 16px 0;
  display: block;
}

/* Media placeholder for missing items */

.media-placeholder {
  background: var(--light-blue);
  border: 2px dashed var(--primary);
  border-radius: var(--radius);
  padding: 24px;
  text-align: center;
  color: var(--muted);
  font-style: italic;
  margin: 16px 0;
}
```

---

## 6️⃣ COMPLETE JAVASCRIPT IMPLEMENTATION (TESTED & WORKING)

### 🚀 JavaScript Success Formula

```
✅ NAVIGATION: Previous/Next slide functionality
✅ PROGRESS: Dynamic progress bar updates
✅ QUIZ LOGIC: 75% pass threshold enforcement
✅ FEEDBACK: Visual answer highlighting (✓/✗)
✅ RETRY SYSTEM: Clear selections, new attempt
✅ RESPONSIVE: Works on all devices
```

### 💻 COMPLETE JAVASCRIPT IMPLEMENTATION (SINGLE ARCHITECTURE)

> **CRITICAL**: This is a complete, tested, single-architecture implementation. Use EXACTLY as written.

```javascript
// ===== QUIZ DATA STRUCTURE =====
// MUST be populated with exact number of questions from MODULE_DATA
const quizData = [
  {
    name: "q1",
    question: "Sample question text from source material?",
    options: [
      { value: "A", text: "A. First option from source" },
      { value: "B", text: "B. Second option from source" },
      { value: "C", text: "C. Third option from source" },
      { value: "D", text: "D. Fourth option from source" },
    ],
    correct: "B",
  },
  // Add more questions based on MODULE_DATA.quizQuestions count
];

// ===== COMPLETE MODULE CONTROLLER =====
class EducationalModule {
  constructor() {
    this.slides = document.querySelectorAll(".slide");
    this.currentSlide = 0;
    this.totalSlides = this.slides.length;
    this.quizSubmitted = false;
    this.userAnswers = {};
    this.quizPassed = false;

    this.init();
  }

  init() {
    this.renderQuizQuestions();
    this.bindAllEvents();
    this.setupQuizInteractivity();
    this.updateProgress();
    this.updateNavigation();
    this.loadProgress();
  }

  // ===== QUIZ RENDERING =====
  renderQuizQuestions() {
    const container = document.getElementById("quizQuestionsContainer");
    if (!container) return;

    container.innerHTML = "";

    quizData.forEach((q, index) => {
      const questionDiv = document.createElement("div");
      questionDiv.className = "quiz-question";
      questionDiv.setAttribute("data-correct", q.correct);

      questionDiv.innerHTML = `
        <p class="q">${index + 1}. ${q.question}</p>
        ${q.options
          .map(
            (option) => `
          <label class="quiz-option">
            <input type="radio" name="${q.name}" value="${option.value}" />
            <span>${option.text}</span>
          </label>
        `
          )
          .join("")}
      `;

      container.appendChild(questionDiv);
    });
  }

  // ===== EVENT BINDING =====
  bindAllEvents() {
    // Navigation buttons
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (prevBtn) prevBtn.onclick = () => this.previousSlide();
    if (nextBtn) nextBtn.onclick = () => this.nextSlide();

    // Quiz buttons
    const submitBtn = document.getElementById("submitQuiz");
    const retryBtn = document.getElementById("retryBtn");
    const resetBtn = document.getElementById("resetBtn");

    if (submitBtn) submitBtn.onclick = () => this.submitQuiz();
    if (retryBtn) retryBtn.onclick = () => this.retryQuiz();
    if (resetBtn) resetBtn.onclick = () => this.resetModule();

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.previousSlide();
      if (e.key === "ArrowRight") this.nextSlide();
    });
  }

  // ===== QUIZ INTERACTIVITY =====
  setupQuizInteractivity() {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".quiz-option")) {
        const clickedOption = e.target.closest(".quiz-option");
        const question = clickedOption.closest(".quiz-question");

        // Remove selection from other options in same question
        question.querySelectorAll(".quiz-option").forEach((opt) => {
          opt.classList.remove("selected");
        });

        // Select clicked option
        clickedOption.classList.add("selected");
        const radio = clickedOption.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      }
    });
  }

  // ===== NAVIGATION METHODS =====
  showSlide(index) {
    if (index < 0 || index >= this.totalSlides) return;

    // Hide all slides
    this.slides.forEach((slide) => slide.classList.remove("active"));

    // Show target slide
    if (this.slides[index]) {
      this.slides[index].classList.add("active");
    }

    this.currentSlide = index;
    this.updateProgress();
    this.updateNavigation();
    this.saveProgress();
  }

  previousSlide() {
    if (this.currentSlide > 0) {
      this.showSlide(this.currentSlide - 1);
    }
  }

  nextSlide() {
    const isLastSlide = this.currentSlide === this.totalSlides - 1;

    if (!isLastSlide) {
      this.showSlide(this.currentSlide + 1);
    } else if (isLastSlide && this.quizPassed) {
      // Quiz completed successfully - could add completion action here
      this.showMessage("Module completed successfully!", "success");
    }
  }

  // ===== PROGRESS TRACKING =====
  updateProgress() {
    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");
    const slideCounter = document.getElementById("slideCounter");

    const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;

    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressText)
      progressText.textContent = `Section ${this.currentSlide + 1} of ${
        this.totalSlides
      }`;
    if (slideCounter)
      slideCounter.textContent = `${this.currentSlide + 1} / ${
        this.totalSlides
      }`;
  }

  updateNavigation() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    // Previous button
    if (prevBtn) prevBtn.disabled = this.currentSlide === 0;

    // Next button
    if (nextBtn) {
      const isLastSlide = this.currentSlide === this.totalSlides - 1;
      if (isLastSlide) {
        nextBtn.disabled = !this.quizPassed;
        nextBtn.textContent = this.quizPassed ? "Complete" : "Next";
      } else {
        nextBtn.disabled = false;
        nextBtn.textContent = "Next";
      }
    }
  }

  // ===== QUIZ SUBMISSION =====
  submitQuiz() {
    // Collect all answers
    const questions = document.querySelectorAll(".quiz-question");
    this.userAnswers = {};
    let allAnswered = true;

    questions.forEach((question) => {
      const selectedInput = question.querySelector(
        'input[type="radio"]:checked'
      );
      if (selectedInput) {
        this.userAnswers[selectedInput.name] = selectedInput.value;
      } else {
        allAnswered = false;
      }
    });

    if (!allAnswered) {
      this.showMessage(
        "Please answer all questions before submitting.",
        "error"
      );
      return;
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quizData.length;

    quizData.forEach((q) => {
      if (this.userAnswers[q.name] === q.correct) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= 75;

    // Mark as submitted
    this.quizSubmitted = true;
    this.quizPassed = passed;

    // CRITICAL: Store in localStorage
    localStorage.setItem("moduleScore", score.toString());
    localStorage.setItem(
      "moduleAttempts",
      (parseInt(localStorage.getItem("moduleAttempts") || "0") + 1).toString()
    );
    localStorage.setItem("lastAttemptDate", new Date().toISOString());

    if (passed) {
      localStorage.setItem("moduleCompleted", "true");
      localStorage.setItem("completionDate", new Date().toISOString());
    }

    // Show feedback
    this.markQuizAnswers();
    this.showResults(score, correctAnswers, totalQuestions, passed);
    this.updateNavigation();

    // Disable submit button
    const submitBtn = document.getElementById("submitQuiz");
    if (submitBtn) submitBtn.disabled = true;
  }

  // ===== QUIZ FEEDBACK =====
  markQuizAnswers() {
    document.querySelectorAll(".quiz-question").forEach((question) => {
      const correctAnswer = question.getAttribute("data-correct");
      const questionName = question.querySelector('input[type="radio"]').name;
      const userAnswer = this.userAnswers[questionName];

      question.querySelectorAll(".quiz-option").forEach((option) => {
        const input = option.querySelector('input[type="radio"]');
        const isSelected = input.checked;
        const isCorrect = input.value === correctAnswer;

        if (isSelected) {
          if (isCorrect) {
            option.classList.add("correct");
            option.innerHTML +=
              ' <span style="color: var(--success); font-weight: bold;"> ✓</span>';
          } else {
            option.classList.add("incorrect");
            option.innerHTML +=
              ' <span style="color: var(--error); font-weight: bold;"> ✗</span>';
          }
        }
      });
    });
  }

  showResults(score, correct, total, passed) {
    const message = document.getElementById("quizMessage");
    const banner = document.getElementById("resultBanner");
    const retryBtn = document.getElementById("retryBtn");

    if (passed) {
      if (message) {
        message.textContent = `Congratulations! You scored ${score}% (${correct}/${total}). Module completed successfully!`;
        message.className = "quiz-message success";
      }

      if (banner) {
        banner.innerHTML = `
          <strong>Module Completed!</strong><br>
          <span>Score: ${score}% (${correct}/${total})</span><br>
          <span style="color: var(--success); font-weight: 500;">You are ready to proceed to the next module.</span>
        `;
        banner.className = "result-banner success";
        banner.style.display = "block";
      }

      if (retryBtn) retryBtn.style.display = "none";
    } else {
      if (message) {
        message.textContent = `You scored ${score}% (${correct}/${total}). You need 75% to pass. Please review the material and try again.`;
        message.className = "quiz-message error";
      }

      if (banner) {
        banner.innerHTML = `
          <strong>Module Not Completed</strong><br>
          <span>Score: ${score}% (${correct}/${total}). Minimum 75% required.</span><br>
          <span style="color: var(--error); font-weight: 500;">Please review the content and retry the assessment.</span>
        `;
        banner.className = "result-banner fail";
        banner.style.display = "block";
      }

      if (retryBtn) retryBtn.style.display = "inline-block";
    }
  }

  // ===== RESET FUNCTIONS =====
  retryQuiz() {
    // Clear all selections and feedback
    document.querySelectorAll(".quiz-option").forEach((option) => {
      option.classList.remove("selected", "correct", "incorrect");
      const feedback = option.querySelector('span[style*="color"]');
      if (feedback) feedback.remove();
    });

    // Clear radio buttons
    document
      .querySelectorAll('#quizForm input[type="radio"]')
      .forEach((input) => {
        input.checked = false;
      });

    // Clear messages
    this.clearMessages();

    // Reset state
    this.quizSubmitted = false;
    this.quizPassed = false;
    this.userAnswers = {};

    // Re-enable submit button
    const submitBtn = document.getElementById("submitQuiz");
    if (submitBtn) submitBtn.disabled = false;

    // Hide retry button
    const retryBtn = document.getElementById("retryBtn");
    if (retryBtn) retryBtn.style.display = "none";

    this.updateNavigation();
  }

  resetModule() {
    // Reset quiz first
    this.retryQuiz();

    // Go to first slide
    this.showSlide(0);
  }

  // ===== UTILITY METHODS =====
  showMessage(text, type) {
    const messageEl = document.getElementById("quizMessage");
    if (messageEl) {
      messageEl.textContent = text;
      messageEl.className = `quiz-message ${type}`;
    }
  }

  clearMessages() {
    const message = document.getElementById("quizMessage");
    const banner = document.getElementById("resultBanner");

    if (message) {
      message.textContent = "";
      message.className = "quiz-message";
    }

    if (banner) {
      banner.innerHTML = "";
      banner.style.display = "none";
    }
  }

  // ===== PROGRESS PERSISTENCE =====
  saveProgress() {
    localStorage.setItem("moduleProgress", this.currentSlide.toString());
    localStorage.setItem("lastAccessed", new Date().toISOString());
  }

  loadProgress() {
    // Check for previous completion
    if (localStorage.getItem("moduleCompleted") === "true") {
      const score = localStorage.getItem("moduleScore") || "N/A";
      const attempts = localStorage.getItem("moduleAttempts") || "1";

      const banner = document.getElementById("resultBanner");
      if (banner) {
        banner.innerHTML = `
          <strong>Previously Completed</strong><br>
          <span>Best Score: ${score}% | Attempts: ${attempts}</span><br>
          <span style="color: var(--success);">You can review content or retake to improve your score.</span>
        `;
        banner.className = "result-banner success";
        banner.style.display = "block";
      }
    }

    // Restore slide position
    const savedProgress = localStorage.getItem("moduleProgress");
    if (savedProgress && !isNaN(savedProgress)) {
      const slideIndex = parseInt(savedProgress);
      if (slideIndex >= 0 && slideIndex < this.totalSlides) {
        this.showSlide(slideIndex);
      }
    }
  }
}

// ===== INITIALIZATION =====
// CRITICAL: Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.educationalModule = new EducationalModule();
});
```

---

## 7. QUALITY ASSURANCE CHECKLIST (VALIDATE EVERY MODULE)

### Content Quality

- [ ] **Minimum 6-8 comprehensive content slides** before quiz
- [ ] **3-5 detailed paragraphs per slide** from source material
- [ ] **All key concepts extracted** from PRIMARY_CONTENT_SOURCE
- [ ] **No placeholder or generic text** - real content only
- [ ] **Proper academic terminology** and definitions included

### Quiz Standards

- [ ] **Exact number of questions** as specified in MODULE_DATA
- [ ] **Every question has exactly 4 options** (A, B, C, D)
- [ ] **Consistent quiz option layout** and spacing
- [ ] **All questions based on source material**
- [ ] **data-correct attributes** present on all questions

### Layout Consistency

- [ ] **Fixed slide container height** (600px)
- [ ] **Consistent spacing and padding** throughout
- [ ] **Uniform button sizes and colors**
- [ ] **Proper progress bar functionality**
- [ ] **Responsive design works** on mobile

### JavaScript Functionality

- [ ] **All navigation buttons work correctly**
- [ ] **Progress bar updates** with slide changes
- [ ] **Quiz validation** requires all questions answered
- [ ] **retryBtn stays on quiz slide** (does not go to slide 0)
- [ ] **resetBtn goes to slide 0** for module review
- [ ] **75% pass threshold enforced**
- [ ] **Keyboard navigation works** (arrow keys)

### Technical Requirements

- [ ] **Complete HTML document** with DOCTYPE
- [ ] **No external dependencies** or CDN links
- [ ] **All CSS variables defined** and used consistently
- [ ] **All required element IDs present**
- [ ] **File works immediately** when opened in browser

### 🔧 FUNCTIONALITY VERIFICATION CHECKLIST

**Navigation Testing:**

- [ ] Previous button disabled on first slide
- [ ] Next button works through all content slides
- [ ] Next button disabled on quiz until 75% passed
- [ ] Keyboard arrows work for navigation
- [ ] Progress bar updates correctly

**Quiz Testing:**

- [ ] All quiz questions render with 4 options each
- [ ] Radio button selection works (only one per question)
- [ ] Submit requires all questions answered
- [ ] Score calculation is accurate (75% = 3/4, 4/4, etc.)
- [ ] Retry clears all selections and feedback
- [ ] Reset goes to slide 0, retry stays on quiz

**localStorage Testing:**

- [ ] `moduleScore` stored after submission
- [ ] `moduleAttempts` increments on each submission
- [ ] `moduleCompleted` set to "true" when passed
- [ ] `moduleProgress` saves current slide
- [ ] Previous completion banner shows on reload

**Visual Testing:**

- [ ] Blue theme consistent throughout
- [ ] Hover effects work on buttons and options
- [ ] Success/error messages display correctly
- [ ] Mobile responsive design works
- [ ] Quiz feedback shows ✓/✗ correctly

---

## 8. COMMON ISSUES AND FIXES

### Issue 1: Inconsistent Quiz Layout

**Problem:** Options appear in single row or have different spacing
**Solution:** Use EXACT CSS from Section 5, ensure `.quiz-option` has `display: flex` and consistent padding

### Issue 2: Insufficient Content

**Problem:** Generated modules have minimal content
**Solution:** Extract MORE content from source, create 6-8 slides minimum, 3-5 paragraphs each

### Issue 3: Wrong Button Behaviors

**Problem:** retryBtn goes to slide 0, buttons don't work properly  
**Solution:** Follow EXACT JavaScript from Section 6, retryBtn must stay on quiz slide

### Issue 4: Inconsistent Heights

**Problem:** Slides have different heights, layout shifts
**Solution:** Use fixed height containers from Section 5, consistent min-height values

---

## 9. FINAL VALIDATION REQUIREMENTS

Before submitting ANY module, verify:

1. **Content Extraction:** Contains comprehensive material from source (not placeholder text)
2. **Quiz Structure:** Exact number of questions, all with 4 options A-D
3. **Layout Consistency:** Fixed heights, consistent spacing, professional appearance
4. **Button Functionality:** retryBtn/resetBtn work correctly, navigation functions
5. **Technical Compliance:** No external dependencies, works in any browser
6. **Design Standards:** Follows exact CSS variables and styling rules

**Remember:** Students depend on these modules for learning. Every module must be complete, consistent, and fully functional.

---

## 10. FINAL TEMPLATE COMPLIANCE CHECKLIST

### EXACT TEMPLATE MATCHING (VALIDATE EVERY ELEMENT)

- [ ] **HTML Structure**: Uses exact `<div class="module-container">` hierarchy
- [ ] **Progress Section**: Includes `progress-text` and `time-estimate` elements
- [ ] **Intro Text**: Has `<p class="intro">` with welcome message
- [ ] **Slide Structure**: Uses `<article class="slide" data-index="X">` format
- [ ] **Quiz Container**: Has `<div id="quizQuestionsContainer"></div>` (empty, populated by JS)
- [ ] **Button IDs**: All buttons have exact IDs: `prevBtn`, `nextBtn`, `submitQuiz`, `retryBtn`, `resetBtn`
- [ ] **Navigation**: Uses exact structure with `nav-buttons` and `nav-info` classes

### JAVASCRIPT FUNCTIONALITY (CRITICAL REQUIREMENTS)

- [ ] **ModuleController Class**: Must use class-based structure, not functional approach
- [ ] **Quiz Data Array**: Populate `quizData` with exact question count from MODULE_DATA
- [ ] **Dynamic Rendering**: Use `renderQuizQuestions()` function to populate quiz container
- [ ] **Event Binding**: All buttons bound in `bindEvents()` method using arrow functions
- [ ] **DOM Ready**: Initialize with `document.addEventListener("DOMContentLoaded", ...)`

### CSS COMPLIANCE (TEMPLATE VISUAL MATCH)

- [ ] **Color Variables**: Use exact color values from template (teal: #0b7b72, etc.)
- [ ] **Font Family**: Inter, "Segoe UI", Roboto, Arial, sans-serif
- [ ] **Layout Classes**: Include `.highlight`, `.video-container`, `.intro`, `.media` classes
- [ ] **Button Styling**: Exact button colors and hover states
- [ ] **Quiz Styling**: Proper spacing and background colors for questions/options

### CONTENT EXTRACTION (COMPREHENSIVE REQUIREMENTS)

- [ ] **Slide Count**: Minimum 6-8 content slides plus 1 quiz slide
- [ ] **Content Depth**: Each slide has 3-5 paragraphs of detailed material from source
- [ ] **Learning Objectives**: Extract and list specific objectives from source material
- [ ] **Key Concepts**: Use `.highlight` boxes for important definitions and principles
- [ ] **No Placeholders**: All content must be extracted from PRIMARY_CONTENT_SOURCE

### FUNCTIONAL VERIFICATION (MUST WORK PERFECTLY)

- [ ] **Navigation**: Previous/Next buttons work, progress bar updates
- [ ] **Quiz Validation**: Cannot submit until all questions answered
- [ ] **Scoring**: Calculates percentage correctly, 75% pass threshold
- [ ] **Button Behaviors**: retryBtn stays on quiz, resetBtn goes to slide 0
- [ ] **RETRY FUNCTIONALITY**: Retry button clears quiz completely and stays on quiz slide
- [ ] **RESET FUNCTIONALITY**: Reset button clears quiz and goes to slide 0
- [ ] **Quiz Clearing**: Form reset, re-render questions, re-attach events
- [ ] **Responsive**: Works properly on mobile devices
- [ ] **Self-Contained**: No external dependencies, works offline

---

## ⚡ FINAL GENERATION INSTRUCTIONS

### 🎯 CRITICAL IMPLEMENTATION STEPS:

1. **Extract Content**: Create 6-8 comprehensive slides from PRIMARY_CONTENT_SOURCE
2. **Populate Quiz**: Fill `quizData` array with exact number from MODULE_DATA.quizQuestions
3. **Copy JavaScript**: Use the complete `EducationalModule` class exactly as written
4. **Apply CSS**: Use all provided CSS with blue theme variables
5. **Test Everything**: Verify all buttons, navigation, and quiz functionality works

### 🚨 ABSOLUTE REQUIREMENTS:

```
✅ SINGLE ARCHITECTURE: Only EducationalModule class, no standalone functions
✅ EXACT JAVASCRIPT: Copy implementation without modifications
✅ COMPLETE FUNCTIONALITY: Every button and feature must work
✅ BLUE THEME ONLY: Use --primary, --secondary, --light-blue variables
✅ LOCALSTORAGE WORKING: Progress and scores must persist
✅ RESPONSIVE DESIGN: Must work on all screen sizes
✅ NO PLACEHOLDERS: Real content only from source material
```

### 💯 SUCCESS GUARANTEE:

> **If you follow these instructions exactly, the generated module will have:**
>
> - 100% working navigation and quiz functionality
> - Perfect localStorage implementation
> - Consistent blue theme throughout
> - Professional responsive design
> - Complete educational content from source

---

**GENERATE COMPLETE, FUNCTIONAL HTML MODULE NOW** 🚀
