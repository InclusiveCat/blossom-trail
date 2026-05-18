const fs = require('fs');
let s = fs.readFileSync('survey.html', 'utf8');

// The select uses double quotes in this part of the HTML
const selectRegex = /id="survey-lang-select"[^>]*>([\s\S]*?)<\/select>/;
const match = s.match(selectRegex);

if (match) {
    const newOptions = [
        "<option value=\"en\">English</option>",
        "<option value=\"cy\">Cymraeg (Welsh)</option>",
        "<option value=\"fr\">Fran\u00e7ais</option>",
        "<option value=\"de\">Deutsch</option>",
        "<option value=\"pl\">Polski</option>",
        "<option value=\"ro\">Rom\u00e2n\u0103</option>",
        "<option value=\"es\">Espa\u00f1ol</option>",
        "<option value=\"ar\">\u0627\u0644\u0639\u0631\u0628\u064a\u0629</option>",
        "<option value=\"ur\">\u0627\u0631\u062f\u0648</option>"
    ].join('\n                    ');
    
    const newSelect = match[0].replace(match[1], '\n                    ' + newOptions + '\n                ');
    s = s.replace(match[0], newSelect);
    fs.writeFileSync('survey.html', s, 'utf8');
    console.log('Done. Cymraeg:', s.includes('Cymraeg'));
} else {
    console.log('Still not found. Dumping all select tags:');
    const matches = s.match(/<select[^>]*>/g);
    if (matches) matches.forEach(m => console.log(m));
}
