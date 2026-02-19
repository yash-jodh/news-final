const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(express.json());

// CORS — more permissive configuration
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  // Allow any Vercel preview URL as fallback
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    // Allow localhost
    if (origin.includes('localhost')) return callback(null, true);
    
    // Allow any *.vercel.app domain
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    
    // Allow specifically configured origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    
    console.log(`CORS blocked origin: ${origin}`);
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ── Health Check ──────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.json({
    status: 'X-Times backend running ✓',
    routes: ['GET /api/news', 'POST /api/summarize'],
    allowedOrigins,
    env: {
      GEMINI_API_KEY:  process.env.GEMINI_API_KEY  ? 'SET ✓' : 'MISSING ✗',
      NEWS_API_KEY:    process.env.NEWS_API_KEY     ? 'SET ✓' : 'MISSING ✗',
      FRONTEND_URL:    process.env.FRONTEND_URL     || 'not set',
    },
  });
});

// ── GET /api/news ─────────────────────────────────────────────────────────────

app.get('/api/news', async (req, res) => {
  try {
    const {
      category = 'general',
      country  = 'us',
      page     = 1,
      pageSize = 12,
    } = req.query;

    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'NEWS_API_KEY not set. Add it in Render → Environment Variables.',
      });
    }

    let url;
    if (category === 'anime') {
      url = `https://newsapi.org/v2/everything?q=anime&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
    } else {
      url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
    }

    const response = await fetch(url);
    const data     = await response.json();

    if (!response.ok || data.status === 'error') {
      return res.status(response.status || 500).json({
        error: data.message || `NewsAPI error (${response.status})`,
      });
    }

    return res.json({
      articles:     data.articles     || [],
      totalResults: data.totalResults || 0,
    });

  } catch (err) {
    console.error('News fetch error:', err.message);
    return res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
});

// ── POST /api/summarize ───────────────────────────────────────────────────────

app.post('/api/summarize', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const text = [title, description].filter(Boolean).join('. ').trim();

    if (text.length < 30) {
      return res.status(400).json({ error: 'Not enough content to summarize' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY not set. Add it in Render → Environment Variables.',
      });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Summarize this news article in exactly 3 bullet points.
Each bullet must be one short, clear sentence covering the key facts.
Start each bullet with "•" on its own line.
Return ONLY the 3 bullets — no intro, no extra explanation.

Article: ${text}`,
          }],
        }],
        generationConfig: {
          temperature:     0.3,
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

    const bullets = raw
      .split('\n')
      .map(line => line.replace(/^[•\-*\d.]\s*/, '').trim())
      .filter(line => line.length > 0);

    return res.json({
      bullets: bullets.length > 0 ? bullets : [raw.trim()],
    });

  } catch (err) {
    console.error('Summarize error:', err.message);
    return res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
});

// ── 404 catch-all ─────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({
    error:           `Route not found: ${req.method} ${req.path}`,
    availableRoutes: ['GET /', 'GET /api/news', 'POST /api/summarize'],
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✓ Backend running on http://localhost:${PORT}`);
  console.log(`✓ NEWS_API_KEY:   ${process.env.NEWS_API_KEY   ? 'SET ✓' : 'MISSING ✗'}`);
  console.log(`✓ GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'SET ✓' : 'MISSING ✗'}`);
  console.log(`✓ FRONTEND_URL:   ${process.env.FRONTEND_URL   || 'not set'}`);
  console.log(`✓ CORS: Allowing all *.vercel.app domains`);
});