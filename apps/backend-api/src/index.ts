import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../agent/.env') });

import { handleMessage } from '../../../apps/agent/src/ai-agent';
import { startTelegramBot } from './telegram-bot';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/webhook', async (req, res) => {
  console.log('📥 Webhook received:', JSON.stringify(req.body, null, 2));
  
  const text = req.body.text || '';
  const userId = req.body.userId || 'anonymous';
  
  const reply = await handleMessage(userId, text);
  
  res.json({ reply });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server listening on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 Webhook: http://localhost:${PORT}/webhook`);
  
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  if (telegramToken && telegramToken !== 'your_telegram_token_here') {
    console.log('\n🤖 Starting Telegram bot...');
    startTelegramBot(telegramToken);
  } else {
    console.log('\n⚠️  Telegram bot disabled (no token configured)');
    console.log('   Add TELEGRAM_BOT_TOKEN to apps/agent/.env to enable');
  }
});
