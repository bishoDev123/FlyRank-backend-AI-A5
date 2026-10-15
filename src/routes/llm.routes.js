const express = require('express');
const router = express.Router();
const z = require('zod');
const { OpenAI } = require("openai");
const fs = require("fs");
const path = require("path");

const PROMPT_VERSION = "generate-script-v3";

const { LLMInputSchema, LLMOutputSchema } = require('../llm/schema');

const promptPath = path.join(
    process.cwd(),
    "src",
    "llm",
    "prompts",
    `${PROMPT_VERSION}.md`
);

const quarantinePath = path.join(
    process.cwd(),
    "logs",
    "quarantine.jsonl"
);

const client = new OpenAI({
    baseURL: process.env.LLM_BASE_URL,
    apiKey: process.env.LLM_API_KEY
});

const systemPrompt = fs.readFileSync(promptPath, "utf8");

function extractJson(text) {
    // First attempt use regex, but finding the curly brackets is a much smarter approach imo
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end <= start) {
        throw new SyntaxError("No JSON object in model output");
    }
    return JSON.parse(text.slice(start, end + 1));
}

function parseAndValidate(text) {
    let data;
    // validating json parsing
    try {
        data = extractJson(text);
    }
    catch (error) {
        return { ok: false, error: `JSON parse error: ${error.message}` }
    }

    //validating schema parsing
    const result = LLMOutputSchema.safeParse(data);
    if (!result.success) {
        return { ok: false, error: JSON.stringify(result.error.issues) };
    }

    return { ok: true, data: result.data };
}

async function callModel(messages) {
    const completion = await client.chat.completions.create({
        model: process.env.LLM_MODEL,
        messages,
        temperature: 0.2
    });

    return completion.choices[0].message.content ?? "";
}

function quarantine(entry) {
    fs.mkdirSync(path.dirname(quarantinePath), { recursive: true });
    fs.appendFileSync(quarantinePath, JSON.stringify({
        timeStamp: new Date().toISOString(),
        promptVersion: PROMPT_VERSION,
        ...entry
    }) + "\n");
}

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
            ];

            // First attempt
            const raw1 = await callModel(prompt);
            const first = parseAndValidate(raw1);
            if (first.ok) {
                return res.status(200).json({ input, output: first.data });
            }

            // Second Attempt
            const raw2 = await callModel([
                ...prompt,
                { role: "assistant", content: raw1 },
                {
                    role: "user",
                    content:
                        `Your previous answer was rejected for this reason: ${first.error}\n` +
                        `Return only corrected JSON matching the schema.`
                }
            ]);
            const second = parseAndValidate(raw2);
            if (second.ok) {
                return res.status(200).json({ input, output: second.data });
            }

            quarantine({
                input,
                firstOutput: raw1,
                firstError: first.error,
                secondOutput: raw2,
                secondError: second.error
            });

            return res.status(422).json({
                error: "The model's response could not be validated. Please try again."
            });
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