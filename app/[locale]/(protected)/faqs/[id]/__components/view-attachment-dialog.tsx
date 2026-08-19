"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, FileText, X } from "lucide-react";
import { openPdfInNewTab } from "@/lib/pdf-utils";

interface ViewAttachmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  fileType: string;
  fileSize: string;
  onDownload: () => void;
}

const getFileDisplayName = (urlOrName: string) => {
  if (!urlOrName) return "";
  try {
    if (urlOrName.startsWith("http://") || urlOrName.startsWith("https://")) {
      const url = new URL(urlOrName);
      const pathname = url.pathname;
      const basename = pathname.split("/").pop();
      if (basename) return decodeURIComponent(basename);
    }
  } catch (e) {
    // fallback
  }
  return urlOrName;
};

export function ViewAttachmentDialog({
  open,
  onOpenChange,
  fileName,
  fileType,
  fileSize,
  onDownload,
}: ViewAttachmentDialogProps) {
  const displayName = getFileDisplayName(fileName);
  const isUrl = fileName.startsWith("http://") || fileName.startsWith("https://");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[90%] max-w-[calc(100vw-2rem)] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <span>Attachment Preview</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3 min-w-0 overflow-hidden">
          {/* File Card Preview */}
          <div className="p-4 rounded-xl bg-default-50 border border-default-200 space-y-3 min-w-0 overflow-hidden">
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="text-xs text-default-500 font-medium uppercase tracking-wider shrink-0">
                File Details
              </span>
              <Badge color="secondary" className="text-xs font-semibold shrink-0">
                {fileType}
              </Badge>
            </div>

            <div className="min-w-0 space-y-1">
              <h4
                className="text-sm font-bold text-default-900 truncate break-all"
                title={displayName}
              >
                {displayName}
              </h4>
              {isUrl && (
                <p
                  className="text-xs text-default-400 truncate break-all"
                  title={fileName}
                >
                  {fileName}
                </p>
              )}
              <p className="text-xs text-default-500 mt-0.5">Size: {fileSize}</p>
            </div>
          </div>

          {/* Sample Document Viewer Simulation */}
          <div className="p-6 rounded-xl border border-dashed border-default-300 bg-background text-center space-y-2 min-w-0 overflow-hidden">
            <FileText className="w-10 h-10 text-default-400 mx-auto" />
            <p className="text-xs text-default-600 font-medium">
              Document Preview Ready
            </p>
            <p className="text-[11px] text-default-400 break-all px-2 line-clamp-3">
              Click download to get the full copy of{" "}
              <span className="font-medium text-default-600 break-all" title={displayName}>
                {displayName}
              </span>
            </p>
          </div>
        </div>

        <DialogFooter className="sm:gap-2 flex justify-end items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            variant="outline"
            size="md"
            className="gap-1.5"
            onClick={() => {
              openPdfInNewTab(fileName);
              onOpenChange(false);
            }}
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in New Tab</span>
          </Button>
          <Button
            color="primary"
            size="md"
            className="gap-1.5"
            onClick={() => {
              onDownload();
              onOpenChange(false);
            }}
          >
            <Download className="w-4 h-4" />
            <span>Download File</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
