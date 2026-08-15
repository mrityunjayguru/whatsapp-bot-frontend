import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/navigation";
import { getChatbotById } from "../chatbot-table/data";
import { ChatbotDetailClient } from "./chatbot-detail-client";

function ChatbotNotFound() {
  return (
    <Card className="mt-5 shadow-none border border-default-200">
      <CardContent className="p-10 text-center">
        <Bot className="w-12 h-12 text-default-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-default-800 mb-1">
          Chatbot Not Found
        </h3>
        <p className="text-sm text-default-500 mb-5">
          The chatbot you are looking for does not exist or has been removed.
        </p>
        <Link href="/chatbot">
          <Button color="primary">
            Back to Chatbots
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

const ChatbotDetailPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const chatbot = getChatbotById(id);

  if (!chatbot) {
    return (
      <div>
        <SiteBreadcrumb />
        <ChatbotNotFound />
      </div>
    );
  }

  return (
    <div>
      <SiteBreadcrumb />
      <ChatbotDetailClient chatbot={chatbot} />
    </div>
  );
};

export default ChatbotDetailPage;
