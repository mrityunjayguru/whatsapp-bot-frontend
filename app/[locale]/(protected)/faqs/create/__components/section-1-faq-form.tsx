"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FAQDataProps } from "../../faqs-table/data";
import { cn } from "@/lib/utils";

interface Section1FAQFormProps {
  question: string;
  setQuestion: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  keywordsInput: string;
  setKeywordsInput: (val: string) => void;
  matchType: FAQDataProps["matchType"];
  setMatchType: (val: FAQDataProps["matchType"]) => void;
  priority: FAQDataProps["priority"];
  setPriority: (val: FAQDataProps["priority"]) => void;
  className?: string;
}

export const Section1FAQForm = ({
  question,
  setQuestion,
  category,
  setCategory,
  keywordsInput,
  setKeywordsInput,
  matchType,
  setMatchType,
  priority,
  setPriority,
  className,
}: Section1FAQFormProps) => {
  return (
    <Card className={cn("shadow-sm border border-default-200", className)}>
      <CardContent className="p-6 space-y-6">
        {/* Section Title Bar */}
        <div className="space-y-1 border-b border-default-200 pb-4">
          <div className="text-xs font-bold text-default-500 uppercase tracking-wider">
            SECTION 1 : FAQ Details
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Question */}
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="question" className="text-xs text-default-500 font-medium">
              Question <span className="text-destructive">*</span>
            </Label>
            <Input
              id="question"
              placeholder="Enter question title..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="h-10 border-default-200"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-xs text-default-500 font-medium">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="h-10 border-default-200">
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

          {/* Keywords */}
          <div className="space-y-1.5">
            <Label htmlFor="keywords" className="text-xs text-default-500 font-medium">
              Keywords (comma-separated)
            </Label>
            <Input
              id="keywords"
              placeholder="e.g. Onboarding, Setup, Password"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              className="h-10 border-default-200"
            />
          </div>

          {/* Match Type */}
          <div className="space-y-1.5">
            <Label htmlFor="matchType" className="text-xs text-default-500 font-medium">
              Match Type
            </Label>
            <Select
              value={matchType}
              onValueChange={(val) => setMatchType(val as FAQDataProps["matchType"])}
            >
              <SelectTrigger id="matchType" className="h-10 border-default-200">
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

          {/* Priority */}
          <div className="space-y-1.5">
            <Label htmlFor="priority" className="text-xs text-default-500 font-medium">
              Priority
            </Label>
            <Select
              value={priority}
              onValueChange={(val) => setPriority(val as FAQDataProps["priority"])}
            >
              <SelectTrigger id="priority" className="h-10 border-default-200">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
