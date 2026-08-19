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

const getFileTypeLabel = (fileNameOrUrl: string) => {
  const cleanName = getFileDisplayName(fileNameOrUrl).toLowerCase();
  if (cleanName.endsWith(".pdf")) return "PDF Document";
  if (cleanName.endsWith(".docx") || cleanName.endsWith(".doc")) return "Word Document";
  if (cleanName.endsWith(".xlsx") || cleanName.endsWith(".xls") || cleanName.endsWith(".csv")) return "Spreadsheet";
  if (cleanName.endsWith(".png") || cleanName.endsWith(".jpg") || cleanName.endsWith(".jpeg") || cleanName.endsWith(".webp") || cleanName.endsWith(".svg")) return "Image File";
  return "Document";
};

export const Section4Attachment = ({ faq }: Section4AttachmentProps) => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const rawFileName = faq.attachment || "quickstart_guide.pdf";
  const displayName = getFileDisplayName(rawFileName);
  const fileType = getFileTypeLabel(rawFileName);
  const fileSize = "2.4 MB";
  const uploadedAt = faq.createdAt || "2024-01-10";

  // Real browser download function
  const handleDownload = () => {
    try {
      const sampleContent = `Document: ${displayName}\nURL: ${rawFileName}\nFAQ ID: ${faq.faqId}\nQuestion: ${faq.question}\nAnswer: ${faq.fullAnswer || faq.answerPreview}\nDownloaded At: ${new Date().toLocaleString()}`;
      const blob = new Blob([sampleContent], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = displayName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${displayName} successfully!`);
    } catch (err) {
      toast.error(`Failed to download ${displayName}`);
    }
  };

  // View preview function
  const handleView = () => {
    setViewDialogOpen(true);
    toast.success(`Opening preview for ${displayName}`);
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
              <span className="text-sm font-semibold text-default-900 truncate" title={rawFileName}>
                {displayName}
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
        fileName={rawFileName}
        fileType={fileType}
        fileSize={fileSize}
        onDownload={handleDownload}
      />
    </Card>
  );
};
