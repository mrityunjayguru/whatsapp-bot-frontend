"use client"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  ColumnDef,
} from "@tanstack/react-table"
import { Eye, Bell, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils";
import { Link } from "@/components/navigation";

export type DataProps = {
  id: string | number;
  contactId: string;
  customerName: string;
  customerImage: string;
  whatsappName: string;
  mobile: string;
  email: string;
  tags: string[];
  totalConversations: number;
  lastConversation: string;
  createdAt: string;
  action: React.ReactNode;
}

const tagColors: Record<string, string> = {
  "VIP": "bg-amber-500/15 text-amber-600",
  "Priority": "bg-red-500/15 text-red-600",
  "Support": "bg-blue-500/15 text-blue-600",
  "Sales": "bg-emerald-500/15 text-emerald-600",
  "New": "bg-purple-500/15 text-purple-600",
  "Returning": "bg-cyan-500/15 text-cyan-600",
}

export const columns: ColumnDef<DataProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div className="w-16 shrink-0">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 64,
  },
  {
    accessorKey: "contactId",
    header: "Contact ID",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-default-700 whitespace-nowrap shrink-0">#{row.getValue("contactId")}</span>
    ),
    size: 150,
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
    cell: ({ row }) => {
      const name = row.getValue<string>("customerName");
      const image = row.original.customerImage;
      const initials = name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
      return (
        <div className="font-medium text-card-foreground/80 shrink-0">
          <div className="flex gap-3 items-center whitespace-nowrap">
            <Avatar
              className="rounded-full w-8 h-8 bg-transparent hover:bg-transparent shadow-none border-none shrink-0"
            >
              {image ? (
                <AvatarImage src={image} />
              ) : (
                <AvatarFallback>{initials || "AB"}</AvatarFallback>
              )}
            </Avatar>
            <span className="text-sm text-default-700 whitespace-nowrap font-medium">
              {name ?? "Unknown Customer"}
            </span>
          </div>
        </div>
      )
    },
    size: 200,
  },
  {
    accessorKey: "whatsappName",
    header: "WhatsApp Name",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap shrink-0">{row.getValue("whatsappName")}</span>
    ),
    size: 160,
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap shrink-0">{row.getValue("mobile")}</span>
    ),
    size: 160,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap shrink-0">{row.getValue("email")}</span>
    ),
    size: 220,
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags: string[] = row.getValue("tags") || [];
      return (
        <div className="flex flex-nowrap gap-1.5 whitespace-nowrap shrink-0">
          {tags.map((tag, idx) => (
            <Badge
              key={idx}
              className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap shrink-0", tagColors[tag] || "bg-default-200 text-default-700")}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )
    },
    size: 220,
  },
  {
    accessorKey: "totalConversations",
    header: "Total Conversations",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap shrink-0">{row.getValue("totalConversations")} Conversations</span>
    ),
    size: 150,
  },
  {
    accessorKey: "lastConversation",
    header: "Last Conversation",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap shrink-0">{row.getValue("lastConversation")}</span>
    ),
    size: 160,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap shrink-0">{row.getValue("createdAt")}</span>
    ),
    size: 180,
  },
  {
    id: "actions",
    accessorKey: "action",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const convId = row.original.id;
      return (
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/contacts/${convId}`}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 ring-offset-transparent !border !border-default-200 text-default-500 hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/5 transition-colors shrink-0 bg-background hover:ring-0 hover:ring-transparent"
                    color="secondary"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>View Contact</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    },
    size: 90,
  }
]
