const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const validCategories = [
    'Food', 'Travel', 'Rent', 'Utilities', 'Entertainment', 'Health', 'Education', 'Shopping', 'Other'
];

async function categorizeExpense(title, description = '') {
    // 1. Rule-based Strategy (Keyword Matching)
    const lowerTitle = title.toLowerCase();
    const lowerDesc = description.toLowerCase();
    const combined = lowerTitle + " " + lowerDesc;

    const keywords = {
        'Food': ['coffee', 'starbucks', 'mcdonalds', 'burger', 'pizza', 'restaurant', 'lunch', 'dinner', 'breakfast', 'grocery', 'market', 'food', 'whole foods', 'trader joes'],
        'Travel': ['uber', 'lyft', 'taxi', 'flight', 'airline', 'hotel', 'airbnb', 'train', 'bus', 'subway', 'fuel', 'gas', 'parking'],
        'Rent': ['rent', 'lease', 'mortgage'],
        'Utilities': ['electric', 'water', 'internet', 'wifi', 'phone', 'mobile', 'bill', 'utility'],
        'Entertainment': ['movie', 'cinema', 'netflix', 'spotify', 'hulu', 'concert', 'ticket', 'game', 'steam', 'playstation', 'xbox'],
        'Health': ['doctor', 'hospital', 'pharmacy', 'drug', 'medicine', 'dental', 'gym', 'fitness', 'clinic'],
        'Education': ['course', 'book', 'tuition', 'school', 'university', 'college', 'udemy', 'coursera', 'learning'],
        'Shopping': ['amazon', 'walmart', 'target', 'clothes', 'shoe', 'electronics', 'apple', 'store', 'shop']
    };

    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => combined.includes(word))) {
            return category;
        }
    }

    // 2. AI Strategy
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is not set and keyword match failed. Defaulting to 'Other'.");
        return 'Other'; // Better fallback
    }

    try {
        const prompt = `
      You are an expert financial assistant.
      Categorize the following expense into exactly one of these categories: 
      ${validCategories.join(', ')}.
      
      Expense Title: ${title}
      Description: ${description}
      
      Rules:
      1. Return ONLY the category name from the list above.
      2. Do not explain your reasoning.
      3. Do not use punctuation or markdown formatting.
      4. If unsure, choose the best fit or 'Other'.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        // Clean up potential markdown formatting (e.g. **Food**)
        text = text.replace(/[*_`]/g, '').trim();

        // Validate against allowed categories (case-insensitive)
        const matchedCategory = validCategories.find(c => c.toLowerCase() === text.toLowerCase());

        if (matchedCategory) {
            return matchedCategory;
        } else {
            console.warn(`AI returned invalid category: '${text}'. Defaulting to 'Other'.`);
            return 'Other';
        }

    } catch (error) {
        console.error("Error categorizing expense:", error);
        return 'Other';
    }
}


async function getFinancialAdvice(query, contextData) {
    if (!process.env.GEMINI_API_KEY) {
        return "I'm sorry, I can't provide advice right now because my brain (API Key) is missing.";
    }

    try {
        const prompt = `
      You are a wise and helpful financial advisor and expense tracking assistant.
      
      Here is the user's current expense context:
      ${JSON.stringify(contextData, null, 2)}
      
      The user asks: "${query}"
      
      Provide a helpful, friendly, and concise response. 
      If they ask for advice, analyze their spending patterns (if provided) and suggest improvements.
      If they ask a general question, answer it.
      Keep the tone encouraging, professional yet accessible.
      Do not output raw JSON, talk to the user naturally.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Error getting AI advice:", error);
        return "I'm having trouble thinking right now. Please try again later.";
    }
}

module.exports = { categorizeExpense, getFinancialAdvice };

