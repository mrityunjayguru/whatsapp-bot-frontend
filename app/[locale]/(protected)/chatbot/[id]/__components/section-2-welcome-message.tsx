"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

interface Section2WelcomeMessageProps {
  chatbot: ChatbotDataProps;
  onSave?: (updatedChatbot: ChatbotDataProps) => void;
}

export const Section2WelcomeMessage = ({
  chatbot,
  onSave,
}: Section2WelcomeMessageProps) => {
  const [welcomeEnabled, setWelcomeEnabled] = useState<boolean>(
    chatbot.welcomeMessageEnabled ?? true
  );
  const [welcomeText, setWelcomeText] = useState<string>(
    chatbot.welcomeMessageText ||
      "Hi! Welcome to ABC Company. How can we help you today?"
  );

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    enabled: welcomeEnabled,
    text: welcomeText,
  });

  // Switch confirmation dialog state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState<boolean | null>(null);

  const handleSwitchClick = (checked: boolean) => {
    setPendingValue(checked);
    setConfirmDialogOpen(true);
  };

  const handleConfirmToggle = () => {
    if (pendingValue !== null) {
      setWelcomeEnabled(pendingValue);
      if (onSave) {
        onSave({
          ...chatbot,
          welcomeMessageEnabled: pendingValue,
          welcomeMessageText: welcomeText,
        });
      }
      toast.success(
        `Welcome message ${pendingValue ? "enabled" : "disabled"} successfully!`
      );
    }
    setConfirmDialogOpen(false);
    setPendingValue(null);
  };

  const openEditDialog = () => {
    setEditForm({
      enabled: welcomeEnabled,
      text: welcomeText,
    });
    setEditDialogOpen(true);
  };

  const saveEditDialog = () => {
    setWelcomeEnabled(editForm.enabled);
    setWelcomeText(editForm.text);
    if (onSave) {
      onSave({
        ...chatbot,
        welcomeMessageEnabled: editForm.enabled,
        welcomeMessageText: editForm.text,
      });
    }
    setEditDialogOpen(false);
    toast.success("Welcome message settings updated successfully!");
  };

  const handleSaveMain = () => {
    if (onSave) {
      onSave({
        ...chatbot,
        welcomeMessageEnabled: welcomeEnabled,
        welcomeMessageText: welcomeText,
      });
    }
    toast.success("Welcome message settings saved successfully!");
  };

  return (
    <>
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Section Title & Badges */}
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-default-500 uppercase tracking-wide mb-4">
              Section 2: Welcome Message
            </div>
          </div>

          {/* Enable / Disable Welcome Message Switch Row */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-default-200 bg-default-50/50">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-default-800 flex items-center gap-2">
                <span>Enable Welcome Message</span>
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    welcomeEnabled ? "text-emerald-600" : "text-red-500"
                  )}
                >
                  ({welcomeEnabled ? "Enabled" : "Disabled"})
                </span>
              </div>
              <p className="text-[11px] text-default-500">
                Automatically send a greeting message when a user starts a conversation
              </p>
            </div>
            <Switch
              checked={welcomeEnabled}
              onCheckedChange={(checked) => handleSwitchClick(checked)}
              color="primary"
            />
          </div>

          {/* Welcome Message Text Input */}
          <div className="space-y-1.5">
            <Label htmlFor="welcomeMessageText" className="text-xs text-default-500 font-medium">
              Welcome Message Text
            </Label>
            <Textarea
              id="welcomeMessageText"
              rows={3}
              value={welcomeText}
              onChange={(e) => setWelcomeText(e.target.value)}
              placeholder="Enter greeting message text..."
              className="text-sm !border !border-default-200 shadow-none focus-visible:!ring-0 focus-visible:!border-default-300"
            />
          </div>

          {/* Example Box */}
          <div className="space-y-1.5 p-3 rounded-lg border border-default-200 bg-default-50/30">
            <span className="text-xs font-semibold text-default-700">Example:</span>
            <div className="text-xs text-default-600 italic pt-0.5">
              &quot;{welcomeText || "Hi! Welcome to ABC Company. How can we help you today?"}&quot;
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="pt-3 mt-1 border-t border-default-200 flex flex-wrap items-center justify-end gap-2">
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

      {/* Edit Welcome Message Dialog Modal */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Edit Welcome Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between p-3 rounded-lg border border-default-200 bg-default-50/50">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold">Enable Welcome Message</Label>
                <p className="text-[11px] text-default-500">Greeting status</p>
              </div>
              <Switch
                checked={editForm.enabled}
                onCheckedChange={(checked) =>
                  setEditForm((prev) => ({ ...prev, enabled: checked }))
                }
                color="primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editWelcomeText">Welcome Message Text</Label>
              <Textarea
                id="editWelcomeText"
                rows={4}
                value={editForm.text}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, text: e.target.value }))
                }
                placeholder="Hi! Welcome to ABC Company. How can we help you today?"
              />
            </div>
            <div className="p-3 rounded-lg border border-default-200 bg-default-50/30 space-y-1">
              <span className="text-xs font-semibold text-default-700">Example Preview:</span>
              <p className="text-xs text-default-600 italic">
                &quot;{editForm.text || "Hi! Welcome to ABC Company. How can we help you today?"}&quot;
              </p>
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

      {/* Confirmation Dialog for Switch Toggle */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingValue === true
                ? "Enable Welcome Message?"
                : "Disable Welcome Message?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-default-600 pt-2">
              {pendingValue === true
                ? "Are you sure you want to enable the welcome message? New users will automatically receive this greeting when initiating a chat."
                : "Are you sure you want to disable the welcome message? Automated greeting messages will be paused."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-8 text-xs !border !border-default-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                "h-8 text-xs",
                pendingValue === true
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              )}
              onClick={handleConfirmToggle}
            >
              {pendingValue === true ? "Confirm Enable" : "Confirm Disable"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
