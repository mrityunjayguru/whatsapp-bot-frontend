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
import { Download, FileText, X } from "lucide-react";

interface ViewAttachmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  fileType: string;
  fileSize: string;
  onDownload: () => void;
}

export function ViewAttachmentDialog({
  open,
  onOpenChange,
  fileName,
  fileType,
  fileSize,
  onDownload,
}: ViewAttachmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <FileText className="w-5 h-5 text-primary" />
            <span>Attachment Preview</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* File Card Preview */}
          <div className="p-4 rounded-xl bg-default-50 border border-default-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-default-500 font-medium uppercase tracking-wider">
                File Details
              </span>
              <Badge color="secondary" className="text-xs font-semibold">
                {fileType}
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-bold text-default-900 truncate">
                {fileName}
              </h4>
              <p className="text-xs text-default-500 mt-0.5">Size: {fileSize}</p>
            </div>
          </div>

          {/* Sample Document Viewer Simulation */}
          <div className="p-6 rounded-xl border border-dashed border-default-300 bg-background text-center space-y-2">
            <FileText className="w-10 h-10 text-default-400 mx-auto" />
            <p className="text-xs text-default-600 font-medium">
              Document Preview Ready
            </p>
            <p className="text-[11px] text-default-400">
              Click download to get the full copy of {fileName}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            color="primary"
            size="sm"
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
