import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { generateProceduralRobloxGame } from './src/utils/proceduralGenerator.ts';
import { RobloxGame } from './src/types/roblox.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google Gen AI client with User-Agent header as required by skill guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: AI Roblox Game Generator
app.post('/api/generate-roblox-game', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const baseGame = generateProceduralRobloxGame(prompt);

  // If Gemini API Key is available, enhance with custom AI game design & Luau scripts
  if (process.env.GEMINI_API_KEY) {
    try {
      const systemInstruction = `You are an expert Roblox Studio lead developer and Luau engineer.
The user wants to generate a complete, playable Roblox game from a single prompt.
Analyze their prompt: "${prompt}".
Generate high quality JSON containing:
1. "title": Catchy Roblox game title (with 1 emoji prefix)
2. "description": 2-sentence exciting synopsis
3. "objective": Clear player goal
4. "customLuauScript": A complete, production-grade ServerScriptService Luau script with leaderboards, debounce, and mechanics tailored specifically to this prompt.
5. "features": List of 6 unique game features.
Return ONLY valid raw JSON with keys: title, description, objective, customLuauScript, features.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Create a Roblox game based on: ${prompt}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text;
      if (responseText) {
        try {
          const aiData = JSON.parse(responseText);
          if (aiData.title) baseGame.title = aiData.title;
          if (aiData.description) baseGame.description = aiData.description;
          if (aiData.objective) baseGame.gameplay.objective = aiData.objective;
          if (Array.isArray(aiData.features) && aiData.features.length > 0) {
            baseGame.features = aiData.features;
          }
          if (aiData.customLuauScript && typeof aiData.customLuauScript === 'string') {
            baseGame.scripts.unshift({
              id: 'script_custom_ai',
              name: 'CustomGameMechanics',
              path: 'ServerScriptService/CustomGameMechanics',
              target: 'ServerScriptService',
              type: 'Script',
              description: 'AI-synthesized custom Luau mechanics tailored to your prompt',
              code: aiData.customLuauScript,
            });
          }

          return res.json({
            success: true,
            game: baseGame,
            isAiGenerated: true,
          });
        } catch (parseErr) {
          console.warn('Failed to parse Gemini JSON, using rich procedural model:', parseErr);
        }
      }
    } catch (apiError: any) {
      console.warn('Gemini generation warning, falling back to procedural:', apiError?.message || apiError);
    }
  }

  // Graceful fallback to procedural generator
  return res.json({
    success: true,
    game: baseGame,
    isAiGenerated: false,
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Dev vs Prod Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`BloxCraft Studio Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
