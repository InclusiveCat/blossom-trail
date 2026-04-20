const fs = require('fs');
const html = fs.readFileSync('form_raw.html', 'utf-8');
const match = html.match(/var FB_PUBLIC_LOAD_DATA_ = (\[.*?\]);<\/script>/s);
if (match) {
    const data = JSON.parse(match[1]);
    const questions = data[1][1];
    questions.forEach(item => {
        if (item[4]) {
            console.log(`\n--- ${item[1]} ---`);
            const opts = item[4][0];
            console.log(`Entry ID: entry.${opts[0]}`);
            if (opts[1]) {
                console.log(`Choices:`);
                opts[1].forEach(choice => {
                    console.log(` - ${choice[0]}`);
                });
            }
        }
    });
}
