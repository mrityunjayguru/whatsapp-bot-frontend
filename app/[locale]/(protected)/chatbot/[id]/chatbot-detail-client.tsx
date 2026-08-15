"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/navigation";
import { ArrowLeft, Play } from "lucide-react";
import { ChatbotDataProps } from "../chatbot-table/data";
import { Section1BasicSettings } from "./__components/section-1-basic-settings";
import { Section2WelcomeMessage } from "./__components/section-2-welcome-message";
import { Section3FaqResponse } from "./__components/section-3-faq-response";
import { Section4HumanHandover } from "./__components/section-4-human-handover";
import { Section5BehaviorRules } from "./__components/section-5-behavior-rules";
import { Section6TestChatbot } from "./__components/section-6-test-chatbot";
import { Section7ChatbotConversations } from "./__components/section-7-chatbot-conversations";

export function ChatbotDetailClient({
  chatbot,
}: {
  chatbot: ChatbotDataProps;
}) {
  const [currentBot, setCurrentBot] = useState<ChatbotDataProps>({ ...chatbot });

  const scrollToTestSection = () => {
    const el = document.getElementById("section-6-test-chatbot");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link href="/chatbot">
            <Button
              variant="outline"
              size="sm"
              className="h-9 !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              <ArrowLeft className="w-4 h-4 me-1.5" />
              Back
            </Button>
          </Link>
          <div className="text-xs text-default-500">
            Chatbot ID #{" "}
            <span className="font-semibold text-default-700">
              {currentBot.chatbotId}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToTestSection}
            className="h-9 gap-2 !border !border-default-200 shadow-none bg-background hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-600 hover:text-emerald-700 hover:border-emerald-500/30"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Test Chatbot</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <Section1BasicSettings
          chatbot={currentBot}
          onSave={(updated) => setCurrentBot((prev) => ({ ...prev, ...updated }))}
        />
        <Section2WelcomeMessage
          chatbot={currentBot}
          onSave={(updated) => setCurrentBot((prev) => ({ ...prev, ...updated }))}
        />
      </div>

      {/* Section 3: FAQ & Response System */}
      <Section3FaqResponse chatbot={currentBot} />

      {/* Section 4 & Section 5 Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <Section4HumanHandover
          chatbot={currentBot}
          onSave={(updated) => setCurrentBot((prev) => ({ ...prev, ...updated }))}
        />
        <Section5BehaviorRules
          chatbot={currentBot}
          onSave={(updated) => setCurrentBot((prev) => ({ ...prev, ...updated }))}
        />
      </div>

      {/* Section 6: Test Chatbot Playground */}
      <div id="section-6-test-chatbot">
        <Section6TestChatbot chatbot={currentBot} />
      </div>

      {/* Section 7: Chatbot Conversations Table */}
      <Section7ChatbotConversations chatbot={currentBot} />
    </div>
  );
}