"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Paperclip,
  Trash2,
  RefreshCw,
  MessageSquarePlus,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { FAQDataProps, initialFaqData } from "../faqs/faqs-table/data";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export function ChatbotClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! I am your AI Assistant. You can ask me any question, and I will search our FAQs to answer it instantly. Select one of the suggestions below to try it out!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [model, setModel] = useState("gemini-pro");
  const [temperature, setTemperature] = useState("0.7");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful customer support assistant. Answer queries clearly based on the FAQs."
  );
  const [isTyping, setIsTyping] = useState(false);
  const [faqs, setFaqs] = useState<FAQDataProps[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load FAQs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("faqs_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setFaqs(parsed);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    setFaqs(initialFaqData);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Find answers from local FAQs data
  const findAnswerInFaqs = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    // 1. Try exact matches on Question or FAQ ID
    const exactMatch = faqs.find(
      (f) =>
        f.question.toLowerCase().includes(lowerQuery) ||
        lowerQuery.includes(f.question.toLowerCase()) ||
        lowerQuery.includes(f.faqId.toLowerCase())
    );
    if (exactMatch) {
      return exactMatch.fullAnswer || exactMatch.answerPreview;
    }

    // 2. Try match on Keywords
    const keywordMatch = faqs.find((f) =>
      f.keywords.some((kw) => lowerQuery.includes(kw.toLowerCase()))
    );
    if (keywordMatch) {
      return keywordMatch.fullAnswer || keywordMatch.answerPreview;
    }

    // 3. Fallback default response listing some items
    const sampleQuestions = faqs.slice(0, 3).map((f) => `• "${f.question}"`);
    return `I couldn't find a direct match in our FAQs. Here are a few things you can ask me about:\n\n${sampleQuestions.join(
      "\n"
    )}\n\nFeel free to try one of these queries!`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const messageText = textToSend || inputVal;
    if (!messageText.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal("");
    setIsTyping(true);

    // Simulate chatbot typing delay
    setTimeout(() => {
      const answerText = findAnswerInFaqs(messageText);
      const botMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: answerText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: "Chat history has been reset. How can I help you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    toast.success("Chat history cleared");
  };

  return (
    <div className="mt-5 grid grid-cols-1 xl:grid-cols-4 gap-6 items-stretch">
      {/* Sidebar: Chat Parameters */}
      <Card className="xl:col-span-1 border-default-200 shadow-sm flex flex-col justify-between">
        <CardContent className="p-6 space-y-6">
          <div className="border-b border-default-200 pb-4">
            <h3 className="text-lg font-bold text-default-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI settings
            </h3>
            <p className="text-xs text-default-500 mt-1">
              Configure parameters for the chatbot response.
            </p>
          </div>

          <div className="space-y-4">
            {/* Model Select */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-default-800">Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="h-10 border-default-200">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-pro">Gemini 1.5 Pro (Recommended)</SelectItem>
                  <SelectItem value="gemini-flash">Gemini 1.5 Flash</SelectItem>
                  <SelectItem value="claude-sonnet">Claude 3.5 Sonnet</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4o Mini</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <Label className="text-default-800">Temperature</Label>
                <span className="text-xs text-primary font-semibold">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full h-1.5 bg-default-100 rounded-lg appearance-none cursor-pointer accent-primary border border-default-200"
              />
              <div className="flex justify-between text-[10px] text-default-400">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>

            {/* System Prompt */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-default-800">System Instructions</Label>
              <Textarea
                rows={4}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="border-default-200 text-sm leading-relaxed p-3"
              />
            </div>
          </div>

          {/* Reset Action */}
          <div className="pt-4 border-t border-default-200 flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5 h-10 text-default-700 hover:bg-default-50 border-default-200"
              onClick={handleResetChat}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
              <span>Clear History</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Chat Interface */}
      <Card className="xl:col-span-3 border-default-200 shadow-sm flex flex-col h-[600px]">
        {/* Chat Window Header */}
        <div className="px-6 py-4 border-b border-default-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-default-900 text-sm">Dashcode AI Assistant</h4>
              <p className="text-xs text-emerald-500 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
                Online
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-default-200 hover:bg-default-50 gap-1.5 text-xs text-default-700"
              onClick={handleResetChat}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
          </div>
        </div>

        {/* Scrollable Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-default-50/50 select-text">
          {messages.map((msg) => {
            const isBot = msg.sender === "bot";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  isBot ? "mr-auto" : "ml-auto flex-row-reverse"
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs font-semibold ${
                    isBot
                      ? "bg-primary/10 border-primary/20 text-primary"
                      : "bg-default-100 border-default-200 text-default-600"
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1">
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-2xs border ${
                      isBot
                        ? "bg-background border-default-200 text-default-800 rounded-tl-xs"
                        : "bg-primary border-primary-500 text-white rounded-tr-xs shadow-primary-500/10"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-default-400 block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-background border border-default-200 rounded-2xl px-4 py-3.5 rounded-tl-xs shadow-2xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-default-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-default-400 rounded-full animate-bounce delay-200"></span>
                <span className="w-1.5 h-1.5 bg-default-400 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}

          {/* Suggestions panel (Only shown when welcome message is visible) */}
          {messages.length === 1 && !isTyping && (
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pl-11">
              {faqs.slice(0, 4).map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => handleSendMessage(faq.question)}
                  className="flex items-start gap-2.5 p-3 rounded-xl border border-default-200 hover:border-primary hover:bg-primary/5 bg-background transition-all text-left group cursor-pointer shadow-3xs"
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
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Inputs Footer Area */}
        <div className="p-4 border-t border-default-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 border-default-200 hover:bg-default-50 text-default-400"
              onClick={() => toast.success("Attachments are simulated")}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask me something about the platform..."
              className="h-10 border-default-200 flex-1 focus:ring-1"
            />
            <Button type="submit" size="icon" className="h-10 w-10 shrink-0 shadow-none">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
