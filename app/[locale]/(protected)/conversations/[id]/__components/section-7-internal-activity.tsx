import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Section7InternalActivity = ({ conversation }: any) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
            Section 7: Internal Activity
          </div>
          <div className="text-[11px] text-default-400 mt-0.5">
            Useful for audit.
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-24">
              Viewed By
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <Avatar className="h-5 w-5 shrink-0 bg-default-100 border border-default-200">
                {conversation.assignedTo?.image ? (
                  <AvatarImage src={conversation.assignedTo.image} />
                ) : (
                  <AvatarFallback className="text-[9px] text-default-700">R</AvatarFallback>
                )}
              </Avatar>
              <span className="text-xs font-medium text-default-800 truncate">
                Rahul
              </span>
              <span className="text-[10px] text-default-400">
                (Aug 4, 09:35 AM)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-24">
              Assigned By
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <Avatar className="h-5 w-5 shrink-0 bg-default-100 border border-default-200">
                <AvatarFallback className="text-[9px] text-default-700">SYS</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-default-800 truncate">
                System
              </span>
              <span className="text-[10px] text-default-400">
                (Aug 4, 09:31 AM)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-24">
              Resolved By
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <Avatar className="h-5 w-5 shrink-0 bg-default-100 border border-default-200">
                {conversation.assignedTo?.image ? (
                  <AvatarImage src={conversation.assignedTo.image} />
                ) : (
                  <AvatarFallback className="text-[9px] text-default-700">R</AvatarFallback>
                )}
              </Avatar>
              <span className="text-xs font-medium text-default-800 truncate">
                Rahul
              </span>
              <span className="text-[10px] text-default-400">
                (Aug 4, 10:15 AM)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-24">
              Closed By
            </span>
            <span className="text-xs font-medium text-default-800 truncate pr-1">
              —
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
