const express = require("express");
const openai = require("openai");
const router = express.Router();

  openai.apiKey = process.env.OPENAI_API_KEY;

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await openai.Completion.create({
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