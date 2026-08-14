import SiteBreadcrumb from "@/components/site-breadcrumb";
import { InviteClient } from "./invite-client";

export default function InviteEmployeePage() {
  return (
    <div>
      <SiteBreadcrumb />
      <div className="mt-4">
        <InviteClient />
      </div>
    </div>
  );
}
