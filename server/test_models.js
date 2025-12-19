require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Dummy initial
        // Actually, the SDK doesn't expose listModels directly on the main class easily in all versions, 
        // but let's try to just use a known working model like 'gemini-1.5-flash-latest' or 'gemini-pro'
        // If the implementation of listModels is needed we might need to use the REST API manually or dig into the object.
        // However, usually 'gemini-1.5-flash' works. Let's try 'gemini-1.5-flash-latest' or just 'gemini-1.5-pro'

        // Wait, check if I can just simple-test a few common ones. 
    } catch (e) {
        console.log(e);
    }
}

// Actually better to just try a few known ones in the test script.
const models = ["gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-1.0-pro"];

async function testModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

    for (const m of models) {
        console.log(`Testing model: ${m}`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Hello");
            console.log(`SUCCESS with ${m}`);
            return;
        } catch (error) {
            console.log(`FAILED with ${m}: ${error.message.split('\n')[0]}`);
        }
    }
}

testModels();
