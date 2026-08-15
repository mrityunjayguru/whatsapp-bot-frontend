"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bot,
  User,
  Send,
  RefreshCw,
  Sparkles,
  Paperclip,
  Globe,
  Tag,
  HelpCircle,
  AlertCircle,
  FileText,
  MessageSquarePlus,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { ChatbotDataProps } from "../../chatbot-table/data";
import { FAQDataProps, initialFaqData } from "../../../faqs/faqs-table/data";

interface Section6TestChatbotProps {
  chatbot: ChatbotDataProps;
}

interface TestMessage {
  id: string;
  sender: "customer" | "chatbot";
  text: string;
  timestamp: string;
  detectedFaq?: FAQDataProps | null;
  matchedKeywords?: string[];
  attachment?: string | null;
  url?: string | null;
}

export const Section6TestChatbot = ({ chatbot }: Section6TestChatbotProps) => {
  const [faqs, setFaqs] = useState<FAQDataProps[]>([]);
  const [messages, setMessages] = useState<TestMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeDiagnosticMessage, setActiveDiagnosticMessage] = useState<TestMessage | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  // Matcher algorithm
  const processQuery = (query: string) => {
    const lowerQuery = query.toLowerCase().trim();

    if (lowerQuery.includes("business hour") || lowerQuery.includes("office hour")) {
      return {
        answer: "Our office is open Monday to Friday, 9 AM to 6 PM.",
        detectedFaq: {
          id: "demo-hours",
          faqId: "FAQ-100",
          question: "What are your business hours?",
          category: "General",
          keywords: ["Business Hours", "Office Hours", "Schedule"],
          answerPreview: "Our office is open Monday to Friday, 9 AM to 6 PM.",
          fullAnswer: "Our office is open Monday to Friday, 9 AM to 6 PM.",
          attachment: null,
          url: "",
          matchType: "Exact Match" as const,
          priority: "High" as const,
          status: "Active" as const,
          createdBy: { name: "Support Team", avatar: "" },
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
        matchedKeywords: ["Business Hours", "Schedule"],
        attachment: null,
        url: "",
      };
    }

    // 1. Exact match
    const exactMatch = faqs.find(
      (f) =>
        f.question.toLowerCase().includes(lowerQuery) ||
        lowerQuery.includes(f.question.toLowerCase()) ||
        lowerQuery.includes(f.faqId.toLowerCase())
    );

    if (exactMatch) {
      return {
        answer: exactMatch.fullAnswer || exactMatch.answerPreview,
        detectedFaq: exactMatch,
        matchedKeywords: exactMatch.keywords || [],
        attachment: exactMatch.attachment || null,
        url: exactMatch.url || null,
      };
    }

    // 2. Keyword match
    const keywordMatch = faqs.find((f) =>
      f.keywords?.some((kw) => lowerQuery.includes(kw.toLowerCase()))
    );

    if (keywordMatch) {
      const foundKws = keywordMatch.keywords.filter((kw) =>
        lowerQuery.includes(kw.toLowerCase())
      );
      return {
        answer: keywordMatch.fullAnswer || keywordMatch.answerPreview,
        detectedFaq: keywordMatch,
        matchedKeywords: foundKws.length > 0 ? foundKws : keywordMatch.keywords,
        attachment: keywordMatch.attachment || null,
        url: keywordMatch.url || null,
      };
    }

    // 3. Fallback answer
    const sampleQs = faqs.slice(0, 3).map((f) => `• "${f.question}"`);
    return {
      answer: `I couldn't find a direct match in our FAQ system. Here are sample topics you can ask me about:\n\n${sampleQs.join(
        "\n"
      )}\n\nFeel free to try one of these queries!`,
      detectedFaq: null,
      matchedKeywords: [],
      attachment: null,
      url: null,
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const messageText = textToSend || inputVal;
    if (!messageText.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg: TestMessage = {
      id: Math.random().toString(),
      sender: "customer",
      text: messageText.trim(),
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      const result = processQuery(messageText);

      const botMsg: TestMessage = {
        id: Math.random().toString(),
        sender: "chatbot",
        text: result.answer,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        detectedFaq: result.detectedFaq,
        matchedKeywords: result.matchedKeywords,
        attachment: result.attachment,
        url: result.url,
      };

      setMessages((prev) => [...prev, botMsg]);
      setActiveDiagnosticMessage(botMsg);
      setIsTyping(false);
    }, 450);
  };

  const handleResetChat = () => {
    setMessages([]);
    setActiveDiagnosticMessage(null);
    setInputVal("");
    toast.success("Test chat session reset!");
  };

  return (
    <Card className="shadow-none border border-default-200">
      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-default-100">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              SECTION 6: Test Chatbot
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetChat}
              className="h-8 border-default-200 hover:bg-default-50 gap-1.5 text-xs text-default-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear Test Chat</span>
            </Button>
          </div>
        </div>

        {/* Playground Grid: Chat Panel (Left 7 cols) & Show Diagnostics Panel (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Main Chat Interface */}
          <div className="lg:col-span-7 border border-default-200 rounded-xl bg-card shadow-sm flex flex-col h-[560px] overflow-hidden">
            {/* Chat Window Header */}
            <div className="px-5 py-3.5 border-b border-default-200 flex items-center justify-between shrink-0 bg-background">
              <div className="flex items-center gap-3">
                <div>
                  <h4 className="font-bold text-default-900 text-sm">
                    {chatbot.name}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-default-400">
                  #{chatbot.chatbotId}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-default-200 hover:bg-default-300 hover:text-default-600 gap-1.5 text-xs text-default-700"
                  onClick={handleResetChat}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </Button>
              </div>
            </div>

            {/* Scrollable Messages Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-default-50/50 select-text flex flex-col justify-between">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-3 my-auto">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-default-800">
                      Test {chatbot.name}
                    </h4>
                    <p className="text-xs text-default-500 max-w-xs mx-auto">
                      Click one of the suggested default messages below or type a message to start testing live responses.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isBot = msg.sender === "chatbot";
                    const isSelectedForDiag = activeDiagnosticMessage?.id === msg.id;

                    return (
                      <div
                        key={msg.id}
                        onClick={() => {
                          if (isBot) setActiveDiagnosticMessage(msg);
                        }}
                        className={cn(
                          "flex gap-3 max-w-[85%]",
                          isBot ? "mr-auto" : "ml-auto flex-row-reverse",
                          isBot ? "cursor-pointer" : ""
                        )}
                      >
                        {/* Avatar Icon */}


                        {/* Message Bubble */}
                        <div className="space-y-1">
                          <div
                            className={cn(
                              "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-2xs border transition-all",
                              isBot
                                ? "bg-background  text-default-800 rounded-tl-xs"
                                : "bg-emerald-500 text-white rounded-tr-xs",
                              isSelectedForDiag && isBot ? "" : ""
                            )}
                          >
                            {msg.text}
                          </div>
                          <div
                            className={cn(
                              "text-[10px] text-default-400 px-1 flex items-center gap-1.5",
                              isBot ? "justify-start" : "justify-end"
                            )}
                          >
                            <span>{msg.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-3 max-w-[85%] mr-auto">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="bg-background border border-default-200 rounded-2xl px-4 py-3.5 rounded-tl-xs shadow-2xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-default-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-default-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-default-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Suggestions panel */}
              {!isTyping && faqs.length > 0 && (
                <div className="pt-3 border-t border-default-200/60">
                  <div className="text-[11px] font-semibold text-default-500 mb-2">
                    Default Suggestions (Click to Test):
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {faqs.slice(0, 4).map((faq) => (
                      <button
                        key={faq.id}
                        onClick={() => handleSendMessage(faq.question)}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl border border-default-200 hover:border-primary hover:bg-primary/5 bg-background transition-all text-left group cursor-pointer shadow-3xs"
                      >
                        <MessageSquarePlus className="w-4 h-4 text-default-400 group-hover:text-primary shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold text-default-800 group-hover:text-primary transition-colors">
                            {faq.question}
                          </div>
                          <div className="text-[10px] text-default-400 mt-0.5 line-clamp-1">
                            {faq.category} • Match: {faq.matchType}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Inputs Footer Area */}
            <div className="p-4 border-t border-default-200 shrink-0 bg-background">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <Input
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask me something to test chatbot responses..."
                  className="h-10 border-default-200 text-sm focus-visible:ring-primary/20"
                />
                <Button
                  type="submit"
                  color="primary"
                  className="h-10 px-4 gap-2 shrink-0 font-medium"
                >
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>

            {/* Clean, Plain Text "Show Details" Panel (Iconless & Colorless) */}
            <div className="lg:col-span-5 border border-default-200 rounded-xl bg-card p-4 h-[560px] flex flex-col overflow-hidden">
            <div className="pb-3 border-b border-default-100 shrink-0">
              <h4 className="text-xs font-bold text-default-900 uppercase tracking-wide">
                Show Details
              </h4>
              <p className="text-[11px] text-default-500 mt-0.5">
                Live parameters for selected Chatbot response
              </p>
            </div>

            <div className="flex-1 overflow-y-auto pt-3 space-y-4">
              {activeDiagnosticMessage ? (
                <div className="space-y-4 text-xs">
                  {/* 1. Detected FAQ */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-default-600  tracking-wider">
                    Detected FAQ
                    </div>
                    {activeDiagnosticMessage.detectedFaq ? (
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className=" text-xs font-bold text-default-800">
                            #{activeDiagnosticMessage.detectedFaq.faqId}
                          </span>
                          <span className="text-[11px] text-default-600 font-medium">
                            {activeDiagnosticMessage.detectedFaq.status}
                          </span>
                          <span className="text-[11px] text-default-500">
                            • {activeDiagnosticMessage.detectedFaq.category}
                          </span>
                        </div>
                        <p className="font-medium text-default-800 text-xs">
                          {activeDiagnosticMessage.detectedFaq.question}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-default-600 font-medium">
                        No Direct FAQ Match (AI Fallback)
                      </p>
                    )}
                  </div>

                  <div className="border-t border-default-100" />

                  {/* 2. Matched Keywords */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-default-600  tracking-wider">
                    Matched Keywords
                    </div>
                    {activeDiagnosticMessage.matchedKeywords &&
                    activeDiagnosticMessage.matchedKeywords.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {activeDiagnosticMessage.matchedKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded bg-default-100 text-default-700 font-medium"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-default-400 italic">None</p>
                    )}
                  </div>

                  <div className="border-t border-default-100" />

                  {/* 3. Response */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-default-600  tracking-wider">
                    Response
                    </div>
                    <p className="text-xs text-default-800 leading-relaxed font-normal whitespace-pre-wrap">
                      {activeDiagnosticMessage.text}
                    </p>
                  </div>

                  <div className="border-t border-default-100" />

                  {/* 4. Attachment */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-default-600  tracking-wider">
                    Attachment
                    </div>
                    <p className="text-xs text-default-700 font-normal">
                      {activeDiagnosticMessage.attachment || "None"}
                    </p>
                  </div>

                  <div className="border-t border-default-100" />

                  {/* 5. URL */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-default-600  tracking-wider">
                      Url
                    </div>
                    {activeDiagnosticMessage.url ? (
                      <a
                        href={activeDiagnosticMessage.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-default-800 hover:underline font-normal break-all block"
                      >
                        {activeDiagnosticMessage.url}
                      </a>
                    ) : (
                      <p className="text-xs text-default-400 italic">None</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-16 px-4 space-y-2 text-default-400 my-auto">
                  <p className="text-xs font-medium text-default-600">
                    No details to show
                  </p>
                  <p className="text-[11px] text-default-400 max-w-xs">
                    Type a message or click a suggestion on the left to see live FAQ detection, keywords, attachment, and URL.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
