import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import ConversationTable from "./convarsation-table";

const Conversations = () => {
  return (
    <div>
      <SiteBreadcrumb />
      <Card>
          <CardContent className="p-0">
            <ConversationTable />
          </CardContent>
        </Card>
    </div>
  );
};

export default Conversations;
