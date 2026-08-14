"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FAQDataProps } from "../../faqs-table/data";
import { Link2, ExternalLink } from "lucide-react";

interface Section5UrlProps {
  faq: FAQDataProps;
}

export const Section5Url = ({ faq }: Section5UrlProps) => {
  const url = faq.url || "";
  
  // Extract a readable label based on the URL or default to Documentation Page
  const urlLabel = faq.category ? `${faq.category} Reference Docs` : "Documentation Link";

  return (
    <Card className="shadow-sm border border-default-200 h-full">
      <CardContent className="p-6 space-y-6 flex flex-col justify-between h-full">
        <div className="space-y-6">
          {/* Section Title Bar */}
          <div className="flex items-center justify-between border-b border-default-200 pb-3">
            <div className="text-xs font-bold text-default-500 uppercase tracking-wider flex items-center gap-1.5">
              SECTION 5: URL
            </div>
          </div>

          {/* URL Details Rows */}
          <div className="space-y-4">
            {/* URL Label/Title */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-default-500 font-medium">
                URL Title / Label
              </span>
              <span className="text-sm font-semibold text-default-900">
                {urlLabel}
              </span>
            </div>

            {/* Hyperlink URL */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-default-500 font-medium">
                URL
              </span>
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline font-medium break-all"
                >
                  <span>{url}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 inline-block align-middle ml-1 opacity-70" />
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
