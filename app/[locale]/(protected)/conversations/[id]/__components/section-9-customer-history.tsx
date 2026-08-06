import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Section9CustomerHistory = () => {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
            Section 9: Customer History
          </div>
          <div className="text-[11px] text-default-400 mt-0.5">
            Previous Conversations
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 bg-default-50 rounded-lg border border-default-100">
            <div className="text-[10px] font-medium text-default-500 uppercase tracking-wider">Conversation Count</div>
            <div className="text-lg font-bold text-default-800 mt-0.5">5</div>
          </div>
          <div className="p-2 bg-default-50 rounded-lg border border-default-100">
            <div className="text-[10px] font-medium text-default-500 uppercase tracking-wider">Last Conversation</div>
            <div className="text-sm font-semibold text-default-800 mt-1">#1024</div>
          </div>
        </div>

        <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 no-scrollbar">
          <div className="flex items-center justify-between p-2 rounded-lg bg-default-50 border border-default-100">
            <div className="min-w-0">
              <div className="text-xs font-medium text-default-800 truncate">#1024 - Order Delay</div>
              <div className="text-[10px] text-default-400 mt-0.5">Resolved • Aug 2, 2026</div>
            </div>
            <Badge className="bg-emerald-500/15 text-emerald-600 border border-emerald-500/20 text-[9px] px-1 py-0 rounded-full font-normal shrink-0">Resolved</Badge>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-default-50 border border-default-100">
            <div className="min-w-0">
              <div className="text-xs font-medium text-default-800 truncate">#1011 - Size Chart Enquiry</div>
              <div className="text-[10px] text-default-400 mt-0.5">Closed • Jul 28, 2026</div>
            </div>
            <Badge className="bg-default-300/40 text-default-700 border border-default-300 text-[9px] px-1 py-0 rounded-full font-normal shrink-0">Closed</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
