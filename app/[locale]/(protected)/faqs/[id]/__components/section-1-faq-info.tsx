"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { SquarePen, Power, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQDataProps } from "../../faqs-table/data";
import { AddEditFAQDialog } from "../../faqs-table/add-edit-faq-dialog";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { toast } from "react-hot-toast";

const keywordColors: Record<string, string> = {
  "Onboarding": "bg-blue-500/15 text-blue-600 border-blue-500/20",
  "Setup": "bg-purple-500/15 text-purple-600 border-purple-500/20",
  "Quickstart": "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  "Password": "bg-amber-500/15 text-amber-600 border-amber-500/20",
  "Security": "bg-red-500/15 text-red-600 border-red-500/20",
  "2FA": "bg-rose-500/15 text-rose-600 border-rose-500/20",
  "Payments": "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  "Visa": "bg-blue-500/15 text-blue-600 border-blue-500/20",
  "PayPal": "bg-cyan-500/15 text-cyan-600 border-cyan-500/20",
  "Invoices": "bg-indigo-500/15 text-indigo-600 border-indigo-500/20",
  "API": "bg-cyan-500/15 text-cyan-600 border-cyan-500/20",
  "Tokens": "bg-purple-500/15 text-purple-600 border-purple-500/20",
  "REST": "bg-teal-500/15 text-teal-600 border-teal-500/20",
  "SDK": "bg-blue-500/15 text-blue-600 border-blue-500/20",
  "Webhooks": "bg-pink-500/15 text-pink-600 border-pink-500/20",
  "Events": "bg-amber-500/15 text-amber-600 border-amber-500/20",
  "Payloads": "bg-indigo-500/15 text-indigo-600 border-indigo-500/20",
};

const matchTypeColors: Record<string, string> = {
  "Exact Match": "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  "Partial Match": "bg-blue-500/15 text-blue-600 border-blue-500/20",
  "AI Semantic": "bg-purple-500/15 text-purple-600 border-purple-500/20",
  "Keyword Match": "bg-amber-500/15 text-amber-600 border-amber-500/20",
};

const priorityColors: Record<string, string> = {
  High: "bg-red-500/15 text-red-600 border-red-500/20",
  Medium: "bg-amber-500/15 text-amber-600 border-amber-500/20",
  Low: "bg-default-200 text-default-700 border-default-300",
};

interface Section1FAQInfoProps {
  initialFaq: FAQDataProps;
}

export const Section1FAQInfo = ({ initialFaq }: Section1FAQInfoProps) => {
  const [faq, setFaq] = useState<FAQDataProps>(initialFaq);

  // Dialog & Switch state
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<"Active" | "Inactive">("Active");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isActive = faq.status === "Active";

  const handleToggleClick = () => {
    const nextStatus = isActive ? "Inactive" : "Active";
    setTargetStatus(nextStatus);
    setStatusConfirmOpen(true);
  };

  const handleConfirmStatusChange = () => {
    setFaq((prev) => ({ ...prev, status: targetStatus }));
    setStatusConfirmOpen(false);
    toast.success(`FAQ status changed to ${targetStatus}`);
  };

  const handleSaveEdit = (updatedData: Partial<FAQDataProps>) => {
    setFaq((prev) => ({ ...prev, ...updatedData, updatedAt: new Date().toISOString().split("T")[0] }));
    toast.success("FAQ updated successfully!");
  };

  const handleConfirmDelete = async () => {
    toast.success("FAQ deleted successfully");
  };

  const initials = (faq.createdBy?.name || "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="shadow-sm border border-default-200">
      <CardContent className="p-6 space-y-6">
        {/* Section Title Bar */}
        <div className="flex items-center justify-between border-b border-default-200 pb-4">
          <div className="text-xs font-bold text-default-500 uppercase tracking-wider">
            SECTION 1: FAQ Information
          </div>
        </div>

        {/* Detailed Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* FAQ ID */}
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
              FAQ ID
            </span>
            <span className="text-sm font-semibold text-default-900">
              #{faq.faqId}
            </span>
          </div>

          {/* Question */}
          <div className="flex items-baseline gap-2 min-w-0 md:col-span-2">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
              Question
            </span>
            <span className="text-sm font-bold text-default-900 leading-snug">
              {faq.question}
            </span>
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
              Category
            </span>
            <Badge color="secondary" className="rounded-full px-3 py-1 text-xs font-medium border border-default-200">
              {faq.category}
            </Badge>
          </div>

          {/* Keywords */}
          <div className="flex items-center gap-2 min-w-0 md:col-span-2">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
              Keywords
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(faq.keywords || []).map((kw, idx) => (
                <Badge
                  key={idx}
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium border",
                    keywordColors[kw] || "bg-default-200 text-default-700 border-default-300"
                  )}
                >
                  #{kw}
                </Badge>
              ))}
            </div>
          </div>

          {/* Match Type */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
              Match Type
            </span>
            <Badge
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium border",
                matchTypeColors[faq.matchType] || "bg-default-200 text-default-700"
              )}
            >
              {faq.matchType}
            </Badge>
          </div>

          {/* Priority */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
              Priority
            </span>
            <Badge
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium border",
                priorityColors[faq.priority] || "bg-default-200 text-default-700"
              )}
            >
              {faq.priority}
            </Badge>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
              Status
            </span>
            <span className="text-sm font-semibold text-default-800">
              {faq.status}
            </span>
          </div>

          {/* Created By */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
              Created By
            </span>
            <div className="flex items-center gap-2">
              <Avatar className="rounded-full w-8 h-8 shrink-0 border">
                <AvatarImage src={faq.createdBy.avatar} alt={faq.createdBy.name} />
                <AvatarFallback>{initials || "KM"}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-default-800">
                {faq.createdBy.name}
              </span>
            </div>
          </div>

          {/* Created At */}
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
              Created At
            </span>
            <span className="text-sm font-medium text-default-700">
              {faq.createdAt}
            </span>
          </div>

          {/* Updated At */}
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 font-medium">
              Updated At
            </span>
            <span className="text-sm font-medium text-default-700">
              {faq.updatedAt}
            </span>
          </div>
        </div>

        {/* Buttons Bar */}
        <div className="pt-4 border-t border-default-200 flex flex-wrap items-center gap-3">
          <Button
            color="primary"
            size="sm"
            className="h-9 gap-1.5 shadow-none"
            onClick={() => setEditDialogOpen(true)}
          >
            <SquarePen className="w-4 h-4" />
            <span>Edit FAQ</span>
          </Button>

          {/* Custom Deactivate / Activate Switch Button */}
          <button
            type="button"
            onClick={handleToggleClick}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-default-200 bg-background hover:bg-default-50 dark:hover:bg-slate-800 transition-all shadow-2xs group cursor-pointer"
          >
            <span className="text-sm font-semibold text-default-800">
              {isActive ? "Deactivate" : "Activate"}
            </span>
          </button>

          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-red-500"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
            <span>Delete</span>
          </Button>
        </div>
      </CardContent>

      {/* Confirmation Dialog for Status Change */}
      <AlertDialog open={statusConfirmOpen} onOpenChange={setStatusConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status of FAQ #{faq.faqId} to{" "}
              <strong className="text-default-900">{targetStatus}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStatusConfirmOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStatusChange}>
              Confirm & Apply
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit FAQ Modal Dialog */}
      <AddEditFAQDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        faq={faq}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Modal Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        toastMessage="FAQ deleted successfully"
      />
    </Card>
  );
};
