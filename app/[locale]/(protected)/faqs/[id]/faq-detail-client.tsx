"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/navigation";
import { FAQDataProps, getFaqById } from "../faqs-table/data";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Section1FAQInfo } from "./__components/section-1-faq-info";
import { Section2ChatbotResponse } from "./__components/section-2-chatbot-response";
import { Section3KeywordMatching } from "./__components/section-3-keyword-matching";
import { Section4Attachment } from "./__components/section-4-attachment";
import { Section5Url } from "./__components/section-5-url";

function FAQNotFound() {
  return (
    <Card>
      <CardContent className="p-10 text-center flex flex-col items-center justify-center">
        <HelpCircle className="w-12 h-12 text-default-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-default-800 mb-1">
          FAQ Entry Not Found
        </h3>
        <p className="text-sm text-default-500 mb-5">
          The FAQ record you are looking for does not exist or has been removed.
        </p>
        <Link href="/faqs">
          <Button color="primary">
            Back to FAQs
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function FAQDetailClient({ id }: { id: string }) {
  const [faq, setFaq] = useState<FAQDataProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to find in localStorage
    const saved = localStorage.getItem("faqs_data");
    let foundFaq: FAQDataProps | undefined;
    if (saved) {
      try {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) {
          foundFaq = list.find(
            (item) => item.id === id || item.faqId.toLowerCase() === id.toLowerCase() || item.faqId === `FAQ-${id}`
          );
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Fallback to static data
    if (!foundFaq) {
      foundFaq = getFaqById(id);
    }

    if (foundFaq) {
      setFaq(foundFaq);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-default-500">
        Loading FAQ Details...
      </div>
    );
  }

  if (!faq) {
    return <FAQNotFound />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/faqs">
            <Button
              variant="outline"
              size="sm"
              className="h-9 !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0"
            >
              <ArrowLeft className="w-4 h-4 me-1.5" />
              Back to FAQs
            </Button>
          </Link>
          <div className="text-xs text-default-500">
            FAQ ID #{" "}
            <span className="font-semibold text-default-800">
              {faq.faqId}
            </span>
          </div>
        </div>
      </div>

      {/* Top Grid: SECTION 1 & SECTION 2 (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <Section1FAQInfo initialFaq={faq} />
        <Section2ChatbotResponse faq={faq} />
      </div>

      {/* Bottom Grid: SECTION 3, SECTION 4 & SECTION 5 (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        <Section3KeywordMatching faq={faq} />
        <Section4Attachment faq={faq} />
        <Section5Url faq={faq} />
      </div>
    </div>
  );
}
