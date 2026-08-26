"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/components/navigation";
import { ChatbotDataProps } from "../../chatbot-table/data";

interface Section7ChatbotConversationsProps {
  chatbot: ChatbotDataProps;
}

export interface ChatbotConversationItem {
  id: string;
  conversationId: string;
  customer: {
    name: string;
    avatar: string;
    phone: string;
  };
  currentMode: "Chatbot" | "Human" | "Hybrid";
  assignedEmployee: {
    name: string;
    avatar: string;
  } | null;
  lastMessage: {
    text: string;
    timestamp: string;
  };
  status: "Open" | "In Progress" | "Resolved" | "Closed";
}

const initialConversations: ChatbotConversationItem[] = [
  {
    id: "1",
    conversationId: "CONV-201",
    customer: {
      name: "Jenny Wilson",
      avatar: "/images/avatar/avatar-1.png",
      phone: "+1 (555) 234-5678",
    },
    currentMode: "Chatbot",
    assignedEmployee: null,
    lastMessage: {
      text: "What are your business hours?",
      timestamp: "10 min ago",
    },
    status: "Open",
  },
  {
    id: "2",
    conversationId: "CONV-202",
    customer: {
      name: "Emily Davis",
      avatar: "/images/avatar/avatar-2.png",
      phone: "+1 (555) 876-5432",
    },
    currentMode: "Hybrid",
    assignedEmployee: {
      name: "Michael Chen",
      avatar: "/images/avatar/avatar-3.png",
    },
    lastMessage: {
      text: "I need help configuring my API webhook endpoint.",
      timestamp: "25 min ago",
    },
    status: "In Progress",
  },
  {
    id: "3",
    conversationId: "CONV-203",
    customer: {
      name: "Laura Smith",
      avatar: "/images/avatar/avatar-4.png",
      phone: "+44 20 7946 0958",
    },
    currentMode: "Human",
    assignedEmployee: {
      name: "Sarah Kim",
      avatar: "/images/avatar/avatar-5.png",
    },
    lastMessage: {
      text: "Thank you! The invoice issue is resolved now.",
      timestamp: "1 hour ago",
    },
    status: "Resolved",
  },
  {
    id: "4",
    conversationId: "CONV-204",
    customer: {
      name: "Sarah Johnson",
      avatar: "/images/avatar/avatar-6.png",
      phone: "+1 (555) 345-6789",
    },
    currentMode: "Chatbot",
    assignedEmployee: null,
    lastMessage: {
      text: "How do I reset my password?",
      timestamp: "2 hours ago",
    },
    status: "Open",
  },
  {
    id: "5",
    conversationId: "CONV-205",
    customer: {
      name: "Rachel Brown",
      avatar: "/images/avatar/avatar-7.png",
      phone: "+33 1 23 45 67 89",
    },
    currentMode: "Hybrid",
    assignedEmployee: {
      name: "David Patel",
      avatar: "/images/avatar/avatar-8.png",
    },
    lastMessage: {
      text: "Could you send me the enterprise pricing document?",
      timestamp: "4 hours ago",
    },
    status: "In Progress",
  },
  {
    id: "6",
    conversationId: "CONV-206",
    customer: {
      name: "Megan Taylor",
      avatar: "/images/avatar/avatar-9.png",
      phone: "+81 3-1234-5678",
    },
    currentMode: "Chatbot",
    assignedEmployee: null,
    lastMessage: {
      text: "Thank you for the quick assistance!",
      timestamp: "1 day ago",
    },
    status: "Closed",
  },
  {
    id: "7",
    conversationId: "CONV-207",
    customer: {
      name: "Sophie Clark",
      avatar: "/images/avatar/avatar-10.png",
      phone: "+1 (555) 987-6543",
    },
    currentMode: "Human",
    assignedEmployee: {
      name: "Sarah Kim",
      avatar: "/images/avatar/avatar-5.png",
    },
    lastMessage: {
      text: "Can I upgrade my subscription plan?",
      timestamp: "1 day ago",
    },
    status: "Open",
  },
  {
    id: "8",
    conversationId: "CONV-208",
    customer: {
      name: "Natalie Martin",
      avatar: "/images/avatar/avatar-11.png",
      phone: "+44 20 7123 4567",
    },
    currentMode: "Chatbot",
    assignedEmployee: null,
    lastMessage: {
      text: "Where is my order status?",
      timestamp: "2 days ago",
    },
    status: "Resolved",
  },
];

const modeBadgeStyles: Record<string, string> = {
  Chatbot:
    "bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  Human:
    "bg-purple-500/15 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  Hybrid:
    "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
};

const statusBadgeStyles: Record<string, string> = {
  Open: "bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  "In Progress":
    "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  Resolved:
    "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  Closed:
    "bg-slate-500/15 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400",
};

export const Section7ChatbotConversations = ({
  chatbot,
}: Section7ChatbotConversationsProps) => {
  const [conversations] =
    useState<ChatbotConversationItem[]>(initialConversations);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const filteredConversations = conversations.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.customer.name.toLowerCase().includes(q) ||
      item.conversationId.toLowerCase().includes(q) ||
      item.customer.phone.toLowerCase().includes(q) ||
      item.lastMessage.text.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q) ||
      item.currentMode.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredConversations.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedConversations = filteredConversations.slice(
    startIndex,
    startIndex + pageSize,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Card className="shadow-none border border-default-200">
      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-default-100">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              SECTION 7: Chatbot Conversations
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="max-w-sm h-9 !border !border-default-200 shadow-none bg-background focus-visible:!ring-0 focus-visible:!border-default-300 text-sm"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="border border-default-200 rounded-lg overflow-x-auto">
          <Table>
            <TableHeader className="bg-default-200">
              <TableRow className="border-b border-default-200">
                <TableHead className="text-sm font-semibold text-default-700 h-11">
                  Customer
                </TableHead>
                <TableHead className="text-sm font-semibold text-default-700 h-11">
                  Conversation ID
                </TableHead>
                <TableHead className="text-sm font-semibold text-default-700 h-11">
                  Current Mode
                </TableHead>
                <TableHead className="text-sm font-semibold text-default-700 h-11">
                  Assigned Employee
                </TableHead>
                <TableHead className="text-sm font-semibold text-default-700 h-11">
                  Last Message
                </TableHead>
                <TableHead className="text-sm font-semibold text-default-700 h-11">
                  Status
                </TableHead>
                <TableHead className="text-sm font-semibold text-default-700 h-11 text-end pe-4">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedConversations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-sm text-default-500"
                  >
                    No conversations found matching criteria.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedConversations.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-default-100/50 transition-colors border-b border-default-100"
                  >
                    {/* 1. Customer */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage
                            src={item.customer.avatar}
                            alt={item.customer.name}
                          />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                            {item.customer.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-default-800 truncate">
                            {item.customer.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* 2. Conversation ID */}
                    <TableCell className="py-3">
                      <span className="text-sm font-medium text-default-700 whitespace-nowrap">
                        #{item.conversationId}
                      </span>
                    </TableCell>

                    {/* 3. Current Mode */}
                    <TableCell className="py-3">
                      <Badge
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 border-0",
                          modeBadgeStyles[item.currentMode] ||
                            "bg-default-200 text-default-700",
                        )}
                      >
                        {item.currentMode}
                      </Badge>
                    </TableCell>

                    {/* 4. Assigned Employee */}
                    <TableCell className="py-3">
                      {item.assignedEmployee ? (
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <Avatar className="h-6 w-6 shrink-0">
                            <AvatarImage
                              src={item.assignedEmployee.avatar}
                              alt={item.assignedEmployee.name}
                            />
                            <AvatarFallback className="text-[10px]">
                              {item.assignedEmployee.name
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-default-700">
                            {item.assignedEmployee.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-default-400 italic">
                          Unassigned (Bot)
                        </span>
                      )}
                    </TableCell>

                    {/* 5. Last Message */}
                    <TableCell className="py-3 max-w-[240px]">
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-normal text-default-700 truncate">
                          &quot;{item.lastMessage.text}&quot;
                        </span>
                        <span className="text-[10px] text-default-400">
                          {item.lastMessage.timestamp}
                        </span>
                      </div>
                    </TableCell>

                    {/* 6. Status */}
                    <TableCell className="py-3">
                      <Badge
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 border-0",
                          statusBadgeStyles[item.status] ||
                            "bg-slate-500/15 text-slate-600",
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full mr-1.5 inline-block",
                            item.status === "Resolved"
                              ? "bg-emerald-500"
                              : item.status === "In Progress"
                                ? "bg-amber-500"
                                : item.status === "Open"
                                  ? "bg-blue-500"
                                  : "bg-slate-400",
                          )}
                        />
                        {item.status}
                      </Badge>
                    </TableCell>

                    {/* 7. Action */}
                    <TableCell className="py-3 text-end pe-4">
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
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Table Pagination Footer (Matches main TablePagination component) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-sm text-default-500">
            Showing {filteredConversations.length > 0 ? startIndex + 1 : 0} to{" "}
            {Math.min(startIndex + pageSize, filteredConversations.length)} of{" "}
            {filteredConversations.length} entries
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 border-default-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                size="icon"
                className="w-8 h-8 text-xs font-medium"
                variant={currentPage === page ? "default" : "outline"}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 border-default-200"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
