"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User, Sparkles, RefreshCw, Phone, Play } from "lucide-react";
import { ChatbotDataProps } from "./data";
import { cn } from "@/lib/utils";

interface TestChatbotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bot: ChatbotDataProps | null;
  allBots: ChatbotDataProps[];
}

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

export function TestChatbotDialog({
  open,
  onOpenChange,
  bot,
  allBots,
}: TestChatbotDialogProps) {
  const [selectedBot, setSelectedBot] = useState<ChatbotDataProps | null>(bot);
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bot) {
      setSelectedBot(bot);
      resetChat(bot);
    }
  }, [bot]);

  const resetChat = (targetBot: ChatbotDataProps) => {
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: `Hello! I am "${targetBot.name}" running in ${targetBot.currentMode} mode on ${targetBot.whatsappNumber}. How can I assist you today?`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputVal.trim() || !selectedBot) return;

    const userText = inputVal.trim();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "";
      if (!selectedBot.enabled || selectedBot.status === "Inactive") {
        botResponse = `[System Notice]: This chatbot is currently ${selectedBot.status} / Disabled. Please enable it in Chatbot Settings to handle automated responses.`;
      } else if (selectedBot.currentMode === "Human") {
        botResponse = `[Human Agent Handover]: Your message has been routed to a human support representative. An agent will respond shortly.`;
      } else if (selectedBot.currentMode === "Hybrid") {
        botResponse = `Thank you for reaching out! In Hybrid mode, I can provide quick answers or transfer you to a team member if needed. (Response based on: "${selectedBot.systemPrompt.slice(0, 50)}...")`;
      } else {
        botResponse = `I received your message: "${userText}". As "${selectedBot.name}", I am ready to process your query automatically!`;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  if (!selectedBot) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg w-full p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 bg-default-100/60 dark:bg-default-800/40 border-b border-default-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center">
                <AvatarFallback className="bg-emerald-500/10 text-emerald-600 font-bold">
                  <Bot className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-base font-semibold text-default-900">
                    Test Chatbot Simulator
                  </DialogTitle>
                  <Badge className="bg-emerald-500/15 text-emerald-600 text-[10px] px-2 py-0 border-0">
                    Live Simulator
                  </Badge>
                </div>
                <DialogDescription className="text-xs text-default-500 flex items-center gap-2 mt-0.5">
                  <Phone className="w-3 h-3 text-emerald-500 inline" />
                  <span>{selectedBot.whatsappNumber}</span>
                  <span>•</span>
                  <span>Mode: <strong>{selectedBot.currentMode}</strong></span>
                </DialogDescription>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => resetChat(selectedBot)}
              className="w-8 h-8 text-default-500 hover:text-default-900"
              title="Reset conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Chat message list area */}
        <div className="h-[360px] overflow-y-auto p-4 space-y-3 bg-default-50/50 dark:bg-default-950/20">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex items-start gap-2.5 max-w-[85%]",
                m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0",
                  m.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-emerald-500/15 text-emerald-600 border border-emerald-500/20"
                )}
              >
                {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className="space-y-1">
                <div
                  className={cn(
                    "p-3 rounded-2xl text-xs leading-relaxed shadow-xs",
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-background border border-default-200 text-default-800 rounded-tl-none"
                  )}
                >
                  {m.text}
                </div>
                <span
                  className={cn(
                    "text-[10px] text-default-400 block px-1",
                    m.sender === "user" ? "text-right" : "text-left"
                  )}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-default-400 p-2">
              <Bot className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>{selectedBot.name} is typing...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Chat Input area */}
        <div className="p-3 border-t border-default-200 bg-background flex items-center gap-2">
          <Input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={`Send test message to ${selectedBot.name}...`}
            className="h-10 text-xs !border !border-default-200 shadow-none focus-visible:!ring-0 focus-visible:!border-default-300"
          />
          <Button
            onClick={handleSend}
            disabled={!inputVal.trim()}
            size="icon"
            className="h-10 w-10 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
