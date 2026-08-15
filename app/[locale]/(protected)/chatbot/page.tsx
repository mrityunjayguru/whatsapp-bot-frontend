import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import ChatbotTable from "./chatbot-table";

const ChatbotPage = () => {
  return (
    <div>
      <SiteBreadcrumb />
      <Card className="mt-5">
        <CardContent className="p-0">
          <ChatbotTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotPage;
