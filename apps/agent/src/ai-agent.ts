import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

import { listServices, listProjects, getAboutInfo, getIndustries, getFAQs, initiateContactRequest } from '../../../packages/mcp-tools/src/index';

dotenv.config({ path: path.join(__dirname, '../.env') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'listServices',
      description: 'Returns a list of engineering services offered by Winspiration Energy & Engineering. Use this when user asks about services, offerings, what we do, or capabilities.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'listProjects',
      description: 'Returns portfolio of recent design projects with descriptions and URLs. Use when user asks about projects, portfolio, work examples, or case studies.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getAboutInfo',
      description: 'Returns information about the company including location, founding year, contact details. Use when user asks about the company, contact info, who we are, or how to reach us.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'initiateContactRequest',
      description: 'Initiates a contact form when user wants to get in touch, submit inquiry, request quote, or contact the company. Use when user says "contact", "get in touch", "reach out", "inquiry", "quote", etc.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
];

export async function handleMessage(userId: string, text: string): Promise<string> {
  console.log(`🤖 AI Agent processing message from ${userId}:"${text}"`);

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a knowledgeable assistant for Winspiration Energy & Engineering Pvt. Ltd., an ISO 9001:2015 certified engineering company specializing in industrial piping engineering.

When users ask questions:
- Use the provided tools to fetch accurate information
- Format responses in a conversational, friendly way
- Keep responses concise but informative
- Don't just list data - explain it naturally
- Use appropriate engineering terminology
- Be professional yet approachable

Company Context:
- Name: Winspiration Energy & Engineering Pvt. Ltd.
- Founded: 2015
- Location: Thane (Mumbai), India
- Focus: Piping Stress Analysis, Plant Design, Project Management
- Values: Engineering excellence, sustainability, Make in India

Answer questions naturally as if you're a company representative talking to a potential client.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      tools: tools,
      tool_choice: 'auto', // Let GPT decide whether to use a tool
    });

    const message = response.choices[0]?.message;

    // STEP 2: Check if OpenAI wants to call a tool
    if (message?.tool_calls && message.tool_calls.length > 0) {
      const toolCall = message.tool_calls[0];
      
      // Type guard to ensure it's a function tool call
      if (toolCall.type !== 'function') {
        return 'I encountered an unexpected tool call type.';
      }
      
      console.log(`  → GPT decided to call tool: ${toolCall.function.name}`);

      // Execute the tool that GPT requested
      const toolName = toolCall.function.name;
      const toolResult = await executeToolFunction(toolName);

      if (toolName === 'initiateContactRequest') {
        console.log('  → AI wants to start contact form!');
        return 'start_contact_form';
      }

      const finalResponse = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a knowledgeable representative of Winspiration Energy & Engineering Pvt. Ltd.

The tool has provided you with data. Now format it into a natural, conversational response:

Guidelines:
- Don't just dump all the data - select what's relevant to the question
- Write naturally, as if you're talking to a client
- Keep it concise - don't overwhelm with information
- Use proper formatting (paragraphs, bullets when needed)
- Be professional but friendly
- Only mention details that answer the user's specific question

Example:
- User asks "tell me about your company" → Give brief overview, highlight key strengths
- User asks "what services" → Focus on services, maybe mention 2-3 key ones briefly
- User asks "any projects in oil & gas" → Mention relevant projects only

Make your response sound natural and helpful, not like a data dump.`,
          },
          {
            role: 'user',
            content: text,
          },
          message,
          {
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResult),
          },
        ],
      });

      const finalMessage = finalResponse.choices[0]?.message?.content;
      return finalMessage || 'I apologize, I encountered an issue processing your request.';
    }

    console.log('  → GPT responded without calling tools');
    return message?.content || 'I apologize, I encountered an issue processing your request.';

  } catch (error) {
    console.error('❌ Error in AI agent:', error);
    return 'I apologize, I encountered an error. Please try again.';
  }
}

async function executeToolFunction(toolName: string): Promise<any> {
  switch (toolName) {
    case 'listServices':
      return listServices();
    case 'listProjects':
      return listProjects();
    case 'getAboutInfo':
      return getAboutInfo();
    case 'getIndustries':
      return getIndustries();
    case 'getFAQs':
      return getFAQs();
    case 'initiateContactRequest':
      return initiateContactRequest();
    default:
      return { error: 'Unknown tool' };
  }
}
