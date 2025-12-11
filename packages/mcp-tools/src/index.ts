import { SERVICES, SERVICES_DETAILED, PROJECTS, COMPANY_INFO, INDUSTRIES } from '../../../packages/shared/src/config';

export function listServices() {
  return {
    services: SERVICES_DETAILED
  };
}

export function listProjects() {
  return PROJECTS;
}

export function getAboutInfo() {
  return COMPANY_INFO;
}

export function getIndustries() {
  return {
    industries: INDUSTRIES,
    message: 'We have extensive experience serving a wide range of industries with international project execution.',
  };
}

export function getFAQs() {
  return {
    faqs: [
      {
        question: 'What industries do you serve?',
        answer: `We serve a wide range of industries including ${INDUSTRIES.join(', ')}. We have extensive experience with projects worldwide.`,
      },
      {
        question: 'Do you handle international projects?',
        answer: 'Yes, we have extensive experience with projects in the UK, USA, UAE, Nigeria, Vietnam, and other regions worldwide.',
      },
      {
        question: 'Are you ISO certified?',
        answer: 'Yes, Winspiration is ISO 9001:2015 certified, ensuring high standards in quality management.',
      },
      {
        question: 'What is your approach to sustainability?',
        answer: 'We are strongly committed to environmental sustainability and "Make in India" initiatives, ensuring cost-effective and ecologically viable engineering solutions.',
      },
    ],
  };
}

export function initiateContactRequest() {
  return {
    action: 'start_contact_form',
    message: 'I\'ll help you get in touch with Winspiration! I\'ll need a few details from you.',
    contactInfo: COMPANY_INFO.contact,
    fields: ['name', 'email', 'phone', 'subject', 'message'],
  };
}
