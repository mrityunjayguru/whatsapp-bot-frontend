"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/navigation";
import { EmployeeProps } from "../team-table/columns";
import { ArrowLeft } from "lucide-react";
import { Section1EmployeeInfo } from "./__components/section-1-employee-info";
import { Section2EmployeeWorkload } from "./__components/section-2-employee-workload";
import { Section4AssignedConversations } from "./__components/section-4-assigned-conversations";
import { Section3EmployeeActivity } from "./__components/section-3-employee-activity";
import { Section5EmployeeStatistics } from "./__components/section-5-employee-statistics";

export function TeamDetailClient({
  employee: initialEmployee,
}: {
  employee: EmployeeProps;
}) {
  const [employee] = useState<EmployeeProps>(initialEmployee);

  // Initially hidden as requested: section 4 shows when user clicks View icon in section 2
  const [showSection4, setShowSection4] = useState<boolean>(false);
  const section4Ref = useRef<HTMLDivElement>(null);

  const handleViewTotalAssigned = () => {
    setShowSection4(true);
    setTimeout(() => {
      section4Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="space-y-5">
      {/* Page Header Bar */}
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
              {employee.employeeId}
            </span>
          </div>
        </div>
      </div>

      {/* Side by Side Grid: Section 1 & Section 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <Section1EmployeeInfo employee={employee} />
        <Section2EmployeeWorkload
          employee={employee}
          onViewTotalAssigned={handleViewTotalAssigned}
        />
      </div>

      {/* Section 4: Assigned Conversations (Table Form - Revealed when View clicked) */}
      {showSection4 && (
        <div ref={section4Ref} className="pt-2">
          <Section4AssignedConversations
            employee={employee}
            onClose={() => setShowSection4(false)}
          />
        </div>
      )}

      {/* Section 3: Employee Activity Table */}
      <div className="pt-2">
        <Section3EmployeeActivity employee={employee} />
      </div>

      {/* Section 5: Employee Statistics Cards */}
      <div className="pt-2">
        <Section5EmployeeStatistics employee={employee} />
      </div>
    </div>
  );
}
