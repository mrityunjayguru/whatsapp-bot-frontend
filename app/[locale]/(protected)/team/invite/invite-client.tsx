"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/components/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { Section1EmployeeDetails } from "./__components/section-1-employee-details";
import { Section2AccountSettings } from "./__components/section-2-account-settings";
import { Section3PendingInvitations } from "./__components/section-3-pending-invitations";

export function InviteClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendInvitation = () => {
    setIsSubmitting(true);
    toast.success("Employee invitation sent successfully!");
    setTimeout(() => {
      router.push("/team");
    }, 400);
  };

  return (
    <div className="space-y-5">
      {/* Page Header Bar - Identical layout to [id] */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/team">
            <Button
              variant="outline"
              size="sm"
              className="h-9 !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0"
            >
              <ArrowLeft className="w-4 h-4 me-1.5" />
              Back
            </Button>
          </Link>
          <div className="text-xs text-default-500">
            Employee ID #{" "}
            <span className="font-semibold text-default-800">
              EMP-1009
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Equal Height Grid: Section 1 & Section 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* SECTION 1: Employee Details */}
        <Section1EmployeeDetails />

        {/* SECTION 2: Account Settings */}
        <Section2AccountSettings />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-default-200">
        <Link href="/team">
          <Button
            type="button"
            variant="outline"
            className="h-10 px-5 text-xs font-semibold border-default-200 bg-gray-300"
          >
            Cancel
          </Button>
        </Link>
        <Button
          type="button"
          color="primary"
          onClick={handleSendInvitation}
          disabled={isSubmitting}
          className="h-10 px-6 text-xs font-bold gap-2"
        >
          <Send className="w-4 h-4" />
          Send Invitation
        </Button>
      </div>

      {/* SECTION 3: Pending Invitations Table */}
      <div className="pt-2">
        <Section3PendingInvitations />
      </div>
    </div>
  );
}
