import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import TeamTable from "./team-table";

const Team = () => {
  return (
    <div>
      <SiteBreadcrumb />
      <Card className="mt-5">
        <CardContent className="p-0">
          <TeamTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default Team;
