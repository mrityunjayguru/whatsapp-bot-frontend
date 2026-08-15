"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "@/components/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bot,
  Settings,
  Phone,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatbotDataProps } from "./data";

interface ColumnCallbacks {
  onOpenSettings?: (bot: ChatbotDataProps) => void;
  onOpenTest: (bot: ChatbotDataProps) => void;
  onToggleEnable: (botId: string, enabled: boolean) => void;
  onToggleHandover: (botId: string, handover: boolean) => void;
}

export const getChatbotColumns = (
  callbacks: ColumnCallbacks
): ColumnDef<ChatbotDataProps>[] => [
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
    accessorKey: "chatbotId",
    header: "Chatbot ID",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-default-700 whitespace-nowrap shrink-0">
        #{row.getValue("chatbotId")}
      </span>
    ),
    size: 110,
  },
  {
    accessorKey: "name",
    header: "Chatbot Name",
    cell: ({ row }) => {
      const bot = row.original;
      return (
        <Link
          href={`/chatbot/${bot.id}`}
          className="group flex items-center gap-3 cursor-pointer py-1 max-w-[280px]"
        >
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-default-800 group-hover:text-primary transition-colors truncate">
              {bot.name}
            </span>
            <span className="text-xs text-default-500 truncate">
              {bot.description}
            </span>
          </div>
        </Link>
      );
    },
    size: 260,
  },
  {
    accessorKey: "enabled",
    header: "Enable / Disable",
    cell: ({ row }) => {
      const bot = row.original;
      return (
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <Switch
            checked={bot.enabled}
            onCheckedChange={(checked) => callbacks.onToggleEnable(bot.id, checked)}
            color="primary"
            size="sm"
          />
          <span className={cn("text-xs font-medium", bot.enabled ? "text-emerald-600 dark:text-emerald-400" : "text-default-400")}>
            {bot.enabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      );
    },
    size: 150,
  },
  {
    accessorKey: "whatsappNumber",
    header: "Connected WhatsApp Number",
    cell: ({ row }) => {
      const number = row.getValue<string>("whatsappNumber");
      return (
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0 text-sm text-default-600">
          <span>{number}</span>
        </div>
      );
    },
    size: 210,
  },
  {
    accessorKey: "status",
    header: "Chatbot Status",
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      const isActive = status === "Active";
      return (
        <Badge
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 border-0",
            isActive
              ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
              : "bg-slate-500/15 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400"
          )}
        >
          <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5 inline-block", isActive ? "bg-emerald-500" : "bg-slate-400")} />
          {status}
        </Badge>
      );
    },
    size: 140,
  },
  {
    accessorKey: "currentMode",
    header: "Current Mode",
    cell: ({ row }) => {
      const mode = row.getValue<string>("currentMode");
      const modeStyles: Record<string, string> = {
        Chatbot: "bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
        Human: "bg-purple-500/15 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
        Hybrid: "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
      };
      return (
        <Badge
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 border-0",
            modeStyles[mode] || "bg-default-200 text-default-700"
          )}
        >
          {mode}
        </Badge>
      );
    },
    size: 130,
  },
  {
    accessorKey: "humanHandoverEnabled",
    header: "Human Handover",
    cell: ({ row }) => {
      const bot = row.original;
      return (
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <Switch
            checked={bot.humanHandoverEnabled}
            onCheckedChange={(checked) => callbacks.onToggleHandover(bot.id, checked)}
            color="primary"
            size="sm"
          />
          <span className="text-xs text-default-600 font-medium">
            {bot.humanHandoverEnabled ? "Yes" : "No"}
          </span>
        </div>
      );
    },
    size: 150,
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap shrink-0">
        {row.getValue("createdAt")}
      </span>
    ),
    size: 170,
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const bot = row.original;
      return (
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">


          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/chatbot/${bot.id}`}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-default-200 text-default-500 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors shrink-0 bg-background"
                >
                  <Settings className="w-4 h-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Open Chatbot Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    size: 110,
  },
];
