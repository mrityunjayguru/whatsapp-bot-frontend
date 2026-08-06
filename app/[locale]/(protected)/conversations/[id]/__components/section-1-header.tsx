import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export const Section1Header = ({
  conversation,
  statusStyle,
  statusLabel,
  agentInitials,
  agentName,
}: any) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
          Section 1: Conversation Header
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Conversation No.
            </span>
            <span className="text-sm font-semibold text-default-800 truncate">
              #{conversation.conversationNo} 
            </span>
          </div>
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Status
            </span>
            <Badge
              className={cn(
                "rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap shrink-0",
                statusStyle
              )}
            >
              {statusLabel}
            </Badge>
          </div>
          <div className="flex items-baseline gap-2 min-w-0 col-span-2">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Title
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {conversation.title || "—"}
            </span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Assigned
            </span>
            <Link
              href="#"
              className="flex items-center gap-1.5 hover:underline min-w-0"
            >
              <Avatar className="h-5 w-5 shrink-0 bg-default-100 border border-default-200">
                {conversation.assignedTo?.image ? (
                  <AvatarImage src={conversation.assignedTo.image} />
                ) : (
                  <AvatarFallback className="text-[9px] text-default-700">
                    {agentInitials || "UN"}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-sm font-medium text-default-800 truncate">
                {agentName}
              </span>
            </Link>
          </div>
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Department
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {conversation.department || "—"}
            </span>
          </div>
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Created
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {conversation.createdDate || "—"}
            </span>
          </div>
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Last Activity
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {conversation.lastActivity || "—"}
            </span>
          </div>
        </div>

        <div className="pt-2 mt-1 border-t border-default-200">
          <div className="flex flex-wrap gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              Assign
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              Resolve
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              Close
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              Reopen
            </Button>
            {conversation.isChatbot && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
              >
                Take Over
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
