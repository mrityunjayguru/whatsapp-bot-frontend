"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/components/navigation";
import { cn } from "@/lib/utils";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const statusColors: Record<string, string> = {
  open: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  "in-progress": "bg-amber-500/15 text-amber-600 border-amber-500/20",
  closed: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  pending: "bg-default-300/40 text-default-700 border-default-300",
};
const statusLabels: Record<string, string> = {
  open: "Open",
  "in-progress": "In Progress",
  closed: "Closed",
  pending: "Pending",
};

type ConvRow = {
  id: string | number;
  conversationNo: string;
  title: string;
  assignedTo: { name: string; image: string };
  status: string;
  createdDate: string;
  lastActivity: string;
  action?: React.ReactNode;
};

const columns: ColumnDef<ConvRow>[] = [
  {
    accessorKey: "conversationNo",
    header: "Conversation No.",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-default-700 whitespace-nowrap">
        #{row.getValue("conversationNo")}
      </span>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="text-sm text-default-700 whitespace-nowrap block max-w-[200px] truncate">
        {row.getValue("title")}
      </span>
    ),
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => {
      const user = row.original.assignedTo;
      const initials = user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
      return (
        <div className="flex gap-2 items-center whitespace-nowrap">
          <Avatar className="rounded-full w-7 h-7 bg-transparent shadow-none border-none shrink-0">
            {user?.image ? (
              <AvatarImage src={user.image} />
            ) : (
              <AvatarFallback className="text-[10px] bg-default-200 text-default-700 rounded-full h-7 w-7">
                {initials || "UN"}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm text-default-700">{user?.name ?? "Unassigned"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      return (
        <Badge
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium border whitespace-nowrap",
            statusColors[status] || "bg-default-200 text-default-700"
          )}
        >
          {statusLabels[status] || status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdDate",
    header: "Started",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap">
        {row.getValue("createdDate")}
      </span>
    ),
  },
  {
    accessorKey: "lastActivity",
    header: "Last Activity",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap">
        {row.getValue("lastActivity")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const convId = row.original.id;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/conversations/${convId}`}>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 !border !border-default-200 text-default-500 hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/5 bg-background hover:ring-0"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>View Conversation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];

// Mock conversations for this contact — in production, filter by contactId
const mockConversations: ConvRow[] = [
  {
    id: 1,
    conversationNo: "CONV-10001",
    title: "Order refund request for ORD-28471",
    assignedTo: { name: "Sarah Kim", image: "" },
    status: "open",
    createdDate: "Aug 3, 2026",
    lastActivity: "2 mins ago",
  },
  {
    id: 2,
    conversationNo: "CONV-09887",
    title: "Damaged product replacement query",
    assignedTo: { name: "Michael Chen", image: "" },
    status: "in-progress",
    createdDate: "Jul 28, 2026",
    lastActivity: "1 day ago",
  },
  {
    id: 3,
    conversationNo: "CONV-09650",
    title: "Shipping delay follow-up",
    assignedTo: { name: "Emily Rodriguez", image: "" },
    status: "closed",
    createdDate: "Jul 20, 2026",
    lastActivity: "Jul 21, 2026",
  },
  {
    id: 4,
    conversationNo: "CONV-09412",
    title: "Custom engraving design approval",
    assignedTo: { name: "David Patel", image: "" },
    status: "closed",
    createdDate: "Jul 14, 2026",
    lastActivity: "Jul 16, 2026",
  },
  {
    id: 5,
    conversationNo: "CONV-09100",
    title: "Invoice dispute for INV-8821",
    assignedTo: { name: "Sarah Kim", image: "" },
    status: "pending",
    createdDate: "Jul 5, 2026",
    lastActivity: "Jul 8, 2026",
  },
  {
    id: 6,
    conversationNo: "CONV-08791",
    title: "Subscription upgrade assistance",
    assignedTo: { name: "Jessica Brown", image: "" },
    status: "closed",
    createdDate: "Jun 25, 2026",
    lastActivity: "Jun 26, 2026",
  },
];

export const Section2ConversationHistory = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: mockConversations,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 5 } },
    state: { sorting },
  });

  return (
    <Card>
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-default-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-default-800">
              Conversation History
            </span>
            <Badge className="rounded-full h-5 min-w-[22px] px-1.5 text-[10px] font-semibold bg-default-200 text-default-700">
              {mockConversations.length}
            </Badge>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-default-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-xs font-semibold text-default-600 whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-default-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2.5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-default-400">
                    No conversations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between py-3 px-4 border-t border-default-200">
          <div className="text-xs text-default-500">
            {table.getFilteredRowModel().rows.length} total conversation(s)
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="w-7 h-7 !border !border-default-200 bg-background hover:ring-0"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            {table.getPageOptions().map((page, pageIndex) => (
              <Button
                key={pageIndex}
                onClick={() => table.setPageIndex(pageIndex)}
                size="icon"
                className="w-7 h-7 text-xs"
                variant={
                  table.getState().pagination.pageIndex === pageIndex
                    ? "default"
                    : "outline"
                }
              >
                {page + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="w-7 h-7 !border !border-default-200 bg-background hover:ring-0"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
