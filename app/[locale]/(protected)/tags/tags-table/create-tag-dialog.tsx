"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TagProps } from "./data";

interface CreateTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tagToEdit?: TagProps | null;
  onSave: (tagData: Partial<TagProps>) => void;
}

export function CreateTagDialog({
  open,
  onOpenChange,
  tagToEdit,
  onSave,
}: CreateTagDialogProps) {
  const [tagName, setTagName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [status, setStatus] = React.useState<"Active" | "Inactive">("Active");

  React.useEffect(() => {
    if (tagToEdit) {
      setTagName(tagToEdit.tagName);
      setDescription(tagToEdit.description);
      setStatus(tagToEdit.status);
    } else {
      setTagName("");
      setDescription("");
      setStatus("Active");
    }
  }, [tagToEdit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;

    onSave({
      tagName: tagName.trim(),
      description: description.trim(),
      status,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{tagToEdit ? "Edit Tag" : "Create New Tag"}</DialogTitle>
          <DialogDescription>
            {tagToEdit
              ? "Update tag details and description below."
              : "Add a new tag to organize contacts and segment leads efficiently."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="tagName">Tag Name *</Label>
            <Input
              id="tagName"
              placeholder="e.g. Enterprise Client"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the tag and its intended use..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <Label htmlFor="status-switch">Active Status</Label>
              <p className="text-xs text-default-500">
                Active tags can be assigned to contacts across campaigns.
              </p>
            </div>
            <Switch
              id="status-switch"
              checked={status === "Active"}
              onCheckedChange={(checked) =>
                setStatus(checked ? "Active" : "Inactive")
              }
              color="primary"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {tagToEdit ? "Save Changes" : "Create Tag"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
