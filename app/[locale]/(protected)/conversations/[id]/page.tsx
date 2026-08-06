import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/navigation";
import { getConversationById } from "../convarsation-table/data";
//@ts-ignore
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

const ConversationDetailPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const conversation = getConversationById(id);

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
