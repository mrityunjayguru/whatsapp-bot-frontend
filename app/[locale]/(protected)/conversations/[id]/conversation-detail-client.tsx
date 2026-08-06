"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "@/components/navigation";
import { DataProps } from "../convarsation-table/columns";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import {
  ArrowLeft,
  Mail,
  Phone,
  UserCircle2,
  User,
  Tag,
  Eye,
  X,
  Plus,
  Image,
  FileText,
  Video,
  Music,
  Link2,
  Download,
  Paperclip,
  Clock,
  Bot,
  MessageSquare,
  Smile,
  Send,
  Mic,
  Pause,
} from "lucide-react";

import { Section1Header } from "./__components/section-1-header";
import { Section2CustomerInfo } from "./__components/section-2-customer-info";
import { Section3ChatTimeline } from "./__components/section-3-chat-timeline";
import { Section4FilesShared } from "./__components/section-4-files-shared";
import { Section5Statistics } from "./__components/section-5-statistics";
import { Section6History } from "./__components/section-6-history";
import { Section7InternalActivity } from "./__components/section-7-internal-activity";
import { Section8Notes } from "./__components/section-8-notes";
import { Section9CustomerHistory } from "./__components/section-9-customer-history";

const statusColors: Record<string, string> = {
  open: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  "in-progress": "bg-amber-500/15 text-amber-600 border-amber-500/20",
  closed: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  pending: "bg-default-300/40 text-default-700 border-default-300",
};

const statusLabels: Record<string, string> = {
  open: "Open",
  "in-progress": "In Progress",
  closed: "Closed",
  pending: "Pending",
};

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

type FileKind = "image" | "document" | "video" | "audio" | "link" | "other";

interface SharedFile {
  id: string;
  name: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  kind: FileKind;
  url?: string;
  thumbnail?: string;
}

const sharedFiles: SharedFile[] = [
  {
    id: "f1",
    name: "order-receipt-ORD-28471.jpg",
    size: "1.2 MB",
    uploadedBy: "Jenny Wilson",
    uploadedAt: "Aug 3, 2026 09:15 AM",
    kind: "image",
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "f2",
    name: "product-photo-damaged.png",
    size: "2.8 MB",
    uploadedBy: "Jenny Wilson",
    uploadedAt: "Aug 3, 2026 09:18 AM",
    kind: "image",
    thumbnail:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "f3",
    name: "customer-id-front.jpg",
    size: "768 KB",
    uploadedBy: "Jenny Wilson",
    uploadedAt: "Aug 3, 2026 09:20 AM",
    kind: "image",
    thumbnail:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "f4",
    name: "Invoice_INV-8821.pdf",
    size: "342 KB",
    uploadedBy: "Sarah Kim",
    uploadedAt: "Aug 3, 2026 10:02 AM",
    kind: "document",
  },
  {
    id: "f5",
    name: "Return-Refund-Policy.docx",
    size: "186 KB",
    uploadedBy: "Sarah Kim",
    uploadedAt: "Aug 3, 2026 10:05 AM",
    kind: "document",
  },
  {
    id: "f6",
    name: "Shipping-Label_CONV-10001.pdf",
    size: "512 KB",
    uploadedBy: "Michael Chen",
    uploadedAt: "Aug 4, 2026 08:10 AM",
    kind: "document",
  },
  {
    id: "f7",
    name: "unboxing-video.mp4",
    size: "24.6 MB",
    uploadedBy: "Jenny Wilson",
    uploadedAt: "Aug 3, 2026 09:40 AM",
    kind: "video",
  },
  {
    id: "f8",
    name: "damage-inspection.mov",
    size: "48.3 MB",
    uploadedBy: "Jenny Wilson",
    uploadedAt: "Aug 3, 2026 09:45 AM",
    kind: "video",
  },
  {
    id: "f9",
    name: "customer-voicemail.mp3",
    size: "1.8 MB",
    uploadedBy: "Michael Chen",
    uploadedAt: "Aug 4, 2026 09:00 AM",
    kind: "audio",
  },
  {
    id: "f10",
    name: "support-call-recording.wav",
    size: "6.4 MB",
    uploadedBy: "Sarah Kim",
    uploadedAt: "Aug 4, 2026 11:20 AM",
    kind: "audio",
  },
  {
    id: "f11",
    name: "Help Center — Returns",
    size: "help.shopify.com",
    uploadedBy: "Emily Rodriguez",
    uploadedAt: "Aug 4, 2026 09:30 AM",
    kind: "link",
    url: "https://help.shopify.com/en/manual/orders/refunds-returns",
  },
  {
    id: "f12",
    name: "Order Lookup Portal",
    size: "shop.example.com",
    uploadedBy: "Emily Rodriguez",
    uploadedAt: "Aug 4, 2026 09:32 AM",
    kind: "link",
    url: "https://shop.example.com/orders",
  },
  {
    id: "f13",
    name: "custom-engraving-design.ai",
    size: "4.1 MB",
    uploadedBy: "Jenny Wilson",
    uploadedAt: "Aug 3, 2026 10:30 AM",
    kind: "other",
  },
  {
    id: "f14",
    name: "sample-archive.zip",
    size: "12.7 MB",
    uploadedBy: "Michael Chen",
    uploadedAt: "Aug 4, 2026 10:15 AM",
    kind: "other",
  },
];

const tabConfig: { key: FileKind | "all"; label: string; icon: React.ElementType }[] = [
  { key: "image", label: "Images", icon: Image },
  { key: "document", label: "Documents", icon: FileText },
  { key: "video", label: "Videos", icon: Video },
  { key: "audio", label: "Audio", icon: Music },
  { key: "link", label: "Links", icon: Link2 },
  { key: "other", label: "Others", icon: Paperclip },
];

interface CustomerInfo {
  customerName: string;
  whatsappName: string;
  phone: string;
  email: string;
  tags: string[];
  customerSince: string;
}

export function ConversationDetailClient({
  conversation,
}: {
  conversation: DataProps;
}) {
  const [editContactOpen, setEditContactOpen] = useState(false);
  const [addTagOpen, setAddTagOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<SharedFile | null>(null);

  const openPreview = (file: SharedFile) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    customerName: conversation.customerName,
    whatsappName: conversation.customerName,
    phone: conversation.mobile,
    email: `${conversation.customerName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    tags: [...conversation.tags],
    customerSince: conversation.createdDate,
  });

  const [editForm, setEditForm] = useState<CustomerInfo>({ ...customerInfo });
  const [newTagInput, setNewTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([...customerInfo.tags]);

  const agentName = conversation.assignedTo?.name || "Unassigned";
  const agentInitials = agentName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const customerInitials = conversation.customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const statusKey = conversation.status;
  const statusStyle = statusColors[statusKey] || statusColors.pending;
  const statusLabel = statusLabels[statusKey] || statusKey;

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "customer",
      type: "text",
      content: "Hey there! I wanted to check the status of my order.",
      time: "09:30 AM",
    },
    {
      id: 2,
      sender: "employee",
      type: "text",
      content: "Hello! Sure, let me pull up your order details.",
      time: "09:31 AM",
    },
    {
      id: 3,
      sender: "customer",
      type: "text",
      content: "Thanks. Here is the confirmation document.",
      time: "09:32 AM",
    },
    {
      id: 4,
      sender: "customer",
      type: "file",
      fileName: "order-confirmation-459.pdf",
      fileSize: "1.2 MB",
      time: "09:32 AM",
    },
    {
      id: 5,
      sender: "employee",
      type: "reply",
      replyTo: "Thanks. Here is the confirmation document.",
      content: "Perfect, I've found your design specifications.",
      time: "09:33 AM",
    },
    {
      id: 6,
      sender: "customer",
      type: "image",
      content: "custom-engraving-front.jpg",
      thumbnail: "/images/all-img/shade-1.png",
      time: "09:35 AM",
    },
    {
      id: 7,
      sender: "employee",
      type: "file",
      fileName: "invoice-draft.pdf",
      fileSize: "450 KB",
      time: "09:40 AM",
    },
    {
      id: 8,
      sender: "customer",
      type: "audio",
      duration: "0:14",
      time: "09:42 AM",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current?.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 50);
    }
  }, [chatMessages]);

  const [chatPreviewFile, setChatPreviewFile] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (recordingInterval.current) clearInterval(recordingInterval.current);
      
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const minutes = Math.floor(recordingTime / 60);
      const seconds = recordingTime % 60;
      const durationStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "employee",
          type: "audio",
          duration: durationStr,
          time: formattedTime,
        },
      ]);
      setRecordingTime(0);
    } else {
      // Start recording
      setIsRecording(true);
      setRecordingTime(0);
      recordingInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim() && !chatPreviewFile) return;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    if (chatPreviewFile) {
      setChatMessages((prev) => [...prev, { ...chatPreviewFile, id: Date.now(), sender: "employee", time: formattedTime } as any]);
      setChatPreviewFile(null);
    } else {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "employee",
          type: "text",
          content: chatInput.trim(),
          time: formattedTime,
        },
      ]);
    }
    setChatInput("");
  };

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const quickEmojis = ["😊", "👍", "🙏", "❤️", "😂", "🎉", "✅", "🔥", "👋", "💯", "😢", "🤔"];

  const insertEmoji = (emoji: string) => {
    setChatInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachmentType, setAttachmentType] = useState<string | null>(null);

  const handleSendAttachment = (type: string) => {
    setAttachmentType(type);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input
      
      // Set accept based on type
      if (type === "Image") fileInputRef.current.accept = "image/*";
      else if (type === "Video") fileInputRef.current.accept = "video/*";
      else if (type === "Audio") fileInputRef.current.accept = "audio/*";
      else fileInputRef.current.accept = "*/*";
      
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !attachmentType) return;

    const formatSize = (bytes: number) => {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const objectUrl = URL.createObjectURL(file);
    let previewData: any = {};

    if (attachmentType === "Image") {
      previewData = {
        type: "image",
        content: file.name,
        thumbnail: objectUrl,
      };
    } else if (attachmentType === "Audio") {
      previewData = {
        type: "audio",
        duration: "0:00", 
      };
    } else {
      previewData = {
        type: "file",
        fileName: file.name,
        fileSize: formatSize(file.size),
      };
    }

    setChatPreviewFile(previewData);
    setShowAttachMenu(false);
  };


  const [internalNotes, setInternalNotes] = useState([
    {
      id: 1,
      author: agentName !== "Unassigned" ? agentName : "Rahul",
      content: "Customer requested delivery after 5 PM.",
      time: "Aug 4, 10:00 AM",
    },
    {
      id: 2,
      author: "System",
      content: "WhatsApp profile verified automatically.",
      time: "Aug 4, 09:31 AM",
    },
  ]);
  const [newNote, setNewNote] = useState("");

  const handlePostNote = () => {
    const trimmed = newNote.trim();
    if (!trimmed) return;

    const now = new Date();
    const formattedTime = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }) + ", " + now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setInternalNotes((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: agentName !== "Unassigned" ? agentName : "Rahul",
        content: trimmed,
        time: formattedTime,
      },
    ]);
    setNewNote("");
  };

  const openEditContact = () => {
    setEditForm({ ...customerInfo });
    setEditContactOpen(true);
  };

  const saveEditContact = () => {
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link href="/conversations">
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
            Conversation #{" "}
            <span className="font-semibold text-default-700">
              {conversation.conversationNo}
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
            Email Customer
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
          >
            <Phone className="w-4 h-4 me-1.5" />
            Call Customer
          </Button>
          <Button color="primary" size="sm" className="h-9">
            <UserCircle2 className="w-4 h-4 me-1.5" />
            Reassign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* Left column: Section 1 + Section 2 stacked */}
        <div className="flex flex-col gap-4">
          <Section1Header
            conversation={conversation}
            statusStyle={statusStyle}
            statusLabel={statusLabel}
            agentInitials={agentInitials}
            agentName={agentName}
          />

          <Section2CustomerInfo
            conversation={conversation}
            customerInfo={customerInfo}
            customerInitials={customerInitials}
            tagColors={tagColors}
            openEditContact={() => setEditContactOpen(true)}
            openAddTag={() => setAddTagOpen(true)}
            className="flex-1"
          />
        </div>

        {/* Right column: Section 3 chat */}
        <Section3ChatTimeline
          chatMessages={chatMessages}
          chatContainerRef={chatContainerRef}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          quickEmojis={quickEmojis}
          insertEmoji={insertEmoji}
          showAttachMenu={showAttachMenu}
          setShowAttachMenu={setShowAttachMenu}
          fileInputRef={fileInputRef}
          handleFileSelected={handleFileSelected}
          handleSendAttachment={handleSendAttachment}
          chatPreviewFile={chatPreviewFile}
          setChatPreviewFile={setChatPreviewFile}
          isRecording={isRecording}
          recordingTime={recordingTime}
          toggleRecording={toggleRecording}
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleSendChatMessage={handleSendChatMessage}
        />
      </div>

      <Section5Statistics />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Section4FilesShared
          tabConfig={tabConfig}
          sharedFiles={sharedFiles}
          openPreview={openPreview}
        />
        <Section6History />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section7InternalActivity conversation={conversation} />
        <Section8Notes
          internalNotes={internalNotes}
          newNote={newNote}
          setNewNote={setNewNote}
          handlePostNote={handlePostNote}
        />
        <Section9CustomerHistory />
      </div>




      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Preview File</DialogTitle>
          </DialogHeader>
          {previewFile && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-md border border-default-200 bg-default-50 flex items-center justify-center text-default-500">
                  {(() => {
                    const meta = tabConfig.find((t) => t.key === previewFile.kind);
                    const KindIcon = meta?.icon ?? Paperclip;
                    return <KindIcon className="w-5 h-5" />;
                  })()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-default-800 truncate">
                    {previewFile.name}
                  </div>
                  <div className="text-xs text-default-400">
                    {previewFile.size} • {previewFile.uploadedBy} • {previewFile.uploadedAt}
                  </div>
                </div>
              </div>

              <div className="border border-default-200 rounded-lg overflow-hidden bg-default-50 min-h-[320px] flex items-center justify-center">
                {previewFile.kind === "image" && previewFile.thumbnail ? (
                  <img
                    src={previewFile.thumbnail}
                    alt={previewFile.name}
                    className="max-h-[480px] max-w-full object-contain"
                  />
                ) : previewFile.kind === "link" && previewFile.url ? (
                  <div className="p-6 text-center space-y-2">
                    <Link2 className="w-10 h-10 text-blue-500 mx-auto" />
                    <div className="text-sm font-medium text-default-800">{previewFile.name}</div>
                    <a
                      href={previewFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline break-all"
                    >
                      {previewFile.url}
                    </a>
                    <div className="pt-2">
                      <Button color="primary" size="sm" onClick={() => window.open(previewFile.url, "_blank")}>
                        Open Link
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <Paperclip className="w-12 h-12 text-default-300 mx-auto" />
                    <div className="text-sm font-medium text-default-700">
                      Preview not available for this file type
                    </div>
                    <div className="text-xs text-default-400">
                      Download the file to view its contents
                    </div>
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="!border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
                      >
                        <Download className="w-4 h-4 me-1.5" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
              >
                Close
              </Button>
            </DialogClose>
            <Button color="primary" size="sm" className="h-9">
              <Download className="w-4 h-4 me-1.5" />
              Download File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                value={editForm.customerName}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    customerName: e.target.value,
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
