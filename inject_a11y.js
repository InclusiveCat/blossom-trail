const fs = require('fs');
let html = fs.readFileSync('survey.html', 'utf8');

if (html.includes('survey-a11y-panel')) {
    console.log('Already has panel, skipping.');
    process.exit(0);
}

const a11yPanel = [
    '',
    "            <!-- Accessibility Options panel (set before you begin) -->",
    "            <button class='survey-a11y-toggle' onclick='this.nextElementSibling.classList.toggle(\"open\"); this.setAttribute(\"aria-expanded\", this.nextElementSibling.classList.contains(\"open\"))' aria-expanded='false' aria-controls='survey-a11y-panel'>",
    "                &#9881; Accessibility Options &#9660;",
    "            </button>",
    "            <div id='survey-a11y-panel' class='survey-a11y-panel' role='region' aria-label='Accessibility Options'>",
    "                <div class='a11y-row'>",
    "                    <label for='survey-theme-select'>Colour Theme</label>",
    "                    <select id='survey-theme-select' class='a11y-theme-select' onchange='setTheme(this.value)' aria-label='Select colour theme'>",
    "                        <option value='default'>Default</option>",
    "                        <option value='high-contrast'>High Contrast</option>",
    "                        <option value='dark-mode'>Dark Mode</option>",
    "                        <option value='sepia-overlay'>Sepia</option>",
    "                        <option value='cyan-overlay'>Cyan</option>",
    "                        <option value='sage-overlay'>Sage</option>",
    "                    </select>",
    "                </div>",
    "                <div class='a11y-row'>",
    "                    <label>Text Size</label>",
    "                    <button class='survey-a11y-small-btn' onclick='stepFontSize(-0.1)' aria-label='Decrease text size'>A-</button>",
    "                    <input type='range' class='font-size-slider' min='0.8' max='1.4' step='0.05' value='1' aria-label='Text size' oninput='applyFontScale(parseFloat(this.value))' style='flex:1;'>",
    "                    <button class='survey-a11y-small-btn' onclick='stepFontSize(0.1)' aria-label='Increase text size'>A+</button>",
    "                    <span class='font-size-value' style='min-width:36px;text-align:right;font-size:0.82em;color:#666;'>100%</span>",
    "                </div>",
    "                <div class='a11y-row'>",
    "                    <button class='survey-a11y-small-btn a11y-dyslexia-btn' onclick='toggleDyslexiaFont()' aria-pressed='false'>Dyslexia Font</button>",
    "                    <button class='survey-a11y-small-btn a11y-ruler-btn' onclick='toggleReadingRuler()' aria-pressed='false'>Reading Ruler</button>",
    "                    <button class='survey-a11y-small-btn a11y-tts-btn' onclick='toggleTTS()' aria-pressed='false'>Read Aloud</button>",
    "                </div>",
    "            </div>",
    ""
].join('\n');

html = html.replace('<div class="progress" id="progress-bar"', a11yPanel + '<div class="progress" id="progress-bar"');
fs.writeFileSync('survey.html', html, 'utf8');
console.log('Done. Panel found:', html.includes('survey-a11y-panel'));
