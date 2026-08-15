"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bot, Phone, Settings, Sparkles, Check, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import { ChatbotDataProps } from "./data";

interface ChatbotSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bot: ChatbotDataProps | null;
  onSave: (updatedBot: ChatbotDataProps) => void;
}

export function ChatbotSettingsSheet({
  open,
  onOpenChange,
  bot,
  onSave,
}: ChatbotSettingsSheetProps) {
  const [formData, setFormData] = useState<ChatbotDataProps | null>(null);

  useEffect(() => {
    if (bot) {
      setFormData({ ...bot });
    }
  }, [bot]);

  if (!formData) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    onSave(formData);
    toast.success(`Settings for "${formData.name}" updated successfully!`);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-full overflow-y-auto p-6">
        <SheetHeader className="pb-4 border-b border-default-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <SheetTitle className="text-lg font-semibold text-default-900">
                Chatbot Settings
              </SheetTitle>
              <SheetDescription className="text-xs text-default-500">
                Manage status, mode, connected number, and AI behavior for #{formData.chatbotId}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSave} className="space-y-5 py-6">
          {/* Enable / Disable Chatbot */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-default-200 bg-default-50/50">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold text-default-900">
                Enable / Disable Chatbot
              </Label>
              <p className="text-xs text-default-500">
                Turn chatbot response automation on or off
              </p>
            </div>
            <Switch
              checked={formData.enabled}
              onCheckedChange={(checked) =>
                setFormData((prev) => prev ? { ...prev, enabled: checked } : null)
              }
              color="primary"
            />
          </div>

          {/* Chatbot Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-semibold text-default-700">
              Chatbot Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => prev ? { ...prev, name: e.target.value } : null)
              }
              placeholder="e.g. Customer Support Assistant"
              className="h-10 !border !border-default-200 shadow-none focus-visible:!ring-0 focus-visible:!border-default-300"
            />
          </div>

          {/* Connected WhatsApp Number */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-xs font-semibold text-default-700">
              Connected WhatsApp Number
            </Label>
            <div className="relative">
              <Phone className="w-4 h-4 text-emerald-500 absolute left-3 top-3" />
              <Input
                id="whatsapp"
                value={formData.whatsappNumber}
                onChange={(e) =>
                  setFormData((prev) => prev ? { ...prev, whatsappNumber: e.target.value } : null)
                }
                placeholder="+1 (555) 000-0000"
                className="h-10 pl-9 !border !border-default-200 shadow-none focus-visible:!ring-0 focus-visible:!border-default-300"
              />
            </div>
          </div>

          {/* Grid: Chatbot Status & Current Mode */}
          <div className="grid grid-cols-2 gap-4">
            {/* Chatbot Status */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-default-700">
                Chatbot Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(val: "Active" | "Inactive") =>
                  setFormData((prev) => prev ? { ...prev, status: val } : null)
                }
              >
                <SelectTrigger className="h-10 !border !border-default-200 shadow-none focus-visible:!ring-0">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </SelectItem>
                  <SelectItem value="Inactive">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      Inactive
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Current Mode */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-default-700">
                Current Mode
              </Label>
              <Select
                value={formData.currentMode}
                onValueChange={(val: "Chatbot" | "Human" | "Hybrid") =>
                  setFormData((prev) => prev ? { ...prev, currentMode: val } : null)
                }
              >
                <SelectTrigger className="h-10 !border !border-default-200 shadow-none focus-visible:!ring-0">
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chatbot">Chatbot</SelectItem>
                  <SelectItem value="Human">Human</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Human Handover Enabled */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-default-200 bg-default-50/50">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold text-default-900">
                Human Handover Enabled
              </Label>
              <p className="text-xs text-default-500">
                Allow switching to human agent if query cannot be answered
              </p>
            </div>
            <Switch
              checked={formData.humanHandoverEnabled}
              onCheckedChange={(checked) =>
                setFormData((prev) => prev ? { ...prev, humanHandoverEnabled: checked } : null)
              }
              color="primary"
            />
          </div>

          {/* System Instructions Prompt */}
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-xs font-semibold text-default-700 flex items-center justify-between">
              <span>System Prompt & Behavior</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </Label>
            <Textarea
              id="prompt"
              rows={4}
              value={formData.systemPrompt}
              onChange={(e) =>
                setFormData((prev) => prev ? { ...prev, systemPrompt: e.target.value } : null)
              }
              placeholder="Enter chatbot system prompt..."
              className="!border !border-default-200 shadow-none focus-visible:!ring-0 focus-visible:!border-default-300 text-xs"
            />
          </div>

          <SheetFooter className="pt-4 border-t border-default-200 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 px-4 !border !border-default-200 text-default-700 hover:bg-default-100"
            >
              Cancel
            </Button>
            <Button type="submit" className="h-9 px-4 gap-2">
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
