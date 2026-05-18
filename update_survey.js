const fs = require('fs');
let html = fs.readFileSync('survey.html', 'utf8');

// Add Request Assistance section and language switcher to the existing a11y panel
// Find the closing </div> of the survey-a11y-panel and inject before it
const assistanceAndLang = `
                <hr class="a11y-divider">
                <div class="a11y-row">
                    <label for="survey-lang-select">🌐 Language</label>
                    <select id="survey-lang-select" aria-label="Select display language" onchange="if(window.i18n){window.i18n.setLanguage(this.value)}">
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                    </select>
                </div>
                <hr class="a11y-divider">
                <div class="a11y-row" style="flex-direction:column;align-items:flex-start;">
                    <strong style="font-size:0.82em;color:#c62828;margin-bottom:6px;">🆘 Request Assistance</strong>
                    <a href="https://999bsl.co.uk" target="_blank" rel="noopener noreferrer"
                        class="survey-a11y-small-btn" style="margin-bottom:6px;display:block;text-align:center;text-decoration:none;"
                        aria-label="Request Assistance - opens a help menu">🤟 999 BSL Video Relay</a>
                    <a href="https://www.relayuk.bt.com" target="_blank" rel="noopener noreferrer"
                        class="survey-a11y-small-btn" style="display:block;text-align:center;text-decoration:none;"
                        aria-label="Request Assistance - opens a help menu">💬 Relay UK Text Calls</a>
                </div>
`;

// Insert before the closing </div> of the survey-a11y-panel
html = html.replace(
    "</div>\n<div class=\"progress\"",
    assistanceAndLang + "\n            </div>\n<div class=\"progress\""
);

// Also fix the progress bar indentation (it was missing indentation from the node injection)
html = html.replace(
    '<div class="progress" id="progress-bar"',
    '            <div class="progress" id="progress-bar"'
);

fs.writeFileSync('survey.html', html, 'utf8');

const check = fs.readFileSync('survey.html', 'utf8');
console.log('Request Assistance in survey:', check.includes('Request Assistance'));
console.log('Language switcher in survey:', check.includes('survey-lang-select'));
