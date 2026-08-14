import { EmployeeProps } from "./columns";

const avatars = [
  "/images/avatar/avatar-1.png",
  "/images/avatar/avatar-2.png",
  "/images/avatar/avatar-3.png",
  "/images/avatar/avatar-4.png",
  "/images/avatar/avatar-5.png",
];

const employeeNames = [
  "Alex Morgan",
  "Sarah Connor",
  "David Miller",
  "Emily Watson",
  "Michael Chen",
  "Jessica Taylor",
  "James Wilson",
  "Sophia Martinez",
  "Daniel Anderson",
  "Olivia Thomas",
];

const emails = [
  "alex.morgan@company.com",
  "sarah.connor@company.com",
  "david.miller@company.com",
  "emily.watson@company.com",
  "michael.chen@company.com",
  "jessica.taylor@company.com",
  "james.wilson@company.com",
  "sophia.martinez@company.com",
  "daniel.anderson@company.com",
  "olivia.thomas@company.com",
];

const mobileNumbers = [
  "+1 (555) 234-5678",
  "+1 (555) 876-5432",
  "+44 20 7946 0123",
  "+61 2 9876 1234",
  "+33 1 42 68 55 00",
  "+49 30 123456",
  "+81 3 5555 0143",
  "+1 (555) 345-6789",
  "+1 (555) 987-6543",
  "+44 20 7946 0888",
];

const departments = [
  "Customer Support",
  "Sales",
  "Engineering",
  "Product",
  "HR",
];

const roles = [
  "Admin",
  "Manager",
  "Agent",
  "Developer",
  "Support Lead",
];

const statuses: ("Active" | "Inactive" | "Pending")[] = ["Active", "Active", "Active", "Inactive", "Pending"];

const onlineStatuses: ("Online" | "Offline")[] = ["Online", "Offline", "Online", "Online", "Offline"];

const assignedConversations = [24, 18, 32, 5, 12, 45, 9, 21, 15, 8];
const resolvedConversations = [340, 215, 480, 45, 130, 620, 95, 290, 180, 75];

const lastLogins = [
  "Just now",
  "5 minutes ago",
  "12 minutes ago",
  "1 hour ago",
  "3 hours ago",
  "Yesterday, 4:15 PM",
  "2 days ago",
  "Aug 10, 2026",
  "Aug 08, 2026",
  "Aug 05, 2026",
];

export const initialEmployees: EmployeeProps[] = Array.from({ length: 15 }).map((_, idx) => {
  const name = employeeNames[idx % employeeNames.length];
  return {
    id: (idx + 1).toString(),
    employeeId: `EMP-${String(1001 + idx).padStart(4, "0")}`,
    name: name,
    image: avatars[idx % avatars.length],
    email: emails[idx % emails.length],
    mobile: mobileNumbers[idx % mobileNumbers.length],
    department: departments[idx % departments.length],
    role: roles[idx % roles.length],
    status: statuses[idx % statuses.length],
    onlineStatus: onlineStatuses[idx % onlineStatuses.length],
    assignedConversations: assignedConversations[idx % assignedConversations.length],
    resolvedConversations: resolvedConversations[idx % resolvedConversations.length],
    lastLogin: lastLogins[idx % lastLogins.length],
    action: null,
  };
});

export const getEmployeeById = (id: string | number) => {
  return initialEmployees.find((item) => item.id.toString() === id.toString());
};
