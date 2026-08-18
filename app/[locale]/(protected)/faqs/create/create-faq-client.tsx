"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/components/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { FAQDataProps } from "../faqs-table/data";
// import { uploadFaqText, uploadFaqDocument } from "../faq-api-service";
import { uploadFaqText, attachFaqFile } from "../faq-api-service";
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
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  // Note: category / keywords / matchType / priority / status are collected
  // here but the live backend (FastAPI FAQ store) doesn't persist them yet -
  // only `question` (-> name), `answer` (-> text), `url` (-> source_url),
  // and an attached file are sent to the bot's real knowledge base.

  // const handleSave = async () => {
  //   if (!question.trim()) {
  //     toast.error("Question is required");
  //     return;
  //   }
  //   if (!answer.trim()) {
  //     toast.error("Answer is required");
  //     return;
  //   }

  //   setSaving(true);
  //   try {
  //     // The written answer always goes in as a text source the bot can search.
  //     await uploadFaqText(
  //       answer.trim(),
  //       question.trim(),
  //       url.trim() || undefined,
  //       false // false = bot pastes the answer text; true = bot just sends the link
  //     );

  //     // If a file was attached, index it as a separate document source.
  //     if (attachmentFile) {
  //       await uploadFaqDocument(attachmentFile, true);
  //     }

  //     toast.success("New FAQ added and indexed for the bot!");
  //     router.push("/faqs");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to save FAQ — check the backend connection");
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const handleSave = async () => {
  if (!question.trim()) {
    toast.error("Question is required");
    return;
  }
  if (!answer.trim()) {
    toast.error("Answer is required");
    return;
  }

  setSaving(true);
  try {
    let fileUrl: string | undefined;
    if (attachmentFile) {
      const attached = await attachFaqFile(attachmentFile);
      fileUrl = attached.url;
    }

    // The typed question is the ONLY thing that should trigger this
    // answer. If a file was attached, its URL rides along as the
    // source_url and send_as_link=true so the bot replies with the
    // link - but only when THIS question matches, never for unrelated
    // messages that happen to resemble the file's internal content.
    await uploadFaqText(
      answer.trim(),
      question.trim(),
      fileUrl ?? (url.trim() || undefined),
      Boolean(fileUrl) // link mode only kicks in when a file is attached
    );

    toast.success("New FAQ added and indexed for the bot!");
    router.push("/faqs");
  } catch (err) {
    console.error(err);
    toast.error("Failed to save FAQ — check the backend connection");
  } finally {
    setSaving(false);
  }
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
            attachmentFile={attachmentFile}
            setAttachmentFile={setAttachmentFile}
            url={url}
            setUrl={setUrl}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
