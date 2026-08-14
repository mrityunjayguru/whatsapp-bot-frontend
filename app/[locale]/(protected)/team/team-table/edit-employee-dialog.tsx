"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { EmployeeProps } from "./columns";
import { Edit, User, ShieldCheck, KeyRound } from "lucide-react";
import { toast } from "sonner";

interface EditEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: EmployeeProps | null;
  onSave: (updatedEmployee: EmployeeProps) => void;
}

export function EditEmployeeDialog({
  open,
  onOpenChange,
  employee,
  onSave,
}: EditEmployeeDialogProps) {
  const [form, setForm] = useState<EmployeeProps | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [designation, setDesignation] = useState("Specialist");
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (employee) {
      setForm({ ...employee });
      const parts = (employee.name || "").split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
    }
  }, [employee]);

  if (!form) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${firstName} ${lastName}`.trim() || form.name;
    onSave({
      ...form,
      name: fullName,
    });
    toast.success(`Successfully saved changes for ${fullName}`);
    onOpenChange(false);
  };

  const handleResetPassword = () => {
    toast.success(`Password reset link dispatched to ${form.email}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" className="max-w-lg">
        <DialogHeader className="border-b border-default-200 pb-3">
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            Edit Employee Details
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-default-100 p-1 rounded-lg">
              <TabsTrigger
                value="info"
                className="flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md data-[state=active]:bg-background data-[state=active]:text-primary"
              >
                <User className="w-4 h-4" />
                Employee Information
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md data-[state=active]:bg-background data-[state=active]:text-primary"
              >
                <ShieldCheck className="w-4 h-4" />
                Account
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: SECTION 1 - Employee Information */}
            <TabsContent value="info" className="space-y-4 pt-3">
                           <div className="grid grid-cols-2 gap-3">
                {/* First Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="edit-firstname" className="text-xs font-semibold">
                    First Name *
                  </Label>
                  <Input
                    id="edit-firstname"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="edit-lastname" className="text-xs font-semibold">
                    Last Name *
                  </Label>
                  <Input
                    id="edit-lastname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-email" className="text-xs font-semibold">
                  Email *
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => (prev ? { ...prev, email: e.target.value } : null))
                  }
                  required
                  className="h-9 text-xs"
                />
              </div>

              {/* Mobile Number & Designation */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-mobile" className="text-xs font-semibold">
                    Mobile Number
                  </Label>
                  <Input
                    id="edit-mobile"
                    value={form.mobile}
                    onChange={(e) =>
                      setForm((prev) => (prev ? { ...prev, mobile: e.target.value } : null))
                    }
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-designation" className="text-xs font-semibold">
                    Designation
                  </Label>
                  <Input
                    id="edit-designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* Department & Role */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Department *</Label>
                  <Select
                    value={form.department}
                    onValueChange={(val) =>
                      setForm((prev) => (prev ? { ...prev, department: val } : null))
                    }
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Customer Support">Customer Support</SelectItem>
                      <SelectItem value="Billing">Billing</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Role *</Label>
                  <Select
                    value={form.role}
                    onValueChange={(val) =>
                      setForm((prev) => (prev ? { ...prev, role: val } : null))
                    }
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Employee">Employee</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Agent">Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: SECTION 2 - Account */}
            <TabsContent value="account" className="space-y-4 pt-3">
              <div className="text-xs font-bold text-default-500 uppercase tracking-wider border-b border-default-100 pb-2">
                SECTION 2: Account Settings
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Status *</Label>
                <Select
                  value={form.status}
                  onValueChange={(val: "Active" | "Inactive" | "Pending") =>
                    setForm((prev) => (prev ? { ...prev, status: val } : null))
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Password Button */}
              <div className="p-4 rounded-lg border border-default-200 bg-default-50/50 space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-semibold text-default-800 block">
                      Reset Password
                    </Label>
                    <span className="text-[11px] text-default-500">
                      Send password reset link to employee's registered email address.
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResetPassword}
                    className="h-8 text-xs font-semibold gap-1.5 border-default-200 hover:bg-primary/10 hover:text-primary"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    Reset Password
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Modal Footer Buttons */}
          <DialogFooter className="pt-3 border-t border-default-200 gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" color="primary" size="sm" className="h-9 font-semibold">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
