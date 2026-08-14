export type TagProps = {
  id: string;
  tagId: string;
  tagName: string;
  description: string;
  numberOfContacts: number;
  createdBy: string;
  createdByAvatar?: string;
  createdAt: string;
  updatedAt: string;
  status: "Active" | "Inactive";
};

export const data: TagProps[] = [
  {
    id: "1",
    tagId: "TAG-001",
    tagName: "VIP Customer",
    description: "High-value clients with premium support access and priority status",
    numberOfContacts: 142,
    createdBy: "Alex Morgan",
    createdByAvatar: "/images/avatar/avatar-1.png",
    createdAt: "12 Oct 2024, 10:30 AM",
    updatedAt: "14 Oct 2024, 02:15 PM",
    status: "Active",
  },
  {
    id: "2",
    tagId: "TAG-002",
    tagName: "Priority Lead",
    description: "Inbound leads with high purchase intent requiring follow-up within 24h",
    numberOfContacts: 85,
    createdBy: "Sarah Jenkins",
    createdByAvatar: "/images/avatar/avatar-2.png",
    createdAt: "15 Oct 2024, 09:12 AM",
    updatedAt: "18 Oct 2024, 11:45 AM",
    status: "Active",
  },
  {
    id: "3",
    tagId: "TAG-003",
    tagName: "Support Escalation",
    description: "Tickets escalated to level 2 technical support team",
    numberOfContacts: 34,
    createdBy: "Michael Scott",
    createdByAvatar: "/images/avatar/avatar-3.png",
    createdAt: "01 Nov 2024, 02:20 PM",
    updatedAt: "05 Nov 2024, 04:10 PM",
    status: "Active",
  },
  {
    id: "4",
    tagId: "TAG-004",
    tagName: "Sales Qualified",
    description: "Prospects verified by BDR team ready for executive demo",
    numberOfContacts: 210,
    createdBy: "David Miller",
    createdByAvatar: "/images/avatar/avatar-4.png",
    createdAt: "08 Nov 2024, 11:00 AM",
    updatedAt: "12 Nov 2024, 01:30 PM",
    status: "Active",
  },
  {
    id: "5",
    tagId: "TAG-005",
    tagName: "New Sign-up",
    description: "Recently registered users in the onboarding email sequence",
    numberOfContacts: 312,
    createdBy: "Emily Watson",
    createdByAvatar: "/images/avatar/avatar-5.png",
    createdAt: "20 Nov 2024, 08:45 AM",
    updatedAt: "22 Nov 2024, 10:00 AM",
    status: "Active",
  },
  {
    id: "6",
    tagId: "TAG-006",
    tagName: "Returning Buyer",
    description: "Customers who have completed 2 or more repeat orders",
    numberOfContacts: 178,
    createdBy: "Alex Morgan",
    createdByAvatar: "/images/avatar/avatar-1.png",
    createdAt: "01 Dec 2024, 03:15 PM",
    updatedAt: "03 Dec 2024, 05:20 PM",
    status: "Active",
  },
  {
    id: "7",
    tagId: "TAG-007",
    tagName: "Wholesale Partner",
    description: "B2B distributors and wholesale account managers",
    numberOfContacts: 45,
    createdBy: "Sarah Jenkins",
    createdByAvatar: "/images/avatar/avatar-2.png",
    createdAt: "10 Dec 2024, 01:00 PM",
    updatedAt: "15 Dec 2024, 03:30 PM",
    status: "Active",
  },
  {
    id: "8",
    tagId: "TAG-008",
    tagName: "Beta Tester",
    description: "Users opted into testing pre-release platform features",
    numberOfContacts: 64,
    createdBy: "Michael Scott",
    createdByAvatar: "/images/avatar/avatar-3.png",
    createdAt: "05 Jan 2025, 10:15 AM",
    updatedAt: "10 Jan 2025, 12:00 PM",
    status: "Inactive",
  },
  {
    id: "9",
    tagId: "TAG-009",
    tagName: "Churn Risk",
    description: "Accounts with low activity over the past 30 days flagged for retention",
    numberOfContacts: 29,
    createdBy: "David Miller",
    createdByAvatar: "/images/avatar/avatar-4.png",
    createdAt: "18 Jan 2025, 04:30 PM",
    updatedAt: "22 Jan 2025, 09:10 AM",
    status: "Active",
  },
  {
    id: "10",
    tagId: "TAG-010",
    tagName: "Webinar Attendee",
    description: "Participants from Q1 product roadmap virtual webinar",
    numberOfContacts: 520,
    createdBy: "Emily Watson",
    createdByAvatar: "/images/avatar/avatar-5.png",
    createdAt: "02 Feb 2025, 11:20 AM",
    updatedAt: "04 Feb 2025, 02:40 PM",
    status: "Inactive",
  },
];

export function getTagById(id: string): TagProps | undefined {
  return data.find((item) => item.id === id || item.tagId.toLowerCase() === id.toLowerCase());
}
