const { OpenAI } = require("openai");

const client = new OpenAI({
    baseURL: process.env.LLM_BASE_URL,
    apiKey: process.env.LLM_API_KEY,
});

async function callAI() {
    const res = await client.chat.completions.create({
        model: process.env.LLM_MODEL,
        messages: [{
            role: "user",
            content: "Reply with exactly the word: ready"
        }],
    });

    return res;
}

async function main() {
    const res = await callAI();

    console.log(res.choices[0].message.content);
}

main();