const fs = require('fs');

const content = fs.readFileSync('map.html', 'utf-8');

function extractArray(varName) {
    const regex = new RegExp(`var\\s+${varName}\\s*=\\s*(\\[[\\s\\S]*?\\]);`);
    const match = content.match(regex);
    if (match) {
        let arrStr = match[1];
        // Convert single quotes to double quotes, handle unquoted keys
        // Since it's valid JS, we can use eval or Function to parse it
        try {
            const parsed = new Function(`return ${arrStr};`)();
            return parsed;
        } catch (e) {
            console.error(`Error parsing ${varName}:`, e);
            return [];
        }
    }
    return [];
}

const backupHubs = extractArray('backupHubs');
const sites = extractArray('sites');
const stages = extractArray('stages');

const data = {
    backupHubs,
    sites,
    stages
};

fs.writeFileSync('data/locations.json', JSON.stringify(data, null, 2), 'utf-8');
console.log('locations.json written.');
