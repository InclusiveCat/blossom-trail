const fs = require('fs');
const map = fs.readFileSync('map.html','utf8');
const survey = fs.readFileSync('survey.html','utf8');
const checks = [
  ['map: Request Assistance tab', map.includes('Request Assistance')],
  ['map: aria-label on Request Assistance', map.includes('Request Assistance - opens a help menu')],
  ['map: language switcher', map.includes('blossom-lang-select')],
  ['map: tablist role', map.includes('role="tablist"')],
  ['survey: a11y panel', survey.includes('survey-a11y-panel')],
  ['survey: Request Assistance', survey.includes('Request Assistance')],
  ['survey: language switcher', survey.includes('blossom-lang-select')],
  ['survey: toggleDyslexiaFont', survey.includes('toggleDyslexiaFont')],
  ['survey: setTheme', survey.includes('setTheme')],
  ['survey: toggleTTS', survey.includes('toggleTTS')],
];
checks.forEach(([label, val]) => console.log((val ? 'PASS' : 'FAIL') + ' ' + label));
const pass = checks.filter(c => c[1]).length;
console.log('\n' + pass + '/' + checks.length + ' checks passed');
process.exit(pass === checks.length ? 0 : 1);
