const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.post('/', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await openai.createChatCompletion({
      model: 'text-davinci-003',
      prompt: message,
      max_tokens: 150,
    });
    res.json({ reply: response.data.choices[0].text });
  } catch (error) {
    res.status(500).send({ error: 'Error communicating with ShatGPT' });
  }
});

module.exports = router;