const fs = require('fs');
const langs = {
    en: 'Reading Speed',
    es: 'Velocidad de lectura',
    fr: 'Vitesse de lecture',
    de: 'Lesegeschwindigkeit',
    pl: 'Prędkość czytania',
    cy: 'Cyflymder darllen',
    ro: 'Viteza de citire',
    ar: 'سرعة القراءة',
    ur: 'پڑھنے کی رفتار'
};

Object.keys(langs).forEach(function(lang) {
    const path = 'lang/' + lang + '.json';
    if (!fs.existsSync(path)) return;
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    if (!data.accessibility) data.accessibility = {};
    data.accessibility.readingSpeed = langs[lang];
    // Also ensure readAloud key has no emoji prefix for clean button text
    if (data.accessibility.readAloud && !data.accessibility.readAloud.includes('Read')) {
        // non-English — keep as-is
    } else {
        data.accessibility.readAloud = data.accessibility.readAloud || 'Read Aloud';
    }
    fs.writeFileSync(path, JSON.stringify(data, null, 4), 'utf8');
    console.log(lang + ': readingSpeed = ' + langs[lang]);
});
