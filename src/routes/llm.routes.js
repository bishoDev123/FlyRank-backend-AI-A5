const express = require('express');
const router = express.Router();
const z = require('zod');
const { OpenAI } = require("openai");

const { LLMInputSchema, LLMOutputSchema } = require('../llm/schema');

const fs = require("fs");
const path = require("path");

const promptPath = path.join(
    process.cwd(),
    "src",
    "llm",
    "prompts",
    "generate-script-v1.md"
);

const client = new OpenAI({
    baseURL: process.env.LLM_BASE_URL,
    apiKey: process.env.LLM_API_KEY
});

const systemPrompt = fs.readFileSync(promptPath, "utf8");

router.post('/generate-script', async (req, res, next) => {
    try {
        // A stub mode to not use LLM resources
        if (process.env.LLM_STUB == 1) {
            const input = LLMInputSchema.parse(req.body);
            const output = LLMOutputSchema.parse({ script: "This is a test in stub mode" });
            res.status(200).json({ input, output });
        }
        else {
            const input = LLMInputSchema.parse(req.body);

            const prompt = [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: JSON.stringify(input)
                }
            ]

            const completion = await client.chat.completions.create({
                model: process.env.LLM_MODEL,
                messages: prompt,
                temperature: 0.2
            });
            const text = completion.choices[0].message.content;

            return res.status(200).json({ output: text });
        }

    } catch (error) {
        // to be implemented in the error handler
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: "Invalid request body",
                details: error.issues
            });
        }

        next(error);
    }
});

module.exports = router;