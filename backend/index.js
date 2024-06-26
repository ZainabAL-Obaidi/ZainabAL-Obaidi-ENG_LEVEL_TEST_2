const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const questions = [
  { prompt: "Ask a spelling question.", type: 'spelling' },
  { prompt: "Ask a grammar question.", type: 'grammar' },
  { prompt: "Ask a text understanding question.", type: 'text' }
];

app.post('/api/get-question', async (req, res) => {
  const { questionIndex } = req.body;
  const question = questions[questionIndex];

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: question.prompt,
      max_tokens: 50,
    });
    res.json({ question: { question: response.data.choices[0].text.trim() } });
  } catch (error) {
    console.error('Error generating question:', error);
    res.status(500).json({ error: 'Error generating question.' });
  }
});

app.post('/api/get-feedback', (req, res) => {
  const { answers } = req.body;
  const feedback = [];

  // Simulate feedback based on the answers
  if (answers[0].toLowerCase() === 'accommodate') {
    feedback.push('Spelling: Correct');
  } else {
    feedback.push('Spelling: Incorrect');
  }

  if (answers[1].toLowerCase() === 'correct sentence') {
    feedback.push('Grammar: Correct');
  } else {
    feedback.push('Grammar: Incorrect');
  }

  if (answers[2].toLowerCase() === 'brown') {
    feedback.push('Text Understanding: Correct');
  } else {
    feedback.push('Text Understanding: Incorrect');
  }

  res.json({ feedback: feedback.join(', ') });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
