"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/navigation";
import { TagProps } from "../tags-table/data";
import { ArrowLeft } from "lucide-react";
import { Section1TagInfo } from "./__components/section-1-tag-info";
import { Section2TaggedContacts } from "./__components/section-2-tagged-contacts";

export function TagDetailClient({ tag }: { tag: TagProps }) {
  return (
    <div className="space-y-5 mt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link href="/tags">
            <Button
              variant="outline"
              size="sm"
              className="h-9 !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              <ArrowLeft className="w-4 h-4 me-1.5" />
              Back
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="w-full space-y-5">
        <Section1TagInfo tag={tag} />
        <Section2TaggedContacts />
      </div>
    </div>
  );
}
