"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TagProps } from "./data";
import { Tag, Users, Calendar, User, Clock, CheckCircle2, XCircle, Mail, Phone } from "lucide-react";
import { Link } from "@/components/navigation";

interface ViewTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag: TagProps | null;
  onEdit?: (tag: TagProps) => void;
}

const sampleContactsForTag = [
  { id: "1", name: "Esther Howard", email: "esther.howard@example.com", phone: "+1 (555) 234-5678", avatar: "/images/avatar/avatar-1.png" },
  { id: "2", name: "Cameron Williamson", email: "cameron.w@example.com", phone: "+1 (555) 345-6789", avatar: "/images/avatar/avatar-2.png" },
  { id: "3", name: "Brooklyn Simmons", email: "brooklyn.s@example.com", phone: "+1 (555) 456-7890", avatar: "/images/avatar/avatar-3.png" },
  { id: "4", name: "Leslie Alexander", email: "leslie.a@example.com", phone: "+1 (555) 567-8901", avatar: "/images/avatar/avatar-4.png" },
];

export function ViewTagDialog({ open, onOpenChange, tag, onEdit }: ViewTagDialogProps) {
  if (!tag) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden sm:max-w-2xl">
        {/* Header background card */}
        <div className="bg-default-100 dark:bg-default-800 p-6 border-b border-default-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-semibold text-lg">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-default-900">{tag.tagName}</h2>
                  <Badge color="secondary" className="text-xs font-semibold px-2 py-0.5">
                    #{tag.tagId}
                  </Badge>
                </div>
                <p className="text-sm text-default-500 mt-0.5">{tag.description}</p>
              </div>
            </div>

            <Badge
              className={`rounded-full px-3 py-1 text-xs font-semibold shrink-0 border-0 ${
                tag.status === "Active"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-default-200 text-default-600"
              }`}
            >
              {tag.status === "Active" ? (
                <CheckCircle2 className="w-3.5 h-3.5 me-1.5 inline-block" />
              ) : (
                <XCircle className="w-3.5 h-3.5 me-1.5 inline-block" />
              )}
              {tag.status}
            </Badge>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-lg border border-default-200 bg-background">
              <div className="flex items-center gap-2 text-default-500 text-xs font-medium mb-1">
                <Users className="w-4 h-4 text-primary" />
                <span>Contacts</span>
              </div>
              <div className="text-lg font-bold text-default-900">{tag.numberOfContacts}</div>
            </div>

            <div className="p-3.5 rounded-lg border border-default-200 bg-background">
              <div className="flex items-center gap-2 text-default-500 text-xs font-medium mb-1">
                <User className="w-4 h-4 text-blue-500" />
                <span>Created By</span>
              </div>
              <div className="text-sm font-semibold text-default-900 truncate">{tag.createdBy}</div>
            </div>

            <div className="p-3.5 rounded-lg border border-default-200 bg-background">
              <div className="flex items-center gap-2 text-default-500 text-xs font-medium mb-1">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>Created At</span>
              </div>
              <div className="text-xs font-medium text-default-700">{tag.createdAt}</div>
            </div>

            <div className="p-3.5 rounded-lg border border-default-200 bg-background">
              <div className="flex items-center gap-2 text-default-500 text-xs font-medium mb-1">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>Updated At</span>
              </div>
              <div className="text-xs font-medium text-default-700">{tag.updatedAt}</div>
            </div>
          </div>

          {/* Associated Contacts Preview Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-default-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-default-500" />
                Associated Contacts ({tag.numberOfContacts})
              </h3>
              <Link href="/contacts">
                <Button variant="ghost" size="sm" className="text-xs text-primary hover:underline h-7 px-2">
                  View All Contacts
                </Button>
              </Link>
            </div>

            <div className="divide-y divide-default-200 border border-default-200 rounded-lg overflow-hidden bg-background">
              {sampleContactsForTag.slice(0, 3).map((contact) => (
                <div key={contact.id} className="p-3 flex items-center justify-between gap-3 hover:bg-default-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback className="text-xs">{contact.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-default-800">{contact.name}</div>
                      <div className="text-xs text-default-500 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-default-400" />
                          {contact.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-default-500 hidden sm:flex items-center gap-1">
                    <Phone className="w-3 h-3 text-default-400" />
                    {contact.phone}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-default-50 dark:bg-default-900 border-t border-default-200 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onEdit && (
            <Button
              size="sm"
              color="primary"
              onClick={() => {
                onOpenChange(false);
                onEdit(tag);
              }}
            >
              Edit Tag
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
