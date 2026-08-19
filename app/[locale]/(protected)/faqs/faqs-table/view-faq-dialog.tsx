"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FAQDataProps } from "./data";
import { ExternalLink, Paperclip } from "lucide-react";
import { openPdfInNewTab } from "@/lib/pdf-utils";

interface ViewFAQDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq: FAQDataProps | null;
}

export function ViewFAQDialog({
  open,
  onOpenChange,
  faq,
}: ViewFAQDialogProps) {
  if (!faq) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 pr-6">
            <span className="text-xs font-semibold text-primary">#{faq.faqId}</span>
            <Badge color="secondary" className="text-xs">{faq.category}</Badge>
          </div>
          <DialogTitle className="text-lg font-bold text-default-900 pt-1">
            {faq.question}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm text-default-700">
          <div>
            <span className="text-xs font-semibold text-default-400 block mb-1">
              ANSWER CONTENT
            </span>
            <p className="p-3.5 rounded-lg bg-default-100 dark:bg-slate-900 leading-relaxed text-sm">
              {faq.fullAnswer || faq.answerPreview}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-default-400 font-medium block">Match Type</span>
              <span className="font-semibold text-default-800">{faq.matchType}</span>
            </div>
            <div>
              <span className="text-default-400 font-medium block">Priority</span>
              <span className="font-semibold text-default-800">{faq.priority}</span>
            </div>
            <div>
              <span className="text-default-400 font-medium block">Status</span>
              <span className="font-semibold text-default-800">{faq.status}</span>
            </div>
            <div>
              <span className="text-default-400 font-medium block">Created By</span>
              <span className="font-semibold text-default-800">{faq.createdBy.name}</span>
            </div>
          </div>

          {faq.keywords && faq.keywords.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-default-400 block mb-1">
                KEYWORDS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {faq.keywords.map((kw, i) => (
                  <Badge key={i} color="default" className="text-xs bg-default-100 text-default-700">
                    #{kw}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {(faq.attachment || faq.url) && (
            <div className="pt-2 border-t border-default-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              {faq.attachment && (
                <div className="flex items-center gap-1.5 text-primary font-medium">
                  <Paperclip className="w-4 h-4" />
                  <button
                    type="button"
                    onClick={() => openPdfInNewTab(faq.attachment)}
                    className="hover:underline text-primary text-xs font-medium cursor-pointer"
                  >
                    {faq.attachment}
                  </button>
                </div>
              )}
              {faq.url && (
                <a
                  href={faq.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline font-medium"
                >
                  <span>Open Documentation</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
