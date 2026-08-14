"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import { Link } from "@/components/navigation";
import TablePagination from "./table-pagination";
import { initialEmployees } from "./data";
import { getColumns, EmployeeProps } from "./columns";
import { InviteEmployeeDialog } from "./invite-employee-dialog";
import { EditEmployeeDialog } from "./edit-employee-dialog";
import { ResetPasswordDialog } from "./reset-password-dialog";
import { DeactivateConfirmDialog } from "./deactivate-confirm-dialog";
import {
  Search,
  RefreshCw,
  PlusCircle,
} from "lucide-react";

export default function TeamTable() {
  const [employees, setEmployees] = React.useState<EmployeeProps[]>(initialEmployees);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Filter States
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = React.useState<string>("all");
  const [onlineFilter, setOnlineFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Dialog States
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [resetOpen, setResetOpen] = React.useState(false);
  const [deactivateOpen, setDeactivateOpen] = React.useState(false);

  const [selectedEmployee, setSelectedEmployee] = React.useState<EmployeeProps | null>(null);

  // Handlers for Row Actions
  const handleEdit = (employee: EmployeeProps) => {
    setSelectedEmployee(employee);
    setEditOpen(true);
  };

  const handleToggleStatusRequest = (employee: EmployeeProps) => {
    setSelectedEmployee(employee);
    setDeactivateOpen(true);
  };

  const handleConfirmToggleStatus = (employee: EmployeeProps) => {
    const newStatus = employee.status === "Active" ? "Inactive" : "Active";
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employee.id ? { ...emp, status: newStatus } : emp
      )
    );
    toast.success(
      `Employee ${employee.name} status updated to ${newStatus}`
    );
  };

  const handleResetPasswordRequest = (employee: EmployeeProps) => {
    setSelectedEmployee(employee);
    setResetOpen(true);
  };

  const handleConfirmResetPassword = (employee: EmployeeProps, newPassword?: string) => {
    if (newPassword) {
      toast.success(`Password successfully updated for ${employee.name}`);
    } else {
      toast.info(`Password reset link dispatched to ${employee.email}`);
    }
  };

  const handleSaveEdit = (updatedEmployee: EmployeeProps) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
    );
    toast.success(`Updated details for ${updatedEmployee.name}`);
  };

  const handleInvite = (newEmpData: Partial<EmployeeProps>) => {
    const newId = (employees.length + 1).toString();
    const newEmployee: EmployeeProps = {
      id: newId,
      employeeId: `EMP-${String(1001 + employees.length).padStart(4, "0")}`,
      name: newEmpData.name || "New Employee",
      image: "/images/avatar/avatar-1.png",
      email: newEmpData.email || "",
      mobile: newEmpData.mobile || "+1 (555) 000-0000",
      department: newEmpData.department || "Customer Support",
      role: newEmpData.role || "Agent",
      status: "Active",
      onlineStatus: "Offline",
      assignedConversations: 0,
      resolvedConversations: 0,
      lastLogin: "Never",
    };
    setEmployees((prev) => [newEmployee, ...prev]);
    toast.success(`Invitation sent to ${newEmployee.email}`);
  };

  // Sync state filters to table column filters
  React.useEffect(() => {
    const filters: ColumnFiltersState = [];

    if (roleFilter !== "all") {
      filters.push({ id: "role", value: roleFilter });
    }
    if (statusFilter !== "all") {
      filters.push({ id: "status", value: statusFilter });
    }
    if (departmentFilter !== "all") {
      filters.push({ id: "department", value: departmentFilter });
    }
    if (onlineFilter !== "all") {
      filters.push({ id: "onlineStatus", value: onlineFilter });
    }
    if (searchQuery) {
      filters.push({ id: "name", value: searchQuery });
    }

    setColumnFilters(filters);
  }, [roleFilter, statusFilter, departmentFilter, onlineFilter, searchQuery]);

  const columns = React.useMemo(
    () => getColumns(handleEdit, handleToggleStatusRequest, handleResetPasswordRequest),
    []
  );

  const table = useReactTable({
    data: employees,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const resetAllFilters = () => {
    setRoleFilter("all");
    setStatusFilter("all");
    setDepartmentFilter("all");
    setOnlineFilter("all");
    setSearchQuery("");
  };

  const hasActiveFilters =
    roleFilter !== "all" ||
    statusFilter !== "all" ||
    departmentFilter !== "all" ||
    onlineFilter !== "all" ||
    searchQuery !== "";

  return (
    <div className="w-full space-y-4">
      {/* Top Header & Invite Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 px-5">
        <div>
          <div className="flex-1 text-xl font-medium text-default-900">Team</div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/team/invite">
            <Button
              color="primary"
              size="sm"
              className="h-9 gap-2 shadow-none"
            >
              <PlusCircle className="w-4 h-4" />
              Invite Employee
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap px-5 pb-4 border-b border-default-200">
        {/* Role Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-default-500">Role:</span>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px] h-9 text-xs !border !border-default-200 bg-background">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Agent">Agent</SelectItem>
              <SelectItem value="Developer">Developer</SelectItem>
              <SelectItem value="Support Lead">Support Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-default-500">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-9 text-xs !border !border-default-200 bg-background">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-default-500">Department:</span>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[170px] h-9 text-xs !border !border-default-200 bg-background">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Customer Support">Customer Support</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Product">Product</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Online / Offline Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-default-500">Presence:</span>
          <Select value={onlineFilter} onValueChange={setOnlineFilter}>
            <SelectTrigger className="w-[140px] h-9 text-xs !border !border-default-200 bg-background">
              <SelectValue placeholder="Online / Offline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Online / Offline</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="Offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetAllFilters}
            className="h-9 px-2.5 text-xs text-default-500 hover:text-destructive gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </Button>
        )}

        <div className="flex-1 min-w-[20px]" />

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-default-400" />
          <Input
            placeholder="Search employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs !border !border-default-200 shadow-none bg-background focus-visible:!ring-0 focus-visible:!border-default-300"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-default-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-default-50 dark:hover:bg-default-800/40 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-default-500 text-sm"
                >
                  No employees found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination table={table} />

      {/* Invite Modal */}
      <InviteEmployeeDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onInvite={handleInvite}
      />

      {/* Edit Modal */}
      <EditEmployeeDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        employee={selectedEmployee}
        onSave={handleSaveEdit}
      />

      {/* Reset Password Modal */}
      <ResetPasswordDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        employee={selectedEmployee}
        onConfirmReset={handleConfirmResetPassword}
      />

      {/* Deactivate/Activate Confirmation Alert Dialog */}
      <DeactivateConfirmDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        employee={selectedEmployee}
        onConfirmToggle={handleConfirmToggleStatus}
      />
    </div>
  );
}
