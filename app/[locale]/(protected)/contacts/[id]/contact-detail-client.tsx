"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/navigation";
import { DataProps } from "../contacts-table/columns";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Mail,
  Phone,
  UserCircle2,
  X,
  Plus,
} from "lucide-react";

import { Section1ContactInfo } from "./__components/section-1-contact-info";
import { Section4ContactStatistics } from "./__components/section-4-contact-statistics";
import { Section2ConversationHistory } from "./__components/section-2-conversation-history";
import { Section3ActivityTimeline } from "./__components/section-3-activity-timeline";
import { Section4FilesShared } from "./__components/section-4-files-shared";
import { Section5Tags } from "./__components/section-5-tags";
import { FilePreviewDialog } from "./__components/file-preview-dialog";
import { sharedFiles, SharedFile } from "./__components/files-shared-data";

const tagColors: Record<string, string> = {
  VIP: "bg-amber-500/15 text-amber-600",
  Priority: "bg-red-500/15 text-red-600",
  Support: "bg-blue-500/15 text-blue-600",
  Sales: "bg-emerald-500/15 text-emerald-600",
  New: "bg-purple-500/15 text-purple-600",
  Returning: "bg-cyan-500/15 text-cyan-600",
};

const availableTags = [
  "VIP",
  "Priority",
  "Support",
  "Sales",
  "New",
  "Returning",
  "Billing",
  "Technical",
  "Onboarding",
  "Feedback",
];

export function ContactDetailClient({
  contact,
}: {
  contact: DataProps;
}) {
  const [customerInfo, setCustomerInfo] = useState({
    customname: contact.customname || "Unknown Customer",
    whatsappName: contact.whatsappName,
    phone: contact.mobile,
    email: contact.email,
    tags: [contact.tags], // This creates a nested array
    customerSince: contact.createdAt,
    whatsappphonenumberid: contact.whatsappphonenumberid || "",
  });

  const [editContactOpen, setEditContactOpen] = useState(false);
  const [addTagOpen, setAddTagOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<SharedFile | null>(null);
  const [editForm, setEditForm] = useState({ ...customerInfo });
  const [newTagInput, setNewTagInput] = useState("");
  // ✅ FIX: Flatten the tags array
  const [selectedTags, setSelectedTags] = useState<string[]>(
    customerInfo.tags.flat()
  );
  const customerInitials = customerInfo.customname
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const openPreview = (file: SharedFile) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  const openEditContact = () => {
    setEditForm({ ...customerInfo });
    setEditContactOpen(true);
  };

  const saveEditContact = () => {

    
    console.log("editForm");
    console.log(editForm);
    console.log("editForm");

    
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/allcontactentity/byphonenumber/${editForm.phone}`, {
       method: "GET",
        headers: {
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "1"
        }
      })

      .then((response) => response.json())
      .then(async (data) => {
        console.log("Fetched contact data:", data);



        data.customname = editForm.customname;
        data.email = editForm.email;

const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/allcontactentity/update`,
  {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "1",
    },
    body: JSON.stringify(data),
  }
);

if (!response.ok) {
  throw new Error(`Update failed: ${response.status}`);
}

const result = await response.text();
alert("Update successful: " +response.status);





      });

    setCustomerInfo({ ...editForm });
    setEditContactOpen(false);
  };

  const openAddTag = () => {
    setSelectedTags([...customerInfo.tags]);
    setNewTagInput("");
    setAddTagOpen(true);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    const tag = newTagInput.trim();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
      setNewTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const saveTags = () => {
    setCustomerInfo((prev) => ({ ...prev, tags: [...selectedTags] }));
    setAddTagOpen(false);
  };

  const removeTagFromContact = (tag: string) => {
    setCustomerInfo((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const displayContact = {
    ...contact,
    customname: customerInfo.customname,
    whatsappName: customerInfo.whatsappName,
    mobile: customerInfo.phone,
    email: customerInfo.email,
    tags: customerInfo.tags,
    createdAt: customerInfo.customerSince,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link href="/contacts">
            <Button
              variant="outline"
              size="sm"
              className="h-9 !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              <ArrowLeft className="w-4 h-4 me-1.5" />
              Back
            </Button>
          </Link>
          <div className="text-xs text-default-500">
            Contact ID #{" "}
            <span className="font-semibold text-default-700">
              {contact.contactId}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
          >
            <Mail className="w-4 h-4 me-1.5" />
            Email Contact
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
          >
            <Phone className="w-4 h-4 me-1.5" />
            Call Contact
          </Button>
          <Button color="primary" size="sm" className="h-9" onClick={openEditContact}>
            <UserCircle2 className="w-4 h-4 me-1.5" />
            Edit Contact
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <Section1ContactInfo
          contact={displayContact}
          customerInitials={customerInitials}
          tagColors={tagColors}
          openEditContact={openEditContact}
          openAddTag={openAddTag}
        />
        <Section3ActivityTimeline />
      </div>

      <Section4ContactStatistics contact={displayContact} />

      <Section2ConversationHistory />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
        <Section4FilesShared
          sharedFiles={sharedFiles}
          openPreview={openPreview}
        />
        <Section5Tags
          tags={customerInfo.tags}
          tagColors={tagColors}
          onAddTag={openAddTag}
          onRemoveTag={removeTagFromContact}
        />
      </div>

      <FilePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        file={previewFile}
      />

      <Dialog open={editContactOpen} onOpenChange={setEditContactOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={editForm.customname}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    customname: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappName">WhatsApp Profile Name</Label>
              <Input
                id="whatsappName"
                value={editForm.whatsappName}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    whatsappName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>

                <div className="space-y-2">
              <Label htmlFor="whatsappphonenumberid">WhatsApp phonenummberid</Label>
              <Input
                id="whatsappphonenumberid"
                type="whatsappphonenumberid"
                value={editForm.whatsappphonenumberid}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, whatsappphonenumberid: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerSince">Customer Since</Label>
              <Input
                id="customerSince"
                value={editForm.customerSince}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    customerSince: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button color="primary" size="sm" className="h-9" onClick={saveEditContact}>
              Save Changes 
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addTagOpen} onOpenChange={setAddTagOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Add / Remove Tags</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Selected Tags</Label>
              <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 border border-default-200 rounded-md bg-background">
                {selectedTags.length > 0 ? (
                  selectedTags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap inline-flex items-center gap-1",
                        tagColors[tag] || "bg-default-200 text-default-700"
                      )}
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:opacity-70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-default-400 self-center">
                    No tags selected
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Available Tags</Label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium border transition-colors",
                        isSelected
                          ? cn(
                              "border-transparent",
                              tagColors[tag] ||
                                "bg-default-200 text-default-700"
                            )
                          : "border-default-200 bg-background text-default-600 hover:border-default-300 hover:bg-default-50"
                      )}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customTag">Add Custom Tag</Label>
              <div className="flex gap-2">
                <Input
                  id="customTag"
                  value={newTagInput}
                  placeholder="Enter tag name..."
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomTag();
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCustomTag}
                  className="h-9 shrink-0 !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button color="primary" size="sm" className="h-9" onClick={saveTags}>
              Save Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
