"use client";

import { useState, useEffect } from "react";
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
import { EmployeeProps } from "./columns";
import { KeyRound, Eye, EyeOff, Mail } from "lucide-react";
import { toast } from "sonner";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: EmployeeProps | null;
  onConfirmReset: (employee: EmployeeProps, newPassword?: string) => void;
}

export function ResetPasswordDialog({
  open,
  onOpenChange,
  employee,
  onConfirmReset,
}: ResetPasswordDialogProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open) {
      setNewPassword("");
      setConfirmPassword("");
      setShowPassword(false);
    }
  }, [open]);

  if (!employee) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    onConfirmReset(employee, newPassword);
    onOpenChange(false);
  };

  const handleSendEmailLink = () => {
    toast.success(`Password reset email sent to ${employee.email}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Reset Password - {employee.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          <p className="text-xs text-default-500">
            Set a new temporary password for{" "}
            <span className="font-semibold text-default-700">{employee.email}</span>{" "}
            or send a password reset link directly to their email address.
          </p>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-default-400 hover:text-default-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="border-t border-default-200 pt-3 flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSendEmailLink}
              className="h-9 gap-1.5 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0"
            >
              <Mail className="w-3.5 h-3.5" />
              Send Reset Link Email
            </Button>
          </div>

          <DialogFooter className="pt-2">
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
            <Button type="submit" color="primary" size="sm" className="h-9">
              Update Password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
