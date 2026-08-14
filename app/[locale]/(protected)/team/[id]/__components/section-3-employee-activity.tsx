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
import { EmployeeProps } from "../../team-table/columns";
import {
  Search,
  Filter,
  Activity,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ActivityType =
  | "Employee Created"
  | "Invitation Sent"
  | "Invitation Accepted"
  | "Login"
  | "Logout"
  | "Conversation Assigned"
  | "Conversation Reassigned"
  | "Message Sent"
  | "Conversation Resolved"
  | "Conversation Reopened"
  | "Conversation Closed"
  | "Contact Updated"
  | "Tag Added"
  | "Tag Removed";

export interface ActivityDetail {
  id: number;
  type: ActivityType;
  referenceNo: string;
  status: string;
  statusBadgeColor: string;
  title: string;
  performerName: string;
  performerImage?: string;
  department: string;
  createdDate: string;
  lastActivity: string;
}

interface Section3EmployeeActivityProps {
  employee: EmployeeProps;
}


const allActivitiesList: ActivityDetail[] = [
  {
    id: 1,
    type: "Employee Created",
    referenceNo: "#EMP-1001",
    status: "Active",
    statusBadgeColor: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
    title: "New Employee Profile Created in System",
    performerName: "System Admin",
    performerImage: "/images/avatar/avatar-1.png",
    department: "Human Resources",
    createdDate: "Aug 1, 2026 09:30 AM",
    lastActivity: "12 days ago",
  },
  {
    id: 2,
    type: "Invitation Sent",
    referenceNo: "#INV-48210",
    status: "Sent",
    statusBadgeColor: "bg-blue-500/15 text-blue-600 border-blue-500/20",
    title: "Account Invitation Email Dispatched",
    performerName: "Sarah Kim",
    performerImage: "/images/avatar/avatar-2.png",
    department: "Operations",
    createdDate: "Aug 1, 2026 10:00 AM",
    lastActivity: "12 days ago",
  },
  {
    id: 3,
    type: "Invitation Accepted",
    referenceNo: "#INV-48210",
    status: "Accepted",
    statusBadgeColor: "bg-teal-500/15 text-teal-600 border-teal-500/20",
    title: "Employee Onboarding Password Set & Verified",
    performerName: "Christopher Lee",
    performerImage: "/images/avatar/avatar-3.png",
    department: "Customer Support",
    createdDate: "Aug 1, 2026 11:30 AM",
    lastActivity: "12 days ago",
  },
  {
    id: 4,
    type: "Login",
    referenceNo: "#SES-99482",
    status: "Active Session",
    statusBadgeColor: "bg-indigo-500/15 text-indigo-600 border-indigo-500/20",
    title: "Successful Portal Authentication Login",
    performerName: "Christopher Lee",
    performerImage: "/images/avatar/avatar-3.png",
    department: "Customer Support",
    createdDate: "Aug 13, 2026 09:00 AM",
    lastActivity: "10 hours ago",
  },
  {
    id: 5,
    type: "Logout",
    referenceNo: "#SES-99481",
    status: "Logged Out",
    statusBadgeColor: "bg-slate-500/15 text-slate-600 border-slate-500/20",
    title: "End of Work Shift Session Logout",
    performerName: "Christopher Lee",
    performerImage: "/images/avatar/avatar-3.png",
    department: "Customer Support",
    createdDate: "Aug 12, 2026 06:00 PM",
    lastActivity: "Yesterday",
  },
  {
    id: 6,
    type: "Conversation Assigned",
    referenceNo: "#CONV-10021",
    status: "Open",
    statusBadgeColor: "bg-blue-500/15 text-blue-600 border-blue-500/20",
    title: "Order Status Inquiry — #ORD-28471",
    performerName: "Michael Chen",
    performerImage: "/images/avatar/avatar-4.png",
    department: "Customer Support",
    createdDate: "Aug 13, 2026 09:40 AM",
    lastActivity: "2 minutes ago",
  },
  {
    id: 7,
    type: "Conversation Reassigned",
    referenceNo: "#CONV-10022",
    status: "In Progress",
    statusBadgeColor: "bg-amber-500/15 text-amber-600 border-amber-500/20",
    title: "Billing Error on Monthly Statement",
    performerName: "Emily Rodriguez",
    performerImage: "/images/avatar/avatar-5.png",
    department: "Billing",
    createdDate: "Aug 13, 2026 10:15 AM",
    lastActivity: "12 minutes ago",
  },
  {
    id: 8,
    type: "Message Sent",
    referenceNo: "#CONV-10023",
    status: "Sent",
    statusBadgeColor: "bg-sky-500/15 text-sky-600 border-sky-500/20",
    title: "Request to Upgrade Subscription Plan Reply",
    performerName: "David Patel",
    performerImage: "/images/avatar/avatar-6.png",
    department: "Sales",
    createdDate: "Aug 13, 2026 01:25 PM",
    lastActivity: "28 minutes ago",
  },
  {
    id: 9,
    type: "Conversation Resolved",
    referenceNo: "#CONV-10025",
    status: "Resolved",
    statusBadgeColor: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
    title: "Follow-up on Previous Ticket #4821",
    performerName: "Sarah Kim",
    performerImage: "/images/avatar/avatar-2.png",
    department: "Customer Support",
    createdDate: "Aug 13, 2026 02:10 PM",
    lastActivity: "3 hours ago",
  },
  {
    id: 10,
    type: "Conversation Reopened",
    referenceNo: "#CONV-10027",
    status: "Reopened",
    statusBadgeColor: "bg-orange-500/15 text-orange-600 border-orange-500/20",
    title: "Account Login Authentication Issue",
    performerName: "Christopher Lee",
    performerImage: "/images/avatar/avatar-7.png",
    department: "Technical Support",
    createdDate: "Aug 13, 2026 11:50 AM",
    lastActivity: "Yesterday",
  },
  {
    id: 11,
    type: "Conversation Closed",
    referenceNo: "#CONV-10006",
    status: "Closed",
    statusBadgeColor: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
    title: "Service Setup Assistance Request",
    performerName: "Christopher Lee",
    performerImage: "/images/avatar/avatar-7.png",
    department: "Account Management",
    createdDate: "Aug 5, 2026 07:40 AM",
    lastActivity: "3 hours ago",
  },
  {
    id: 12,
    type: "Contact Updated",
    referenceNo: "#CNT-88210",
    status: "Updated",
    statusBadgeColor: "bg-violet-500/15 text-violet-600 border-violet-500/20",
    title: "Contact Details & Phone Number Updated",
    performerName: "Jessica Brown",
    performerImage: "/images/avatar/avatar-8.png",
    department: "Operations",
    createdDate: "Aug 12, 2026 04:15 PM",
    lastActivity: "Yesterday",
  },
  {
    id: 13,
    type: "Tag Added",
    referenceNo: "#TAG-0012",
    status: "Applied",
    statusBadgeColor: "bg-amber-500/15 text-amber-600 border-amber-500/20",
    title: 'Applied Tag "VIP" to Customer Jenny Wilson',
    performerName: "Sarah Kim",
    performerImage: "/images/avatar/avatar-2.png",
    department: "Sales",
    createdDate: "Aug 13, 2026 04:45 PM",
    lastActivity: "1 hour ago",
  },
  {
    id: 14,
    type: "Tag Removed",
    referenceNo: "#TAG-0014",
    status: "Removed",
    statusBadgeColor: "bg-red-500/15 text-red-600 border-red-500/20",
    title: 'Removed Tag "FollowUp" from Customer Jenny Wilson',
    performerName: "Sarah Kim",
    performerImage: "/images/avatar/avatar-2.png",
    department: "Sales",
    createdDate: "Aug 13, 2026 05:14 PM",
    lastActivity: "30 minutes ago",
  },
];

export const Section3EmployeeActivity = ({
  employee,
}: Section3EmployeeActivityProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredActivities = useMemo(() => {
    return allActivitiesList.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.performerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === "all" || item.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [searchQuery, typeFilter]);

  const totalPages = Math.ceil(filteredActivities.length / pageSize) || 1;
  const paginatedActivities = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredActivities.slice(start, start + pageSize);
  }, [filteredActivities, currentPage, pageSize]);

  return (
    <Card className="shadow-sm border border-default-200">
      <CardContent className="p-5 space-y-4">
        {/* Header & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 ">
          <div>
            <div className="text-xs font-bold text-default-500 uppercase tracking-wider flex items-center gap-1.5">
              SECTION 3: EMPLOYEE ACTIVITY
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-default-400" />
            <Input
              placeholder="Search by title, reference no, performer, department..."
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
              value={typeFilter}
              onValueChange={(val) => {
                setTypeFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-9 text-xs w-[200px]">
                <Filter className="w-3.5 h-3.5 me-1 text-default-400" />
                <SelectValue placeholder="All Activity Types" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">All Activity Types (14)</SelectItem>
                <SelectItem value="Employee Created">Employee Created</SelectItem>
                <SelectItem value="Invitation Sent">Invitation Sent</SelectItem>
                <SelectItem value="Invitation Accepted">Invitation Accepted</SelectItem>
                <SelectItem value="Login">Login</SelectItem>
                <SelectItem value="Logout">Logout</SelectItem>
                <SelectItem value="Conversation Assigned">Conversation Assigned</SelectItem>
                <SelectItem value="Conversation Reassigned">Conversation Reassigned</SelectItem>
                <SelectItem value="Message Sent">Message Sent</SelectItem>
                <SelectItem value="Conversation Resolved">Conversation Resolved</SelectItem>
                <SelectItem value="Conversation Reopened">Conversation Reopened</SelectItem>
                <SelectItem value="Conversation Closed">Conversation Closed</SelectItem>
                <SelectItem value="Contact Updated">Contact Updated</SelectItem>
                <SelectItem value="Tag Added">Tag Added</SelectItem>
                <SelectItem value="Tag Removed">Tag Removed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table Form for Section 3 Activity Data */}
        <div className="rounded-md border border-default-200 overflow-x-auto">
          <Table>
            <TableHeader className="bg-default-50">
              <TableRow className="border-b border-default-200">
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Activity Type
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Reference No.
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Title
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Assigned
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Department
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Created
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Last Activity
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedActivities.length > 0 ? (
                paginatedActivities.map((item) => {
                  const actorName =
                    item.performerName === "Christopher Lee"
                      ? employee.name || item.performerName
                      : item.performerName;
                  const actorImage =
                    item.performerName === "Christopher Lee"
                      ? employee.image || item.performerImage
                      : item.performerImage;
                  const actorDept =
                    item.performerName === "Christopher Lee"
                      ? employee.department || item.department
                      : item.department;

                  return (
                    <TableRow
                      key={item.id}
                      className="hover:bg-default-50/60 transition-colors border-b border-default-100"
                    >
                      {/* Activity Type */}
                      <TableCell className="whitespace-nowrap font-semibold text-default-800 text-sm">
                        {item.type}
                      </TableCell>

                      {/* Reference No. */}
                      <TableCell className="font-medium text-default-700 whitespace-nowrap text-sm">
                        {item.referenceNo}
                      </TableCell>

                      {/* Title */}
                      <TableCell className="text-sm font-medium text-default-900 whitespace-nowrap max-w-[240px] truncate">
                        <span title={item.title}>{item.title}</span>
                      </TableCell>

                      {/* Assigned / Performer */}
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-7 h-7 border border-default-200">
                            {actorImage ? (
                              <AvatarImage src={actorImage} alt={actorName} />
                            ) : null}
                            <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                              {actorName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-default-700 whitespace-nowrap">
                            {actorName}
                          </span>
                        </div>
                      </TableCell>

                      {/* Department */}
                      <TableCell className="whitespace-nowrap text-sm text-default-600 font-medium">
                        {actorDept}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="whitespace-nowrap">
                        <Badge
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium border whitespace-nowrap capitalize",
                            item.statusBadgeColor
                          )}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>

                      {/* Created */}
                      <TableCell className="whitespace-nowrap text-sm text-default-600">
                        {item.createdDate}
                      </TableCell>

                      {/* Last Activity */}
                      <TableCell className="whitespace-nowrap text-sm text-default-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-default-400" />
                          <span>{item.lastActivity}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-32 text-center text-default-500 text-xs"
                  >
                    No activity logs found.
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
              {filteredActivities.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-default-800">
              {Math.min(
                currentPage * pageSize,
                filteredActivities.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-default-800">
              {filteredActivities.length}
            </span>{" "}
            activities
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
