import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/navigation";
import { getEmployeeById } from "../team-table/data";
import { TeamDetailClient } from "./team-detail-client";

function EmployeeNotFound() {
  return (
    <Card>
      <CardContent className="p-10 text-center">
        <UserCircle2 className="w-12 h-12 text-default-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-default-800 mb-1">
          Employee Not Found
        </h3>
        <p className="text-sm text-default-500 mb-5">
          The employee you are looking for does not exist or has been removed.
        </p>
        <Link href="/team">
          <Button color="primary">
            Back to Team
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

const EmployeeDetailPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const employee = getEmployeeById(id);

  if (!employee) {
    return (
      <div>
        <SiteBreadcrumb />
        <EmployeeNotFound />
      </div>
    );
  }

  return (
    <div>
      <SiteBreadcrumb />
      <div className="mt-4">
        <TeamDetailClient employee={employee} />
      </div>
    </div>
  );
};

export default EmployeeDetailPage;
