"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, KeyRound, UserX, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmployeeProps } from "../../team-table/columns";

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  Inactive: "bg-default-300/40 text-default-700 border-default-300",
  Pending: "bg-amber-500/15 text-amber-600 border-amber-500/20",
};

const roleColors: Record<string, string> = {
  Admin: "bg-purple-500/15 text-purple-600 border-purple-500/20",
  Manager: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  Agent: "bg-cyan-500/15 text-cyan-600 border-cyan-500/20",
  Developer: "bg-indigo-500/15 text-indigo-600 border-indigo-500/20",
  "Support Lead": "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
};

interface Section1EmployeeInfoProps {
  employee: EmployeeProps;
  onEdit?: () => void;
  onResetPassword?: () => void;
  onToggleStatus?: () => void;
}

export const Section1EmployeeInfo = ({
  employee,
  onEdit,
  onResetPassword,
  onToggleStatus,
}: Section1EmployeeInfoProps) => {
  const initials = employee.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isOnline = employee.onlineStatus === "Online";
  const isActive = employee.status === "Active";

  return (
    <Card className="shadow-sm border border-default-200">
      <CardContent className="p-5 space-y-4">
        {/* Header Title */}
        <div className="flex items-center justify-between  ">
          <div className="text-xs font-bold text-default-500 uppercase tracking-wider">
            SECTION 1: Employee Information
          </div>
        </div>

        {/* Profile Header */}
        <div className="flex items-center gap-4 pb-2 border-b border-default-200">
          <Avatar className="h-14 w-14 shrink-0 bg-default-100 border border-default-200">
            {employee.image ? (
              <AvatarImage src={employee.image} alt={employee.name} />
            ) : (
              <AvatarFallback className="text-sm font-semibold text-default-700">
                {initials || "EM"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-default-800 truncate">
              {employee.name}
            </h3>
            <p className="text-xs text-default-500 truncate mt-0.5">
              {employee.role} • {employee.department}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className={cn(
                  "w-2 h-2 rounded-full inline-block shrink-0",
                  isOnline ? "bg-emerald-500 animate-pulse" : "bg-default-400"
                )}
              />
              <span className="text-xs font-medium text-default-600">
                {employee.onlineStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-1">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-36 font-medium">
              Employee ID
            </span>
            <span className="text-sm font-semibold text-default-800 truncate">
              #{employee.employeeId}
            </span>
          </div>

          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-36 font-medium">
              Employee Name
            </span>
            <span className="text-sm font-semibold text-default-800 truncate">
              {employee.name}
            </span>
          </div>

          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-36 font-medium">
              Email
            </span>
            <span className="text-sm font-medium text-blue-600 truncate">
              {employee.email}
            </span>
          </div>

          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-36 font-medium">
              Mobile Number
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {employee.mobile}
            </span>
          </div>

          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-36 font-medium">
              Designation
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {employee.role}
            </span>
          </div>

          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-36 font-medium">
              Department
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {employee.department}
            </span>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-36 font-medium">
              Role
            </span>
            <Badge
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium border",
                roleColors[employee.role] || "bg-default-200 text-default-700"
              )}
            >
              {employee.role}
            </Badge>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-36 font-medium">
              Status
            </span>
            <Badge
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium border",
                statusColors[employee.status] || "bg-default-200 text-default-700"
              )}
            >
              {employee.status}
            </Badge>
          </div>

          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-36 font-medium">
              Online / Offline
            </span>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "w-2 h-2 rounded-full inline-block shrink-0",
                  isOnline ? "bg-emerald-500" : "bg-default-400"
                )}
              />
              <span className="text-sm font-medium text-default-800">
                {employee.onlineStatus}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-36 font-medium">
              Created At
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              Aug 01, 2026
            </span>
          </div>

          <div className="flex items-baseline gap-2 min-w-0 col-span-1 md:col-span-2">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-36 font-medium">
              Last Login
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {employee.lastLogin}
            </span>
          </div>
        </div>

        {/* Buttons Action Footer */}
        <div className="pt-4 mt-2 border-t border-default-200">
          <div className="flex flex-wrap gap-2.5">
            <Button
              color="primary"
              size="sm"
              onClick={onEdit}
              className="h-9 text-xs gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Employee
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onResetPassword}
              className="h-9 text-xs gap-1.5 !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0"
            >
              <KeyRound className="w-3.5 h-3.5 text-default-500" />
              Reset Password
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onToggleStatus}
              className={cn(
                "h-9 text-xs gap-1.5 !border bg-background hover:bg-transparent hover:ring-0",
                isActive
                  ? "border-destructive/30 text-destructive hover:border-destructive hover:text-destructive"
                  : "border-emerald-500/30 text-emerald-600 hover:border-emerald-500 hover:text-emerald-600"
              )}
            >
              {isActive ? (
                <>
                  <UserX className="w-3.5 h-3.5" />
                  Deactivate
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  Activate
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
