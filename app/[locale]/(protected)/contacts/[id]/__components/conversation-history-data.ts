export type ConvRow = {
  id: string | number;
  conversationNo: string;
  title: string;
  assignedTo: { name: string; image: string };
  status: string;
  createdDate: string;
  lastActivity: string;
  messageCount: number;
  action?: React.ReactNode;
};

export const statusColors: Record<string, string> = {
  open: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  "in-progress": "bg-amber-500/15 text-amber-600 border-amber-500/20",
  closed: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  pending: "bg-default-300/40 text-default-700 border-default-300",
};

export const statusLabels: Record<string, string> = {
  open: "Open",
  "in-progress": "In Progress",
  closed: "Closed",
  pending: "Pending",
};

export const mockConversations: ConvRow[] = [
  {
    id: 1,
    conversationNo: "CONV-10001",
    title: "Order refund request for ORD-28471",
    assignedTo: { name: "Sarah Kim", image: "" },
    status: "open",
    createdDate: "Aug 3, 2026",
    lastActivity: "2 mins ago",
    messageCount: 45,
  },
  {
    id: 2,
    conversationNo: "CONV-09887",
    title: "Damaged product replacement query",
    assignedTo: { name: "Michael Chen", image: "" },
    status: "in-progress",
    createdDate: "Jul 28, 2026",
    lastActivity: "1 day ago",
    messageCount: 32,
  },
  {
    id: 3,
    conversationNo: "CONV-09650",
    title: "Shipping delay follow-up",
    assignedTo: { name: "Emily Rodriguez", image: "" },
    status: "closed",
    createdDate: "Jul 20, 2026",
    lastActivity: "Jul 21, 2026",
    messageCount: 18,
  },
  {
    id: 4,
    conversationNo: "CONV-09412",
    title: "Custom engraving design approval",
    assignedTo: { name: "David Patel", image: "" },
    status: "closed",
    createdDate: "Jul 14, 2026",
    lastActivity: "Jul 16, 2026",
    messageCount: 24,
  },
  {
    id: 5,
    conversationNo: "CONV-09100",
    title: "Invoice dispute for INV-8821",
    assignedTo: { name: "Sarah Kim", image: "" },
    status: "pending",
    createdDate: "Jul 5, 2026",
    lastActivity: "Jul 8, 2026",
    messageCount: 15,
  },
  {
    id: 6,
    conversationNo: "CONV-08791",
    title: "Subscription upgrade assistance",
    assignedTo: { name: "Jessica Brown", image: "" },
    status: "closed",
    createdDate: "Jun 25, 2026",
    lastActivity: "Jun 26, 2026",
    messageCount: 12,
  },
];

export type ContactConversationStats = {
  totalConversations: number;
  totalMessages: number;
  lastContacted: string;
  firstContacted: string;
  openConversations: number;
  resolvedConversations: number;
};

export function computeContactStats(convs: ConvRow[]): ContactConversationStats {
  const totalConversations = convs.length;
  const totalMessages = convs.reduce((sum, c) => sum + (c.messageCount || 0), 0);

  const parseDate = (s: string): Date => {
    const d = new Date(s);
    return isNaN(d.getTime()) ? new Date(0) : d;
  };

  const sortedByCreated = [...convs].sort(
    (a, b) => parseDate(a.createdDate).getTime() - parseDate(b.createdDate).getTime()
  );
  const firstContacted = sortedByCreated[0]?.createdDate ?? "-";
  const lastContacted = sortedByCreated[sortedByCreated.length - 1]?.createdDate ?? "-";

  const openConversations = convs.filter(
    (c) => c.status === "open" || c.status === "in-progress" || c.status === "pending"
  ).length;
  const resolvedConversations = convs.filter((c) => c.status === "closed").length;

  return {
    totalConversations,
    totalMessages,
    lastContacted,
    firstContacted,
    openConversations,
    resolvedConversations,
  };
}
