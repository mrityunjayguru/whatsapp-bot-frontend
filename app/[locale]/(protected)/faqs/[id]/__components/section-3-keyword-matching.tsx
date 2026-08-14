"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FAQDataProps } from "../../faqs-table/data";

interface Section3KeywordMatchingProps {
  faq: FAQDataProps;
}

export const Section3KeywordMatching = ({ faq }: Section3KeywordMatchingProps) => {
  // Sample keywords list if specific ones needed alongside faq.keywords
  const defaultKeywordsList = [
    "hours",
    "timing",
    "open",
    "working hours",
    "office timing",
  ];

  // Combine FAQ keywords with list items
  const keywordsList = faq.keywords.length > 0 ? faq.keywords : defaultKeywordsList;

  return (
    <Card className="shadow-sm border border-default-200">
      <CardContent className="p-6 space-y-6">
        {/* Section Title Bar */}
        <div className="text-xs font-bold text-default-500 uppercase tracking-wider border-b border-default-200 pb-3">
          SECTION 3: Keyword Matching
        </div>

        {/* Match Type & Priority Rows */}
        <div className="space-y-3 pb-2 border-b border-default-100">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap  font-medium">
              Match Type
            </span>
            <span className="text-sm font-semibold text-default-800">
              {faq.matchType}
            </span>
          </div>

          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap font-medium">
              Priority
            </span>
            <span className="text-sm font-medium text-default-700">
              {faq.priority}
            </span>
          </div>
        </div>

        {/* Dedicated Keywords Part (Matching exact user screenshot) */}
        <div className="space-y-2 pt-1">
          <div className="text-base font-bold text-default-900">
            Keywords:
          </div>
          <div className="space-y-1.5 pl-0.5">
            {keywordsList.map((item, idx) => (
              <div
                key={idx}
                className={`text-sm ${
                  idx === keywordsList.length - 1
                    ? "text-blue-600 font-medium hover:underline cursor-pointer"
                    : "text-default-800 font-normal"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
