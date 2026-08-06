import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import ContactTable from "./contacts-table";

const Contacts = () => {
  return (
    <div>
      <SiteBreadcrumb />
      <Card className="mt-5">
        <CardContent className="p-0">
          <ContactTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default Contacts;
