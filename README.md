#  Ween AI Bot

**AI-Powered Customer Service Bot for Engineering Companies**

Ween AI Bot is an intelligent conversational platform that combines the power of OpenAI GPT-4 with automated workflow management. Delivers company-specific answers through MCP (Model Context Protocol) tools, providing instant, contextual responses about their services, projects, and the company information with real-time form processing and multi-channel notifications.

![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![AI Powered](https://img.shields.io/badge/AI-GPT--4-green)
![Platform](https://img.shields.io/badge/Platform-Telegram-blue)

## ✨ Features

- 🧠 **Intelligent Conversations**: GPT-4 powered natural language understanding
- 📋 **Smart Forms**: AI-triggered contact forms with edit and review capabilities
- ⚡ **Real-Time Automation**: n8n workflow integration for instant notifications
- 🔧 **Tool Calling**: Dynamic information retrieval based on user intent
- 💬 **Context Aware**: Understands engineering terminology and company-specific data
- 🎯 **Multi-Step Workflows**: Interactive data collection with validation
- 📱 **Telegram Integration**: Seamless messaging platform integration

## 📸 Screenshots

### Main Chat Interface
![Chat Interface](./screenshots/chat-interface.png)
*AI-powered conversations about engineering services*

### Contact Form Flow
![Contact Form](./screenshots/contact-form.png)
*Interactive multi-step form collection*

### Edit & Review Features
![Edit Feature](./screenshots/edit-feature.png)
*Edit any field during form filling*

### Automation Workflow
![n8n Workflow](./screenshots/n8n-workflow.png)
*Automated notifications and data logging*

---

## 🚀 Quick Start

### Prerequisites
```bash
# Required
Node.js 20+
pnpm
OpenAI API key
Telegram Bot token

# Optional
n8n (for automation)
```

### Installation

```bash
# Clone and install
git clone <repository-url>
cd whatsapp_agent
pnpm install

# Configure environment
cp apps/agent/.env.example apps/agent/.env
# Edit .env with your API keys

# Start the bot
cd apps/backend-api
pnpm run dev
```

### Configuration

Create `apps/agent/.env`:
```env
OPENAI_API_KEY=your_openai_api_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
N8N_WEBHOOK_URL=http://localhost:5678/webhook/contact-form
OPENAI_MODEL=gpt-4o-mini
```

---

## 🏗️ Architecture

Ween AI Bot follows a **monorepo architecture** with clear separation of concerns:

```
whatsapp_agent/
├── apps/
│   ├── agent/              # AI agent logic
│   │   └── src/
│   │       └── ai-agent.ts # OpenAI tool calling
│   └── backend-api/        # Express server
│       └── src/
│           ├── index.ts
│           ├── telegram-bot.ts
│           └── contact-form.ts
├── packages/
│   ├── mcp-tools/          # Business logic tools
│   │   └── src/
│   │       └── index.ts    # Tool implementations
│   └── shared/             # Shared configuration
│       └── src/
│           └── config.ts
└── docker-compose.yml      # Multi-container setup
```

### System Flow

```
User Message (Telegram)
    ↓
Express Backend
    ↓
AI Agent (GPT-4)
    ↓
┌───────┴───────┐
↓               ↓
MCP Tools     Contact Form
↓               ↓
Response      n8n Workflow
              ↓
         ┌────┴────┐
         ↓         ↓
    Google Sheets  Email
```

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with webhook handling
- **AI Integration**: OpenAI GPT-4 with function calling
- **Messaging**: Telegram Bot API
- **Real-Time**: Webhook-based event processing

### Automation
- **Workflow Engine**: n8n for visual automation
- **Data Storage**: Google Sheets integration
- **Notifications**: Gmail API for email alerts
- **Extensibility**: Add Slack, CRM, or custom webhooks

### Infrastructure
- **Package Management**: pnpm workspaces for monorepo
- **Containerization**: Docker with multi-service setup
- **Environment Management**: dotenv for configuration
- **Process Management**: PM2 for production deployment

---

## 📊 Core Components

### AI Agent
- **Tool Calling**: Dynamically selects appropriate information sources
- **Context Management**: Maintains conversation history
- **Natural Language**: Understands intent behind user queries
- **Response Formatting**: Converts data to conversational format

### Contact Form System
- **AI Trigger**: Automatically detects contact intent
- **Multi-Step Collection**: Gathers name, email, phone, subject, message
- **Edit Capability**: Users can modify any field: `edit name John Smith`
- **Review Feature**: Check all data before submission: `review`
- **Cancel Option**: Exit anytime with keywords: `cancel`, `stop`, `quit`
- **Validation**: Ensures data quality before processing

### Automation Workflows
- **Google Sheets**: Automatic data logging with timestamps
- **Email Notifications**: Instant alerts to company team
- **User Confirmations**: Auto-send receipt emails to users
- **Custom Actions**: Extensible for CRM, Slack, webhooks

---

## 🎮 Usage Examples

### Information Queries

```
User: What services do you offer?
Bot: We specialize in industrial piping engineering, including:
     • Piping Stress Analysis (Static/Dynamic)
     • 3D Plant Modeling & Design
     • Pipe Support Design with FEA
     • Project Management Services
     
User: Tell me about your projects
Bot: We have extensive international experience:
     • Offshore FPSO Piping (North Sea, UK)
     • Flue-Gas Desulfurization (India)
     • GBARAN Single Well HPHT Skid (Nigeria)
     [... with project details and links]
```

### Contact Form Interaction

```
User: I need a quote
Bot: 📋 Contact Form
     I'll help you get in touch! I need a few details.
     👤 Please provide your full name:
     (Type "cancel" to stop | "review" to see data)

User: John Doe
Bot: 📧 Please provide your email:

User: edit name John Smith
Bot: ✅ Updated name: John Smith
Bot: 📧 Please provide your email:

User: john@company.com
Bot: 📱 Please provide your phone:

User: review
Bot: 📋 Current Form Data:
     👤 Name: John Smith
     📧 Email: john@company.com
     
User: +1234567890
Bot: 📝 What is the subject of your inquiry?
[... continues until complete]

Bot: ✅ Thank you! Your inquiry has been submitted.
     Our team will contact you shortly.
```

---

## 🔧 Development

### Project Structure

| Directory | Purpose |
|-----------|---------|
| `apps/agent/` | AI logic and OpenAI integration |
| `apps/backend-api/` | Express server and bot handlers |
| `packages/mcp-tools/` | Business data and tool functions |
| `packages/shared/` | Configuration and constants |

### Key Files

| File | Description |
|------|-------------|
| `ai-agent.ts` | GPT-4 integration with tool calling |
| `telegram-bot.ts` | Message handlers and routing |
| `contact-form.ts` | Form state and validation |
| `mcp-tools/index.ts` | Information retrieval functions |
| `config.ts` | Centralized application config |

### Adding New Features

#### Create a New Information Tool

```typescript
// 1. Add function in packages/mcp-tools/src/index.ts
export function getNewInfo() {
  return {
    info: "Your information here"
  };
}

// 2. Register in apps/agent/src/ai-agent.ts
const tools = [
  {
    type: 'function',
    function: {
      name: 'getNewInfo',
      description: 'Returns new information when user asks about...',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
];

// 3. Import in tool execution
import { getNewInfo } from '../../../packages/mcp-tools/src/index';
```

#### Customize Company Information

```typescript
// Edit packages/shared/src/config.ts
export const COMPANY_INFO = {
  name: 'Your Company Name',
  contact: {
    email: 'contact@company.com',
    phone: '+1234567890',
  },
  services: [
    'Service 1',
    'Service 2',
  ],
};
```

---

## 📋 Available Commands

### Development
```bash
pnpm install          # Install dependencies
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run clean        # Clean build artifacts
```

### With PM2
```bash
npm install -g pm2
pm2 start "pnpm run dev" --name ween-bot
pm2 status            # Check status
pm2 logs ween-bot     # View logs
pm2 restart ween-bot  # Restart
pm2 stop ween-bot     # Stop
```

### With Docker
```bash
docker-compose up -d      # Start all services
docker-compose logs -f    # View logs
docker-compose down       # Stop services
```

---

## 🌐 Service URLs

When running locally:
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **n8n Automation**: http://localhost:5678

---

## 📊 Feature Status

| Feature | Status | Description |
|---------|--------|-------------|
| AI Chat | ✅ | GPT-4 powered conversations |
| Contact Form | ✅ | Multi-step data collection |
| Edit Fields | ✅ | Modify any form field |
| Review Data | ✅ | Preview before submission |
| Cancel Form | ✅ | Exit with keywords |
| n8n Integration | ✅ | Workflow automation |
| Google Sheets | ✅ | Data logging |
| Email Alerts | ✅ | Team notifications |
| User Confirmations | ✅ | Receipt emails |
| Multi-language | ⏳ | Planned |
| Voice Messages | ⏳ | Future |
| WhatsApp | ⏳ | Under development |

---

## 🤝 Contributing

Contributions welcome! Follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Open a Pull Request

---

<div align="center">

**Built with Node.js, TypeScript, OpenAI GPT-4, and n8n**

⭐ Star this repository if you find it useful!

</div>

