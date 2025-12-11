export interface ContactFormData {
  userId: string;
  userName?: string;
  timestamp: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  status: 'incomplete' | 'complete';
}

const activeFormSubmissions = new Map<string, ContactFormData>();

export function startContactForm(userId: string, userName?: string): ContactFormData {
  const formData: ContactFormData = {
    userId,
    userName,
    timestamp: new Date().toISOString(),
    status: 'incomplete',
  };
  
  activeFormSubmissions.set(userId, formData);
  return formData;
}

/**
 * Contact form with editable fields
 */
export function updateContactForm(
  userId: string,
  field: keyof Omit<ContactFormData, 'userId' | 'timestamp' | 'status'>,
  value: string
): ContactFormData | null {
  const formData = activeFormSubmissions.get(userId);
  if (!formData) {
    return null;
  }
  
  formData[field] = value;
  
  if (formData.name && formData.email && formData.phone && formData.subject && formData.message) {
    formData.status = 'complete';
  }
  
  activeFormSubmissions.set(userId, formData);
  return formData;
}

export function editContactFormField(
  userId: string,
  field: 'name' | 'email' | 'phone' | 'subject' | 'message',
  newValue: string
): ContactFormData | null {
  const formData = activeFormSubmissions.get(userId);
  if (!formData) {
    return null;
  }
  
  formData[field] = newValue;
  formData.status = 'incomplete';
  
  activeFormSubmissions.set(userId, formData);
  return formData;
}

export function getFormSummary(userId: string): string | null {
  const formData = activeFormSubmissions.get(userId);
  if (!formData) {
    return null;
  }
  
  let summary = '📋 *Current Form Data:*\n\n';
  
  if (formData.name) summary += `👤 Name: ${formData.name}\n`;
  if (formData.email) summary += `📧 Email: ${formData.email}\n`;
  if (formData.phone) summary += `📱 Phone: ${formData.phone}\n`;
  if (formData.subject) summary += `📝 Subject: ${formData.subject}\n`;
  if (formData.message) summary += `💬 Message: ${formData.message}\n`;
  
  summary += '\n_To edit a field, type: edit [field] [new value]_\n';
  summary += '_Example: edit name John Smith_';
  
  return summary;
}

export function getActiveForm(userId: string): ContactFormData | null {
  return activeFormSubmissions.get(userId) || null;
}

export function completeContactForm(userId: string): ContactFormData | null {
  const formData = activeFormSubmissions.get(userId);
  if (formData) {
    activeFormSubmissions.delete(userId);
  }
  return formData || null;
}

export function cancelContactForm(userId: string): void {
  activeFormSubmissions.delete(userId);
}

export function getNextMissingField(formData: ContactFormData): string | null {
  if (!formData.name) return 'name';
  if (!formData.email) return 'email';
  if (!formData.phone) return 'phone';
  if (!formData.subject) return 'subject';
  if (!formData.message) return 'message';
  return null;
}

export function getNextFieldPrompt(field: string): string {
  const prompts: Record<string, string> = {
    name: '👤 Please provide your full name:\n\n_(Type "cancel" to stop | "review" to see current data)_',
    email: '📧 Please provide your email address:\n\n_(Type "cancel" to stop | "review" to see current data)_',
    phone: '📱 Please provide your phone number:\n\n_(Type "cancel" to stop | "review" to see current data)_',
    subject: '📝 What is the subject of your inquiry?\n\n_(Type "cancel" to stop | "review" to see current data)_',
    message: '💬 Please describe your inquiry or requirements in detail:\n\n_(Type "cancel" to stop | "review" to see current data)_',
  };
  
  return prompts[field] || 'Please provide the information:\n\n_(Type "cancel" to stop | "review" to see current data)_';
}
