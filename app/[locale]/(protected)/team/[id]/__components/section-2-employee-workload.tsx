"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmployeeProps } from "../../team-table/columns";
import {
  Briefcase,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Inbox,
  TrendingUp,
  MessageCircle,
} from "lucide-react";

interface Section2EmployeeWorkloadProps {
  employee: EmployeeProps;
  onViewTotalAssigned?: () => void;
}

export const Section2EmployeeWorkload = ({
  employee,
  onViewTotalAssigned,
}: Section2EmployeeWorkloadProps) => {
  // Demo workload stats calculated or derived from employee props
  const totalAssigned = employee.assignedConversations || 24;
  const openConvs = Math.round(totalAssigned * 0.35);
  const pendingConvs = Math.round(totalAssigned * 0.15);
  const resolvedConvs = employee.resolvedConversations || 142;
  const closedConvs = Math.round(totalAssigned * 0.4);
  const unassignedConvs = 0;

  return (
    <Card className="shadow-sm border border-default-200 h-full">
      <CardContent className="p-5 space-y-4 flex flex-col justify-between h-full">
        <div className="space-y-4">
          {/* Header Title */}
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-default-500 uppercase tracking-wider flex items-center gap-1.5">
              
              SECTION 2: Employee Workload
            </div>
          </div>

          {/* Featured Highlight Card: Total Assigned Conversations */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 p-4 transition-all">
            <img
              src="/images/all-img/shade-1.png"
              alt="Shade pattern"
              draggable="false"
              className="absolute top-0 right-0 w-3/4 h-full object-cover opacity-30 pointer-events-none"
            />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-default-600 uppercase tracking-wide flex items-center gap-1.5">
                  Total Assigned Conversations
                </div>
                <div className="text-3xl font-extrabold text-default-900 mt-1">
                  {totalAssigned}
                </div>
              </div>

              <button
                type="button"
                onClick={onViewTotalAssigned}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary px-3 py-1.5 rounded-lg underline cursor-pointer transition-all transform active:scale-95"
              >
                View
              </button>
            </div>
          </div>

          {/* Workload Metric List */}
          <div className="space-y-2.5 pt-1">
            {/* Open Conversations */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-default-200/80 bg-background hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-blue-500/15 text-blue-600">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-default-700">
                  Open Conversations
                </span>
              </div>
              <p className=" border-blue-500/20 font-bold px-2.5 py-0.5 text-xs">
                {openConvs}
              </p>
            </div>

            {/* Pending Conversations */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-default-200/80 bg-background hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-amber-500/15 text-amber-600">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-default-700">
                  Pending Conversations
                </span>
              </div>
              <p className=" font-bold px-2.5 py-0.5 text-xs">
                {pendingConvs}
              </p>
            </div>

            {/* Resolved Conversations */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-default-200/80 bg-background hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-emerald-500/15 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-default-700">
                  Resolved Conversations
                </span>
              </div>
              <p className="font-bold px-2.5 py-0.5 text-xs">
                {resolvedConvs}
              </p>
            </div>

            {/* Closed Conversations */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-default-200/80 bg-background hover:bg-default-100 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-default-200 text-default-700">
                  <XCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-default-700">
                  Closed Conversations
                </span>
              </div>
              <p className=" font-bold px-2.5 py-0.5 text-xs">
                {closedConvs}
              </p>
            </div>

            {/* Unassigned Conversations */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-default-200/80 bg-background hover:bg-default-100 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-default-200/60 text-default-500">
                  <Inbox className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-default-600">
                  Unassigned Conversations
                </span>
              </div>
              <p className=" font-bold px-2.5 py-0.5 text-xs">
                {unassignedConvs}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
