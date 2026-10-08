const z = require('zod');

const LLMInputSchema = z.object({
    current_song: z.object({
        title: z.string(),
        artist: z.string()
    }),
    next_song: z.object({
        title: z.string(),
        artist: z.string()
    })
});

const LLMOutputSchema = z.object({
    script: z.string().max(300)
});

module.exports = {LLMInputSchema, LLMOutputSchema}