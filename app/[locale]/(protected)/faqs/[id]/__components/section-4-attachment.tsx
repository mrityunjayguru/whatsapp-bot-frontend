"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FAQDataProps } from "../../faqs-table/data";
import { Paperclip, Download, Eye, FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { ViewAttachmentDialog } from "./view-attachment-dialog";

interface Section4AttachmentProps {
  faq: FAQDataProps;
}

export const Section4Attachment = ({ faq }: Section4AttachmentProps) => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const fileName = faq.attachment || "quickstart_guide.pdf";
  const fileType = fileName.endsWith(".pdf")
    ? "PDF Document"
    : fileName.endsWith(".png") || fileName.endsWith(".jpg")
    ? "Image File"
    : "Document";
  const fileSize = "2.4 MB";
  const uploadedAt = faq.createdAt || "2024-01-10";

  // Real browser download function
  const handleDownload = () => {
    try {
      const sampleContent = `Document: ${fileName}\nFAQ ID: ${faq.faqId}\nQuestion: ${faq.question}\nAnswer: ${faq.fullAnswer || faq.answerPreview}\nDownloaded At: ${new Date().toLocaleString()}`;
      const blob = new Blob([sampleContent], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${fileName} successfully!`);
    } catch (err) {
      toast.error(`Failed to download ${fileName}`);
    }
  };

  // View preview function
  const handleView = () => {
    setViewDialogOpen(true);
    toast.success(`Opening preview for ${fileName}`);
  };

  return (
    <Card className="shadow-sm border border-default-200 h-full">
      <CardContent className="p-6 space-y-6 flex flex-col justify-between h-full">
        <div className="space-y-6">
          {/* Section Title Bar */}
          <div className="flex items-center justify-between border-b border-default-200 pb-3">
            <div className="text-xs font-bold text-default-500 uppercase tracking-wider flex items-center gap-1.5">
              SECTION 4: Attachment
            </div>
          </div>

          {/* Attachment Details Rows */}
          <div className="space-y-3">
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
                File Name
              </span>
              <span className="text-sm font-semibold text-default-900 truncate">
                {fileName}
              </span>
            </div>

            <div className="flex items-baseline gap-2 min-w-0">
              <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
                File Type
              </span>
              <span className="text-sm font-medium text-default-700">
                {fileType}
              </span>
            </div>

            <div className="flex items-baseline gap-2 min-w-0">
              <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
                File Size
              </span>
              <span className="text-sm font-medium text-default-700">
                {fileSize}
              </span>
            </div>

            <div className="flex items-baseline gap-2 min-w-0">
              <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
                Uploaded At
              </span>
              <span className="text-sm font-medium text-default-700">
                {uploadedAt}
              </span>
            </div>

            {/* View / Download Action Row */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
                View / Download
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs !border !border-default-200 hover:bg-gray-100 hover:text-gray-700"
                  onClick={handleView}
                >
                  <Eye className="w-3.5 h-3.5 text-gray-500" />
                  <span>View</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs !border !border-default-200 hover:bg-gray-100 hover:text-gray-700"
                  onClick={handleDownload}
                >
                  <Download className="w-3.5 h-3.5 text-gray-500" />
                  <span>Download</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Attachment Preview Modal Dialog */}
      <ViewAttachmentDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        fileName={fileName}
        fileType={fileType}
        fileSize={fileSize}
        onDownload={handleDownload}
      />
    </Card>
  );
};
