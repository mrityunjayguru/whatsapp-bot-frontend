"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Edit, UserX, UserCheck, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Link } from "@/components/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type EmployeeProps = {
  id: string;
  employeeId: string;
  name: string;
  image: string;
  email: string;
  mobile: string;
  department: string;
  role: string;
  status: "Active" | "Inactive" | "Pending";
  onlineStatus: "Online" | "Offline";
  assignedConversations: number;
  resolvedConversations: number;
  lastLogin: string;
  action?: React.ReactNode;
};

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

interface ColumnActionsProps {
  employee: EmployeeProps;
  onEdit: (employee: EmployeeProps) => void;
  onToggleStatus: (employee: EmployeeProps) => void;
  onResetPassword: (employee: EmployeeProps) => void;
}

const ColumnActions = ({
  employee,
  onEdit,
  onToggleStatus,
  onResetPassword,
}: ColumnActionsProps) => {
  const isActive = employee.status === "Active";

  return (
    <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
      {/* View Employee Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={`/team/${employee.id}`}>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 ring-offset-transparent !border !border-default-200 text-default-500 hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/5 transition-colors shrink-0 bg-background hover:ring-0 hover:ring-transparent"
                color="secondary"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>View Employee</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Action Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 ring-offset-transparent !border !border-default-200 text-default-500 hover:text-default-800 hover:border-default-300 hover:bg-default-100 transition-colors shrink-0 bg-background hover:ring-0"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-1.5">
          <DropdownMenuLabel className="text-xs font-semibold text-default-500 px-2 py-1">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1" />
          
          <DropdownMenuItem
            onClick={() => onEdit(employee)}
            className="flex items-center gap-2 cursor-pointer py-2 px-2 rounded-sm text-xs"
          >
            <Edit className="w-4 h-4 text-default-500" />
            <span>Edit Details</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onResetPassword(employee)}
            className="flex items-center gap-2 cursor-pointer py-2 px-2 rounded-sm text-xs"
          >
            <KeyRound className="w-4 h-4 text-default-500" />
            <span>Reset Password</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1" />

          {/* Deactivate User Toggle Switch Row in Action Menu */}
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              onToggleStatus(employee);
            }}
            className="flex items-center justify-between cursor-pointer py-2 px-2 rounded-sm text-xs"
          >
            <div className="flex items-center gap-2">
              {isActive ? (
                <UserX className="w-4 h-4 text-destructive" />
              ) : (
                <UserCheck className="w-4 h-4 text-emerald-600" />
              )}
              <span className={isActive ? "text-destructive font-medium" : "text-emerald-600 font-medium"}>
                Deactivate User
              </span>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={() => onToggleStatus(employee)}
              color="primary"
              size="sm"
              className="pointer-events-none"
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const getColumns = (
  onEdit: (employee: EmployeeProps) => void,
  onToggleStatus: (employee: EmployeeProps) => void,
  onResetPassword: (employee: EmployeeProps) => void
): ColumnDef<EmployeeProps>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div className="w-16 shrink-0">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 64,
  },
  {
    accessorKey: "employeeId",
    header: "Employee ID",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-default-700 whitespace-nowrap shrink-0">
        #{row.getValue("employeeId")}
      </span>
    ),
    size: 140,
  },
  {
    accessorKey: "name",
    header: "Employee Name",
    cell: ({ row }) => {
      const name = row.getValue<string>("name");
      const image = row.original.image;
      const initials = name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
      return (
        <div className="font-medium text-card-foreground/80 shrink-0">
          <div className="flex gap-3 items-center whitespace-nowrap">
            <Avatar className="rounded-full w-8 h-8 bg-transparent hover:bg-transparent shadow-none border-none shrink-0">
              {image ? (
                <AvatarImage src={image} />
              ) : (
                <AvatarFallback>{initials || "EM"}</AvatarFallback>
              )}
            </Avatar>
            <span className="text-sm text-default-700 whitespace-nowrap font-medium">
              {name ?? "Unknown Employee"}
            </span>
          </div>
        </div>
      );
    },
    size: 200,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap shrink-0">
        {row.getValue("email")}
      </span>
    ),
    size: 220,
  },
  {
    accessorKey: "mobile",
    header: "Mobile Number",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap shrink-0">
        {row.getValue("mobile")}
      </span>
    ),
    size: 160,
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap shrink-0">
        {row.getValue("department")}
      </span>
    ),
    size: 160,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue<string>("role");
      return (
        <Badge
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium border whitespace-nowrap shrink-0",
            roleColors[role] || "bg-default-200 text-default-700"
          )}
        >
          {role}
        </Badge>
      );
    },
    size: 130,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      return (
        <Badge
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium border whitespace-nowrap shrink-0",
            statusColors[status] || "bg-default-200 text-default-700"
          )}
        >
          {status}
        </Badge>
      );
    },
    size: 110,
  },
  {
    accessorKey: "onlineStatus",
    header: "Online Status",
    cell: ({ row }) => {
      const onlineStatus = row.getValue<string>("onlineStatus");
      const isOnline = onlineStatus === "Online";
      return (
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <span
            className={cn(
              "w-2 h-2 rounded-full inline-block shrink-0",
              isOnline ? "bg-emerald-500" : "bg-default-400"
            )}
          />
          <span className="text-xs text-default-600 font-medium">
            {onlineStatus}
          </span>
        </div>
      );
    },
    size: 130,
  },
  {
    accessorKey: "assignedConversations",
    header: "Assigned Conversations",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap shrink-0">
        {row.getValue("assignedConversations")} Conversations
      </span>
    ),
    size: 180,
  },
  {
    accessorKey: "resolvedConversations",
    header: "Resolved Conversations",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap shrink-0">
        {row.getValue("resolvedConversations")} Conversations
      </span>
    ),
    size: 180,
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: ({ row }) => (
      <span className="text-sm text-default-600 whitespace-nowrap shrink-0">
        {row.getValue("lastLogin")}
      </span>
    ),
    size: 150,
  },
  {
    id: "actions",
    accessorKey: "action",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => (
      <ColumnActions
        employee={row.original}
        onEdit={onEdit}
        onToggleStatus={onToggleStatus}
        onResetPassword={onResetPassword}
      />
    ),
    size: 110,
  },
];
