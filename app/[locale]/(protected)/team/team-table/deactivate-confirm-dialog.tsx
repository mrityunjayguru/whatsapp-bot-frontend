"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmployeeProps } from "./columns";
import { AlertTriangle, UserCheck } from "lucide-react";

interface DeactivateConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: EmployeeProps | null;
  onConfirmToggle: (employee: EmployeeProps) => void;
}

export function DeactivateConfirmDialog({
  open,
  onOpenChange,
  employee,
  onConfirmToggle,
}: DeactivateConfirmDialogProps) {
  if (!employee) return null;

  const isDeactivating = employee.status === "Active";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isDeactivating ? (
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
            ) : (
              <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            {isDeactivating ? "Deactivate Account?" : "Activate Account?"}
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-2 text-sm text-default-600">
            {isDeactivating ? (
              <>
                Are you sure you want to deactivate{" "}
                <span className="font-semibold text-default-800">
                  {employee.name}
                </span>
                ? This will temporarily revoke their login access and disable assigned conversation workflows.
              </>
            ) : (
              <>
                Are you sure you want to re-activate{" "}
                <span className="font-semibold text-default-800">
                  {employee.name}
                </span>
                ? This will restore their system access and active status.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-3">
          <AlertDialogCancel className="h-9 !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirmToggle(employee);
              onOpenChange(false);
            }}
            className={
              isDeactivating
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9"
                : "bg-emerald-600 text-white hover:bg-emerald-700 h-9"
            }
          >
            {isDeactivating ? "Confirm Deactivation" : "Confirm Activation"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
