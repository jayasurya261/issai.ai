require('dotenv').config();
const { getFinancialAdvice } = require('./services/aiService');

async function testAI() {
    console.log("Testing AI Financial Advice Service...");

    const sampleContext = {
        recentExpenses: [
            { title: 'Starbucks', amount: 5.50, category: 'Food', date: new Date() },
            { title: 'Uber', amount: 12.00, category: 'Travel', date: new Date() },
            { title: 'Netflix', amount: 15.00, category: 'Entertainment', date: new Date() }
        ],
        summary: { totalAmount: 32.50, count: 3 }
    };

    const query = "How can I save money based on my recent spending?";

    console.log(`\nQuery: "${query}"`);
    console.log("Context provided:", JSON.stringify(sampleContext, null, 2));

    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn("\nWARNING: GEMINI_API_KEY is missing in .env. The test might return a fallback message.");
        }

        const response = await getFinancialAdvice(query, sampleContext);
        console.log("\n--- AI Response ---");
        console.log(response);
        console.log("-------------------");
    } catch (error) {
        console.error("Test failed:", error);
    }
}

testAI();
