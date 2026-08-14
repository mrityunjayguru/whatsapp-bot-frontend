"use client";

import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Paperclip, Link2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface Section2FAQChatbotResponseProps {
  answer: string;
  setAnswer: (val: string) => void;
  attachment: string;
  setAttachment: (val: string) => void;
  url: string;
  setUrl: (val: string) => void;
  className?: string;
}

export const Section2FAQChatbotResponse = ({
  answer,
  setAnswer,
  attachment,
  setAttachment,
  url,
  setUrl,
  className,
}: Section2FAQChatbotResponseProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file.name);
    }
  };

  return (
    <Card className={cn("shadow-sm border border-default-200 h-full flex flex-col", className)}>
      <CardContent className="p-6 space-y-6 flex-1 flex flex-col justify-between">
        {/* Section Title Bar */}
        <div className="space-y-1 border-b border-default-200 pb-4">
          <div className="text-xs font-bold text-default-500 uppercase tracking-wider">
            SECTION 2 :  Chatbot Response
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 flex-1 flex flex-col">
          {/* Answer Textarea */}
          <div className="space-y-1.5 flex-1 flex flex-col">
            <Label htmlFor="answer" className="text-xs text-default-500 font-medium">
              Answer <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="answer"
              placeholder="Write the complete answer response here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              className="flex-1 min-h-[340px] border-default-200 text-sm leading-relaxed p-4"
            />
          </div>

          {/* Attachment Input */}
          <div className="space-y-1.5 shrink-0">
            <Label htmlFor="attachment" className="text-xs text-default-500 font-medium flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-default-400" />
              Attachment
            </Label>
            <div className="flex gap-2">
              <Input
                id="attachment"
                placeholder="e.g. quickstart_guide.pdf"
                value={attachment}
                onChange={(e) => setAttachment(e.target.value)}
                className="h-10 border-default-200 flex-1"
              />
              <Button
                type="button"
                variant="outline"
                className="h-10 shrink-0 border-default-200 hover:bg-default-100 px-4 gap-1.5 text-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
                <span>Select from File</span>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-1.5 shrink-0">
            <Label htmlFor="url" className="text-xs text-default-500 font-medium flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-default-400" />
              URL
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://docs.dashcode.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-10 border-default-200"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
