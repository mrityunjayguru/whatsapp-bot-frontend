import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import TagsTable from "./tags-table";

const Tags = () => {
  return (
    <div>
      <SiteBreadcrumb />
      <Card className="mt-5">
        <CardContent className="p-0">
          <TagsTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default Tags;
