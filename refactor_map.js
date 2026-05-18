const fs = require('fs');

const mapHtml = fs.readFileSync('map.html', 'utf-8');

// We want to extract the CSS and JS, then rewrite map.html to use semantic tags.
// First, extract CSS
const styleRegex = /<style>([\s\S]*?)<\/style>/;
const styleMatch = mapHtml.match(styleRegex);
if (styleMatch) {
    fs.writeFileSync('css/map_old.css', styleMatch[1], 'utf-8');
}

// Extract the JS
// There are multiple script tags. We want the one that has all the custom logic.
const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
let match;
let scripts = [];
while ((match = scriptRegex.exec(mapHtml)) !== null) {
    scripts.push(match[1]);
}

if (scripts.length > 0) {
    fs.writeFileSync('js/map_old.js', scripts.join('\n\n'), 'utf-8');
}

// Now replace in HTML
let newHtml = mapHtml.replace(styleRegex, `    <link rel="stylesheet" href="css/core.css">
    <link rel="stylesheet" href="css/accessibility.css">
    <link rel="stylesheet" href="css/map_old.css">`);

newHtml = newHtml.replace(/<script>[\s\S]*?<\/script>/g, '');

// Inject script references right before </body>
newHtml = newHtml.replace('</body>', `    <script src="js/app.js"></script>
    <script src="js/accessibility.js"></script>
    <script src="js/map_old.js"></script>
    <script src="js/i18n.js"></script>
</body>`);

// Add skip link
newHtml = newHtml.replace('<div id="app">', `<a href="#main-content" class="skip-link">Skip to main content</a>\n    <main id="app" role="main">`);
newHtml = newHtml.replace('</div>\n\n    <button id="recenter-btn">', '</main>\n\n    <button id="recenter-btn">');

// Make sidebar an aside
newHtml = newHtml.replace('<nav id="sidebar">', '<aside id="sidebar" aria-label="Map Controls">');
newHtml = newHtml.replace('</nav>', '</aside>');

fs.writeFileSync('map.html', newHtml, 'utf-8');

console.log("map.html refactored successfully.");
