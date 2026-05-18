const fs = require('fs');

// ── 1. Add TTS rate slider to map.html display pane ──────────────────────
let map = fs.readFileSync('map.html', 'utf8');

// After the TTS toggle button, add the rate slider
map = map.replace(
    `<button class="a11y-btn a11y-tts-btn" onclick="toggleTTS()" aria-pressed="false">🔊 Read Aloud</button>`,
    `<button class="a11y-btn a11y-tts-btn" onclick="toggleTTS()" aria-pressed="false">🔊 Read Aloud</button>
                        <div class="font-size-control" style="margin-top:4px;">
                            <label class="font-size-label" for="map-tts-rate">Reading Speed</label>
                            <div class="font-size-row">
                                <span style="font-size:0.8em;color:#888;">🐢</span>
                                <input type="range" id="map-tts-rate" class="font-size-slider tts-rate-slider"
                                    min="0.3" max="1.5" step="0.05" value="0.85"
                                    aria-label="Reading speed" aria-valuemin="30" aria-valuemax="150" aria-valuenow="85"
                                    oninput="setTTSRate(parseFloat(this.value))">
                                <span style="font-size:0.8em;color:#888;">🚀</span>
                            </div>
                            <div class="font-size-value tts-rate-label">🚶 Normal</div>
                        </div>`
);

fs.writeFileSync('map.html', map, 'utf8');
console.log('map.html TTS rate slider:', map.includes('tts-rate-slider'));

// ── 2. Add TTS rate slider to survey.html a11y panel ─────────────────────
let survey = fs.readFileSync('survey.html', 'utf8');

survey = survey.replace(
    `<button class='survey-a11y-small-btn a11y-tts-btn' onclick='toggleTTS()' aria-pressed='false'>Read Aloud</button>`,
    `<button class='survey-a11y-small-btn a11y-tts-btn' onclick='toggleTTS()' aria-pressed='false'>Read Aloud</button>
                </div>
                <div class="a11y-row" style="align-items:center;">
                    <label for="survey-tts-rate">Reading Speed</label>
                    <span style="font-size:0.8em;">🐢</span>
                    <input type="range" id="survey-tts-rate" class="tts-rate-slider"
                        min="0.3" max="1.5" step="0.05" value="0.85"
                        aria-label="Reading speed" style="flex:1;"
                        oninput="setTTSRate(parseFloat(this.value))">
                    <span style="font-size:0.8em;">🚀</span>
                    <span class="tts-rate-label" style="min-width:70px;font-size:0.8em;color:#555;text-align:right;">🚶 Normal</span>
                </div>
                <div class="a11y-row" style="display:none;">`  // dummy open div that gets closed by next item
);

// That approach breaks HTML. Let me do it differently - just inject before the closing </div> of the button row
// Reset - redo from scratch
survey = fs.readFileSync('survey.html', 'utf8');

const oldTTSRow = `<div class='a11y-row'>
                    <button class='survey-a11y-small-btn a11y-dyslexia-btn' onclick='toggleDyslexiaFont()' aria-pressed='false'>Dyslexia Font</button>
                    <button class='survey-a11y-small-btn a11y-ruler-btn' onclick='toggleReadingRuler()' aria-pressed='false'>Reading Ruler</button>
                    <button class='survey-a11y-small-btn a11y-tts-btn' onclick='toggleTTS()' aria-pressed='false'>Read Aloud</button>
                </div>`;

const newTTSRows = `<div class='a11y-row'>
                    <button class='survey-a11y-small-btn a11y-dyslexia-btn' onclick='toggleDyslexiaFont()' aria-pressed='false'>Dyslexia Font</button>
                    <button class='survey-a11y-small-btn a11y-ruler-btn' onclick='toggleReadingRuler()' aria-pressed='false'>Reading Ruler</button>
                    <button class='survey-a11y-small-btn a11y-tts-btn' onclick='toggleTTS()' aria-pressed='false'>Read Aloud</button>
                </div>
                <div class="a11y-row" style="align-items:center;gap:6px;">
                    <label for="survey-tts-rate" style="min-width:80px;">Reading Speed</label>
                    <span style="font-size:0.82em;" aria-hidden="true">🐢</span>
                    <input type="range" id="survey-tts-rate" class="tts-rate-slider"
                        min="0.3" max="1.5" step="0.05" value="0.85"
                        aria-label="Reading speed - adjust to make Read Aloud faster or slower"
                        style="flex:1;" oninput="setTTSRate(parseFloat(this.value))">
                    <span style="font-size:0.82em;" aria-hidden="true">🚀</span>
                    <span class="tts-rate-label" style="min-width:68px;font-size:0.82em;color:#555;text-align:right;">🚶 Normal</span>
                </div>`;

if (survey.includes(oldTTSRow)) {
    survey = survey.replace(oldTTSRow, newTTSRows);
    console.log('survey.html TTS rate slider: injected by exact match');
} else {
    // Fallback: inject after the Read Aloud button
    survey = survey.replace(
        `<button class='survey-a11y-small-btn a11y-tts-btn' onclick='toggleTTS()' aria-pressed='false'>Read Aloud</button>
                </div>`,
        `<button class='survey-a11y-small-btn a11y-tts-btn' onclick='toggleTTS()' aria-pressed='false'>Read Aloud</button>
                </div>
                <div class="a11y-row" style="align-items:center;gap:6px;">
                    <label for="survey-tts-rate" style="min-width:80px;">Reading Speed</label>
                    <span aria-hidden="true">🐢</span>
                    <input type="range" id="survey-tts-rate" class="tts-rate-slider" min="0.3" max="1.5" step="0.05" value="0.85" aria-label="Reading speed" style="flex:1;" oninput="setTTSRate(parseFloat(this.value))">
                    <span aria-hidden="true">🚀</span>
                    <span class="tts-rate-label" style="min-width:68px;font-size:0.82em;color:#555;text-align:right;">🚶 Normal</span>
                </div>`
    );
    console.log('survey.html TTS rate slider: injected by fallback');
}

fs.writeFileSync('survey.html', survey, 'utf8');
console.log('survey tts-rate-slider present:', survey.includes('tts-rate-slider'));
