import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2 } from "lucide-react";
import { TagProps } from "../../tags-table/data";

export const Section1TagInfo = ({ tag }: { tag: TagProps }) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-default-200 pb-2">
          <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
            Section 1: Tag Information
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6 pt-2">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32">
              Tag ID
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {tag.tagId}
            </span>
          </div>

          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32">
              Tag Name
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {tag.tagName}
            </span>
          </div>

          <div className="flex items-start gap-2 min-w-0 col-span-2">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32">
              Description
            </span>
            <span className="text-sm font-medium text-default-800 whitespace-normal">
              {tag.description}
            </span>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32">
              Status
            </span>
            <div className="flex items-center gap-2">
              <Switch checked={tag.status === "Active"} />
              <span className="text-sm font-medium text-default-800">
                {tag.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32">
              Created By
            </span>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={tag.createdByAvatar} />
                <AvatarFallback>{tag.createdBy?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-default-800 truncate">
                {tag.createdBy}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32">
              Created At
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {tag.createdAt}
            </span>
          </div>

          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32">
              Updated At
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {tag.updatedAt}
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
              <Edit className="w-3.5 h-3.5 me-1.5" />
              Edit Tag
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200 text-destructive border-destructive/30 hover:border-destructive hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5 me-1.5" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
