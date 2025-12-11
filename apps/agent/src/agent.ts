/**
 * Agent Module
 * 
 * This is the "brain" of our chatbot. It:
 * 1. Receives user messages
 * 2. Decides which tool to call
 * 3. Formats the response in natural language
 * 
 * Later we'll replace the simple keyword matching with AI!
 */

// Import the MCP tools
import { listServices, listProjects, getAboutInfo } from '../../../packages/mcp-tools/src/index';

/**
 * Main agent function that handles incoming messages
 * 
 * @param userId - Unique identifier for the user (for future use: conversation history)
 * @param text - The message text from the user
 * @returns A natural language response string
 */
export async function handleMessage(userId: string, text: string): Promise<string> {
  // Convert to lowercase for easier matching
  const lowerText = text.toLowerCase();
  
  // Log the incoming message (helpful for debugging)
  console.log(`🤖 Agent processing message from user ${userId}: "${text}"`);
  
  // ===========================================
  // DECISION LOGIC: Which tool should we call?
  // ===========================================
  
  // Check if user is asking about services
  if (lowerText.includes('service') || lowerText.includes('what do you do') || lowerText.includes('what can you do')) {
    console.log('  → Calling listServices() tool');
    const data = listServices();
    
    // Format the response nicely
    const servicesList = data.services.map((service, index) => `${index + 1}. ${service}`).join('\n');
    return `✨ We offer the following services:\n\n${servicesList}\n\nWould you like to know more about any specific service?`;
  }
  
  // Check if user is asking about projects/portfolio
  if (lowerText.includes('project') || lowerText.includes('portfolio') || lowerText.includes('work') || lowerText.includes('example')) {
    console.log('  → Calling listProjects() tool');
    const projects = listProjects();
    
    // Format with emojis and structure
    const projectsList = projects.map(project => 
      `📁 **${project.name}**\n   ${project.description}\n   🔗 ${project.url}`
    ).join('\n\n');
    
    return `🎨 Here are some of our recent projects:\n\n${projectsList}\n\nWant to discuss a project idea?`;
  }
  
  // Check if user is asking about the company
  if (lowerText.includes('about') || lowerText.includes('who are you') || lowerText.includes('contact') || lowerText.includes('reach')) {
    console.log('  → Calling getAboutInfo() tool');
    const info = getAboutInfo();
    
    // Format company info nicely
    return `ℹ️ **About ${info.name}**\n\n` +
           `${info.tagline}\n\n` +
           `📅 Founded: ${info.founded}\n` +
           `📍 Location: ${info.location}\n\n` +
           `We specialize in:\n${info.specialties.map(s => `• ${s}`).join('\n')}\n\n` +
           `📞 **Contact Us:**\n` +
           `📧 Email: ${info.contact.email}\n` +
           `📱 Phone: ${info.contact.phone}`;
  }
  
  // Check for greetings
  if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
    console.log('  → Greeting detected');
    return `👋 Hello! I'm the Winspiration Energy & Engineering assistant.\n\n` +
           `I can help you with:\n` +
           `• Our services\n` +
           `• Portfolio/projects\n` +
           `• Company information\n\n` +
           `What would you like to know?`;
  }
  
  // ===========================================
  // FALLBACK: No tool matched
  // ===========================================
  console.log('  → No tool matched, sending fallback');
  return `I'm here to help! You can ask me about:\n\n` +
         `🎨 Services - "What services do you offer?"\n` +
         `📁 Projects - "Show me your portfolio"\n` +
         `ℹ️ About Us - "Tell me about your company"\n\n` +
         `What would you like to know?`;
}

/**
 * Helper function to analyze text and determine intent
 * (For future use when we add AI)
 * 
 * @param text - User message
 * @returns Intent category
 */
function analyzeIntent(text: string): 'services' | 'projects' | 'about' | 'greeting' | 'unknown' {
  const lower = text.toLowerCase();
  
  if (lower.includes('service') || lower.includes('what do you do')) return 'services';
  if (lower.includes('project') || lower.includes('portfolio')) return 'projects';
  if (lower.includes('about') || lower.includes('contact')) return 'about';
  if (lower.includes('hello') || lower.includes('hi')) return 'greeting';
  
  return 'unknown';
}
