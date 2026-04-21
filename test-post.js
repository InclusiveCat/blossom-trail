const fs = require('fs');

async function testSubmit() {
    const formData = new URLSearchParams();
    formData.append('entry.797108725', 'Female');
    formData.append('entry.429384339', 'Under 18 years');
    formData.append('entry.752149719', '🟪Blooming - I\'m thriving, my energy is strong, daily tasks feel manageable. I can engage, plan and adapt with confidence.');
    formData.append('entry.320659026', 'County Durham');
    formData.append('entry.751986915', 'Active in Employment');
    formData.append('entry.1437769659', 'Agree');
    formData.append('entry.1712510494', 'Agree');
    formData.append('entry.1609008989', 'test tasks');
    formData.append('entry.249581486', 'Agree');
    formData.append('entry.1069785642', 'Flexible support - services that adapt to fluctuating energy, communication, and executive‑function needs.');
    formData.append('entry.1218629302', 'Agree');
    formData.append('entry.659943046', 'test working well');

    const response = await fetch('https://docs.google.com/forms/d/e/1FAIpQLSctSSap_3TAdcZ0p6uCQPOnNI0rZe1fAENhh6RKfjVj-CvJwA/formResponse', {
        method: 'POST',
        body: formData,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    const text = await response.text();
    console.log("Status:", response.status);
    const hasError = text.includes('freebirdFormviewerViewResponseLinksContainer') || text.includes('error');
    if (text.includes("Your response has been recorded")) {
        console.log("Success message found.");
    } else {
        console.log("Failed. Extracting error...");
        const match = text.match(/<div class="[^"]*freebirdFormviewerViewItemsItemErrorMessage[^"]*".*?>(.*?)<\/div>/g);
        console.log(match);
        fs.writeFileSync('form-err.html', text);
    }
}

testSubmit();
