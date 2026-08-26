import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/navigation";
import { getContactById } from "../contacts-table/data";
import { ContactDetailClient } from "./contact-detail-client";

function ContactDetailNotFound() {
  return (
    <Card>
      <CardContent className="p-10 text-center">
        <UserCircle2 className="w-12 h-12 text-default-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-default-800 mb-1">
          Contact not found
        </h3>
        <p className="text-sm text-default-500 mb-5">
          The contact you are looking for does not exist or has been removed.
        </p>
        <Link href="/contacts">
          <Button color="primary">
            Back to Contacts
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

const ContactDetailPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const { id } = params;

  // ✅ FIX: Added 'await' since getContactById returns a Promise
  const contact = await getContactById(id);

  if (!contact) {
    return (
      <div>
        <SiteBreadcrumb />
        <ContactDetailNotFound />
      </div>
    );
  }

  return (
    <div>
      <SiteBreadcrumb />
      <ContactDetailClient contact={contact} />
    </div>
  );
};

export default ContactDetailPage;
