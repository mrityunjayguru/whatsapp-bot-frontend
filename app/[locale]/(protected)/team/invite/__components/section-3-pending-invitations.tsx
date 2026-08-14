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
import {
  Search,
  Filter,
  Send,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface PendingInvitation {
  id: string | number;
  employeeName: string;
  avatar?: string;
  email: string;
  invitedBy: {
    name: string;
    avatar?: string;
  };
  invitationDate: string;
  invitationStatus: "Pending" | "Expired" | "Sent";
  lastInvitationSent: string;
}

const mockPendingInvitations: PendingInvitation[] = [
  {
    id: 1,
    employeeName: "Alexander Wright",
    avatar: "/images/avatar/avatar-1.png",
    email: "alexander.wright@company.com",
    invitedBy: {
      name: "Sarah Kim",
      avatar: "/images/avatar/avatar-2.png",
    },
    invitationDate: "Aug 13, 2026 10:15 AM",
    invitationStatus: "Pending",
    lastInvitationSent: "2 hours ago",
  },
  {
    id: 2,
    employeeName: "Sophia Martinez",
    avatar: "/images/avatar/avatar-3.png",
    email: "sophia.martinez@company.com",
    invitedBy: {
      name: "Michael Chen",
      avatar: "/images/avatar/avatar-4.png",
    },
    invitationDate: "Aug 12, 2026 03:45 PM",
    invitationStatus: "Sent",
    lastInvitationSent: "Yesterday, 03:45 PM",
  },
  {
    id: 3,
    employeeName: "Daniel Vance",
    avatar: "/images/avatar/avatar-5.png",
    email: "daniel.vance@company.com",
    invitedBy: {
      name: "Sarah Kim",
      avatar: "/images/avatar/avatar-2.png",
    },
    invitationDate: "Aug 10, 2026 11:20 AM",
    invitationStatus: "Expired",
    lastInvitationSent: "3 days ago",
  },
  {
    id: 4,
    employeeName: "Olivia Taylor",
    avatar: "/images/avatar/avatar-6.png",
    email: "olivia.taylor@company.com",
    invitedBy: {
      name: "David Patel",
      avatar: "/images/avatar/avatar-7.png",
    },
    invitationDate: "Aug 09, 2026 09:00 AM",
    invitationStatus: "Pending",
    lastInvitationSent: "4 days ago",
  },
  {
    id: 5,
    employeeName: "Ethan Harrison",
    avatar: "/images/avatar/avatar-8.png",
    email: "ethan.harrison@company.com",
    invitedBy: {
      name: "Michael Chen",
      avatar: "/images/avatar/avatar-4.png",
    },
    invitationDate: "Aug 08, 2026 02:30 PM",
    invitationStatus: "Sent",
    lastInvitationSent: "5 days ago",
  },
];

const statusBadgeColors: Record<string, string> = {
  Pending: "bg-amber-500/15 text-amber-600 border-amber-500/20",
  Sent: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  Expired: "bg-red-500/15 text-red-600 border-red-500/20",
};

export function Section3PendingInvitations() {
  const [invitations, setInvitations] = useState<PendingInvitation[]>(mockPendingInvitations);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handleResend = (item: PendingInvitation) => {
    toast.success(`Invitation email resent to ${item.email}`);
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === item.id
          ? { ...inv, lastInvitationSent: "Just now", invitationStatus: "Sent" }
          : inv
      )
    );
  };

  const handleCancel = (item: PendingInvitation) => {
    setInvitations((prev) => prev.filter((inv) => inv.id !== item.id));
    toast.info(`Invitation cancelled for ${item.employeeName}`);
  };

  const filtered = useMemo(() => {
    return invitations.filter((item) => {
      const matchesSearch =
        item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.invitedBy.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.invitationStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invitations, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  return (
    <Card className="shadow-sm border border-default-200">
      <CardContent className="p-5 space-y-4">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-default-500 uppercase tracking-wider">
              Pending Invitations
            </div>
            <p className="text-xs text-default-500 mt-1">
              Manage all pending employee invitations, resend emails, or cancel access requests.
            </p>
          </div>
          <Badge
            color="primary"
            className="w-fit bg-primary/10 text-primary border-primary/20 font-semibold px-3 py-1 text-xs"
          >
            {filtered.length} Pending Invites
          </Badge>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-default-400" />
            <Input
              placeholder="Search by name, email, invited by..."
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
              <SelectTrigger className="h-9 text-xs w-[160px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Sent">Sent</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table Form for Pending Invitations */}
        <div className="rounded-md border border-default-200 overflow-x-auto">
          <Table>
            <TableHeader className="bg-default-50">
              <TableRow className="border-b border-default-200">
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Employee Name
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Invited By
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Invitation Date
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Invitation Status
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap">
                  Last Invitation Sent
                </TableHead>
                <TableHead className="font-semibold text-default-800 text-xs whitespace-nowrap text-end">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.length > 0 ? (
                paginated.map((item) => {
                  const initials = item.employeeName
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
                      {/* Employee Name */}
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 border border-default-200">
                            {item.avatar ? (
                              <AvatarImage src={item.avatar} alt={item.employeeName} />
                            ) : null}
                            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-semibold text-default-800 whitespace-nowrap">
                            {item.employeeName}
                          </span>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="whitespace-nowrap text-sm text-default-600 font-medium">
                        {item.email}
                      </TableCell>

                      {/* Invited By */}
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-6 h-6 border border-default-200">
                            {item.invitedBy.avatar ? (
                              <AvatarImage src={item.invitedBy.avatar} alt={item.invitedBy.name} />
                            ) : null}
                            <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
                              {item.invitedBy.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-default-700 whitespace-nowrap">
                            {item.invitedBy.name}
                          </span>
                        </div>
                      </TableCell>

                      {/* Invitation Date */}
                      <TableCell className="whitespace-nowrap text-sm text-default-600">
                        {item.invitationDate}
                      </TableCell>

                      {/* Invitation Status */}
                      <TableCell className="whitespace-nowrap">
                        <Badge
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium border whitespace-nowrap capitalize",
                            statusBadgeColors[item.invitationStatus] ||
                              "bg-default-200 text-default-700"
                          )}
                        >
                          {item.invitationStatus}
                        </Badge>
                      </TableCell>

                      {/* Last Invitation Sent */}
                      <TableCell className="whitespace-nowrap text-sm text-default-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-default-400" />
                          <span>{item.lastInvitationSent}</span>
                        </div>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="whitespace-nowrap text-end">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleResend(item)}
                            className="h-8 text-xs font-semibold gap-1.5 border-default-200 hover:bg-primary/10 hover:text-primary"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Resend Invitation
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancel(item)}
                            className="h-8 text-xs font-semibold gap-1.5 border-default-200 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Cancel Invitation
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-default-500 text-xs"
                  >
                    No pending invitations found.
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
              {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-default-800">
              {Math.min(currentPage * pageSize, filtered.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-default-800">
              {filtered.length}
            </span>{" "}
            pending invitations
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
}
