"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/navigation";
import { Settings } from "lucide-react";
import { FAQDataProps } from "../../faqs-table/data";
import { cn } from "@/lib/utils";

interface Section3FAQSettingsProps {
  status: FAQDataProps["status"];
  setStatus: (val: FAQDataProps["status"]) => void;
  onSave: () => void;
  className?: string;
}

export const Section3FAQSettings = ({
  status,
  setStatus,
  onSave,
  className,
}: Section3FAQSettingsProps) => {
  const isActive = status === "Active";

  return (
    <Card className={cn("shadow-sm border border-default-200 flex flex-col", className)}>
      <CardContent className="p-6 space-y-6 flex-1 flex flex-col justify-between">
        {/* Section Title Bar */}
        <div className="space-y-1 border-b border-default-200 pb-4 shrink-0">
          <div className="text-xs font-bold text-default-500 uppercase tracking-wider">
            SECTION 3 : Settings
          </div>
        </div>

        {/* Settings Content */}
        <div className="space-y-6 flex-1 flex flex-col justify-between pt-2">
          <div className="flex items-center justify-between shrink-0">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-default-900">
                FAQ Status
              </Label>
              <div className="text-xs text-default-500">
                Set this FAQ to Active or Inactive
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold transition-colors ${isActive ? "text-primary" : "text-default-400"}`}>
                {status}
              </span>
              <Switch
                checked={isActive}
                onCheckedChange={(checked) => setStatus(checked ? "Active" : "Inactive")}
                color="primary"
                size="md"
              />
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="pt-6 border-t border-default-200 space-y-3 shrink-0">
            <div className="text-xs font-bold text-default-500 uppercase tracking-wider">
              Buttons
            </div>
            <div className="flex items-center gap-3">
              <Button
                color="primary"
                className="flex-1 shadow-none h-10"
                onClick={onSave}
              >
                Save FAQ
              </Button>
              <Link href="/faqs" className="flex-1">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full h-10"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
