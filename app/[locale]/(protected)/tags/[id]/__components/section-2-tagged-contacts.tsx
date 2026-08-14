"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Link } from "@/components/navigation";
import { cn } from "@/lib/utils";
import TablePagination from "@/app/[locale]/(protected)/contacts/contacts-table/table-pagination";

export type TaggedContactProps = {
  id: string | number;
  contactId: string;
  customerName: string;
  customerImage?: string;
  whatsappName: string;
  mobile: string;
  email: string;
  otherTags: string[];
  lastConversation: string;
  createdAt: string;
};

const tagColors: Record<string, string> = {
  VIP: "bg-amber-500/15 text-amber-600",
  Priority: "bg-red-500/15 text-red-600",
  Support: "bg-blue-500/15 text-blue-600",
  Sales: "bg-emerald-500/15 text-emerald-600",
  New: "bg-purple-500/15 text-purple-600",
  Returning: "bg-cyan-500/15 text-cyan-600",
};

const mockContacts: TaggedContactProps[] = [
  {
    id: "1",
    contactId: "CUS-1001",
    customerName: "Jenny Wilson",
    customerImage: "/images/avatar/avatar-1.png",
    whatsappName: "Jenny W",
    mobile: "+1 (555) 123-4567",
    email: "jenny@example.com",
    otherTags: ["VIP", "Priority"],
    lastConversation: "2 minutes ago",
    createdAt: "Aug 3, 2026 09:12 AM",
  },
  {
    id: "2",
    contactId: "CUS-1002",
    customerName: "Emily Davis",
    customerImage: "/images/avatar/avatar-2.png",
    whatsappName: "Emily",
    mobile: "+44 20 7946 0958",
    email: "emily@example.com",
    otherTags: ["Support"],
    lastConversation: "5 minutes ago",
    createdAt: "Aug 3, 2026 10:45 AM",
  },
  {
    id: "3",
    contactId: "CUS-1003",
    customerName: "Laura Smith",
    customerImage: "/images/avatar/avatar-3.png",
    whatsappName: "Laura S",
    mobile: "+61 2 9876 5432",
    email: "laura@example.com",
    otherTags: ["Sales", "New"],
    lastConversation: "12 minutes ago",
    createdAt: "Aug 3, 2026 02:30 PM",
  },
  {
    id: "4",
    contactId: "CUS-1004",
    customerName: "Sarah Johnson",
    customerImage: "/images/avatar/avatar-4.png",
    whatsappName: "Sarah J",
    mobile: "+33 1 23 45 67 89",
    email: "sarah@example.com",
    otherTags: ["Returning"],
    lastConversation: "28 minutes ago",
    createdAt: "Aug 4, 2026 08:05 AM",
  },
  {
    id: "5",
    contactId: "CUS-1005",
    customerName: "Rachel Brown",
    customerImage: "/images/avatar/avatar-5.png",
    whatsappName: "Rachel",
    mobile: "+81 3-1234-5678",
    email: "rachel@example.com",
    otherTags: ["VIP"],
    lastConversation: "1 hour ago",
    createdAt: "Aug 4, 2026 11:20 AM",
  },
];

export const columns: ColumnDef<TaggedContactProps>[] = [
  {
    accessorKey: "contactId",
    header: "Contact ID",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-default-700 whitespace-nowrap">
        #{row.getValue("contactId")}
      </span>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
    cell: ({ row }) => {
      const name = row.getValue<string>("customerName");
      const image = row.original.customerImage;
      const initials = name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
      return (
        <div className="flex gap-2.5 items-center whitespace-nowrap">
          <Avatar className="rounded-full w-7 h-7 shrink-0">
            {image && <AvatarImage src={image} alt={name} />}
            <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-default-700 font-medium">
            {name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "whatsappName",
    header: "WhatsApp Profile Name",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap">
        {row.getValue("whatsappName")}
      </span>
    ),
  },
  {
    accessorKey: "mobile",
    header: "Mobile Number",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap">
        {row.getValue("mobile")}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap">
        {row.getValue("email")}
      </span>
    ),
  },
  {
    accessorKey: "otherTags",
    header: "Other Tags",
    cell: ({ row }) => {
      const tags: string[] = row.getValue("otherTags") || [];
      return (
        <div className="flex flex-nowrap gap-1.5 whitespace-nowrap">
          {tags.map((tag, idx) => (
            <Badge
              key={idx}
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 border-0",
                tagColors[tag] || "bg-default-200 text-default-700"
              )}
            >
              {tag}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "lastConversation",
    header: "Last Conversation",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap">
        {row.getValue("lastConversation")}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Contact Created At",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap">
        {row.getValue("createdAt")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Link href={`/contacts/${id}`}>
          <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 ring-offset-transparent !border !border-default-200 text-default-600 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors shrink-0 bg-background"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
          </Link>
        </div>
      );
    },
  },
];

export const Section2TaggedContacts = () => {
  const table = useReactTable({
    data: mockContacts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
            Section 2: Tagged Contacts
          </div>
          <div className="text-sm text-default-600 mt-1">
            Show all contacts to whom this tag has been assigned.
          </div>
        </div>

        <div className="rounded-md border border-default-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-default-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-xs font-semibold text-default-700">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-default-500 text-sm"
                  >
                    No contacts found for this tag.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <TablePagination table={table} />
      </CardContent>
    </Card>
  );
};
