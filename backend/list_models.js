require('dotenv').config();
const fs = require('fs');

async function listModels() {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            const models = data.models.map(m => m.name).join('\n');
            fs.writeFileSync('models.txt', models);
            console.log("Wrote models to models.txt");
        } else {
            fs.writeFileSync('models.txt', JSON.stringify(data, null, 2));
        }

    } catch (error) {
        fs.writeFileSync('models.txt', "Error: " + error.message);
    }
}

listModels();
