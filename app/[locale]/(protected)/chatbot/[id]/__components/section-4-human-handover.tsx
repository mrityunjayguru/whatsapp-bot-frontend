"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import {
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { ChatbotDataProps } from "../../chatbot-table/data";

interface Section4HumanHandoverProps {
  chatbot: ChatbotDataProps;
  onSave?: (updatedChatbot: ChatbotDataProps) => void;
}

export const Section4HumanHandover = ({
  chatbot,
  onSave,
}: Section4HumanHandoverProps) => {
  const [handoverEnabled, setHandoverEnabled] = useState<boolean>(
    chatbot.humanHandoverEnabled ?? true
  );
  const [manualHandover, setManualHandover] = useState<boolean>(
    chatbot.manualHandoverEnabled ?? true
  );
  const [automaticHandover, setAutomaticHandover] = useState<boolean>(
    chatbot.automaticHandoverEnabled ?? true
  );
  const [handoverMessageText, setHandoverMessageText] = useState<string>(
    chatbot.handoverMessage ||
      "Thank you. One of our team members will assist you shortly."
  );

  // Switch confirmation state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<{
    type: "enable" | "manual" | "auto";
    value: boolean;
  } | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const handleToggleClick = (type: "enable" | "manual" | "auto", checked: boolean) => {
    setPendingToggle({ type, value: checked });
    setConfirmDialogOpen(true);
  };

  const handleConfirmToggle = () => {
    if (!pendingToggle) return;
    const { type, value } = pendingToggle;

    if (type === "enable") {
      setHandoverEnabled(value);
      toast.success(
        `Human handover ${value ? "enabled" : "disabled"} successfully!`
      );
    } else if (type === "manual") {
      setManualHandover(value);
      toast.success(
        `Manual handover ${value ? "enabled" : "disabled"} successfully!`
      );
    } else if (type === "auto") {
      setAutomaticHandover(value);
      toast.success(
        `Automatic handover ${value ? "enabled" : "disabled"} successfully!`
      );
    }

    setConfirmDialogOpen(false);
    setPendingToggle(null);
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    const updated: ChatbotDataProps = {
      ...chatbot,
      humanHandoverEnabled: handoverEnabled,
      manualHandoverEnabled: manualHandover,
      automaticHandoverEnabled: automaticHandover,
      handoverMessage: handoverMessageText,
    };

    setTimeout(() => {
      if (onSave) {
        onSave(updated);
      }
      setIsSaving(false);
      toast.success("Human Handover settings saved successfully!");
    }, 400);
  };

  const handleReset = () => {
    setHandoverEnabled(chatbot.humanHandoverEnabled ?? true);
    setManualHandover(chatbot.manualHandoverEnabled ?? true);
    setAutomaticHandover(chatbot.automaticHandoverEnabled ?? true);
    setHandoverMessageText(
      chatbot.handoverMessage ||
        "Thank you. One of our team members will assist you shortly."
    );
    toast.success("Settings reset to last saved state.");
  };

  return (
    <>
      <Card className="shadow-none border border-default-200">
        <CardContent className="p-4 sm:p-5 space-y-5">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-default-100">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                SECTION 4: Human Handover
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-9 gap-1.5 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </Button>
              <Button
                color="primary"
                size="sm"
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="h-9 gap-1.5 px-4 shadow-sm"
              >
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-5 items-start">
            {/* Form Controls Column (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* 1. Enable Human Handover */}
              <div className="p-3.5 rounded-lg border border-default-200 bg-background space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-default-800 cursor-pointer">
                      Enable Human Handover
                    </Label>
                    <p className="text-[11px] text-default-500">
                      Master control switch for human takeover capability.
                    </p>
                  </div>
                  <Switch
                    checked={handoverEnabled}
                    onCheckedChange={(val) => handleToggleClick("enable", val)}
                  />
                </div>
              </div>

              {/* 2. Manual Handover */}
              <div
                className={cn(
                  "p-3.5 rounded-lg border transition-opacity space-y-2",
                  handoverEnabled
                    ? "border-default-200 bg-background"
                    : "border-default-200 bg-default-50/50 opacity-60 pointer-events-none"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-default-800 cursor-pointer">
                      Manual Handover
                    </Label>
                    <p className="text-[11px] text-default-500">
                      Employees can manually click &quot;Take Control&quot; to stop chatbot response.
                    </p>
                  </div>
                  <Switch
                    checked={manualHandover}
                    disabled={!handoverEnabled}
                    onCheckedChange={(val) => handleToggleClick("manual", val)}
                  />
                </div>
              </div>

              {/* 3. Automatic Handover */}
              <div
                className={cn(
                  "p-3.5 rounded-lg border transition-opacity space-y-2",
                  handoverEnabled
                    ? "border-default-200 bg-background"
                    : "border-default-200 bg-default-50/50 opacity-60 pointer-events-none"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-default-800 cursor-pointer">
                      Automatic Handover
                    </Label>
                    <p className="text-[11px] text-default-500">
                      Triggers handover automatically when chatbot confidence is low.
                    </p>
                  </div>
                  <Switch
                    checked={automaticHandover}
                    disabled={!handoverEnabled}
                    onCheckedChange={(val) => handleToggleClick("auto", val)}
                  />
                </div>
              </div>

              {/* 4. Handover Message (Editable Input) */}
              <div
                className={cn(
                  "p-3.5 rounded-lg border transition-opacity space-y-2.5",
                  handoverEnabled
                    ? "border-default-200 bg-background"
                    : "border-default-200 bg-default-50/50 opacity-60 pointer-events-none"
                )}
              >
                <Label
                  htmlFor="handoverMessage"
                  className="text-xs font-bold text-default-800 flex items-center justify-between"
                >
                  <span>Handover Message</span>
                  <span className="text-[10px] font-normal text-default-400">
                    Editable message
                  </span>
                </Label>
                <Textarea
                  id="handoverMessage"
                  rows={2}
                  value={handoverMessageText}
                  onChange={(e) => setHandoverMessageText(e.target.value)}
                  placeholder="Enter the automated message sent to customer when employee takes control..."
                  className="text-xs focus:ring-primary/20"
                />
                <p className="text-[11px] text-default-400">
                  This exact text is sent to the customer immediately when an employee takes control of the chat.
                </p>
              </div>
            </div>

            {/* Example Preview Card Column (5 cols) */}
          </div>
        </CardContent>
      </Card>

      {/* Toggle Confirmation Alert Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-default-900">
              Confirm Handover Setting Change?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-default-500">
              Are you sure you want to {pendingToggle?.value ? "enable" : "disable"}{" "}
              {pendingToggle?.type === "enable"
                ? "Human Handover overall"
                : pendingToggle?.type === "manual"
                ? "Manual Handover"
                : "Automatic Handover"}
              ? This takes effect for all incoming chat sessions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              onClick={() => setConfirmDialogOpen(false)}
              className="h-8 text-xs"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmToggle}
              className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
