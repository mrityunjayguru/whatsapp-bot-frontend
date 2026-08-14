export type FAQDataProps = {
  id: string;
  faqId: string;
  question: string;
  category: string;
  keywords: string[];
  answerPreview: string;
  fullAnswer: string;
  attachment: string | null;
  url: string;
  matchType: "Exact Match" | "Partial Match" | "AI Semantic" | "Keyword Match";
  priority: "High" | "Medium" | "Low";
  status: "Active" | "Inactive";
  createdBy: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
};

export const initialFaqData: FAQDataProps[] = [
  {
    id: "1",
    faqId: "FAQ-101",
    question: "How do I get started with Dashcode?",
    category: "General",
    keywords: ["Onboarding", "Setup", "Quickstart"],
    answerPreview: "Follow our step-by-step onboarding wizard to set up your profile...",
    fullAnswer: "Getting started is quick and simple! Sign up for an account, follow our onboarding wizard to set up your profile, and connect your essential tools and data sources. Our interactive guide will walk you through the primary workspace layout.",
    attachment: "quickstart_guide.pdf",
    url: "",
    matchType: "Exact Match",
    priority: "High",
    status: "Active",
    createdBy: {
      name: "Jenny Wilson",
      avatar: "/images/avatar/avatar-1.png"
    },
    createdAt: "2024-01-10",
    updatedAt: "2024-02-12"
  },
  {
    id: "2",
    faqId: "FAQ-102",
    question: "How do I reset or update my password?",
    category: "Support",
    keywords: ["Password", "Security", "2FA"],
    answerPreview: "Navigate to Account Settings > Security and click 'Change Password'...",
    fullAnswer: "Navigate to Account Settings > Security and click 'Change Password'. If you cannot log in, click 'Forgot Password' on the login screen, and we will send a password reset link to your registered email address.",
    attachment: null,
    url: "",
    matchType: "AI Semantic",
    priority: "High",
    status: "Active",
    createdBy: {
      name: "Emily Davis",
      avatar: "/images/avatar/avatar-2.png"
    },
    createdAt: "2024-01-12",
    updatedAt: "2024-02-10"
  },
  {
    id: "3",
    faqId: "FAQ-103",
    question: "What payment methods are supported for subscriptions?",
    category: "Pricing",
    keywords: ["Payments", "Visa", "PayPal", "Invoices"],
    answerPreview: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal...",
    fullAnswer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and wire transfers for enterprise annual subscriptions.",
    attachment: "billing_faq_v2.pdf",
    url: "",
    matchType: "Keyword Match",
    priority: "Medium",
    status: "Active",
    createdBy: {
      name: "Laura Smith",
      avatar: "/images/avatar/avatar-3.png"
    },
    createdAt: "2024-01-15",
    updatedAt: "2024-02-08"
  },
  {
    id: "4",
    faqId: "FAQ-104",
    question: "Where can I find API documentation and generate access keys?",
    category: "Services",
    keywords: ["API", "Tokens", "REST", "SDK"],
    answerPreview: "API docs are available at /docs. Generate keys under Settings > API...",
    fullAnswer: "API documentation is available at /docs. You can generate, manage, and revoke API access tokens in Settings > Developer & API Keys.",
    attachment: "openapi_v3.json",
    url: "",
    matchType: "Exact Match",
    priority: "High",
    status: "Active",
    createdBy: {
      name: "Sarah Johnson",
      avatar: "/images/avatar/avatar-4.png"
    },
    createdAt: "2024-01-18",
    updatedAt: "2024-02-14"
  },
  {
    id: "5",
    faqId: "FAQ-105",
    question: "How do webhooks work for real-time notifications?",
    category: "Services",
    keywords: ["Webhooks", "Events", "Payloads"],
    answerPreview: "Register endpoints under Settings > Integrations > Webhooks...",
    fullAnswer: "You can register webhook endpoints under Settings > Integrations > Webhooks to receive automated HTTP POST payloads for events like new messages, status updates, and user actions.",
    attachment: null,
    url: "",
    matchType: "Partial Match",
    priority: "Medium",
    status: "Active",
    createdBy: {
      name: "Rachel Brown",
      avatar: "/images/avatar/avatar-5.png"
    },
    createdAt: "2024-01-20",
    updatedAt: "2024-02-05"
  },
  {
    id: "6",
    faqId: "FAQ-106",
    question: "Can I customize workspace theme and primary colors?",
    category: "General",
    keywords: ["Theme", "Customizer", "Dark Mode"],
    answerPreview: "Toggle Light, Dark, or System mode in the header or customizer panel...",
    fullAnswer: "Yes! You can toggle between Light, Dark, and System theme modes using the theme switcher in the header. You can also customize navigation style, accent colors, and sidebar preferences via the Settings or Customizer panel.",
    attachment: null,
    url: "",
    matchType: "AI Semantic",
    priority: "Low",
    status: "Inactive",
    createdBy: {
      name: "Megan Taylor",
      avatar: "/images/avatar/avatar-6.png"
    },
    createdAt: "2024-01-22",
    updatedAt: "2024-01-30"
  },
  {
    id: "7",
    faqId: "FAQ-107",
    question: "How do I invite team members and set role permissions?",
    category: "Support",
    keywords: ["Team", "Roles", "Permissions", "RBAC"],
    answerPreview: "Navigate to Settings > Team, click 'Invite Member', and select a role...",
    fullAnswer: "Navigate to Settings > Team Members, click 'Invite Member', enter their email address, and select a permission role (Owner, Admin, Member, or Viewer).",
    attachment: "rbac_matrix.pdf",
    url: "",
    matchType: "Exact Match",
    priority: "High",
    status: "Active",
    createdBy: {
      name: "Sophie Clark",
      avatar: "/images/avatar/avatar-7.png"
    },
    createdAt: "2024-01-25",
    updatedAt: "2024-02-11"
  },
  {
    id: "8",
    faqId: "FAQ-108",
    question: "What are the rate limits for free vs enterprise plans?",
    category: "Pricing",
    keywords: ["Rate Limits", "Plans", "Enterprise"],
    answerPreview: "Standard API keys are limited to 1,000 requests per minute...",
    fullAnswer: "Standard API keys are limited to 1,000 requests per minute. Enterprise accounts have customizable rate limits and dedicated webhooks.",
    attachment: null,
    url: "",
    matchType: "Partial Match",
    priority: "Medium",
    status: "Active",
    createdBy: {
      name: "Natalie Martin",
      avatar: "/images/avatar/avatar-8.png"
    },
    createdAt: "2024-01-28",
    updatedAt: "2024-02-02"
  },
  {
    id: "9",
    faqId: "FAQ-109",
    question: "How do I download monthly invoices in PDF format?",
    category: "Payment",
    keywords: ["Invoices", "PDF", "Receipts"],
    answerPreview: "Invoices and transaction history are accessible anytime under Settings > Billing...",
    fullAnswer: "Invoices and transaction history are accessible anytime under Settings > Billing > Invoices. You can view or download PDF copies of every invoice with tax details.",
    attachment: "sample_invoice.pdf",
    url: "",
    matchType: "Exact Match",
    priority: "Low",
    status: "Active",
    createdBy: {
      name: "Hannah Lewis",
      avatar: "/images/avatar/avatar-9.png"
    },
    createdAt: "2024-02-01",
    updatedAt: "2024-02-12"
  },
  {
    id: "10",
    faqId: "FAQ-110",
    question: "What security compliance standards does Dashcode adhere to?",
    category: "Support",
    keywords: ["Security", "SOC2", "GDPR", "ISO27001"],
    answerPreview: "We host infrastructure in AWS data centers compliant with SOC 2 Type II...",
    fullAnswer: "All data is encrypted both in transit (TLS 1.3) and at rest (AES-256). We host our infrastructure in enterprise-grade AWS data centers compliant with SOC 2 Type II, ISO 27001, and GDPR regulations.",
    attachment: "soc2_cert.pdf",
    url: "",
    matchType: "AI Semantic",
    priority: "High",
    status: "Active",
    createdBy: {
      name: "Lisa White",
      avatar: "/images/avatar/avatar-10.png"
    },
    createdAt: "2024-02-05",
    updatedAt: "2024-02-15"
  }
];

export function getFaqById(id: string): FAQDataProps | undefined {
  return initialFaqData.find(
    (item) => item.id === id || item.faqId.toLowerCase() === id.toLowerCase() || item.faqId === `FAQ-${id}`
  );
}
