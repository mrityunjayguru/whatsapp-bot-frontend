"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FAQDataProps } from "./data";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Eye,
  SquarePen,
  Power,
  Trash2,
  ExternalLink,
  Paperclip,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/components/navigation";
import { openPdfInNewTab } from "@/lib/pdf-utils";

// Tag & Keyword styling per Conversations / Contacts page pattern
const keywordColors: Record<string, string> = {
  Onboarding: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  Setup: "bg-purple-500/15 text-purple-600 border-purple-500/20",
  Quickstart: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  Password: "bg-amber-500/15 text-amber-600 border-amber-500/20",
  Security: "bg-red-500/15 text-red-600 border-red-500/20",
  "2FA": "bg-rose-500/15 text-rose-600 border-rose-500/20",
  Payments: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  Visa: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  PayPal: "bg-cyan-500/15 text-cyan-600 border-cyan-500/20",
  Invoices: "bg-indigo-500/15 text-indigo-600 border-indigo-500/20",
  API: "bg-cyan-500/15 text-cyan-600 border-cyan-500/20",
  Tokens: "bg-purple-500/15 text-purple-600 border-purple-500/20",
  REST: "bg-teal-500/15 text-teal-600 border-teal-500/20",
  SDK: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  Webhooks: "bg-pink-500/15 text-pink-600 border-pink-500/20",
  Events: "bg-amber-500/15 text-amber-600 border-amber-500/20",
  Payloads: "bg-indigo-500/15 text-indigo-600 border-indigo-500/20",
  Theme: "bg-purple-500/15 text-purple-600 border-purple-500/20",
  Customizer: "bg-sky-500/15 text-sky-600 border-sky-500/20",
  "Dark Mode": "bg-slate-500/15 text-slate-600 border-slate-500/20",
  Team: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  Roles: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  Permissions: "bg-amber-500/15 text-amber-600 border-amber-500/20",
  RBAC: "bg-red-500/15 text-red-600 border-red-500/20",
};

const matchTypeColors: Record<string, string> = {
  "Exact Match": "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  "Partial Match": "bg-blue-500/15 text-blue-600 border-blue-500/20",
  "AI Semantic": "bg-purple-500/15 text-purple-600 border-purple-500/20",
  "Keyword Match": "bg-amber-500/15 text-amber-600 border-amber-500/20",
};

const priorityColors: Record<string, string> = {
  High: "bg-red-500/15 text-red-600 border-red-500/20",
  Medium: "bg-amber-500/15 text-amber-600 border-amber-500/20",
  Low: "bg-default-200 text-default-700 border-default-300",
};

export const getColumns = ({
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}: {
  onView?: (faq: FAQDataProps) => void;
  onEdit: (faq: FAQDataProps) => void;
  onToggleStatus: (faq: FAQDataProps) => void;
  onDelete: (faq: FAQDataProps) => void;
}): ColumnDef<FAQDataProps>[] => [
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
    accessorKey: "faqId",
    header: "FAQ ID",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-default-700 whitespace-nowrap shrink-0">
        #{row.getValue("faqId")}
      </span>
    ),
    size: 130,
  },
  {
    accessorKey: "question",
    header: "Question",
    cell: ({ row }) => (
      <div className="min-w-[240px] shrink-0">
        <Link href={`/faqs/${row.original.id}`}>
          <span className="text-sm font-medium text-default-900 hover:text-primary transition-colors cursor-pointer block line-clamp-2">
            {row.getValue("question")}
          </span>
        </Link>
      </div>
    ),
    size: 260,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge
        color="secondary"
        className="rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap shrink-0 border border-default-200"
      >
        {row.getValue("category")}
      </Badge>
    ),
    size: 160,
  },
  {
    accessorKey: "keywords",
    header: "Keywords",
    cell: ({ row }) => {
      const keywords: string[] = row.getValue("keywords") || [];
      return (
        <div className="flex flex-nowrap gap-1.5 whitespace-nowrap shrink-0">
          {keywords.map((kw, idx) => (
            <Badge
              key={idx}
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium border whitespace-nowrap shrink-0",
                keywordColors[kw] ||
                  "bg-default-200 text-default-700 border-default-300",
              )}
            >
              #{kw}
            </Badge>
          ))}
        </div>
      );
    },
    size: 240,
  },
  {
    accessorKey: "answerPreview",
    header: "Answer Preview",
    cell: ({ row }) => (
      <span
        className="text-sm text-default-600 whitespace-nowrap text-ellipsis overflow-hidden block shrink-0"
        style={{ maxWidth: 300, minWidth: 260 }}
        title={row.original.fullAnswer || row.getValue("answerPreview")}
      >
        {row.getValue("answerPreview")}
      </span>
    ),
    size: 300,
  },
  {
    accessorKey: "attachment",
    header: "Attachment",
    cell: ({ row }) => {
      const att = row.getValue<string | null>("attachment");
      if (!att)
        return (
          <span className="text-sm text-default-400 whitespace-nowrap shrink-0">
            —
          </span>
        );
      const displayName = att.includes("/") ? att.split("/").pop() || att : att;
      return (
        <div className="flex items-center gap-1.5 text-sm text-primary font-medium whitespace-nowrap shrink-0">
          <Paperclip className="w-4 h-4 shrink-0" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openPdfInNewTab(att);
            }}
            className="truncate max-w-[120px] lowercase text-primary font-medium hover:underline text-left cursor-pointer"
          >
            {displayName}
          </button>
        </div>
      );
    },
    size: 150,
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => {
      const url = row.getValue<string>("url");
      if (!url)
        return (
          <span className="text-sm text-default-400 whitespace-nowrap shrink-0">
            —
          </span>
        );
      return (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-sm text-blue-500 hover:underline whitespace-nowrap shrink-0"
        >
          <span>Docs Link</span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        </a>
      );
    },
    size: 130,
  },
  {
    accessorKey: "matchType",
    header: "Match Type",
    cell: ({ row }) => {
      const val = row.getValue<string>("matchType");
      return (
        <Badge
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium border whitespace-nowrap shrink-0",
            matchTypeColors[val] || "bg-default-200 text-default-700",
          )}
        >
          {val}
        </Badge>
      );
    },
    size: 140,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const prio = row.getValue<string>("priority");
      return (
        <Badge
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium border whitespace-nowrap shrink-0",
            priorityColors[prio] || "bg-default-200 text-default-700",
          )}
        >
          {prio}
        </Badge>
      );
    },
    size: 120,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      const isActive = status === "Active";
      return (
        <Badge
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium border whitespace-nowrap shrink-0",
            isActive
              ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20"
              : "bg-default-300/40 text-default-700 border-default-300",
          )}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
    size: 120,
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => {
      const author = row.original.createdBy;
      const initials = author.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
      return (
        <div className="font-medium text-card-foreground/80 shrink-0">
          <div className="flex gap-3 items-center whitespace-nowrap">
            <Avatar className="rounded-full w-8 h-8 bg-transparent hover:bg-transparent shadow-none border-none shrink-0">
              {author.avatar ? (
                <AvatarImage src={author.avatar} />
              ) : (
                <AvatarFallback>{initials || "KM"}</AvatarFallback>
              )}
            </Avatar>
            <span className="text-sm text-default-700 whitespace-nowrap font-medium">
              {author.name}
            </span>
          </div>
        </div>
      );
    },
    size: 200,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap shrink-0">
        {row.getValue("createdAt")}
      </span>
    ),
    size: 140,
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap shrink-0">
        {row.getValue("updatedAt")}
      </span>
    ),
    size: 140,
  },
  {
    id: "actions",
    accessorKey: "action",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const faq = row.original;
      return (
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          {/* View Action Button OUT on table row linking to /faqs/${faq.id} */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/faqs/${faq.id}`}>
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
                <p>View FAQ Details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Other actions (Edit, Activate/Deactivate, Delete) IN DropdownMenu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 !border !border-default-200 text-default-500 hover:bg-default-100 shadow-none shrink-0"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-default-500">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onEdit(faq)}
                className="gap-2 cursor-pointer text-xs"
              >
                <SquarePen className="w-3.5 h-3.5 text-amber-500" />
                <span>Edit FAQ</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleStatus(faq)}
                className="gap-2 cursor-pointer text-xs"
              >
                <Power className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  {faq.status === "Active" ? "Deactivate" : "Activate"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(faq)}
                className="gap-2 cursor-pointer text-xs text-destructive focus:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    size: 100,
  },
];
