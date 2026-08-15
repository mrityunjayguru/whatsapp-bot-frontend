export interface ChatbotDataProps {
  id: string;
  chatbotId: string;
  name: string;
  description: string;
  whatsappNumber: string;
  status: "Active" | "Inactive";
  currentMode: "Chatbot" | "Human" | "Hybrid";
  humanHandoverEnabled: boolean;
  manualHandoverEnabled?: boolean;
  automaticHandoverEnabled?: boolean;
  handoverMessage?: string;
  respondToNewConversations?: boolean;
  respondToFaqMatches?: boolean;
  sendAttachmentWhenConfigured?: boolean;
  sendUrlWhenConfigured?: boolean;
  stopWhenEmployeeTakesControl?: boolean;
  enabled: boolean;
  createdAt: string;
  lastActive: string;
  systemPrompt: string;
  welcomeMessageEnabled?: boolean;
  welcomeMessageText?: string;
}

export const initialChatbots: ChatbotDataProps[] = [
  {
    id: "1",
    chatbotId: "BOT-101",
    name: "Customer Support Assistant",
    description: "Handles general customer inquiries & FAQ resolution 24/7",
    whatsappNumber: "+1 (555) 234-5678",
    status: "Active",
    currentMode: "Chatbot",
    humanHandoverEnabled: true,
    enabled: true,
    createdAt: "Aug 3, 2026 09:12 AM",
    lastActive: "2 minutes ago",
    systemPrompt: "You are a polite customer support assistant. Help users with account questions, billing, and general support inquiries using simple and concise language."
  },
  {
    id: "2",
    chatbotId: "BOT-102",
    name: "Sales & Lead Generator",
    description: "Qualifies new leads and schedules product demonstrations",
    whatsappNumber: "+1 (555) 876-5432",
    status: "Active",
    currentMode: "Hybrid",
    humanHandoverEnabled: true,
    enabled: true,
    createdAt: "Aug 3, 2026 11:45 AM",
    lastActive: "12 minutes ago",
    systemPrompt: "Greet potential clients, collect lead information (name, email, requirements), and schedule a call with our sales team when appropriate."
  },
  {
    id: "3",
    chatbotId: "BOT-103",
    name: "Order Tracking & Delivery Bot",
    description: "Automates order status lookup and delivery updates for customers",
    whatsappNumber: "+44 20 7946 0958",
    status: "Active",
    currentMode: "Chatbot",
    humanHandoverEnabled: false,
    enabled: true,
    createdAt: "Aug 4, 2026 08:30 AM",
    lastActive: "28 minutes ago",
    systemPrompt: "Assist customers in tracking their order status using their Order ID or registered WhatsApp number."
  },
  {
    id: "4",
    chatbotId: "BOT-104",
    name: "VIP Account Manager",
    description: "Dedicated assistance for premium tier clients with instant handover",
    whatsappNumber: "+61 2 9876 5432",
    status: "Inactive",
    currentMode: "Human",
    humanHandoverEnabled: true,
    enabled: false,
    createdAt: "Aug 4, 2026 02:15 PM",
    lastActive: "1 day ago",
    systemPrompt: "Provide high-priority assistance to VIP account holders. Transfer complex issues directly to assigned human agents."
  },
  {
    id: "5",
    chatbotId: "BOT-105",
    name: "Technical Helpdesk Bot",
    description: "Troubleshoots technical issues and guides users through fix steps",
    whatsappNumber: "+33 1 23 45 67 89",
    status: "Active",
    currentMode: "Hybrid",
    humanHandoverEnabled: true,
    enabled: true,
    createdAt: "Aug 5, 2026 10:20 AM",
    lastActive: "5 minutes ago",
    systemPrompt: "Perform initial technical troubleshooting for mobile and web app issues. Escalate to tier-2 support if unsolved in 3 steps."
  },
  {
    id: "6",
    chatbotId: "BOT-106",
    name: "Feedback & Survey Collector",
    description: "Gathers post-purchase customer ratings and NPS feedback",
    whatsappNumber: "+81 3-1234-5678",
    status: "Inactive",
    currentMode: "Chatbot",
    humanHandoverEnabled: false,
    enabled: false,
    createdAt: "Aug 6, 2026 04:00 PM",
    lastActive: "3 days ago",
    systemPrompt: "Ask customers 3 short survey questions regarding their recent interaction and store feedback ratings."
  }
];

export const getChatbotById = (id: string): ChatbotDataProps | undefined => {
  return initialChatbots.find(
    (b) => b.id.toString() === id.toString() || b.chatbotId.toLowerCase() === id.toLowerCase()
  );
};
