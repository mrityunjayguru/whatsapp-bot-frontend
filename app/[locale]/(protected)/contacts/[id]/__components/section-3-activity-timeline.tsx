"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { format, parse, isValid } from "date-fns";

interface TimelineEvent {
  id: number;
  title: string;
  description?: string;
  time: string;
  date: string; // "Aug 3, 2026" format
  actor?: string;
  color: string; // dot color class
}

const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    title: "Contact Created",
    description: "New contact was added to the system.",
    time: "09:12 AM",
    date: "Aug 3, 2026",
    actor: "System",
    color: "bg-emerald-500",
  },
  {
    id: 2,
    title: "Tag Added",
    description: 'Tag "VIP" was applied to this contact.',
    time: "09:18 AM",
    date: "Aug 3, 2026",
    actor: "Sarah Kim",
    color: "bg-amber-500",
  },
  {
    id: 3,
    title: "Email Updated",
    description: "Email address was changed to jenny@example.com.",
    time: "10:05 AM",
    date: "Aug 3, 2026",
    actor: "Michael Chen",
    color: "bg-blue-500",
  },
  {
    id: 4,
    title: "Phone Updated",
    description: "Phone number was updated to +1 (555) 123-4567.",
    time: "10:30 AM",
    date: "Aug 3, 2026",
    actor: "Michael Chen",
    color: "bg-violet-500",
  },
  {
    id: 5,
    title: "Conversation Started",
    description: "CONV-10001 — Order refund request for ORD-28471.",
    time: "02:15 PM",
    date: "Aug 3, 2026",
    actor: "Jenny Wilson",
    color: "bg-cyan-500",
  },
  {
    id: 6,
    title: "Tag Added",
    description: 'Tag "Priority" was applied to this contact.',
    time: "09:00 AM",
    date: "Aug 4, 2026",
    actor: "Sarah Kim",
    color: "bg-amber-500",
  },
  {
    id: 7,
    title: "Conversation Started",
    description: "CONV-09887 — Damaged product replacement query.",
    time: "11:20 AM",
    date: "Aug 4, 2026",
    actor: "Jenny Wilson",
    color: "bg-cyan-500",
  },
  {
    id: 8,
    title: "Conversation Closed",
    description: "CONV-09650 — Shipping delay follow-up resolved.",
    time: "03:45 PM",
    date: "Aug 4, 2026",
    actor: "Emily Rodriguez",
    color: "bg-default-400",
  },
  {
    id: 9,
    title: "Complete",
    description: "Contact profile fully verified and marked complete.",
    time: "04:00 PM",
    date: "Aug 4, 2026",
    actor: "System",
    color: "bg-emerald-500",
  },
];

function parseEventDate(dateStr: string): Date | null {
  try {
    const d = parse(dateStr, "MMM d, yyyy", new Date());
    return isValid(d) ? d : null;
  } catch {
    return null;
  }
}


function groupEventsByDate(events: TimelineEvent[]) {
  const grouped = events.reduce<Record<string, TimelineEvent[]>>((acc, ev) => {
    if (!acc[ev.date]) acc[ev.date] = [];
    acc[ev.date].push(ev);
    return acc;
  }, {});

  return Object.entries(grouped).sort(([dateA], [dateB]) => {
    const parsedA = parseEventDate(dateA);
    const parsedB = parseEventDate(dateB);
    if (!parsedA || !parsedB) return 0;
    return parsedA.getTime() - parsedB.getTime();
  });
}

function TimelineEventItem({ ev }: { ev: TimelineEvent }) {
  return (
    <div className="flex items-start gap-3 relative">
      <div
        className={cn(
          "w-[11px] h-[11px] rounded-full shrink-0 z-10 mt-1.5 border-2 border-background ring-1 ring-default-200",
          ev.color
        )}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-default-800 leading-tight">
            {ev.title}
          </span>
          <span className="text-[10px] text-default-400 whitespace-nowrap shrink-0 mt-0.5">
            {ev.time}
          </span>
        </div>
        {ev.description && (
          <p className="text-xs text-default-500 mt-0.5 leading-relaxed">
            {ev.description}
          </p>
        )}
        {ev.actor && (
          <span className="text-[10px] text-default-400 mt-1 inline-block">
            by{" "}
            <span className="font-medium text-default-600">{ev.actor}</span>
          </span>
        )}
      </div>
    </div>
  );
}

export const Section3ActivityTimeline = () => {
  const dateGroups = groupEventsByDate(timelineEvents);
  const [activeDateIndex, setActiveDateIndex] = useState(
    Math.max(dateGroups.length - 1, 0)
  );
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [currentDate, eventsForDate = []] = dateGroups[activeDateIndex] ?? [];
  const selectedDate = currentDate ? parseEventDate(currentDate) ?? undefined : undefined;
  const hasEvents = eventsForDate.length > 0;

  const handleDateSelect = (date: Date | undefined) => {
    setCalendarOpen(false);
    if (!date) return;

    const index = dateGroups.findIndex(([dateLabel]) => {
      const parsed = parseEventDate(dateLabel);
      return (
        parsed &&
        parsed.getDate() === date.getDate() &&
        parsed.getMonth() === date.getMonth() &&
        parsed.getFullYear() === date.getFullYear()
      );
    });

    if (index >= 0) {
      setActiveDateIndex(index);
    }
  };

  const goToPreviousDate = () => {
    setActiveDateIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToNextDate = () => {
    setActiveDateIndex((prev) => Math.min(prev + 1, dateGroups.length - 1));
  };

  return (
    <Card className="flex flex-col h-full">
      <CardContent className="p-4 flex flex-col gap-3 h-full">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
            Section 3: Activity Timeline
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-1.5">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5 !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-300"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  {selectedDate
                    ? format(selectedDate, "MMM d, yyyy")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Single date timeline */}
        <div className="border border-default-200 rounded-lg overflow-hidden flex flex-col flex-1">
          <div className="p-4">
            {hasEvents ? (
              
                <div className="relative">
                  <div className="absolute left-[5px] top-2 bottom-2 w-px bg-default-200" />
                  <div className="space-y-4">
                    {eventsForDate.map((ev) => (
                      <TimelineEventItem key={ev.id} ev={ev} />
                    ))}
                  </div>
                </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-center py-8">
                <CalendarDays className="w-8 h-8 text-default-300" />
                <p className="text-sm font-medium text-default-500">
                  No activity found
                </p>
              </div>
            )}
          </div>

         
        </div>
      </CardContent>
    </Card>
  );
};
