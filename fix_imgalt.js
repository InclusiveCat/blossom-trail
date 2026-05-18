const fs = require('fs');
let js = fs.readFileSync('js/map.js', 'utf8');

// Fix popup image alt to use s.imgAlt if available, otherwise fall back to descriptive name
js = js.replace(
    `(s.img ? '<img src="' + s.img + '" class="popup-img" alt="Photo of ' + s.name + '">' : '')`,
    `(s.img ? '<img src="' + s.img + '" class="popup-img" alt="' + (s.imgAlt || (s.type === "blossom" ? "Blossom trees in bloom at " + s.name : s.name + " — landmark on the Blossom Trail")) + '">' : '')`
);

fs.writeFileSync('js/map.js', js, 'utf8');

try {
    new Function(fs.readFileSync('js/map.js','utf8'));
    console.log('map.js: OK');
} catch(e) {
    console.error('SYNTAX ERROR:', e.message);
}

const check = fs.readFileSync('js/map.js','utf8');
console.log('imgAlt support:', check.includes('s.imgAlt'));
