"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EmployeeProps } from "../../team-table/columns";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  bgClass: string;
  valueClass: string;
  shade: string;
  isDate?: boolean;
}

function StatCard({
  label,
  value,
  bgClass,
  valueClass,
  shade,
  isDate,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-none shadow-none rounded-lg",
        bgClass
      )}
    >
      <CardContent className="p-4 flex flex-col justify-between min-h-[140px]">
        <img
          src={`/images/all-img/${shade}.png`}
          alt=""
          draggable="false"
          className="absolute top-0 start-0 w-full h-full object-contain pointer-events-none"
        />
        <div className="mb-4 text-xs font-semibold text-default-700 uppercase tracking-wide z-10 leading-snug">
          {label}
        </div>
        <div
          className={cn(
            "font-bold mb-4 z-10",
            isDate ? "text-sm leading-tight" : "text-3xl lg:text-4xl",
            valueClass
          )}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

export const Section5EmployeeStatistics = ({
  employee,
}: {
  employee: EmployeeProps;
}) => {
  const totalHandled = (employee.assignedConversations || 24) + (employee.resolvedConversations || 142);
  const resolved = employee.resolvedConversations || 142;
  const closed = 18;
  const unresolved = Math.max(0, totalHandled - (resolved + closed));

  const stats: StatCardProps[] = [
    {
      label: "Total Conversations Handled",
      value: totalHandled,
      bgClass: "bg-primary/10",
      valueClass: "text-default-900",
      shade: "shade-1",
    },
    {
      label: "Total Customer Messages",
      value: 1280,
      bgClass: "bg-info/10",
      valueClass: "text-blue-600",
      shade: "shade-2",
    },
    {
      label: "Total Employee Messages",
      value: 1145,
      bgClass: "bg-success/10",
      valueClass: "text-emerald-600",
      shade: "shade-4",
    },
    {
      label: "Total Conversations Resolved",
      value: resolved,
      bgClass: "bg-warning/10",
      valueClass: "text-amber-600",
      shade: "shade-3",
    },
    {
      label: "Total Conversations Closed",
      value: closed,
      bgClass: "bg-indigo-500/10",
      valueClass: "text-indigo-600",
      shade: "shade-2",
    },
    {
      label: "Total Unresolved Conversations",
      value: unresolved,
      bgClass: "bg-rose-500/10",
      valueClass: "text-rose-600",
      shade: "shade-1",
    },
    {
      label: "Total Attachments Sent",
      value: 84,
      bgClass: "bg-cyan-500/10",
      valueClass: "text-cyan-600",
      shade: "shade-3",
    },
    {
      label: "Last Activity",
      value: "3 hours ago",
      bgClass: "bg-purple-500/10",
      valueClass: "text-purple-600",
      shade: "shade-4",
      isDate: true,
    },
  ];

  return (
    <Card className="shadow-sm border border-default-200">
      <CardContent className="p-4 space-y-4">
        <div>
          <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
            SECTION 5: Employee Statistics
          </div>
          <div className="text-[11px] text-default-400 mt-0.5">
            Overview of conversation volume, messaging counts, resolution rates, and attachment statistics
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
