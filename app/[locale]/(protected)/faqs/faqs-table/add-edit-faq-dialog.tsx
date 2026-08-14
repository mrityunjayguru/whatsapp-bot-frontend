"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FAQDataProps } from "./data";

interface AddEditFAQDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq?: FAQDataProps | null;
  onSave: (faqData: Partial<FAQDataProps>) => void;
}

export function AddEditFAQDialog({
  open,
  onOpenChange,
  faq,
  onSave,
}: AddEditFAQDialogProps) {
  const isEditing = !!faq;

  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("General");
  const [matchType, setMatchType] = useState<FAQDataProps["matchType"]>("Exact Match");
  const [priority, setPriority] = useState<FAQDataProps["priority"]>("Medium");
  const [status, setStatus] = useState<FAQDataProps["status"]>("Active");
  const [keywords, setKeywords] = useState("");
  const [answer, setAnswer] = useState("");
  const [attachment, setAttachment] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (faq) {
      setQuestion(faq.question);
      setCategory(faq.category);
      setMatchType(faq.matchType);
      setPriority(faq.priority);
      setStatus(faq.status);
      setKeywords(faq.keywords.join(", "));
      setAnswer(faq.fullAnswer || faq.answerPreview);
      setAttachment(faq.attachment || "");
      setUrl(faq.url || "");
    } else {
      setQuestion("");
      setCategory("General");
      setMatchType("Exact Match");
      setPriority("Medium");
      setStatus("Active");
      setKeywords("");
      setAnswer("");
      setAttachment("");
      setUrl("");
    }
  }, [faq, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keywordArray = keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    onSave({
      ...(faq ? { id: faq.id, faqId: faq.faqId } : {}),
      question,
      category,
      matchType,
      priority,
      status,
      keywords: keywordArray,
      answerPreview: answer.slice(0, 100) + (answer.length > 100 ? "..." : ""),
      fullAnswer: answer,
      attachment: attachment ? attachment : null,
      url,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEditing ? "Edit FAQ" : "+ Add New FAQ"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Question */}
          <div className="space-y-1.5">
            <Label htmlFor="question" className="text-sm font-medium">
              Question <span className="text-destructive">*</span>
            </Label>
            <Input
              id="question"
              placeholder="Enter question title..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="h-10 border-default-200"
            />
          </div>

          {/* Category & Match Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-10 border-default-200">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Products">Products</SelectItem>
                  <SelectItem value="Services">Services</SelectItem>
                  <SelectItem value="Pricing">Pricing</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                  <SelectItem value="Delivery">Delivery</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="Returns & Refunds">Returns & Refunds</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Match Type</Label>
              <Select
                value={matchType}
                onValueChange={(v) => setMatchType(v as FAQDataProps["matchType"])}
              >
                <SelectTrigger className="h-10 border-default-200">
                  <SelectValue placeholder="Select Match Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Exact Match">Exact Match</SelectItem>
                  <SelectItem value="Partial Match">Partial Match</SelectItem>
                  <SelectItem value="AI Semantic">AI Semantic</SelectItem>
                  <SelectItem value="Keyword Match">Keyword Match</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as FAQDataProps["priority"])}
              >
                <SelectTrigger className="h-10 border-default-200">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as FAQDataProps["status"])}
              >
                <SelectTrigger className="h-10 border-default-200">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-1.5">
            <Label htmlFor="keywords" className="text-sm font-medium">
              Keywords (comma-separated)
            </Label>
            <Input
              id="keywords"
              placeholder="e.g. Onboarding, Setup, Password"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="h-10 border-default-200"
            />
          </div>

          {/* Answer */}
          <div className="space-y-1.5">
            <Label htmlFor="answer" className="text-sm font-medium">
              Full Answer Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="answer"
              rows={4}
              placeholder="Write the complete answer response..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              className="border-default-200 text-sm"
            />
          </div>

          {/* Attachment & URL */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="attachment" className="text-sm font-medium">
                Attachment File Name
              </Label>
              <Input
                id="attachment"
                placeholder="e.g. guide.pdf"
                value={attachment}
                onChange={(e) => setAttachment(e.target.value)}
                className="h-10 border-default-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="url" className="text-sm font-medium">
                Docs URL Link
              </Label>
              <Input
                id="url"
                placeholder="https://docs.dashcode.com/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-10 border-default-200"
              />
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {isEditing ? "Update FAQ" : "Create FAQ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
