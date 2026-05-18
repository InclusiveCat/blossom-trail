const fs = require('fs');
const files = ['js/accessibility.js', 'js/i18n.js', 'js/map.js'];
let allOk = true;
files.forEach(f => {
    try {
        new Function(fs.readFileSync(f, 'utf8'));
        console.log(f + ': OK');
    } catch(e) {
        console.error(f + ': SYNTAX ERROR - ' + e.message);
        allOk = false;
    }
});
process.exit(allOk ? 0 : 1);
