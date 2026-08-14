"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@/components/navigation";
import { EmployeeProps } from "../../team-table/columns";
import {
  Eye,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AssignedConversation {
  id: string | number;
  conversationNo: string;
  customerName: string;
  customerImage?: string;
  mobile: string;
  tags: string[];
  title: string;
  status: "open" | "in-progress" | "pending" | "resolved" | "closed";
  lastMessage: string;
  lastActivity: string;
  unread: number;
}

interface Section4AssignedConversationsProps {
  employee: EmployeeProps;
  onClose?: () => void;
}

const statusColors: Record<string, string> = {
  open: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  "in-progress": "bg-amber-500/15 text-amber-600 border-amber-500/20",
  closed: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  pending: "bg-default-300/40 text-default-700 border-default-300",
  resolved: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
};

const statusLabels: Record<string, string> = {
  open: "Open",
  "in-progress": "In Progress",
  pending: "Pending",
  resolved: "Resolved",
  closed: "Closed",
};

const tagColors: Record<string, string> = {
  VIP: "bg-amber-500/15 text-amber-600",
  Priority: "bg-red-500/15 text-red-600",
  Support: "bg-blue-500/15 text-blue-600",
  Sales: "bg-emerald-500/15 text-emerald-600",
  New: "bg-purple-500/15 text-purple-600",
  Returning: "bg-cyan-500/15 text-cyan-600",
};

// Generate realistic assigned conversation mock data for the employee
const generateMockConversations = (employeeName: string): AssignedConversation[] => [
  {
    id: 1,
    conversationNo: "CONV-10021",
    customerName: "Jenny Wilson",
    customerImage: "/images/avatar/avatar-1.png",
    mobile: "+1 (555) 123-4567",
    tags: ["VIP", "Priority"],
    title: "Order Status Inquiry — #ORD-28471",
    status: "open",
    lastMessage: "Thank you for your help! The issue is now resolved on my end.",
    lastActivity: "2 minutes ago",
    unread: 3,
  },
  {
    id: 2,
    conversationNo: "CONV-10022",
    customerName: "Emily Davis",
    customerImage: "/images/avatar/avatar-2.png",
    mobile: "+44 20 7946 0958",
    tags: ["Support"],
    title: "Billing Error on Monthly Statement",
    status: "in-progress",
    lastMessage: "Can you please check the status of my order? It's been over a week.",
    lastActivity: "12 minutes ago",
    unread: 1,
  },
  {
    id: 3,
    conversationNo: "CONV-10023",
    customerName: "Laura Smith",
    customerImage: "/images/avatar/avatar-3.png",
    mobile: "+61 2 9876 5432",
    tags: ["Sales", "New"],
    title: "Request to Upgrade Subscription Plan",
    status: "pending",
    lastMessage: "I'm interested in upgrading my current plan. What options are available?",
    lastActivity: "28 minutes ago",
    unread: 5,
  },
  {
    id: 4,
    conversationNo: "CONV-10024",
    customerName: "Sarah Johnson",
    customerImage: "/images/avatar/avatar-4.png",
    mobile: "+33 1 23 45 67 89",
    tags: ["Returning", "Support"],
    title: "Damaged Product Upon Delivery",
    status: "open",
    lastMessage: "The product arrived but seems to be damaged during shipping. What can I do?",
    lastActivity: "1 hour ago",
    unread: 2,
  },
  {
    id: 5,
    conversationNo: "CONV-10025",
    customerName: "Rachel Brown",
    customerImage: "/images/avatar/avatar-5.png",
    mobile: "+81 3-1234-5678",
    tags: ["VIP"],
    title: "Follow-up on Previous Ticket #4821",
    status: "resolved",
    lastMessage: "Just wanted to follow up on my previous ticket about the billing error.",
    lastActivity: "3 hours ago",
    unread: 0,
  },
  {
    id: 6,
    conversationNo: "CONV-10026",
    customerName: "Megan Taylor",
    customerImage: "/images/avatar/avatar-6.png",
    mobile: "+49 30 12345678",
    tags: ["Priority", "Sales"],
    title: "Missing Invoice for Recent Purchase",
    status: "closed",
    lastMessage: "Could you send me the invoice for my last purchase? I need it for accounting.",
    lastActivity: "Yesterday, 11:45 AM",
    unread: 0,
  },
  {
    id: 7,
    conversationNo: "CONV-10027",
    customerName: "Sophie Clark",
    customerImage: "/images/avatar/avatar-7.png",
    mobile: "+91 98765 43210",
    tags: ["New"],
    title: "Account Login Authentication Issue",
    status: "in-progress",
    lastMessage: "I'm having trouble logging into my account. It keeps saying invalid password.",
    lastActivity: "Yesterday, 3:30 PM",
    unread: 4,
  },
  {
    id: 8,
    conversationNo: "CONV-10028",
    customerName: "Natalie Martin",
    customerImage: "/images/avatar/avatar-8.png",
    mobile: "+1 (415) 555-0132",
    tags: ["VIP", "Support"],
    title: "Feature Request: Export Functionality",
    status: "open",
    lastMessage: "Do you offer any discounts for long-term customers? I've been with you for 3 years.",
    lastActivity: "2 days ago",
    unread: 2,
  },
];

export const Section4AssignedConversations = ({
  employee,
  onClose,
}: Section4AssignedConversationsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const rawConversations = useMemo(
    () => generateMockConversations(employee.name),
    [employee.name]
  );

  const filteredConversations = useMemo(() => {
    return rawConversations.filter((item) => {
      const matchesSearch =
        item.conversationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mobile.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rawConversations, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredConversations.length / pageSize) || 1;
  const paginatedConversations = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredConversations.slice(start, start + pageSize);
  }, [filteredConversations, currentPage, pageSize]);

  return (
    <Card className="shadow-sm border border-default-200">
      <CardContent className="p-5 space-y-4">
        {/* Header & Description */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-default-500 uppercase tracking-wider flex items-center gap-1.5">
              SECTION 4: Assigned Conversations
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              color="primary"
              className="w-fit bg-primary/10 text-primary border-primary/20 font-semibold px-3 py-1 text-xs"
            >
              {filteredConversations.length} Conversations
            </Badge>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-default-500 hover:bg-default-100 hover:text-gray-800"
                title="Hide Section 4"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filters Bar (Matching Conversation Table) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-default-400" />
            <Input
              placeholder="Search conversations, customer name, mobile..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-9 text-xs w-[150px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table Form - Matching exact conversation table design */}
        <div className="rounded-md border border-default-200 overflow-x-auto">
          <Table>
            <TableHeader className="bg-default-50">
              <TableRow className="border-b border-default-200">
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Conversation No.
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Customer Name
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Mobile Number
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Tags
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Conversation Title
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Last Message Preview
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Last Activity
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap text-center">
                  Unread Messages
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap text-end">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedConversations.length > 0 ? (
                paginatedConversations.map((item) => {
                  const initials = item.customerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <TableRow
                      key={item.id}
                      className="hover:bg-default-50/60 transition-colors border-b border-default-100"
                    >
                      {/* Conversation No. */}
                      <TableCell className="font-medium text-default-700 whitespace-nowrap text-sm">
                        #{item.conversationNo}
                      </TableCell>

                      {/* Customer Name */}
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar className="rounded-full w-8 h-8 bg-transparent hover:bg-transparent shadow-none border-none shrink-0">
                            {item.customerImage ? (
                              <AvatarImage
                                src={item.customerImage}
                                alt={item.customerName}
                              />
                            ) : null}
                            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-default-700 whitespace-nowrap">
                            {item.customerName}
                          </span>
                        </div>
                      </TableCell>

                      {/* Mobile Number */}
                      <TableCell className="whitespace-nowrap text-sm text-default-600">
                        {item.mobile}
                      </TableCell>

                      {/* Tags */}
                      <TableCell className="whitespace-nowrap">
                        <div className="flex flex-nowrap gap-1.5">
                          {item.tags.map((tag) => (
                            <Badge
                              key={tag}
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap shrink-0",
                                tagColors[tag] || "bg-default-200 text-default-700"
                              )}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>

                      {/* Conversation Title */}
                      <TableCell className="text-sm font-medium text-default-700 whitespace-nowrap max-w-[200px] truncate">
                        <span title={item.title}>{item.title}</span>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="whitespace-nowrap">
                        <Badge
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium border whitespace-nowrap shrink-0 capitalize",
                            statusColors[item.status] ||
                              "bg-default-200 text-default-700 border-default-300"
                          )}
                        >
                          {statusLabels[item.status] || item.status}
                        </Badge>
                      </TableCell>

                      {/* Last Message Preview */}
                      <TableCell className="text-sm text-default-600 whitespace-nowrap max-w-[260px] truncate">
                        <span title={item.lastMessage}>
                          {item.lastMessage}
                        </span>
                      </TableCell>

                      {/* Last Activity */}
                      <TableCell className="whitespace-nowrap text-sm text-default-600">
                        {item.lastActivity}
                      </TableCell>

                      {/* Unread Messages */}
                      <TableCell className="whitespace-nowrap text-center">
                        {item.unread > 0 ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <Bell className="w-4 h-4 text-blue-500 shrink-0" />
                            <Badge className="rounded-full bg-blue-500 text-white text-xs font-semibold min-w-[22px] h-[22px] flex items-center justify-center px-1.5 whitespace-nowrap">
                              {item.unread}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-sm text-default-400">—</span>
                        )}
                      </TableCell>

                      {/* Action */}
                      <TableCell className="whitespace-nowrap text-end">
                        <Link href={`/conversations/${item.id}`}>
                        <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 ring-offset-transparent !border !border-default-200 text-default-500 hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/5 transition-colors shrink-0 bg-background hover:ring-0 hover:ring-transparent"
                color="secondary"
              >
                <Eye className="w-4 h-4" />
              </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="h-32 text-center text-default-500 text-xs"
                  >
                    No assigned conversations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Table Footer & Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-default-500">
            Showing{" "}
            <span className="font-semibold text-default-800">
              {filteredConversations.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-default-800">
              {Math.min(
                currentPage * pageSize,
                filteredConversations.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-default-800">
              {filteredConversations.length}
            </span>{" "}
            conversations
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="w-8 h-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="icon"
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 text-xs"
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="w-8 h-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
