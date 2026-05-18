const fs = require('fs');
let survey = fs.readFileSync('survey.html', 'utf8');

// Fix Reading Speed labels in survey
survey = survey.replace(
    /<span[^>]*>Slower<\/span>/g,
    '<span style="font-size:0.82em;color:#888;" aria-hidden="true">Slower</span>'
);
survey = survey.replace(
    /<span[^>]*>Faster<\/span>/g,
    '<span style="font-size:0.82em;color:#888;" aria-hidden="true">Faster</span>'
);

// Fix tts-rate-label initial text
survey = survey.replace(/>Normal<\/span>/g, ' class="tts-rate-label" style="min-width:68px;font-size:0.82em;color:#555;text-align:right;">Normal</span>');

// Add data-i18n to survey a11y panel labels that are translatable
survey = survey.replace(
    ">Colour Theme</label>",
    ' data-i18n="accessibility.colourTheme">Colour Theme</label>'
);
survey = survey.replace(
    ">Text Size</label>",
    ' data-i18n="accessibility.textSize">Text Size</label>'
);
survey = survey.replace(
    "'>A-</button>",
    "' data-i18n=\"accessibility.decrease\">A-</button>"
);
survey = survey.replace(
    "'>A+</button>",
    "' data-i18n=\"accessibility.increase\">A+</button>"
);
survey = survey.replace(
    "'>Dyslexia Font</button>",
    "' data-i18n=\"accessibility.dyslexiaFont\">Dyslexia Font</button>"
);
survey = survey.replace(
    "'>Reading Ruler</button>",
    "' data-i18n=\"accessibility.readingRuler\">Reading Ruler</button>"
);
survey = survey.replace(
    "'>Read Aloud</button>",
    "' data-i18n=\"accessibility.readAloud\">Read Aloud</button>"
);
// Request Assistance label
survey = survey.replace(
    '>🆘 Request Assistance</strong>',
    ' data-i18n="accessibility.requestAssistance">🆘 Request Assistance</strong>'
);

fs.writeFileSync('survey.html', survey, 'utf8');
const i18nCount = (survey.match(/data-i18n=/g) || []).length;
console.log('data-i18n attrs in survey.html:', i18nCount);
console.log('Turtle emoji gone:', !survey.includes('\uD83D\uDC22'));
