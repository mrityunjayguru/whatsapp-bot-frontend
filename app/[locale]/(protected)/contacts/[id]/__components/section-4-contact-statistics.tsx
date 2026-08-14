"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DataProps } from "../../contacts-table/columns";
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
            isDate ? "text-sm leading-tight" : "text-4xl",
            valueClass
          )}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

export const Section4ContactStatistics = ({
  contact,
}: {
  contact: DataProps;
}) => {
  const stats: StatCardProps[] = [
    {
      label: "Total Conversations",
      value: contact.totalConversations,
      bgClass: "bg-primary/10",
      valueClass: "text-default-900",
      shade: "shade-1",
    },
    {
      label: "Total Messages",
      value: contact.totalConversations * 32 + 128,
      bgClass: "bg-info/10",
      valueClass: "text-blue-600",
      shade: "shade-2",
    },
    {
      label: "Last Contacted",
      value: contact.lastConversation,
      bgClass: "bg-success/10",
      valueClass: "text-emerald-600",
      shade: "shade-4",
      isDate: true,
    },
    {
      label: "First Contacted",
      value: contact.createdAt,
      bgClass: "bg-warning/10",
      valueClass: "text-amber-600",
      shade: "shade-3",
      isDate: true,
    },
    {
      label: "Open Conversations",
      value: Math.max(1, Math.floor(contact.totalConversations * 0.25)),
      bgClass: "bg-indigo-500/10",
      valueClass: "text-indigo-600",
      shade: "shade-2",
    },
    {
      label: "Resolved Conversations",
      value: Math.max(
        0,
        contact.totalConversations -
          Math.max(1, Math.floor(contact.totalConversations * 0.25))
      ),
      bgClass: "bg-pink-500/10",
      valueClass: "text-pink-600",
      shade: "shade-1",
    },
  ];

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
            Section 4: Contact Statistics
          </div>
          <div className="text-[11px] text-default-400 mt-0.5">
            Overview of conversations and engagement for this contact
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
