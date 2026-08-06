import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Tag, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export const Section2CustomerInfo = ({
  conversation,
  customerInfo,
  customerInitials,
  tagColors,
  openEditContact,
  openAddTag,
}: any) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
            Section 2: Customer Information
          </div>
        </div>

        <div className="flex items-center gap-3 pb-2 border-b border-default-200">
          <Avatar className="h-10 w-10 shrink-0 bg-default-100 border border-default-200">
            {conversation.customerImage ? (
              <AvatarImage src={conversation.customerImage} />
            ) : (
              <AvatarFallback className="text-xs text-default-700">
                {customerInitials || "AB"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-default-800 truncate">
              {customerInfo.customerName}
            </div>
            <div className="text-[11px] text-default-500 truncate">
              Since {customerInfo.customerSince}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Name
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {customerInfo.customerName}
            </span>
          </div>
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              WhatsApp
            </span>
            <span className="text-sm font-medium truncate text-blue-600">
              {customerInfo.whatsappName}
            </span>
          </div>
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Phone
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {customerInfo.phone}
            </span>
          </div>
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Email
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {customerInfo.email}
            </span>
          </div>
          <div className="col-span-2 flex items-start gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28 pt-0.5">
              Tags
            </span>
            <div className="flex flex-wrap gap-1.5 min-w-0">
              {customerInfo.tags.length > 0 ? (
                customerInfo.tags.map((tag: string, idx: number) => (
                  <Badge
                    key={idx}
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
                      tagColors[tag] || "bg-default-200 text-default-700"
                    )}
                  >
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-default-400">No tags</span>
              )}
            </div>
          </div>
          <div className="flex items-baseline gap-2 min-w-0 col-span-2">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Customer Since
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {customerInfo.customerSince}
            </span>
          </div>
        </div>

        <div className="pt-2 mt-1 border-t border-default-200">
          <div className="flex flex-wrap gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={openEditContact}
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              <User className="w-3.5 h-3.5 me-1.5" />
              Edit Contact
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openAddTag}
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              <Tag className="w-3.5 h-3.5 me-1.5" />
              Add Tag
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              <Eye className="w-3.5 h-3.5 me-1.5" />
              View Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
