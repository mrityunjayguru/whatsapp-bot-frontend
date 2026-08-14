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
import { Eye, Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils";
import { Link } from "@/components/navigation";

export type DataProps = {
  id: string | number;
  conversationNo: string;
  profilename: string;
  phonenumber: string;
  title: string;
  customerName: string;
  customerImage: string;
  mobile: string;
  tags: string[];
  assignedTo: {
    name: string;
    image: string;
  };
  department: string;
  status: "open" | "in-progress" | "closed" | "pending" | string;
  createdDate: string;
  lastMessage: string;
  lastActivity: string;
  unread: number;
  isChatbot: boolean;
  action?: React.ReactNode;
  [key: string]: any;
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
    accessorKey: "conversationNo",
    header: "Conversation No.",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-default-700 whitespace-nowrap shrink-0">#{row.getValue("conversationNo")}</span>
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
    accessorKey: "mobile",
    header: "Mobile",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap shrink-0">{row.getValue("mobile")}</span>
    ),
    size: 160,
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
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => {
      const user = row.original.assignedTo;
      const initials = user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
      return (
        <div className="font-medium text-card-foreground/80 shrink-0">
          <div className="flex gap-2 items-center whitespace-nowrap">
            <Avatar
              className="rounded-full w-7 h-7 bg-transparent hover:bg-transparent shadow-none border-none shrink-0"
            >
              {user?.image ? (
                <AvatarImage src={user.image} />
              ) : (
                <AvatarFallback className="text-[10px]">{initials || "UN"}</AvatarFallback>
              )}
            </Avatar>
            <span className="text-sm text-default-700 whitespace-nowrap">
              {user?.name ?? "Unassigned"}
            </span>
          </div>
        </div>
      )
    },
    size: 190,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColors: Record<string, string> = {
        open: "bg-blue-500/15 text-blue-600 border-blue-500/20",
        "in-progress": "bg-amber-500/15 text-amber-600 border-amber-500/20",
        closed: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
        pending: "bg-default-300/40 text-default-700 border-default-300"
      };
      const statusLabels: Record<string, string> = {
        open: "Open",
        "in-progress": "In Progress",
        closed: "Closed",
        pending: "Pending"
      };
      const status = row.getValue<string>("status");
      const statusStyles = statusColors[status] || "bg-default-200 text-default-700";
      const statusLabel = statusLabels[status] || status;
      return (
        <Badge
          className={cn("rounded-full px-3 py-1 text-xs font-medium border whitespace-nowrap shrink-0", statusStyles)}
        >
          {statusLabel}
        </Badge>
      );
    },
    size: 130,
  },
  {
    accessorKey: "lastMessage",
    header: "Last Message",
    cell: ({ row }) => {
      const message = row.getValue<string>("lastMessage") || "";
      return (
        <span
          className="text-sm text-default-600 whitespace-nowrap text-ellipsis overflow-hidden block shrink-0"
          style={{ maxWidth: 320, minWidth: 320 }}
          title={message}
        >
          {message}
        </span>
      )
    },
    size: 320,
  },
  {
    accessorKey: "lastActivity",
    header: "Last Activity",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap shrink-0">{row.getValue("lastActivity")}</span>
    ),
    size: 160,
  },
  {
    accessorKey: "unread",
    header: "Unread",
    cell: ({ row }) => {
      const count = row.getValue<number>("unread") || 0;
      return (
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          {count > 0 ? (
            <>
              <Bell className="w-4 h-4 text-blue-500 shrink-0" />
              <Badge className="rounded-full bg-blue-500 text-white text-xs font-semibold min-w-[22px] h-[22px] flex items-center justify-center px-1.5 whitespace-nowrap shrink-0">
                {count}
              </Badge>
            </>
          ) : (
            <span className="text-sm text-default-400 whitespace-nowrap">—</span>
          )}
        </div>
      )
    },
    size: 100,
  },
  {
    id: "actions",
    accessorKey: "action",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const convId = row.original.phonenumber;
      
      return (
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/conversations/${convId}`}>
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
                <p>View Conversation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    },
    size: 90,
  }
]
