import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const Section6History = () => {
  return (
    <Card className="lg:col-span-2">
      <CardContent className="p-4 space-y-4">
        <div>
          <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
            Section 6: Conversation History
          </div>
          <div className="text-[11px] text-default-400 mt-0.5">
            Timeline of events and actions performed in this conversation
          </div>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-default-200">
          <div className="relative">
            <span className="absolute -left-[18px] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-default-400 ring-4 ring-background" />
            <div className="text-sm font-medium text-default-800">Conversation Started</div>
            <div className="text-xs text-default-400">Aug 4, 2026 09:30 AM</div>
          </div>
          <div className="relative">
            <span className="absolute -left-[18px] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
            <div className="text-sm font-medium text-default-800">Assigned to Rahul</div>
            <div className="text-xs text-default-400">Aug 4, 2026 09:31 AM</div>
          </div>
          <div className="relative">
            <span className="absolute -left-[18px] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-blue-500 ring-4 ring-background" />
            <div className="text-sm font-medium text-default-800">Tag Added</div>
            <div className="text-xs text-default-400">Aug 4, 2026 09:32 AM</div>
          </div>
          <div className="relative">
            <span className="absolute -left-[18px] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-amber-500 ring-4 ring-background" />
            <div className="text-sm font-medium text-default-800">Employee Changed</div>
            <div className="text-xs text-default-400">Aug 4, 2026 09:45 AM</div>
          </div>
          <div className="relative">
            <span className="absolute -left-[18px] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-background" />
            <div className="text-sm font-medium text-default-800">Resolved</div>
            <div className="text-xs text-default-400">Aug 4, 2026 10:15 AM</div>
          </div>
          <div className="relative">
            <span className="absolute -left-[18px] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-rose-500 ring-4 ring-background" />
            <div className="text-sm font-medium text-default-800">Reopened</div>
            <div className="text-xs text-default-400">Aug 4, 2026 10:30 AM</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
