const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/generate', (req, res) => {
  const { title, description, model, temperature } = req.body || {};

  if (!title || !description || !model) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' });
  }

  const safeTemperature = isNaN(parseFloat(temperature))
    ? 0.7
    : Math.min(Math.max(parseFloat(temperature), 0), 1);

  const prompt = {
    meta: {
      title: String(title).trim(),
      createdAt: new Date().toISOString(),
      model: String(model).trim()
    },
    request: {
      messages: [
        {
          role: 'system',
          content: 'Eres un modelo de IA que sigue estrictamente el formato JSON solicitado.'
        },
        {
          role: 'user',
          content: String(description).trim()
        }
      ],
      temperature: safeTemperature
    }
  };

  return res.json({ prompt });
});

app.listen(PORT, () => {
  console.log(`PromptForge JSON corriendo en puerto ${PORT}`);
});

