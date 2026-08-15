"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { ChatbotDataProps } from "../../chatbot-table/data";

interface Section1BasicSettingsProps {
  chatbot: ChatbotDataProps;
  onSave?: (updatedChatbot: ChatbotDataProps) => void;
}

export const Section1BasicSettings = ({
  chatbot,
  onSave,
}: Section1BasicSettingsProps) => {
  const [formData, setFormData] = useState<ChatbotDataProps>({ ...chatbot });
  const [editForm, setEditForm] = useState<ChatbotDataProps>({ ...chatbot });
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Switch confirmation dialog state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"enabled" | "status">("enabled");
  const [pendingValue, setPendingValue] = useState<boolean | string | null>(null);

  const botInitials = formData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "CB";

  // Trigger switch confirmation for Enable/Disable
  const handleEnableSwitchClick = (checked: boolean) => {
    setConfirmType("enabled");
    setPendingValue(checked);
    setConfirmDialogOpen(true);
  };

  // Trigger switch confirmation for Chatbot Status (Active/Inactive)
  const handleStatusSwitchClick = (checked: boolean) => {
    setConfirmType("status");
    setPendingValue(checked ? "Active" : "Inactive");
    setConfirmDialogOpen(true);
  };

  const handleConfirmToggle = () => {
    if (confirmType === "enabled" && typeof pendingValue === "boolean") {
      const updated = { ...formData, enabled: pendingValue };
      setFormData(updated);
      if (onSave) onSave(updated);
      toast.success(`Chatbot ${pendingValue ? "enabled" : "disabled"} successfully!`);
    } else if (confirmType === "status" && typeof pendingValue === "string") {
      const updated = { ...formData, status: pendingValue as "Active" | "Inactive" };
      setFormData(updated);
      if (onSave) onSave(updated);
      toast.success(`Chatbot status changed to ${pendingValue}!`);
    }
    setConfirmDialogOpen(false);
    setPendingValue(null);
  };

  const openEditDialog = () => {
    setEditForm({ ...formData });
    setEditDialogOpen(true);
  };

  const saveEditDialog = () => {
    setFormData({ ...editForm });
    if (onSave) onSave(editForm);
    setEditDialogOpen(false);
    toast.success(`Settings for "${editForm.name}" updated successfully!`);
  };

  const handleSaveMain = () => {
    if (onSave) onSave(formData);
    toast.success(`Basic settings for "${formData.name}" saved successfully!`);
  };

  return (
    <>
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Section Title & Badges */}
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
              Section 1: Basic Settings
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap",
                  formData.status === "Active"
                    ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                    : "bg-slate-500/15 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400"
                )}
              >
                Status: {formData.status}
              </Badge>
              <Badge
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap",
                  formData.enabled
                    ? "bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                    : "bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                )}
              >
                {formData.enabled ? "Automation Enabled" : "Automation Disabled"}
              </Badge>
            </div>
          </div>

          {/* Sub Header Banner */}
          <div className="flex items-center gap-3 pb-3 border-b border-default-200">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-default-800 truncate">
                {formData.name}
              </div>
              <div className="text-[11px] text-default-500 truncate">
                Chatbot ID #{formData.chatbotId} • Created {formData.createdAt}
              </div>
            </div>
          </div>

          {/* Grid Layout Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chatbot Name Input */}
            <div className="space-y-1.5">
              <Label htmlFor="chatbotName" className="text-xs text-default-500 font-medium">
                Chatbot Name
              </Label>
              <Input
                id="chatbotName"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter chatbot name..."
                className="h-9 text-sm !border !border-default-200 shadow-none focus-visible:!ring-0 focus-visible:!border-default-300"
              />
            </div>

            {/* Connected WhatsApp Business Number Input */}
            <div className="space-y-1.5">
              <Label htmlFor="whatsappNumber" className="text-xs text-default-500 font-medium">
                Connected WhatsApp Business Number
              </Label>
              <Input
                id="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    whatsappNumber: e.target.value,
                  }))
                }
                placeholder="+1 (555) 000-0000"
                className="h-9 text-sm !border !border-default-200 shadow-none focus-visible:!ring-0 focus-visible:!border-default-300"
              />
            </div>

            {/* Current Mode Select */}
            <div className="space-y-1.5 col-span-1 md:col-span-2">
              <Label className="text-xs text-default-500 font-medium">
                Current Mode
              </Label>
              <Select
                value={formData.currentMode}
                onValueChange={(val: "Chatbot" | "Human" | "Hybrid") =>
                  setFormData((prev) => ({ ...prev, currentMode: val }))
                }
              >
                <SelectTrigger className="h-9 text-sm !border !border-default-200 shadow-none focus-visible:!ring-0">
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chatbot">Chatbot</SelectItem>
                  <SelectItem value="Human">Human</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Chatbot Status Switch Row */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-default-200 bg-default-50/50">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-default-800 flex items-center gap-2">
                  <span>Chatbot Status</span>
                  <span className={cn("text-[11px] font-medium flex items-center gap-1", formData.status === "Active" ? "text-emerald-600" : "text-slate-500")}>
                    <span className={cn("w-2 h-2 rounded-full", formData.status === "Active" ? "bg-emerald-500" : "bg-slate-400")} />
                    {formData.status}
                  </span>
                </div>
                <p className="text-[11px] text-default-500">
                  Toggle status between Active and Inactive
                </p>
              </div>
              <Switch
                checked={formData.status === "Active"}
                onCheckedChange={(checked) => handleStatusSwitchClick(checked)}
                color="primary"
              />
            </div>

            {/* Enable / Disable Chatbot Switch Row */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-default-200 bg-default-50/50">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-default-800 flex items-center gap-2">
                  <span>Enable / Disable Chatbot</span>
                  <span className={cn("text-[11px] font-medium", formData.enabled ? "text-emerald-600" : "text-red-500")}>
                    ({formData.enabled ? "Enabled" : "Disabled"})
                  </span>
                </div>
                <p className="text-[11px] text-default-500">
                  Turn chatbot response automation on or off
                </p>
              </div>
              <Switch
                checked={formData.enabled}
                onCheckedChange={(checked) => handleEnableSwitchClick(checked)}
                color="primary"
              />
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="pt-3 mt-1 border-t border-default-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => handleEnableSwitchClick(!formData.enabled)}
                className={cn(
                  "h-8 text-xs !border bg-background hover:bg-transparent hover:ring-0",
                  formData.enabled
                    ? "border-destructive/30 text-destructive hover:border-destructive hover:text-destructive"
                    : "border-emerald-500/30 text-emerald-600 hover:border-emerald-500 hover:text-emerald-600"
                )}
              >
                {formData.enabled ? "Disable Chatbot" : "Enable Chatbot"}
              </Button>
            </div>
            <Button
              color="primary"
              size="sm"
              type="button"
              onClick={handleSaveMain}
              className="h-8 text-xs px-4"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Basic Settings Dialog Modal */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Edit Basic Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="editName">Chatbot Name</Label>
              <Input
                id="editName"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editWhatsapp">Connected WhatsApp Business Number</Label>
              <Input
                id="editWhatsapp"
                value={editForm.whatsappNumber}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    whatsappNumber: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Current Mode</Label>
              <Select
                value={editForm.currentMode}
                onValueChange={(val: "Chatbot" | "Human" | "Hybrid") =>
                  setEditForm((prev) => ({ ...prev, currentMode: val }))
                }
              >
                <SelectTrigger className="h-10 !border !border-default-200">
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chatbot">Chatbot</SelectItem>
                  <SelectItem value="Human">Human</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-default-200 bg-default-50/50">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold">Chatbot Status</Label>
                <p className="text-[11px] text-default-500">Active or Inactive</p>
              </div>
              <Switch
                checked={editForm.status === "Active"}
                onCheckedChange={(checked) =>
                  setEditForm((prev) => ({
                    ...prev,
                    status: checked ? "Active" : "Inactive",
                  }))
                }
                color="primary"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-default-200 bg-default-50/50">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold">Enable / Disable Chatbot</Label>
                <p className="text-[11px] text-default-500">Automation status</p>
              </div>
              <Switch
                checked={editForm.enabled}
                onCheckedChange={(checked) =>
                  setEditForm((prev) => ({ ...prev, enabled: checked }))
                }
                color="primary"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button color="primary" size="sm" className="h-9" onClick={saveEditDialog}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Switch Toggles */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmType === "enabled"
                ? pendingValue === true
                  ? "Enable Chatbot Automation?"
                  : "Disable Chatbot Automation?"
                : `Change Status to ${pendingValue}?`}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-default-600 pt-2">
              {confirmType === "enabled"
                ? pendingValue === true
                  ? `Are you sure you want to enable automation for "${formData.name}"? Automated responses will be resumed for incoming messages.`
                  : `Are you sure you want to disable automation for "${formData.name}"? Automated responses will be paused until enabled again.`
                : `Are you sure you want to change the status of "${formData.name}" to ${pendingValue}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-8 text-xs !border !border-default-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                "h-8 text-xs",
                (confirmType === "enabled" && pendingValue === true) ||
                  (confirmType === "status" && pendingValue === "Active")
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              )}
              onClick={handleConfirmToggle}
            >
              {confirmType === "enabled"
                ? pendingValue === true
                  ? "Confirm Enable"
                  : "Confirm Disable"
                : `Confirm ${pendingValue}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
