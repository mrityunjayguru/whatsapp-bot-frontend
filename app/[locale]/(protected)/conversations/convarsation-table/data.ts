<<<<<<< HEAD
import { DataProps } from "./columns";

const avatars = [
  "/images/avatar/avatar-1.png",
  "/images/avatar/avatar-2.png",
  "/images/avatar/avatar-3.png",
  "/images/avatar/avatar-4.png",
  "/images/avatar/avatar-5.png",
  "/images/avatar/avatar-6.png",
  "/images/avatar/avatar-7.png",
  "/images/avatar/avatar-8.png",
  "/images/avatar/avatar-9.png",
  "/images/avatar/avatar-10.png",
  "/images/avatar/avatar-11.png",
  "/images/avatar/avatar-12.png",
];

const customerNames = [
  "Jenny Wilson",
  "Emily Davis",
  "Laura Smith",
  "Sarah Johnson",
  "Rachel Brown",
  "Megan Taylor",
  "Sophie Clark",
  "Natalie Martin",
  "Hannah Lewis",
  "Lisa White",
  "Emma Walker",
  "Olivia Anderson",
  "Ava Martinez",
  "Isabella Lee",
  "Mia Thompson",
  "Charlotte Garcia",
  "Amelia Rodriguez",
  "Harper Wilson",
  "Evelyn Moore",
  "Abigail Taylor",
];

const agentNames = [
  "Michael Chen",
  "Sarah Kim",
  "David Patel",
  "Jessica Brown",
  "Ryan Thompson",
  "Emily Rodriguez",
  "Christopher Lee",
  "Amanda Wilson",
];

const allTags = [
  ["VIP", "Priority"],
  ["Support"],
  ["Sales", "New"],
  ["Returning", "Support"],
  ["VIP"],
  ["Priority", "Sales"],
  ["New"],
  ["VIP", "Support", "Priority"],
  ["Returning"],
  ["Sales", "VIP"],
];

const lastMessages = [
  "Thank you for your help! The issue is now resolved on my end.",
  "Can you please check the status of my order? It's been over a week.",
  "I'm interested in upgrading my current plan. What options are available?",
  "The product arrived but seems to be damaged during shipping. What can I do?",
  "Just wanted to follow up on my previous ticket about the billing error.",
  "Could you send me the invoice for my last purchase? I need it for accounting.",
  "Your service team was amazing! They helped me set everything up quickly.",
  "I'm having trouble logging into my account. It keeps saying invalid password.",
  "Do you offer any discounts for long-term customers? I've been with you for 3 years.",
  "The new update looks great! However, I noticed a small bug in the dashboard.",
  "Can I speak with a supervisor regarding my complaint? I'm not satisfied with the resolution.",
  "Please cancel my subscription as I no longer need your services.",
  "I want to add another user to my account. How do I go about doing that?",
  "My payment failed but the money was deducted from my account. Please assist.",
  "Thank you for the quick turnaround on my custom request. Looks perfect!",
];

const mobileNumbers = [
  "+1 (555) 123-4567",
  "+44 20 7946 0958",
  "+61 2 9876 5432",
  "+33 1 23 45 67 89",
  "+81 3-1234-5678",
  "+49 30 12345678",
  "+91 98765 43210",
  "+1 (415) 555-0132",
  "+86 138 1234 5678",
  "+39 06 1234 5678",
  "+34 912 345 678",
  "+55 11 91234-5678",
  "+7 495 123-45-67",
  "+82 2-1234-5678",
  "+52 55 1234 5678",
];

const lastActivities = [
  "2 minutes ago",
  "5 minutes ago",
  "12 minutes ago",
  "28 minutes ago",
  "1 hour ago",
  "2 hours ago",
  "3 hours ago",
  "5 hours ago",
  "Yesterday, 11:45 AM",
  "Yesterday, 3:30 PM",
  "Yesterday, 6:15 PM",
  "2 days ago",
  "3 days ago",
  "5 days ago",
  "1 week ago",
];

const statuses: DataProps["status"][] = ["open", "in-progress", "closed", "pending"];
const unreadCounts = [3, 0, 1, 5, 0, 0, 2, 8, 0, 4, 1, 0, 0, 6, 2, 0, 1, 0, 3, 0];

const conversationTitles = [
  "Order Status Inquiry — #ORD-28471",
  "Billing Error on Monthly Statement",
  "Request to Upgrade Subscription Plan",
  "Damaged Product Upon Delivery",
  "Follow-up on Previous Ticket #4821",
  "Missing Invoice for Recent Purchase",
  "Service Setup Assistance Request",
  "Account Login Authentication Issue",
  "Long-term Customer Discount Request",
  "Bug Report: Dashboard Display Glitch",
  "Escalation: Complaint Resolution",
  "Subscription Cancellation Request",
  "Add Team Member to Account",
  "Payment Failed but Deducted Inquiry",
  "Custom Request Order Confirmation",
  "Product Return & Refund Request",
  "Delivery Address Update Needed",
  "Password Reset Not Receiving Email",
  "Feature Request: Export Functionality",
  "Welcome Onboarding Support Call",
];

const departments = [
  "Customer Support",
  "Sales",
  "Billing",
  "Technical Support",
  "Operations",
  "Returns & Refunds",
  "Account Management",
  "Onboarding",
];

const createdDates = [
  "Aug 3, 2026 09:12 AM",
  "Aug 3, 2026 10:45 AM",
  "Aug 3, 2026 02:30 PM",
  "Aug 4, 2026 08:05 AM",
  "Aug 4, 2026 11:20 AM",
  "Aug 4, 2026 03:55 PM",
  "Aug 5, 2026 07:40 AM",
  "Aug 5, 2026 09:15 AM",
  "Aug 5, 2026 10:30 AM",
  "Aug 2, 2026 01:10 PM",
  "Aug 2, 2026 04:25 PM",
  "Aug 1, 2026 09:50 AM",
  "Aug 1, 2026 11:35 AM",
  "Jul 31, 2026 03:15 PM",
  "Jul 30, 2026 08:45 AM",
  "Jul 30, 2026 12:20 PM",
  "Jul 29, 2026 05:10 PM",
  "Jul 28, 2026 10:05 AM",
  "Jul 28, 2026 02:40 PM",
  "Jul 27, 2026 04:15 PM",
];

export const data: DataProps[] = customerNames.map((name, idx) => {
  const status = statuses[idx % statuses.length];
  const unread = status === "closed" ? 0 : unreadCounts[idx];
  const isChatbot = idx % 5 === 0;
  return {
    id: idx + 1,
    conversationNo: `CONV-${String(10000 + idx).padStart(5, "0")}`,
    title: conversationTitles[idx % conversationTitles.length],
    customerName: name,
    customerImage: avatars[idx % avatars.length],
    mobile: mobileNumbers[idx % mobileNumbers.length],
    tags: allTags[idx % allTags.length],
    assignedTo: {
      name: agentNames[idx % agentNames.length],
      image: avatars[(idx + 3) % avatars.length],
    },
    department: departments[idx % departments.length],
    status,
    createdDate: createdDates[idx % createdDates.length],
    lastMessage: lastMessages[idx % lastMessages.length],
    lastActivity: lastActivities[idx % lastActivities.length],
    unread,
    isChatbot,
    action: null,
  };
});

export function getConversationById(id: string | number): DataProps | undefined {
  const numericId = typeof id === "string" ? Number(id) : id;
  return data.find((item) => Number(item.id) === numericId);
}
=======
import { DataProps } from "./columns";

const avatars = [
  "/images/avatar/avatar-1.png",
  "/images/avatar/avatar-2.png",
  "/images/avatar/avatar-3.png",
  "/images/avatar/avatar-4.png",
  "/images/avatar/avatar-5.png",
  "/images/avatar/avatar-6.png",
  "/images/avatar/avatar-7.png",
  "/images/avatar/avatar-8.png",
  "/images/avatar/avatar-9.png",
  "/images/avatar/avatar-10.png",
  "/images/avatar/avatar-11.png",
  "/images/avatar/avatar-12.png",
];

const customerNames = [
  "Jenny Wilson",
  "Emily Davis",
  "Laura Smith",
  "Sarah Johnson",
  "Rachel Brown",
  "Megan Taylor",
  "Sophie Clark",
  "Natalie Martin",
  "Hannah Lewis",
  "Lisa White",
  "Emma Walker",
  "Olivia Anderson",
  "Ava Martinez",
  "Isabella Lee",
  "Mia Thompson",
  "Charlotte Garcia",
  "Amelia Rodriguez",
  "Harper Wilson",
  "Evelyn Moore",
  "Abigail Taylor",
];

const agentNames = [
  "Michael Chen",
  "Sarah Kim",
  "David Patel",
  "Jessica Brown",
  "Ryan Thompson",
  "Emily Rodriguez",
  "Christopher Lee",
  "Amanda Wilson",
];

const allTags = [
  ["VIP", "Priority"],
  ["Support"],
  ["Sales", "New"],
  ["Returning", "Support"],
  ["VIP"],
  ["Priority", "Sales"],
  ["New"],
  ["VIP", "Support", "Priority"],
  ["Returning"],
  ["Sales", "VIP"],
];

const lastMessages = [
  "Thank you for your help! The issue is now resolved on my end.",
  "Can you please check the status of my order? It's been over a week.",
  "I'm interested in upgrading my current plan. What options are available?",
  "The product arrived but seems to be damaged during shipping. What can I do?",
  "Just wanted to follow up on my previous ticket about the billing error.",
  "Could you send me the invoice for my last purchase? I need it for accounting.",
  "Your service team was amazing! They helped me set everything up quickly.",
  "I'm having trouble logging into my account. It keeps saying invalid password.",
  "Do you offer any discounts for long-term customers? I've been with you for 3 years.",
  "The new update looks great! However, I noticed a small bug in the dashboard.",
  "Can I speak with a supervisor regarding my complaint? I'm not satisfied with the resolution.",
  "Please cancel my subscription as I no longer need your services.",
  "I want to add another user to my account. How do I go about doing that?",
  "My payment failed but the money was deducted from my account. Please assist.",
  "Thank you for the quick turnaround on my custom request. Looks perfect!",
];

const mobileNumbers = [
  "+1 (555) 123-4567",
  "+44 20 7946 0958",
  "+61 2 9876 5432",
  "+33 1 23 45 67 89",
  "+81 3-1234-5678",
  "+49 30 12345678",
  "+91 98765 43210",
  "+1 (415) 555-0132",
  "+86 138 1234 5678",
  "+39 06 1234 5678",
  "+34 912 345 678",
  "+55 11 91234-5678",
  "+7 495 123-45-67",
  "+82 2-1234-5678",
  "+52 55 1234 5678",
];

const lastActivities = [
  "2 minutes ago",
  "5 minutes ago",
  "12 minutes ago",
  "28 minutes ago",
  "1 hour ago",
  "2 hours ago",
  "3 hours ago",
  "5 hours ago",
  "Yesterday, 11:45 AM",
  "Yesterday, 3:30 PM",
  "Yesterday, 6:15 PM",
  "2 days ago",
  "3 days ago",
  "5 days ago",
  "1 week ago",
];

const statuses: DataProps["status"][] = ["open", "in-progress", "closed", "pending"];
const unreadCounts = [3, 0, 1, 5, 0, 0, 2, 8, 0, 4, 1, 0, 0, 6, 2, 0, 1, 0, 3, 0];

const conversationTitles = [
  "Order Status Inquiry — #ORD-28471",
  "Billing Error on Monthly Statement",
  "Request to Upgrade Subscription Plan",
  "Damaged Product Upon Delivery",
  "Follow-up on Previous Ticket #4821",
  "Missing Invoice for Recent Purchase",
  "Service Setup Assistance Request",
  "Account Login Authentication Issue",
  "Long-term Customer Discount Request",
  "Bug Report: Dashboard Display Glitch",
  "Escalation: Complaint Resolution",
  "Subscription Cancellation Request",
  "Add Team Member to Account",
  "Payment Failed but Deducted Inquiry",
  "Custom Request Order Confirmation",
  "Product Return & Refund Request",
  "Delivery Address Update Needed",
  "Password Reset Not Receiving Email",
  "Feature Request: Export Functionality",
  "Welcome Onboarding Support Call",
];

const departments = [
  "Customer Support",
  "Sales",
  "Billing",
  "Technical Support",
  "Operations",
  "Returns & Refunds",
  "Account Management",
  "Onboarding",
];

const createdDates = [
  "Aug 3, 2026 09:12 AM",
  "Aug 3, 2026 10:45 AM",
  "Aug 3, 2026 02:30 PM",
  "Aug 4, 2026 08:05 AM",
  "Aug 4, 2026 11:20 AM",
  "Aug 4, 2026 03:55 PM",
  "Aug 5, 2026 07:40 AM",
  "Aug 5, 2026 09:15 AM",
  "Aug 5, 2026 10:30 AM",
  "Aug 2, 2026 01:10 PM",
  "Aug 2, 2026 04:25 PM",
  "Aug 1, 2026 09:50 AM",
  "Aug 1, 2026 11:35 AM",
  "Jul 31, 2026 03:15 PM",
  "Jul 30, 2026 08:45 AM",
  "Jul 30, 2026 12:20 PM",
  "Jul 29, 2026 05:10 PM",
  "Jul 28, 2026 10:05 AM",
  "Jul 28, 2026 02:40 PM",
  "Jul 27, 2026 04:15 PM",
];

export const data: DataProps[] = customerNames.map((name, idx) => {
  const status = statuses[idx % statuses.length];
  const unread = status === "closed" ? 0 : unreadCounts[idx];
  const isChatbot = idx % 5 === 0;
  return {
    id: idx + 1,
    conversationNo: `CONV-${String(10000 + idx).padStart(5, "0")}`,
    title: conversationTitles[idx % conversationTitles.length],
    customerName: name,
    customerImage: avatars[idx % avatars.length],
    mobile: mobileNumbers[idx % mobileNumbers.length],
    phonenumber: mobileNumbers[idx % mobileNumbers.length], // 👈 ADD THIS LINE
    tags: allTags[idx % allTags.length],
    assignedTo: {
      name: agentNames[idx % agentNames.length],
      image: avatars[(idx + 3) % avatars.length],
    },
    department: departments[idx % departments.length],
    status,
    createdDate: createdDates[idx % createdDates.length],
    lastMessage: lastMessages[idx % lastMessages.length],
    lastActivity: lastActivities[idx % lastActivities.length],
    unread,
    isChatbot,
    profilename: name,
    action: null,
  };
});

export function getConversationById(id: string | number): DataProps | undefined {
  const numericId = typeof id === "string" ? Number(id) : id;
  return data.find((item) => Number(item.id) === numericId);
}
>>>>>>> 1baa7e2c9c410fdd1e71ad464aea08b119d620c0
