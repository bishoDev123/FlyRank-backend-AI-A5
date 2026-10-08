const express = require('express');
const router = express.Router();
const z = require('zod');

const { LLMInputSchema, LLMOutputSchema } = require('../llm/schema');

router.post('/generate-script', (req, res, next) => {
    try {
        // A stub mode to not use LLM resources
        if (process.env.LLM_STUB == 1) {
            const input = LLMInputSchema.parse(req.body);
            const output = LLMOutputSchema.parse({ script: "This is a test in stub mode" });
            res.status(200).json({ input, output });
        }
        else {
            const input = LLMInputSchema.parse(req.body);
            // in case not in stub mode
            return res.status(501).json({
                error: "LLM implementation not available"
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