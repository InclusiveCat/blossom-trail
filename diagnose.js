const fs = require('fs');

// 1. Check popup alt text
const js = fs.readFileSync('js/map.js', 'utf8');
const lines = js.split('\n');
lines.forEach((l, i) => {
  if (l.includes('popup-img')) {
    console.log('POPUP LINE ' + (i+1) + ':');
    console.log(l);
  }
});

// 2. Check data-i18n attrs in map.html
const html = fs.readFileSync('map.html', 'utf8');
const i18nMatches = html.match(/data-i18n="[^"]+"/g) || [];
console.log('\ndata-i18n in map.html:', i18nMatches.length, 'instances');
i18nMatches.forEach(m => console.log(' ', m));

// 3. Check data-i18n in survey.html
const survey = fs.readFileSync('survey.html', 'utf8');
const surveyI18n = survey.match(/data-i18n="[^"]+"/g) || [];
console.log('\ndata-i18n in survey.html:', surveyI18n.length, 'instances');
surveyI18n.forEach(m => console.log(' ', m));

// 4. Check TTS selector in accessibility.js
const a11y = fs.readFileSync('js/accessibility.js', 'utf8');
const ttsSection = a11y.match(/TTS_SELECTOR[\s\S]*?;/);
if (ttsSection) console.log('\nTTS_SELECTOR:', ttsSection[0]);

// 5. Check rate slider emojis
const hasSlowFast = a11y.includes('Slower') || a11y.includes('Faster');
const hasTurtle = a11y.includes('🐢');
console.log('\nHas Slower/Faster text:', hasSlowFast);
console.log('Has turtle emoji:', hasTurtle);
