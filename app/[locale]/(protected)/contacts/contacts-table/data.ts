import { DataProps } from "./columns";

const avatars = [
  "/images/avatar/avatar-1.png",
  "/images/avatar/avatar-2.png",
  "/images/avatar/avatar-3.png",
  "/images/avatar/avatar-4.png",
  "/images/avatar/avatar-5.png",
];

const customerNames = [
  "Jenny Wilson",
  "Emily Davis",
  "Laura Smith",
  "Sarah Johnson",
  "Rachel Brown",
];

const whatsappNames = [
  "Jenny W",
  "Emily",
  "Laura S",
  "Sarah J",
  "Rachel",
];

const mobileNumbers = [
  "+1 (555) 123-4567",
  "+44 20 7946 0958",
  "+61 2 9876 5432",
  "+33 1 23 45 67 89",
  "+81 3-1234-5678",
];

const emails = [
  "jenny@example.com",
  "emily@example.com",
  "laura@example.com",
  "sarah@example.com",
  "rachel@example.com",
];

const allTags = [
  ["VIP", "Priority"],
  ["Support"],
  ["Sales", "New"],
  ["Returning", "Support"],
  ["VIP"],
];

const totalConversations = [
  15,
  8,
  24,
  3,
  12,
];

const lastConversations = [
  "2 minutes ago",
  "5 minutes ago",
  "12 minutes ago",
  "28 minutes ago",
  "1 hour ago",
];

const createdDates = [
  "Aug 3, 2026 09:12 AM",
  "Aug 3, 2026 10:45 AM",
  "Aug 3, 2026 02:30 PM",
  "Aug 4, 2026 08:05 AM",
  "Aug 4, 2026 11:20 AM",
];

export const data: DataProps[] = Array.from({ length: 20 }).map((_, idx) => {
  return {
    id: idx + 1,
    contactId: `CUS-${String(1000 + idx).padStart(4, "0")}`,
    customerName: customerNames[idx % customerNames.length],
    customerImage: avatars[idx % avatars.length],
    whatsappName: whatsappNames[idx % whatsappNames.length],
    mobile: mobileNumbers[idx % mobileNumbers.length],
    email: emails[idx % emails.length],
    tags: allTags[idx % allTags.length],
    totalConversations: totalConversations[idx % totalConversations.length],
    lastConversation: lastConversations[idx % lastConversations.length],
    createdAt: createdDates[idx % createdDates.length],
    action: null,
  };
});

export const getContactById = (id: string | number) => {
  return data.find((item) => item.id.toString() === id.toString());
};
