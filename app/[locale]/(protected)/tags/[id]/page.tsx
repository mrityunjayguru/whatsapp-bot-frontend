import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/navigation";
import { getTagById } from "../tags-table/data";
import { TagDetailClient } from "./tag-detail-client";

function TagNotFound() {
  return (
    <Card className="mt-5">
      <CardContent className="p-10 text-center">
        <Tag className="w-12 h-12 text-default-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-default-800 mb-1">
          Tag not found
        </h3>
        <p className="text-sm text-default-500 mb-5">
          The tag you are looking for does not exist or has been removed.
        </p>
        <Link href="/tags">
          <Button color="primary">
            Back to Tags
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

const TagDetailPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const tag = getTagById(id);

  if (!tag) {
    return (
      <div>
        <SiteBreadcrumb />
        <TagNotFound />
      </div>
    );
  }

  return (
    <div>
      <SiteBreadcrumb />
      <TagDetailClient tag={tag} />
    </div>
  );
};

export default TagDetailPage;
