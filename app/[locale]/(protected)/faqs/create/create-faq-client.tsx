"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/components/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { FAQDataProps, initialFaqData } from "../faqs-table/data";

import { Section1FAQForm } from "./__components/section-1-faq-form";
import { Section2FAQChatbotResponse } from "./__components/section-2-faq-chatbot-response";
import { Section3FAQSettings } from "./__components/section-3-faq-settings";

export function CreateFAQClient() {
  const router = useRouter();

  // Form States
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("General");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [matchType, setMatchType] = useState<FAQDataProps["matchType"]>("Exact Match");
  const [priority, setPriority] = useState<FAQDataProps["priority"]>("Medium");
  const [status, setStatus] = useState<FAQDataProps["status"]>("Active");
  const [answer, setAnswer] = useState("");
  const [attachment, setAttachment] = useState("");
  const [url, setUrl] = useState("");

  const [faqId, setFaqId] = useState("FAQ-111");

  useEffect(() => {
    const saved = localStorage.getItem("faqs_data");
    let currentLength = initialFaqData.length;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          currentLength = parsed.length;
        }
      } catch (e) {
        console.error(e);
      }
    }
    setFaqId(`FAQ-10${currentLength + 1}`);
  }, []);

  // Split and clean keywords
  const keywords = keywordsInput
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0);

  const handleSave = () => {
    if (!question.trim()) {
      toast.error("Question is required");
      return;
    }
    if (!answer.trim()) {
      toast.error("Answer is required");
      return;
    }

    // Get current data from localStorage
    let currentData = [...initialFaqData];
    const saved = localStorage.getItem("faqs_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          currentData = parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }

    const newId = (currentData.length + 1).toString();
    const newFaq: FAQDataProps = {
      id: newId,
      faqId: faqId,
      question: question.trim(),
      category: category,
      keywords: keywords,
      answerPreview: answer.slice(0, 100) + (answer.length > 100 ? "..." : ""),
      fullAnswer: answer.trim(),
      attachment: attachment.trim() ? attachment.trim() : null,
      url: url.trim(),
      matchType: matchType,
      priority: priority,
      status: status,
      createdBy: {
        name: "Kathryn Murphy",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kathryn",
      },
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    const updatedData = [newFaq, ...currentData];
    localStorage.setItem("faqs_data", JSON.stringify(updatedData));
    toast.success("New FAQ added successfully!");
    router.push("/faqs");
  };

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
              {faqId}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Layout: Left Column & Right Column Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Left: Section 1 FAQ Form & Section 3 Settings */}
        <div className="space-y-5 flex flex-col h-full justify-between">
          <Section1FAQForm
            question={question}
            setQuestion={setQuestion}
            category={category}
            setCategory={setCategory}
            keywordsInput={keywordsInput}
            setKeywordsInput={setKeywordsInput}
            matchType={matchType}
            setMatchType={setMatchType}
            priority={priority}
            setPriority={setPriority}
            className="w-full shrink-0"
          />
          <Section3FAQSettings
            status={status}
            setStatus={setStatus}
            onSave={handleSave}
            className="w-full flex-1"
          />
        </div>

        {/* Right: Section 2 Chatbot Response */}
        <div className="h-full">
          <Section2FAQChatbotResponse
            answer={answer}
            setAnswer={setAnswer}
            attachment={attachment}
            setAttachment={setAttachment}
            url={url}
            setUrl={setUrl}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
