"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, TagIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Section5TagsProps {
  tags: string[];
  tagColors: Record<string, string>;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export const Section5Tags = ({
  tags,
  tagColors,
  onAddTag,
  onRemoveTag,
}: Section5TagsProps) => {
  return (
    <Card className="lg:col-span-2 h-full">
      <CardContent className="p-4 h-full flex flex-col gap-4">
        <div className="shrink-0">
          <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
            Section 5: Tags
          </div>
          <div className="text-[11px] text-default-400 mt-0.5">
            Manage contact tags
          </div>
        </div>

        <div className="flex-1 min-h-0 border border-default-200 rounded-lg overflow-hidden flex flex-col">
          {tags.length > 0 ? (
            <ul className="space-y-2 p-3 h-[220px] overflow-y-auto scroll-smooth">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-md border border-default-200 bg-default-50/50"
                >
                  <Badge
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
                      tagColors[tag] || "bg-default-200 text-default-700"
                    )}
                  >
                    {tag}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => onRemoveTag(tag)}
                    className="h-6 w-6 rounded-md flex items-center justify-center text-default-400 hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-default-400 py-4 px-3 text-center h-[220px] flex items-center justify-center">
              No tags assigned yet
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-default-200 shrink-0">
          <div className="flex flex-wrap gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={onAddTag}
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              <Tag className="w-3.5 h-3.5 me-1.5" />
              Add Tag
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddTag}
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-destructive/30 text-destructive hover:text-destructive"
            >
              <TagIcon className="w-3.5 h-3.5 me-1.5" />
              Remove Tag
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
