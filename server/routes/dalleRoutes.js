import express from 'express'
import * as dotenv from 'dotenv';
import OpenAI from 'openai'

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

router.get('/', (req, res) => {
    res.send('Hello from Dall-E!');
});

router.post('/', async (req, res) => {
    try {
        const { prompt } = req.body;

        const aiResponse = await openai.images.generate({
            prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json',
        });

        const image = aiResponse.data[0].b64_json;

        res.status(200).json({ photo: image });
    } catch (error) {
        console.error(error);

        if (error.response) {
            res.status(500).send(error.response.data.error.message);
        } else {
            res.status(500).send('An error occurred while processing your request.');
        }
    }
});

export default router;
