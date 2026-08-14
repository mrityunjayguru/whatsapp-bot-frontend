"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Tag, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "@/components/navigation";
import { TagProps } from "./data";

const tagColors: Record<string, string> = {
  "VIP Customer": "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
  "Priority Lead": "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20",
  "Support Escalation": "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
  "Sales Qualified": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  "New Sign-up": "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20",
  "Returning Buyer": "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
  "Wholesale Partner": "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
  "Beta Tester": "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/20",
  "Churn Risk": "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/20",
  "Webinar Attendee": "bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/20",
};

interface GetColumnsProps {
  onView?: (tag: TagProps) => void;
}

export const getColumns = ({}: GetColumnsProps = {}): ColumnDef<TagProps>[] => [
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
      <div className="w-12 shrink-0">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 48,
  },
  {
    accessorKey: "tagId",
    header: "Tag ID",
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-default-700 whitespace-nowrap shrink-0">
        #{row.getValue("tagId")}
      </span>
    ),
    size: 110,
  },
  {
    accessorKey: "tagName",
    header: "Tag Name",
    cell: ({ row }) => {
      const tagName = row.getValue<string>("tagName");
      const colorStyle = tagColors[tagName] || "bg-default-200 text-default-800 border-default-300";
      return (
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <Badge
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-md border flex items-center gap-1.5 shrink-0",
              colorStyle
            )}
          >
            <Tag className="w-3.5 h-3.5 shrink-0" />
            {tagName}
          </Badge>
        </div>
      );
    },
    size: 180,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span
        className="text-sm text-default-600 truncate max-w-[260px] inline-block align-middle"
        title={row.getValue("description")}
      >
        {row.getValue("description")}
      </span>
    ),
    size: 260,
  },
  {
    accessorKey: "numberOfContacts",
    header: "Number of Contacts",
    cell: ({ row }) => {
      const count: number = row.getValue("numberOfContacts");
      return (
        <div className="flex items-center gap-1.5 text-sm text-default-700 font-medium whitespace-nowrap shrink-0">
          <Users className="w-4 h-4 text-default-400 shrink-0" />
          <span>{count} Contacts</span>
        </div>
      );
    },
    size: 160,
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => {
      const name = row.getValue<string>("createdBy");
      const avatar = row.original.createdByAvatar;
      const initials = name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return (
        <div className="flex gap-2.5 items-center whitespace-nowrap shrink-0">
          <Avatar className="rounded-full w-7 h-7 shrink-0">
            {avatar && <AvatarImage src={avatar} alt={name} />}
            <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-default-700 font-medium whitespace-nowrap">
            {name}
          </span>
        </div>
      );
    },
    size: 170,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap shrink-0">
        {row.getValue("createdAt")}
      </span>
    ),
    size: 170,
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap shrink-0">
        {row.getValue("updatedAt")}
      </span>
    ),
    size: 170,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: "Active" | "Inactive" = row.getValue("status");
      const isActive = status === "Active";

      return (
        <Badge
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shrink-0 border-0",
            isActive
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-default-200 text-default-600"
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full me-1.5 inline-block",
              isActive ? "bg-emerald-500" : "bg-default-400"
            )}
          />
          {status}
        </Badge>
      );
    },
    size: 110,
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const tag = row.original;
      return (
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/tags/${tag.id}`}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 ring-offset-transparent !border !border-default-200 text-default-600 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors shrink-0 bg-background"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>View Tag Details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    size: 90,
  },
];
