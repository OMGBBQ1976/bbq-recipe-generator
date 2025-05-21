const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/generate', async (req, res) => {
  const { meat, style, smoker, wood, time, useMetric, useCelsius } = req.body;

  try {
    const tempUnit = useCelsius ? 'Celsius' : 'Fahrenheit';
    const measureUnit = useMetric ? 'metric' : 'imperial';
    const woodText = wood ? ` using ${wood} wood` : '';

    const prompt = `
Generate a low and slow BBQ recipe for ${meat} using ${style} BBQ style on a ${smoker}${woodText}, 
that takes about ${time} hours. Include:
- A dry rub recipe
- Step-by-step cooking instructions
- Tips and techniques
Please write the recipe using ${tempUnit} for temperature and ${measureUnit} measurements.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    const recipe = response.choices[0].message.content;
    res.json({ recipe });

  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).json({ error: 'Error generating recipe' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`);
});
