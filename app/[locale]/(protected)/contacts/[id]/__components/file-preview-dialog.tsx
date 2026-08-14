"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Paperclip, Download } from "lucide-react";
import { SharedFile, tabConfig } from "./files-shared-data";

interface FilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: SharedFile | null;
}

export function FilePreviewDialog({
  open,
  onOpenChange,
  file,
}: FilePreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Preview File</DialogTitle>
        </DialogHeader>
        {file && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-md border border-default-200 bg-default-50 flex items-center justify-center text-default-500">
                {(() => {
                  const meta = tabConfig.find((t) => t.key === file.kind);
                  const KindIcon = meta?.icon ?? Paperclip;
                  return <KindIcon className="w-5 h-5" />;
                })()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-default-800 truncate">
                  {file.name}
                </div>
                <div className="text-xs text-default-400">
                  {file.size} • {file.uploadedBy} • {file.uploadedAt}
                </div>
              </div>
            </div>

            <div className="border border-default-200 rounded-lg overflow-hidden bg-default-50 min-h-[280px] flex items-center justify-center">
              {file.kind === "image" && file.thumbnail ? (
                <img
                  src={file.thumbnail}
                  alt={file.name}
                  className="max-h-[400px] max-w-full object-contain"
                />
              ) : (
                <div className="p-8 text-center space-y-2">
                  <Paperclip className="w-12 h-12 text-default-300 mx-auto" />
                  <div className="text-sm font-medium text-default-700">
                    Preview not available for this file type
                  </div>
                  <div className="text-xs text-default-400">
                    Download the file to view its contents
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              Close
            </Button>
          </DialogClose>
          <Button color="primary" size="sm" className="h-9">
            <Download className="w-4 h-4 me-1.5" />
            Download File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
