"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Section2AccountSettingsData {
  status: "Active" | "Inactive";
  sendInvitationEmail: boolean;
}

interface Section2AccountSettingsProps {
  data?: Section2AccountSettingsData;
  onChange?: (data: Section2AccountSettingsData) => void;
}

export function Section2AccountSettings({
  data,
  onChange,
}: Section2AccountSettingsProps) {
  const [status, setStatus] = useState<"Active" | "Inactive">(data?.status || "Active");
  const [sendInvitationEmail, setSendInvitationEmail] = useState(data?.sendInvitationEmail ?? true);

  const updateParent = (fields: Partial<Section2AccountSettingsData>) => {
    if (onChange) {
      onChange({
        status,
        sendInvitationEmail,
        ...fields,
      });
    }
  };

  return (
    <Card className="shadow-sm border border-default-200 h-full">
      <CardContent className="p-6 flex flex-col justify-between h-full space-y-5">
        <div className="space-y-5">
          {/* Header Title */}
          <div className="flex items-center justify-between ">
            <div className="text-xs font-bold text-default-500 uppercase tracking-wider">
              SECTION 2: Account Settings
            </div>
          </div>

          {/* Form Controls */}
          <div className="space-y-5">
            {/* Status (Active / Inactive) */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-default-700">
                Status *
              </Label>
              <Select
                value={status}
                onValueChange={(val: "Active" | "Inactive") => {
                  setStatus(val);
                  updateParent({ status: val });
                }}
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Send Invitation Setting */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-default-200 bg-default-50/50">
              <div>
                <Label className="text-xs font-semibold text-default-800 block cursor-pointer">
                  Send Invitation
                </Label>
                <span className="text-[11px] text-default-500">
                  Dispatch onboarding link and account access credentials to the employee.
                </span>
              </div>
              <Switch
                checked={sendInvitationEmail}
                onCheckedChange={(checked) => {
                  setSendInvitationEmail(checked);
                  updateParent({ sendInvitationEmail: checked });
                }}
              />
            </div>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
}
