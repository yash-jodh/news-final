const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────

app.use(express.json());

// Allow requests only from your React app
app.use(cors({
  origin: [
    'http://localhost:3000',          // React dev server
    'https://your-app.vercel.app',    // ← Replace with your Vercel URL when deployed
  ],
  methods: ['POST'],
}));

// ── Health Check ────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.json({ status: 'X-Times backend is running ✓' });
});

// ── POST /api/summarize ─────────────────────────────────────────────────────
// Receives: { title, description }
// Returns:  { bullets: string[] }

app.post('/api/summarize', async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validate input
    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const text = [title, description]
      .filter(Boolean)
      .join('. ')
      .trim();

    if (text.length < 30) {
      return res.status(400).json({ error: 'Not enough content to summarize' });
    }

    const apiKey = process.env.GEMINI_API_KEY; // No REACT_APP_ prefix — server only!

    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured on server' });
    }

    // Call Gemini — key stays on server, never sent to browser
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Summarize this news article in exactly 3 bullet points.
Each bullet must be one short, clear sentence covering the key facts.
Start each bullet with "•" on its own line.
Return ONLY the 3 bullets — no intro, no extra explanation.

Article: ${text}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 200,
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errData = await geminiResponse.json().catch(() => ({}));
      const message = errData?.error?.message || `Gemini error (${geminiResponse.status})`;
      return res.status(geminiResponse.status).json({ error: message });
    }

    const geminiData = await geminiResponse.json();
    const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!raw) {
      return res.status(500).json({ error: 'Gemini returned empty response' });
    }

    // Parse bullet lines
    const bullets = raw
      .split('\n')
      .map(line => line.replace(/^[•\-*\d.]\s*/, '').trim())
      .filter(line => line.length > 0);

    return res.json({
      bullets: bullets.length > 0 ? bullets : [raw.trim()],
    });

  } catch (err) {
    console.error('Summarize error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Start ───────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✓ X-Times backend running on http://localhost:${PORT}`);
});