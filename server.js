const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai'); // Make sure this matches your installed SDK version

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Your OpenAI API key from .env
});

app.post('/api/generate', async (req, res) => {
  const { meat, style, smoker, wood, useMetric, useCelsius, includeSauce, includeSpicy } = req.body;

  try {
    const tempUnit = useCelsius ? 'Celsius' : 'Fahrenheit';
    const measureUnit = useMetric ? 'metric' : 'imperial';
    const woodText = wood ? ` using ${wood} wood` : '';
    const sauceText = includeSauce ? ' Include a sauce recipe.' : '';
    const spicyText = includeSpicy ? ' Make it spicy.' : '';

    const prompt = `
Generate a low and slow BBQ recipe for ${meat} using ${style} BBQ style on a ${smoker}${woodText}.
Include:
- A dry rub recipe
- Step-by-step cooking instructions
- Tips and techniques
Use ${tempUnit} for temperature and ${measureUnit} measurements.
${sauceText}${spicyText}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    const recipe = completion.choices[0].message.content;
    res.json({ recipe });

  } catch (error) {
    console.error('❌ Error generating recipe:', error.message);
    res.status(500).json({ error: 'Failed to generate recipe. Please try again.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`);
});
