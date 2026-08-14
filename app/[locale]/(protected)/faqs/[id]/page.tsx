import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/navigation";
import { getFaqById } from "../faqs-table/data";
import { FAQDetailClient } from "./faq-detail-client";

function FAQNotFound() {
  return (
    <Card>
      <CardContent className="p-10 text-center">
        <HelpCircle className="w-12 h-12 text-default-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-default-800 mb-1">
          FAQ Entry Not Found
        </h3>
        <p className="text-sm text-default-500 mb-5">
          The FAQ record you are looking for does not exist or has been removed.
        </p>
        <Link href="/faqs">
          <Button color="primary">
            Back to FAQs
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

const FAQDetailPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  return (
    <div>
      <SiteBreadcrumb />
      <FAQDetailClient id={id} />
    </div>
  );
};

export default FAQDetailPage;
