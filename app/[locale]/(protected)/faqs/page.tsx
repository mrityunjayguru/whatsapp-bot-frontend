import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import FAQTable from "./faqs-table";

const FAQsPage = () => {
  return (
    <div>
      <SiteBreadcrumb />
      <Card className="mt-5">
        <CardContent className="p-0">
          <FAQTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQsPage;
