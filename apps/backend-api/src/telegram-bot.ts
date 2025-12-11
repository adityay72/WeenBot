import TelegramBot from 'node-telegram-bot-api';
import { handleMessage } from '../../../apps/agent/src/ai-agent';
import {
  startContactForm,
  updateContactForm,
  getActiveForm,
  completeContactForm,
  getNextMissingField,
  getNextFieldPrompt,
  cancelContactForm,
  editContactFormField,
  getFormSummary,
  ContactFormData,
} from './contact-form';

async function sendToN8n(formData: ContactFormData): Promise<boolean> {
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
  
  if (!n8nWebhookUrl) {
    console.log('⚠️  N8N_WEBHOOK_URL not configured, skipping n8n submission');
    return false;
  }
  
  try {
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'contact_form',
        data: formData,
        timestamp: new Date().toISOString(),
      }),
    });
    
    if (response.ok) {
      console.log('✅ Contact form sent to n8n successfully');
      return true;
    } else {
      console.error('❌ Failed to send to n8n:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending to n8n:', error);
    return false;
  }
}

/**
 * Initialize and start the Telegram bot
 * 
 * @param token - Telegram bot token from BotFather
 */
export function startTelegramBot(token: string) {
  // Create bot instance with polling (checks for new messages)
  const bot = new TelegramBot(token, { polling: true });

  console.log('🤖 Telegram bot is running! Send /start to your bot to test.');

  // Handle /start command (when user first opens the bot)
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from?.first_name || 'there';
    
    bot.sendMessage(
      chatId,
      `👋 Hello ${userName}! Welcome to Winspiration Energy & Engineering.\n\n` +
      `🏗️ *We Inspire Engineering Excellence*\n\n` +
      `I can help you with:\n` +
      `• Our engineering services (Piping, Stress Analysis, 3D Modeling)\n` +
      `• Project portfolio & case studies\n` +
      `• Industries we serve (Oil & Gas, Power, Petrochemical, etc.)\n` +
      `• Company information & certifications (ISO 9001:2015)\n` +
      `• Frequently asked questions\n\n` +
      `💼 International experience in UK, USA, UAE, Nigeria, Vietnam & more!\n\n` +
      `Just ask me anything about our engineering services!`,
      { parse_mode: 'Markdown' }
    );
  });

  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    
    bot.sendMessage(
      chatId,
      `❓ *How to use Winspiration Bot:*\n\n` +
      `Simply send me a message! For example:\n\n` +
      `🔧 "What services do you offer?"\n` +
      `📂 "Show me your projects"\n` +
      `🏭 "Which industries do you serve?"\n` +
      `📞 "How can I contact you?"\n` +
      `❔ "Are you ISO certified?"\n\n` +
      `I use AI to understand your questions and provide accurate information about Winspiration's engineering services!`,
      { parse_mode: 'Markdown' }
    );
  });

  bot.on('message', async (msg) => {
    if (msg.text?.startsWith('/')) {
      return;
    }

    const chatId = msg.chat.id;
    const userId = msg.from?.id.toString() || 'anonymous';
    const text = msg.text || '';
    const userName = msg.from?.first_name || 'User';

    const cancelKeywords = ['cancel', 'stop', 'exit', 'quit', 'nevermind', 'go back', 'abort'];
    const wantsToCancel = cancelKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );

    if (wantsToCancel) {
      const activeForm = getActiveForm(userId);
      
      if (activeForm) {
        // User has an active form, cancel it
        cancelContactForm(userId);
        await bot.sendMessage(
          chatId,
          '❌ Contact form cancelled.\n\n' +
          'No problem! Feel free to ask me anything else about Winspiration Engineering.\n\n' +
          'You can always reach us directly at:\n' +
          '📧 info@ween.co.in\n' +
          '📞 +91 84079 79009',
          { parse_mode: 'Markdown' }
        );
        console.log(`❌ ${userName} cancelled contact form`);
        return;
      } else {
        await bot.sendMessage(chatId, 'No problem! How else can I help you?');
        return;
      }
    }

    const activeForm = getActiveForm(userId);
    
    if (activeForm) {
      console.log(`📝 Processing contact form input from ${userName}`);
      
      if (text.toLowerCase() === 'review' || text.toLowerCase() === 'show' || text.toLowerCase() === 'check') {
        const summary = getFormSummary(userId);
        if (summary) {
          await bot.sendMessage(chatId, summary, { parse_mode: 'Markdown' });
        }
        
        // Ask for next field again
        const nextField = getNextMissingField(activeForm);
        if (nextField) {
          await bot.sendMessage(chatId, getNextFieldPrompt(nextField));
        }
        return;
      }
      
      const editMatch = text.match(/^edit\s+(\w+)\s+(.+)$/i);
      if (editMatch) {
        const fieldToEdit = editMatch[1].toLowerCase();
        const newValue = editMatch[2];
        
        const validFields = ['name', 'email', 'phone', 'subject', 'message'];
        if (validFields.includes(fieldToEdit)) {
          const updated = editContactFormField(userId, fieldToEdit as any, newValue);
          
          if (updated) {
            await bot.sendMessage(
              chatId,
              `✅ Updated ${fieldToEdit}: ${newValue}\n\n` +
              `Type "review" to see all current data.`
            );
            
            const nextField = getNextMissingField(updated);
            if (nextField) {
              await bot.sendMessage(chatId, getNextFieldPrompt(nextField));
            }
          } else {
            await bot.sendMessage(chatId, '❌ Could not edit field. Please try again.');
          }
        } else {
          await bot.sendMessage(
            chatId,
            `❌ Invalid field name. Valid fields are: name, email, phone, subject, message`
          );
        }
        return;
      }
      
      const nextField = getNextMissingField(activeForm);
      
      if (nextField) {
        const updatedForm = updateContactForm(userId, nextField as any, text);
        
        if (!updatedForm) {
          await bot.sendMessage(chatId, '❌ Sorry, there was an error. Please try again or type "cancel" to stop.');
          return;
        }
        
        // Check if form is complete
        const stillMissing = getNextMissingField(updatedForm);
        
        if (stillMissing) {
          // Ask for next field
          await bot.sendMessage(chatId, getNextFieldPrompt(stillMissing));
        } else {
          // Form complete! Send to n8n
          await bot.sendMessage(chatId, '⏳ Processing your request...');
          
          const completedForm = completeContactForm(userId);
          if (completedForm) {
            const sent = await sendToN8n(completedForm);
            
            if (sent) {
              await bot.sendMessage(
                chatId,
                `✅ *Thank you, ${completedForm.name}!*\n\n` +
                `Your inquiry has been received. Our team will contact you shortly at:\n` +
                `📧 ${completedForm.email}\n` +
                `📱 ${completedForm.phone}\n\n` +
                `We typically respond within 24 hours during business days.`,
                { parse_mode: 'Markdown' }
              );
            } else {
              await bot.sendMessage(
                chatId,
                `✅ *Thank you, ${completedForm.name}!*\n\n` +
                `Your inquiry has been recorded. Our team will contact you at:\n` +
                `📧 ${completedForm.email}\n` +
                `📱 ${completedForm.phone}\n\n` +
                `Alternatively, you can reach us directly at:\n` +
                `📧 info@ween.co.in\n` +
                `📞 +91 84079 79009`,
                { parse_mode: 'Markdown' }
              );
            }
          }
        }
      }
      
      return;
    }

    console.log(`📱 Telegram message from ${userName} (${userId}): "${text}"`);

    try {
      await bot.sendChatAction(chatId, 'typing');

      const reply = await handleMessage(userId, text);

      if (reply.includes('start_contact_form')) {
        startContactForm(userId, userName);
        
        await bot.sendMessage(
          chatId,
          `📋 *Contact Form*\n\n` +
          `I'll help you get in touch with our team! I need a few details from you.\n\n` +
          `👤 Please provide your full name:\n\n` +
          `_(Type "cancel" anytime to stop)_`,
          { parse_mode: 'Markdown' }
        );
        
        console.log(`📝 Started contact form for ${userName}`);
      } else {
        await bot.sendMessage(chatId, reply, {
          parse_mode: 'Markdown',
        });
        
        console.log(`✅ Sent reply to ${userName}`);
      }
    } catch (error) {
      console.error('❌ Error processing Telegram message:', error);
      
      await bot.sendMessage(
        chatId,
        '❌ Sorry, I encountered an error processing your message. Please try again!'
      );
    }
  });

  bot.on('polling_error', (error) => {
    console.error('❌ Telegram polling error:', error);
  });

  return bot;
}
