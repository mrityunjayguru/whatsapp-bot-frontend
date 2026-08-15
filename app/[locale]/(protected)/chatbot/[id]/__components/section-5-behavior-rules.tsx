"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  Save,
  RotateCcw,
  MessageSquare,
  Search,
  Paperclip,
  Globe,
  UserX,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { ChatbotDataProps } from "../../chatbot-table/data";

interface Section5BehaviorRulesProps {
  chatbot: ChatbotDataProps;
  onSave?: (updatedChatbot: ChatbotDataProps) => void;
}

export const Section5BehaviorRules = ({
  chatbot,
  onSave,
}: Section5BehaviorRulesProps) => {
  const [respondNew, setRespondNew] = useState<boolean>(
    chatbot.respondToNewConversations ?? true
  );
  const [respondFaq, setRespondFaq] = useState<boolean>(
    chatbot.respondToFaqMatches ?? true
  );
  const [sendAttachment, setSendAttachment] = useState<boolean>(
    chatbot.sendAttachmentWhenConfigured ?? true
  );
  const [sendUrl, setSendUrl] = useState<boolean>(
    chatbot.sendUrlWhenConfigured ?? true
  );
  const [stopOnHandover, setStopOnHandover] = useState<boolean>(
    chatbot.stopWhenEmployeeTakesControl ?? true
  );

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<{
    key: "new" | "faq" | "attachment" | "url" | "stop";
    label: string;
    value: boolean;
  } | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const handleToggleClick = (
    key: "new" | "faq" | "attachment" | "url" | "stop",
    label: string,
    checked: boolean
  ) => {
    setPendingToggle({ key, label, value: checked });
    setConfirmDialogOpen(true);
  };

  const handleConfirmToggle = () => {
    if (!pendingToggle) return;
    const { key, label, value } = pendingToggle;

    if (key === "new") setRespondNew(value);
    if (key === "faq") setRespondFaq(value);
    if (key === "attachment") setSendAttachment(value);
    if (key === "url") setSendUrl(value);
    if (key === "stop") setStopOnHandover(value);

    toast.success(`"${label}" ${value ? "enabled" : "disabled"} successfully!`);
    setConfirmDialogOpen(false);
    setPendingToggle(null);
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    const updated: ChatbotDataProps = {
      ...chatbot,
      respondToNewConversations: respondNew,
      respondToFaqMatches: respondFaq,
      sendAttachmentWhenConfigured: sendAttachment,
      sendUrlWhenConfigured: sendUrl,
      stopWhenEmployeeTakesControl: stopOnHandover,
    };

    setTimeout(() => {
      if (onSave) {
        onSave(updated);
      }
      setIsSaving(false);
      toast.success("Chatbot Behavior Rules saved successfully!");
    }, 400);
  };

  const handleReset = () => {
    setRespondNew(chatbot.respondToNewConversations ?? true);
    setRespondFaq(chatbot.respondToFaqMatches ?? true);
    setSendAttachment(chatbot.sendAttachmentWhenConfigured ?? true);
    setSendUrl(chatbot.sendUrlWhenConfigured ?? true);
    setStopOnHandover(chatbot.stopWhenEmployeeTakesControl ?? true);
    toast.success("Behavior rules reset to last saved state.");
  };

  const rulesList = [
    {
      key: "new" as const,
      label: "Respond to New Conversations",
      description: "Automatically send welcome message and greet users starting a new chat session.",
      checked: respondNew,
    },
    {
      key: "faq" as const,
      label: "Respond to FAQ/Keyword Matches",
      description: "Search FAQ database and respond automatically when keywords or questions match.",
      checked: respondFaq,

    },
    {
      key: "attachment" as const,
      label: "Send Attachment When Configured",
      description: "Automatically include document/PDF attachments when the matched FAQ contains files.",
      checked: sendAttachment,

    },
    {
      key: "url" as const,
      label: "Send URL When Configured",
      description: "Automatically include web links and URLs when the matched FAQ contains web references.",
      checked: sendUrl,
   
    },
    {
      key: "stop" as const,
      label: "Stop When Employee Takes Control",
      description: "Immediately cease chatbot auto-replies as soon as an employee clicks 'Take Control'.",
      checked: stopOnHandover,

    },
  ];

  return (
    <>
      <Card className="shadow-none border border-default-200 h-full flex flex-col justify-between">
        <CardContent className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-default-100">
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  SECTION 5: Behavior Rules
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 gap-1.5 text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="h-8 gap-1.5 px-3.5 shadow-sm text-xs"
                >
                  <span>{isSaving ? "Saving..." : "Save Rules"}</span>
                </Button>
              </div>
            </div>

            {/* Rules Checkboxes List */}
            <div className="space-y-2.5">
              {rulesList.map((rule) => (
                <div
                  key={rule.key}
                  onClick={() =>
                    handleToggleClick(rule.key, rule.label, !rule.checked)
                  }
                  className="p-3 rounded-lg border border-default-200 bg-background hover:border-primary/30 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="space-y-0.5">
                      <Label className="text-xs font-bold text-default-800 cursor-pointer">
                        {rule.label}
                      </Label>
                      <p className="text-[11px] text-default-500 leading-snug">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                  <Checkbox
                    color="primary"
                    checked={rule.checked}
                    onCheckedChange={(val) =>
                      handleToggleClick(rule.key, rule.label, Boolean(val))
                    }
                    className="h-5 w-5 rounded shrink-0 pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Save Button */}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-default-900">
              Confirm Behavior Rule Change?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-default-500">
              Are you sure you want to {pendingToggle?.value ? "enable" : "disable"}{" "}
              &quot;{pendingToggle?.label}&quot;?
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
