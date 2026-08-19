"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FAQDataProps } from "../../faqs-table/data";
import {
  MessageSquare,
  Copy,
  Check,
  Paperclip,
  ExternalLink,
  FileText,
  Link2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { openPdfInNewTab } from "@/lib/pdf-utils";

interface Section2ChatbotResponseProps {
  faq: FAQDataProps;
}

export const Section2ChatbotResponse = ({ faq }: Section2ChatbotResponseProps) => {
  const [copied, setCopied] = useState(false);

  const hasAttachment = !!faq.attachment;
  const hasUrl = !!faq.url;

  // Calculate Response Type based on user spec
  const getResponseType = () => {
    if (hasAttachment && hasUrl) return "Text + Attachment + URL";
    if (hasAttachment) return "Text + Attachment";
    if (hasUrl) return "Text + URL";
    return "Text";
  };

  const responseType = getResponseType();

  // Determine Attachment Type extension
  const getAttachmentType = (fileName: string | null) => {
    if (!fileName) return "N/A";
    if (fileName.endsWith(".pdf")) return "PDF Document";
    if (fileName.endsWith(".json")) return "JSON File";
    if (fileName.endsWith(".png") || fileName.endsWith(".jpg")) return "Image File";
    return "File Document";
  };

  const handleCopyAnswer = () => {
    navigator.clipboard.writeText(faq.fullAnswer || faq.answerPreview);
    setCopied(true);
    toast.success("Chatbot answer copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="shadow-sm border border-default-200 h-full">
      <CardContent className="p-6 space-y-6 flex flex-col justify-between h-full">
        <div className="space-y-6">
          {/* Section Title Bar */}
          <div className="flex items-center justify-between border-b border-default-200 pb-4">
            <div className="text-xs font-bold text-default-500 uppercase tracking-wider flex items-center gap-1.5">
              SECTION 2: Chatbot Response
            </div>
          </div>

          {/* Full Answer Content Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-default-500 uppercase tracking-wider">
                Answer Content
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs gap-1.5 !border !border-default-200"
                onClick={handleCopyAnswer}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-default-500" />
                )}
                <span>{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>
            <div className="p-4 rounded-xl bg-default-50 dark:bg-slate-900 border border-default-200 leading-relaxed text-default-800 text-sm">
              {faq.fullAnswer || faq.answerPreview}
            </div>
          </div>

          {/* Response Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
            {/* Response Type Field */}
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
                Response Type
              </span>
              <span className="text-sm font-semibold text-default-800">
                {responseType}
              </span>
            </div>

            {/* Attachment Present */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
                Attachment
              </span>
              <span className="text-sm font-semibold text-default-800 flex items-center gap-1.5">
                {hasAttachment ? (
                  <>
                    <Paperclip className="w-4 h-4 text-primary" />
                    <span>Yes</span>
                  </>
                ) : (
                  <span className="text-default-400">No</span>
                )}
              </span>
            </div>

            {/* Attachment Type */}
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
                Attachment Type
              </span>
              <span className="text-sm font-medium text-default-700">
                {getAttachmentType(faq.attachment)}
              </span>
            </div>

            {/* Attachment Name */}
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
                Attachment Name
              </span>
              {faq.attachment ? (
                <button
                  type="button"
                  onClick={() => openPdfInNewTab(faq.attachment)}
                  className="text-sm font-medium text-primary hover:underline truncate cursor-pointer text-left"
                >
                  {faq.attachment}
                </button>
              ) : (
                <span className="text-sm font-medium text-default-400">N/A</span>
              )}
            </div>

            {/* URL */}
            <div className="flex items-baseline gap-2 min-w-0 md:col-span-2">
              <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
                URL
              </span>
              {hasUrl ? (
                <a
                  href={faq.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline font-medium truncate"
                >
                  <Link2 className="w-4 h-4 shrink-0 text-blue-500" />
                  <span className="truncate">{faq.url}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-1 opacity-70" />
                </a>
              ) : (
                <span className="text-sm text-default-400">N/A</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
