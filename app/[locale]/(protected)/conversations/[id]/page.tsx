
import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/navigation";
// @ts-ignore
import { ConversationDetailClient } from "./conversation-detail-client";

function ConversationDetailNotFound() {
  return (
    <Card>
      <CardContent className="p-10 text-center">
        <MessageSquare className="w-12 h-12 text-default-300 mx-auto mb-4" />

        <h3 className="text-lg font-semibold text-default-800 mb-1">
          Conversation not found
        </h3>

        <p className="text-sm text-default-500 mb-5">
          The conversation you are looking for does not exist or has been removed.
        </p>

        <Link href="/conversations">
          <Button color="primary">
            Back to Conversations
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

async function getConversation(id: string) {
  console.log("getConversation ID:", id);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  console.log("API BASE URL:", apiBaseUrl);

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const url = `${apiBaseUrl}/api/conversation/byphonenumber/${id}`;

  console.log("API URL:", url);

  const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "1",
      },
      cache: "no-store",
    });

  console.log("API status:", response.status);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    throw new Error(
      `Failed to fetch conversation: ${response.status}`
    );
  }

  const data = await response.json();

  console.log("Conversation:", data);

  return data;
}

const ConversationDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  console.log("PAGE ID:", id);

  const conversation = await getConversation(id);

  if (!conversation) {
    return (
      <div>
        <SiteBreadcrumb />
        <ConversationDetailNotFound />
      </div>
    );
  }

  return (
    <div>
      <SiteBreadcrumb />
      <ConversationDetailClient conversation={conversation} />
    </div>
  );
};

export default ConversationDetailPage;
