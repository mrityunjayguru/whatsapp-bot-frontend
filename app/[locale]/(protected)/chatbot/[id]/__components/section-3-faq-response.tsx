"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  ExternalLink,
  Search,
  Paperclip,
  Globe,
  Tag,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatbotDataProps } from "../../chatbot-table/data";
import { FAQDataProps, initialFaqData } from "../../../faqs/faqs-table/data";

interface Section3FaqResponseProps {
  chatbot: ChatbotDataProps;
}

interface StatCardProps {
  label: string;
  value: number;
  bgClass: string;
  valueClass: string;
  shade: string;
}

function StatCard({
  label,
  value,
  bgClass,
  valueClass,
  shade,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-none shadow-none rounded-lg transition-transform hover:scale-[1.02]",
        bgClass
      )}
    >
      <CardContent className="p-4 flex flex-col justify-between min-h-[130px]">
        <img
          src={`/images/all-img/${shade}.png`}
          alt=""
          draggable="false"
          className="absolute top-0 start-0 w-full h-full object-contain pointer-events-none opacity-80"
        />
        <div className="mb-2 text-xs font-semibold text-default-700 uppercase tracking-wide z-10 leading-snug">
          {label}
        </div>
        <div className={cn("text-3xl lg:text-4xl font-bold mb-1 z-10", valueClass)}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

export const Section3FaqResponse = ({ chatbot }: Section3FaqResponseProps) => {
  const [faqs, setFaqs] = useState<FAQDataProps[]>([]);
  const [faqMenuOpen, setFaqMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load FAQs from localStorage or initial fallback
    const saved = typeof window !== "undefined" ? localStorage.getItem("faqs_data") : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFaqs(parsed);
          return;
        }
      } catch (e) {
        console.error("Failed to parse local FAQs data", e);
      }
    }
    setFaqs(initialFaqData);
  }, []);

  // Compute stats
  const totalFaqs = faqs.length;
  const activeFaqs = faqs.filter((f) => f.status === "Active").length;
  const inactiveFaqs = faqs.filter((f) => f.status === "Inactive").length;
  const totalKeywords = faqs.reduce(
    (acc, f) => acc + (Array.isArray(f.keywords) ? f.keywords.length : 0),
    0
  );
  const faqsWithAttachments = faqs.filter(
    (f) => f.attachment && f.attachment.trim() !== ""
  ).length;
  const faqsWithUrls = faqs.filter(
    (f) => f.url && f.url.trim() !== ""
  ).length;

  const stats: StatCardProps[] = [
    {
      label: "Total FAQs",
      value: totalFaqs,
      bgClass: "bg-primary/10 dark:bg-primary/20",
      valueClass: "text-default-900 dark:text-default-100",
      shade: "shade-1",
    },
    {
      label: "Active FAQs",
      value: activeFaqs,
      bgClass: "bg-success/10 dark:bg-success/20",
      valueClass: "text-emerald-600 dark:text-emerald-400",
      shade: "shade-4",
    },
    {
      label: "Inactive FAQs",
      value: inactiveFaqs,
      bgClass: "bg-warning/10 dark:bg-warning/20",
      valueClass: "text-amber-600 dark:text-amber-400",
      shade: "shade-3",
    },
    {
      label: "Total Keywords",
      value: totalKeywords,
      bgClass: "bg-info/10 dark:bg-info/20",
      valueClass: "text-blue-600 dark:text-blue-400",
      shade: "shade-2",
    },
    {
      label: "FAQs With Attachments",
      value: faqsWithAttachments,
      bgClass: "bg-indigo-500/10 dark:bg-indigo-500/20",
      valueClass: "text-indigo-600 dark:text-indigo-400",
      shade: "shade-1",
    },
    {
      label: "FAQs With URLs",
      value: faqsWithUrls,
      bgClass: "bg-purple-500/10 dark:bg-purple-500/20",
      valueClass: "text-purple-600 dark:text-purple-400",
      shade: "shade-2",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      faq.question.toLowerCase().includes(query) ||
      faq.faqId.toLowerCase().includes(query) ||
      faq.category.toLowerCase().includes(query) ||
      faq.keywords.some((k: string) => k.toLowerCase().includes(query))
    );
  });

  return (
    <>
      <Card className="shadow-none border border-default-200">
        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-default-100">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                SECTION 3: FAQ & Response
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1">
              <Link href="/faqs">
                <Button
                  color="primary"
                  size="sm"
                  className="gap-2 h-9 px-4 shadow-sm"
                >
                  <span>Manage FAQs</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manage FAQs Drawer (FAQ Menu) */}
      <Sheet open={faqMenuOpen} onOpenChange={setFaqMenuOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col h-full">
          <SheetHeader className="p-4 sm:p-6 border-b border-default-200 text-start bg-default-50/50">
            <div className="flex items-center gap-2 mb-1">
              <Badge color="primary" className="text-xs">
                {chatbot.name}
              </Badge>
            </div>
            <SheetTitle className="text-lg font-bold text-default-900 flex items-center justify-between">
              <span>FAQ Menu</span>
              <Link href="/faqs">
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                  <span>Full Table</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </SheetTitle>
            <SheetDescription className="text-xs text-default-500">
              Connected FAQs system for {chatbot.name} (#{chatbot.chatbotId})
            </SheetDescription>

            {/* Search Input */}
            <div className="relative mt-3">
              <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-default-400" />
              <Input
                placeholder="Search FAQs by question, category, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 h-9 text-xs"
              />
            </div>
          </SheetHeader>

          {/* FAQ Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-10 text-default-400 text-xs">
                No FAQs match your search.
              </div>
            ) : (
              filteredFaqs.map((faq) => (
                <Link key={faq.id} href={`/faqs/${faq.id}`} className="block">
                  <div
                    className="p-3.5 rounded-lg border border-default-200 bg-background hover:border-primary/40 transition-colors space-y-2 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary font-mono">
                          #{faq.faqId}
                        </span>
                        <Badge
                          color={faq.status === "Active" ? "success" : "warning"}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {faq.status}
                        </Badge>
                      </div>
                      <Badge color="secondary" className="text-[10px] text-default-600">
                        {faq.category}
                      </Badge>
                    </div>

                    <h4 className="text-xs font-semibold text-default-800 leading-snug">
                      {faq.question}
                    </h4>

                    <p className="text-[11px] text-default-500 line-clamp-2">
                      {faq.answerPreview || faq.fullAnswer}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-default-400 border-t border-default-100">
                      {faq.keywords && faq.keywords.length > 0 && (
                        <span className="flex items-center gap-1 text-default-500">
                          <Tag className="w-3 h-3 text-default-400" />
                          {faq.keywords.slice(0, 3).join(", ")}
                        </span>
                      )}

                      {faq.attachment && (
                        <span className="flex items-center gap-1 text-indigo-600 font-medium ms-auto">
                          <Paperclip className="w-3 h-3" />
                          Attachment
                        </span>
                      )}

                      {faq.url && (
                        <span className="flex items-center gap-1 text-purple-600 font-medium ms-auto">
                          <Globe className="w-3 h-3" />
                          URL
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="p-4 border-t border-default-200 bg-default-50/50 flex items-center justify-between">
            <span className="text-xs text-default-500 font-medium">
              Total FAQs: {faqs.length}
            </span>
            <Link href="/faqs">
              <Button color="primary" size="sm" className="h-8 text-xs gap-1.5">
                <span>Manage FAQs Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
