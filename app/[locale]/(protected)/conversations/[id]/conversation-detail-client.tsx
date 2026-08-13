"use client";

<<<<<<< HEAD
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
=======
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ChangeEvent,
  type ElementType,
} from "react";

import { Client } from "@stomp/stompjs";

>>>>>>> 1baa7e2c9c410fdd1e71ad464aea08b119d620c0
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
<<<<<<< HEAD
=======

>>>>>>> 1baa7e2c9c410fdd1e71ad464aea08b119d620c0
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
<<<<<<< HEAD
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
=======

import { cn } from "@/lib/utils";

import {
  Image as ImageIcon,
>>>>>>> 1baa7e2c9c410fdd1e71ad464aea08b119d620c0
  FileText,
  Video,
  Music,
  Link2,
  Download,
  Paperclip,
<<<<<<< HEAD
  Clock,
  Bot,
  MessageSquare,
  Smile,
  Send,
  Mic,
  Pause,
=======
  X,
  Plus,
>>>>>>> 1baa7e2c9c410fdd1e71ad464aea08b119d620c0
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

<<<<<<< HEAD
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
=======
import { DataProps } from "../convarsation-table/columns";

/* =========================================================
   API TYPES
========================================================= */

interface ApiConversation {
  assigned_user_id: number | null;
  caption: string;
  chatbaotdata: string | null;
  contact_id: number | null;
  created_at: string;
  filePath: string | null;
  first_message_at: string | null;
  id: number;
  last_message_at: string | null;
  last_message_id: number | null;
  last_message_preview: string | null;
  mediaId: string;
  messageId: string | null;
  messagebody: string;
  messagestatus: string;
  mimeType: string;
  payload: unknown;
  phonenumber: string;
  profilename: string;
  receivedAt: string;
  resolved_at: string | null;
  sender: string | null;
  status: string;
  tenant_id: number;
  title: string;
  unread_count: number | null;
  updated_at: string;
  whatsapp_phone_number_id: number;
}

/* =========================================================
   WEBSOCKET PAYLOAD
========================================================= */

interface WebSocketMessagePayload {
  event?: string;

  conversationId?: string | number | null;
  conversation_id?: string | number | null;
  conversationNo?: string | number | null;

  chatId?: string | number | null;
  chat_id?: string | number | null;

  id?: string | number | null;

  messageId?: string | number | null;
  message_id?: string | number | null;

  mediaId?: string | number | null;
  media_id?: string | number | null;

  phoneNumber?: string | null;
  phonenumber?: string | null;
  phone_number?: string | null;

  customerPhone?: string | null;
  customer_phone?: string | null;

  sender?: string | null;
  from?: string | null;
  direction?: string | null;
  messageDirection?: string | null;

  messageBody?: string | null;
  messagebody?: string | null;
  message?: string | null;
  text?: string | null;
  content?: string | null;
  body?: string | null;

  mimeType?: string | null;
  mime_type?: string | null;
  mimetype?: string | null;

  filePath?: string | null;
  file_path?: string | null;
  fileName?: string | null;
  filename?: string | null;

  fileSize?: string | number | null;
  file_size?: string | number | null;

  thumbnail?: string | null;
  thumbnailUrl?: string | null;
  thumbnail_url?: string | null;

  duration?: string | number | null;

  createdAt?: string | null;
  created_at?: string | null;

  receivedAt?: string | null;
  received_at?: string | null;

  updated_at?: string | null;

  timestamp?: string | null;

  data?: WebSocketMessagePayload;
}

/* =========================================================
   API CONFIG
========================================================= */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const TEXT_API_ENDPOINT =
  "/api/whatsapp/send1";

const MULTIPART_API_ENDPOINT =
  "/api/whatsapp/sendmultipart";

const WS_API_BASE_URL =
  process.env.NEXT_PUBLIC_WS_API_BASE_URL ?? "";

/*
 * IMPORTANT:
 *
 * Spring:
 *
 * messagingTemplate.convertAndSend(
 *     "/topic/chat",
 *     payload
 * );
 *
 * must use the same destination.
 */
const WS_TOPIC =
  "/topic/chat";

/*
 * If your backend currently uses:
 *
 * /topic/tags
 *
 * simply change the above to:
 *
 * const WS_TOPIC = "/topic/tags";
 */

/* =========================================================
   CHAT TYPES
========================================================= */

type ChatMessage = {
  id: string | number;

  sender:
    | "customer"
    | "employee";

  type:
    | "text"
    | "file"
    | "image"
    | "audio"
    | "video";

  content?: string;

  fileName?: string;

  fileSize?: string | number;

  thumbnail?: string;

  duration?: string | number;

  time: string;
};

type ChatPreviewFile = {
  type:
    | "file"
    | "image"
    | "audio"
    | "video";

  content?: string;

  fileName?: string;

  fileSize?: string;

  thumbnail?: string;

  duration?: string;

  file?: File;
};

/* =========================================================
   FILE TYPES
========================================================= */

type FileKind =
  | "image"
  | "document"
  | "video"
  | "audio"
  | "link"
  | "other";

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

/* =========================================================
   STATUS
========================================================= */

const statusColors: Record<
  string,
  string
> = {
  open:
    "bg-blue-500/15 text-blue-600 border-blue-500/20",

  "in-progress":
    "bg-amber-500/15 text-amber-600 border-amber-500/20",

  closed:
    "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",

  pending:
    "bg-default-300/40 text-default-700 border-default-300",
};

const statusLabels: Record<
  string,
  string
> = {
  open: "Open",

  "in-progress":
    "In Progress",

  closed: "Closed",

  pending: "Pending",
};

/* =========================================================
   TAGS
========================================================= */

const tagColors: Record<
  string,
  string
> = {
  VIP:
    "bg-amber-500/15 text-amber-600",

  Priority:
    "bg-red-500/15 text-red-600",

  Support:
    "bg-blue-500/15 text-blue-600",

  Sales:
    "bg-emerald-500/15 text-emerald-600",

  New:
    "bg-purple-500/15 text-purple-600",

  Returning:
    "bg-cyan-500/15 text-cyan-600",
>>>>>>> 1baa7e2c9c410fdd1e71ad464aea08b119d620c0
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

<<<<<<< HEAD
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
=======
/* =========================================================
   TAB CONFIG
========================================================= */

const tabConfig: {
  key: FileKind | "all";
  label: string;
  icon: ElementType;
}[] = [
  {
    key: "image",
    label: "Images",
    icon: ImageIcon,
  },

  {
    key: "document",
    label: "Documents",
    icon: FileText,
  },

  {
    key: "video",
    label: "Videos",
    icon: Video,
  },

  {
    key: "audio",
    label: "Audio",
    icon: Music,
  },

  {
    key: "link",
    label: "Links",
    icon: Link2,
  },

  {
    key: "other",
    label: "Others",
    icon: Paperclip,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function formatTime(
  dateString: string
) {
  if (!dateString) {
    return "";
  }

  const date =
    new Date(dateString);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return dateString;
  }

  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );
}

function formatDate(
  dateString: string
) {
  if (!dateString) {
    return "";
  }

  const date =
    new Date(dateString);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return dateString;
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

function formatFileSize(
  bytes: number
) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

/* =========================================================
   PHONE NORMALIZATION
========================================================= */

function normalizePhone(
  value: unknown
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value).replace(
    /\D/g,
    ""
  );
}

/* =========================================================
   CHATBOT DATA
========================================================= */

function parseChatbotData(
  value: string | null
): {
  reply?: string;
  intent?: string;
  should_handoff_to_human?: boolean;
} | null {
  if (!value) {
    return null;
  }

  try {
    const parsed =
      JSON.parse(value);

    if (
      typeof parsed !==
        "object" ||
      parsed === null
    ) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error(
      "Failed to parse chatbaotdata:",
      error
    );

    return null;
  }
}

/* =========================================================
   MESSAGE TYPE
========================================================= */

function getChatMessageType(
  mimeType?: string | null,
  filePath?: string | null
): ChatMessage["type"] {
  const mime =
    mimeType
      ?.toLowerCase() || "";

  const path =
    filePath
      ?.toLowerCase() || "";

  if (
    mime.startsWith(
      "image/"
    ) ||
    /\.(jpg|jpeg|png|gif|webp|bmp|svg|heic)$/i.test(
      path
    )
  ) {
    return "image";
  }

  if (
    mime.startsWith(
      "audio/"
    ) ||
    /\.(mp3|wav|ogg|m4a|aac|opus|amr)$/i.test(
      path
    )
  ) {
    return "audio";
  }

  if (
    mime.startsWith(
      "video/"
    ) ||
    /\.(mp4|webm|mov|avi|mkv|3gp)$/i.test(
      path
    )
  ) {
    return "video";
  }

  if (
    mime ||
    filePath
  ) {
    return "file";
  }

  return "text";
}

/* =========================================================
   API -> CHAT
========================================================= */

function convertApiMessages(
  apiData: ApiConversation[]
): ChatMessage[] {
  const messages: ChatMessage[] =
    [];

  apiData.forEach(
    (item) => {

      /*
       * CUSTOMER MESSAGE
       */

      if (
        item.messagebody?.trim()
      ) {

        const type =
          getChatMessageType(
            item.mimeType,
            item.filePath
          );

        messages.push({
          id:
            item.messageId ??
            `customer-${item.id}`,

          sender:
            "customer",

          type,

          content:
            item.messagebody ||
            undefined,

          fileName:
            item.filePath ||
            undefined,

          time:
            formatTime(
              item.receivedAt ||
                item.created_at
            ),
        });
      }

      /*
       * BOT MESSAGE
       */

      const botData =
        parseChatbotData(
          item.chatbaotdata
        );

      if (
        botData?.reply
      ) {

        messages.push({
          id:
            `bot-${item.id}`,

          sender:
            "employee",

          type:
            "text",

          content:
            botData.reply,

          time:
            formatTime(
              item.created_at
            ),
        });
      }
    }
  );

  return messages;
}

/* =========================================================
   NORMALIZE CONVERSATION
========================================================= */

function normalizeConversation(
  item: ApiConversation
): DataProps {
  const normalizedStatus =
    item.status?.toLowerCase() ||
    "pending";

  return {
    conversationNo:
      String(item.id),

    customerName:
      item.profilename ||
      "Unknown Customer",

    mobile:
      item.phonenumber ||
      "",

    tags: [],

    createdDate:
      formatDate(
        item.created_at
      ),

    status:
      normalizedStatus,

    assignedTo:
      null,
  } as unknown as DataProps;
}

/* =========================================================
   COMPONENT
========================================================= */

export function ConversationDetailClient({
  conversation,
}: {
  conversation: ApiConversation[];
}) {

  /* =======================================================
     API DATA
  ======================================================= */

  const apiData =
    Array.isArray(
      conversation
    )
      ? conversation
      : [];

  const firstConversation =
    apiData[0];


  /* =======================================================
     BASIC STATE
  ======================================================= */

  const [
    editContactOpen,
    setEditContactOpen,
  ] = useState(false);

  const [
    addTagOpen,
    setAddTagOpen,
  ] = useState(false);

  const [
    previewOpen,
    setPreviewOpen,
  ] = useState(false);

  const [
    previewFile,
    setPreviewFile,
  ] =
    useState<SharedFile | null>(
      null
    );

  const [
    isSending,
    setIsSending,
  ] = useState(false);


  /* =======================================================
     CUSTOMER
  ======================================================= */

  const customerName =
    firstConversation?.profilename ||
    "Unknown Customer";

  const phone =
    firstConversation?.phonenumber ||
    "";

  const customerSince =
    firstConversation?.created_at ||
    "";

  const createCustomerInfo =
    () => ({
      customerName,

      whatsappName:
        customerName,

      phone,

      email:
        customerName
          .toLowerCase()
          .replace(
            /\s+/g,
            "."
          ) +
        "@example.com",

      tags: [] as string[],

      customerSince,
    });

  const [
    customerInfo,
    setCustomerInfo,
  ] = useState(
    createCustomerInfo
  );

  const [
    editForm,
    setEditForm,
  ] = useState(
    createCustomerInfo
  );

  const [
    newTagInput,
    setNewTagInput,
  ] = useState("");

  const [
    selectedTags,
    setSelectedTags,
  ] = useState<string[]>(
    []
  );


  useEffect(() => {

    const next =
      createCustomerInfo();

    setCustomerInfo(
      next
    );

    setEditForm(
      next
    );

  }, [
    firstConversation?.id,
    firstConversation?.profilename,
    firstConversation?.phonenumber,
    firstConversation?.created_at,
  ]);


  /* =======================================================
     AGENT
  ======================================================= */

  const agentName =
    "Unassigned";

  const agentInitials =
    agentName
      .split(" ")
      .map(
        (name) =>
          name[0]
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();


  /* =======================================================
     CUSTOMER INITIALS
  ======================================================= */

  const customerInitials =
    customerName
      .split(" ")
      .map(
        (name) =>
          name[0]
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();


  /* =======================================================
     STATUS
  ======================================================= */

  const statusKey =
    firstConversation?.status?.toLowerCase() ||
    "pending";

  const statusStyle =
    statusColors[
      statusKey
    ] ||
    statusColors.pending;

  const statusLabel =
    statusLabels[
      statusKey
    ] ||
    firstConversation?.status ||
    "Pending";


  /* =======================================================
     CHAT
  ======================================================= */

  const initialMessages =
    convertApiMessages(
      apiData
    );

  const [
    chatMessages,
    setChatMessages,
  ] =
    useState<ChatMessage[]>(
      initialMessages
    );


  /*
   * When server-side conversation changes,
   * reset messages.
   */

  useEffect(() => {

    setChatMessages(
      convertApiMessages(
        apiData
      )
    );

  }, [
    conversation,
  ]);


  /* =======================================================
     CHAT INPUT
  ======================================================= */

  const [
    chatInput,
    setChatInput,
  ] = useState("");


  const chatContainerRef =
    useRef<HTMLDivElement | null>(
      null
    );


  /* =======================================================
     WEBSOCKET
  ======================================================= */

  const stompClientRef =
    useRef<Client | null>(
      null
    );

  const [
    wsConnected,
    setWsConnected,
  ] = useState(false);


  /*
   * Keep received IDs.
   */

  const receivedMessageIds =
    useRef<Set<string>>(
      new Set()
    );


  /*
   * These values are captured by
   * WebSocket callback.
   */

  const currentConversationId =
    firstConversation?.id
      ? String(
          firstConversation.id
        )
      : null;

  const currentPhone =
    normalizePhone(
      firstConversation?.phonenumber
    );


  /* =======================================================
     WEBSOCKET HANDLER
  ======================================================= */

  const handleWebSocketMessage =
    useCallback(
      (
        rawData: unknown
      ) => {

        console.log(
          "========================================"
        );

        console.log(
          "WEBSOCKET MESSAGE RECEIVED"
        );

        console.log(
          rawData
        );

        console.log(
          "========================================"
        );


        if (!rawData) {
          return;
        }


        /*
         * Parse string JSON.
         */

        let data: any =
          rawData;

        if (
          typeof data ===
          "string"
        ) {

          try {

            data =
              JSON.parse(
                data
              );

          } catch (
            error
          ) {

            console.error(
              "Invalid WebSocket JSON:",
              data
            );

            return;
          }
        }


        /*
         * If backend sends:
         *
         * {
         *   event: "NEW_MESSAGE",
         *   data: {...}
         * }
         *
         * unwrap it.
         */

        if (
          data?.data &&
          typeof data.data ===
            "object"
        ) {

          data =
            data.data;
        }


        console.log(
          "NORMALIZED WEBSOCKET DATA:",
          data
        );


        /* =================================================
           EVENT
        ================================================= */

        if (
          data.event &&
          data.event !==
            "NEW_MESSAGE"
        ) {

          console.log(
            "Ignoring event:",
            data.event
          );

          return;
        }


        /* =================================================
           CONVERSATION FILTER
        ================================================= */

        const incomingConversationId =
          data.conversationId ??
          data.conversation_id ??
          data.conversationNo ??
          data.chatId ??
          data.chat_id;


        if (
          incomingConversationId !=
            null &&
          currentConversationId !=
            null
        ) {

          if (
            String(
              incomingConversationId
            ) !==
            String(
              currentConversationId
            )
          ) {

            console.log(
              "Ignoring different conversation:",
              incomingConversationId,
              currentConversationId
            );

            return;
          }
        }


        /* =================================================
           PHONE FILTER
        ================================================= */

        const incomingPhone =
          data.phoneNumber ??
          data.phonenumber ??
          data.phone_number ??
          data.customerPhone ??
          data.customer_phone;


        if (
          incomingPhone &&
          currentPhone
        ) {

          const normalizedIncoming =
            normalizePhone(
              incomingPhone
            );

          /*
           * Only reject when BOTH are present
           * and clearly different.
           */

          if (
            normalizedIncoming &&
            normalizedIncoming !==
              currentPhone
          ) {

            console.log(
              "Ignoring different phone:",
              normalizedIncoming,
              currentPhone
            );

            return;
          }
        }


        /* =================================================
           MESSAGE ID
        ================================================= */

        const rawMessageId =
          data.messageId ??
          data.message_id ??
          data.id ??
          data.mediaId ??
          data.media_id;


        const messageId =
          rawMessageId !=
          null
            ? String(
                rawMessageId
              )
            : `ws-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}`;


        /*
         * Duplicate protection.
         */

        if (
          receivedMessageIds.current.has(
            messageId
          )
        ) {

          console.log(
            "Duplicate WebSocket message ignored:",
            messageId
          );

          return;
        }


        receivedMessageIds.current.add(
          messageId
        );


        /*
         * Prevent Set from becoming
         * infinitely large.
         */

        if (
          receivedMessageIds
            .current.size >
          1000
        ) {

          const first =
            receivedMessageIds
              .current
              .values()
              .next()
              .value;

          if (first) {

            receivedMessageIds
              .current
              .delete(
                first
              );
          }
        }


        /* =================================================
           BODY
        ================================================= */

        const content =
          data.messageBody ??
          data.messagebody ??
          data.message ??
          data.text ??
          data.content ??
          data.body ??
          "";


        /* =================================================
           MIME
        ================================================= */

        const mimeType =
          data.mimeType ??
          data.mime_type ??
          data.mimetype ??
          "";


        /* =================================================
           FILE
        ================================================= */

        const filePath =
          data.filePath ??
          data.file_path ??
          data.fileName ??
          data.filename ??
          "";


        /* =================================================
           SENDER
        ================================================= */

        const senderValue =
          String(
            data.sender ??
              data.from ??
              data.direction ??
              data.messageDirection ??
              ""
          ).toLowerCase();


        let sender:
          ChatMessage["sender"];


        if (
          senderValue ===
            "employee" ||
          senderValue ===
            "agent" ||
          senderValue ===
            "outbound" ||
          senderValue ===
            "sent"
        ) {

          sender =
            "employee";

        } else {

          sender =
            "customer";
        }


        /* =================================================
           TYPE
        ================================================= */

        const type =
          getChatMessageType(
            mimeType,
            filePath
          );


        /* =================================================
           TIMESTAMP
        ================================================= */

        const timestamp =
          data.timestamp ??
          data.createdAt ??
          data.created_at ??
          data.receivedAt ??
          data.received_at ??
          data.updated_at ??
          new Date().toISOString();


        /* =================================================
           EMPTY TEXT
        ================================================= */

        if (
          type === "text" &&
          !String(
            content
          ).trim()
        ) {

          console.log(
            "Empty WebSocket text ignored"
          );

          return;
        }


        /* =================================================
           CREATE MESSAGE
        ================================================= */

        const newMessage:
          ChatMessage = {

          id:
            messageId,

          sender,

          type,

          content:
            content
              ? String(
                  content
                )
              : undefined,

          fileName:
            filePath
              ? String(
                  filePath
                )
              : undefined,

          fileSize:
            data.fileSize ??
            data.file_size ??
            undefined,

          thumbnail:
            data.thumbnail ??
            data.thumbnailUrl ??
            data.thumbnail_url ??
            undefined,

          duration:
            data.duration ??
            undefined,

          time:
            formatTime(
              String(
                timestamp
              )
            ),
        };


        console.log(
          "ADDING MESSAGE TO CHAT:",
          newMessage
        );


        /* =================================================
           UPDATE REACT STATE
        ================================================= */

        setChatMessages(
          (previous) => {

            const exists =
              previous.some(
                (message) =>
                  String(
                    message.id
                  ) ===
                  String(
                    newMessage.id
                  )
              );


            if (exists) {

              console.log(
                "Message already exists"
              );

              return previous;
            }


            return [
              ...previous,
              newMessage,
            ];
          }
        );

      },
      [
        currentConversationId,
        currentPhone,
      ]
    );


  /* =======================================================
     WEBSOCKET CONNECTION
  ======================================================= */

  useEffect(() => {

    if (
      !WS_API_BASE_URL
    ) {

      console.error(
        "NEXT_PUBLIC_WS_API_BASE_URL is not configured"
      );

      return;
    }


    /*
     * Clean trailing slash.
     */

    const base =
      WS_API_BASE_URL.replace(
        /\/$/,
        ""
      );


    /*
     * Convert HTTP URL to WS URL.
     */

    let brokerURL =
      "";


    if (
      base.startsWith(
        "https://"
      )
    ) {

      brokerURL =
        base.replace(
          "https://",
          "wss://"
        ) +
        "/ws";

    } else if (
      base.startsWith(
        "http://"
      )
    ) {

      brokerURL =
        base.replace(
          "http://",
          "ws://"
        ) +
        "/ws";

    } else if (
      base.startsWith(
        "ws://"
      ) ||
      base.startsWith(
        "wss://"
      )
    ) {

      brokerURL =
        base +
        "/ws";

    } else {

      brokerURL =
        `ws://${base}/ws`;
    }


    console.log(
      "========================================"
    );

    console.log(
      "STOMP BROKER URL:",
      brokerURL
    );

    console.log(
      "STOMP TOPIC:",
      WS_TOPIC
    );

    console.log(
      "========================================"
    );


    const client =
      new Client({

        brokerURL,

        reconnectDelay:
          5000,

        heartbeatIncoming:
          10000,

        heartbeatOutgoing:
          10000,

        connectHeaders: {},

        debug:
          (message) => {

            console.log(
              "[STOMP]",
              message
            );
          },


        /* =============================================
           CONNECTED
        ============================================= */

        onConnect:
          () => {

            console.log(
              "========================================"
            );

            console.log(
              "STOMP CONNECTED"
            );

            console.log(
              "SUBSCRIBING:",
              WS_TOPIC
            );

            console.log(
              "========================================"
            );


            setWsConnected(
              true
            );


            client.subscribe(
              WS_TOPIC,
              (
                message
              ) => {

                console.log(
                  "========================================"
                );

                console.log(
                  "STOMP MESSAGE"
                );

                console.log(
                  message.body
                );

                console.log(
                  "========================================"
                );


                try {

                  const parsed =
                    JSON.parse(
                      message.body
                    );


                  handleWebSocketMessage(
                    parsed
                  );

                } catch (
                  error
                ) {

                  console.error(
                    "WebSocket JSON parse error:",
                    error
                  );

                  console.error(
                    "BODY:",
                    message.body
                  );
                }
              }
            );
          },


        /* =============================================
           DISCONNECT
        ============================================= */

        onDisconnect:
          () => {

            console.log(
              "STOMP DISCONNECTED"
            );

            setWsConnected(
              false
            );
          },


        /* =============================================
           STOMP ERROR
        ============================================= */

        onStompError:
          (frame) => {

            console.error(
              "STOMP ERROR:",
              frame.headers[
                "message"
              ]
            );

            console.error(
              "STOMP ERROR BODY:",
              frame.body
            );

            setWsConnected(
              false
            );
          },


        /* =============================================
           SOCKET ERROR
        ============================================= */

        onWebSocketError:
          (error) => {

            console.error(
              "WEBSOCKET ERROR:",
              error
            );

            setWsConnected(
              false
            );
          },


        /* =============================================
           SOCKET CLOSE
        ============================================= */

        onWebSocketClose:
          (event) => {

            console.log(
              "WEBSOCKET CLOSED:",
              event.code,
              event.reason
            );

            setWsConnected(
              false
            );
          },
      });


    stompClientRef.current =
      client;


    /*
     * CONNECT
     */

    client.activate();


    /*
     * CLEANUP
     */

    return () => {

      console.log(
        "Disconnecting STOMP..."
      );

      setWsConnected(
        false
      );

      client.deactivate();

      stompClientRef.current =
        null;
    };

  }, [
    handleWebSocketMessage,
  ]);


  /* =======================================================
     AUTO SCROLL
  ======================================================= */

  useEffect(() => {

    if (
      !chatContainerRef.current
    ) {
      return;
    }


    const timer =
      window.setTimeout(
        () => {

          const container =
            chatContainerRef.current;

          if (container) {

            container.scrollTo({
              top:
                container.scrollHeight,

              behavior:
                "smooth",
            });
          }

        },
        50
      );


    return () => {

      window.clearTimeout(
        timer
      );
    };

  }, [
    chatMessages,
  ]);


  /* =======================================================
     FILE PREVIEW
  ======================================================= */

  const [
    chatPreviewFile,
    setChatPreviewFile,
  ] =
    useState<ChatPreviewFile | null>(
      null
    );


  /* =======================================================
     RECORDING
  ======================================================= */

  const [
    isRecording,
    setIsRecording,
  ] = useState(false);

  const [
    recordingTime,
    setRecordingTime,
  ] = useState(0);

  const recordingInterval =
    useRef<
      ReturnType<
        typeof setInterval
      > | null
    >(null);


  useEffect(() => {

    return () => {

      if (
        recordingInterval.current
      ) {

        clearInterval(
          recordingInterval.current
        );
      }
    };

  }, []);


  const toggleRecording =
    () => {

      if (
        isRecording
      ) {

        setIsRecording(
          false
        );


        if (
          recordingInterval.current
        ) {

          clearInterval(
            recordingInterval.current
          );

          recordingInterval.current =
            null;
        }


        /*
         * Local recording preview.
         */

        const now =
          new Date();

        const formattedTime =
          now.toLocaleTimeString(
            "en-US",
            {
              hour:
                "2-digit",

              minute:
                "2-digit",

              hour12:
                true,
            }
          );


        const minutes =
          Math.floor(
            recordingTime /
              60
          );

        const seconds =
          recordingTime %
          60;


        const durationStr =
          `${minutes}:${
            seconds <
            10
              ? "0"
              : ""
          }${seconds}`;


        setChatMessages(
          (prev) => [
            ...prev,
            {
              id:
                `local-audio-${Date.now()}`,

              sender:
                "employee",

              type:
                "audio",

              duration:
                durationStr,

              time:
                formattedTime,
            },
          ]
        );


        setRecordingTime(
          0
        );

        return;
      }


      setIsRecording(
        true
      );

      setRecordingTime(
        0
      );


      recordingInterval.current =
        setInterval(
          () => {

            setRecordingTime(
              (prev) =>
                prev + 1
            );

          },
          1000
        );
    };


  /* =======================================================
     EMOJI
  ======================================================= */

  const [
    showEmojiPicker,
    setShowEmojiPicker,
  ] = useState(false);

  const [
    showAttachMenu,
    setShowAttachMenu,
  ] = useState(false);


  const quickEmojis = [
    "😊",
    "👍",
    "🙏",
    "❤️",
    "😂",
    "🎉",
    "✅",
    "🔥",
    "👋",
    "💯",
    "😢",
    "🤔",
  ];


  const insertEmoji =
    (
      emoji: string
    ) => {

      setChatInput(
        (prev) =>
          prev + emoji
      );

      setShowEmojiPicker(
        false
      );
    };


  /* =======================================================
     ATTACHMENT
  ======================================================= */

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    );


  const [
    attachmentType,
    setAttachmentType,
  ] = useState<
    string | null
  >(null);


  const handleSendAttachment =
    (
      type: string
    ) => {

      setAttachmentType(
        type
      );


      if (
        !fileInputRef.current
      ) {
        return;
      }


      fileInputRef.current.value =
        "";


      if (
        type ===
        "Image"
      ) {

        fileInputRef.current.accept =
          "image/*";

      } else if (
        type ===
        "Video"
      ) {

        fileInputRef.current.accept =
          "video/*";

      } else if (
        type ===
        "Audio"
      ) {

        fileInputRef.current.accept =
          "audio/*";

      } else {

        fileInputRef.current.accept =
          ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,*/*";
      }


      fileInputRef.current.click();
    };


  const handleFileSelected =
    (
      e: ChangeEvent<HTMLInputElement>
    ) => {

      const file =
        e.target.files?.[0];


      if (
        !file ||
        !attachmentType
      ) {
        return;
      }


      const objectUrl =
        URL.createObjectURL(
          file
        );


      let previewData:
        ChatPreviewFile;


      if (
        attachmentType ===
        "Image"
      ) {

        previewData = {

          type:
            "image",

          content:
            file.name,

          thumbnail:
            objectUrl,

          file,
        };

      } else if (
        attachmentType ===
        "Audio"
      ) {

        previewData = {

          type:
            "audio",

          fileName:
            file.name,

          fileSize:
            formatFileSize(
              file.size
            ),

          duration:
            "0:00",

          file,
        };

      } else if (
        attachmentType ===
        "Video"
      ) {

        previewData = {

          type:
            "video",

          fileName:
            file.name,

          fileSize:
            formatFileSize(
              file.size
            ),

          file,
        };

      } else {

        previewData = {

          type:
            "file",

          fileName:
            file.name,

          fileSize:
            formatFileSize(
              file.size
            ),

          file,
        };
      }


      setChatPreviewFile(
        previewData
      );


      setShowAttachMenu(
        false
      );
    };


  /* =======================================================
     GET FILES
  ======================================================= */

  const getSelectedFiles =
    (): File[] => {

      if (
        fileInputRef.current
          ?.files?.length
      ) {

        return Array.from(
          fileInputRef.current
            .files
        );
      }


      if (
        chatPreviewFile?.file instanceof
        File
      ) {

        return [
          chatPreviewFile.file,
        ];
      }


      return [];
    };


  /* =======================================================
     SEND TEXT
  ======================================================= */

  const sendTextMessage =
    async (
      customerPhone: string,
      message: string
    ) => {

      const formData =
        new URLSearchParams();


      formData.append(
        "to",
        customerPhone
      );


      formData.append(
        "message",
        message
      );


      const response =
        await fetch(
          `${API_BASE_URL}${TEXT_API_ENDPOINT}`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded",

              Accept:
                "application/json, text/plain, */*",
            },

            body:
              formData.toString(),
          }
        );


      const responseText =
        await response.text();


      console.log(
        "SEND1 RESPONSE:",
        responseText
      );


      if (
        !response.ok
      ) {

        throw new Error(
          responseText ||
            `HTTP ${response.status}`
        );
      }


      return responseText;
    };


  /* =======================================================
     SEND MULTIPART
  ======================================================= */

  const sendMultipartMessage =
    async (
      customerPhone: string,
      message: string,
      files: File[]
    ) => {

      const formData =
        new FormData();


      formData.append(
        "to",
        customerPhone
      );


      formData.append(
        "message",
        message
      );


      files.forEach(
        (file) => {

          formData.append(
            "files",
            file,
            file.name
          );
        }
      );


      const response =
        await fetch(
          `${API_BASE_URL}${MULTIPART_API_ENDPOINT}`,
          {
            method:
              "POST",

            headers: {
              Accept:
                "application/json, text/plain, */*",
            },

            body:
              formData,
          }
        );


      const responseText =
        await response.text();


      console.log(
        "SEND MULTIPART RESPONSE:",
        responseText
      );


      if (
        !response.ok
      ) {

        throw new Error(
          responseText ||
            `HTTP ${response.status}`
        );
      }


      return responseText;
    };


  /* =======================================================
     SEND CHAT MESSAGE
  ======================================================= */

  const handleSendChatMessage =
    async () => {

      if (
        isSending
      ) {
        return;
      }


      const customerPhone =
        apiData?.[0]
          ?.phonenumber
          ?.trim();


      if (
        !customerPhone
      ) {

        alert(
          "Phone number not found"
        );

        return;
      }


      const messageText =
        chatInput.trim();


      const files =
        getSelectedFiles();


      if (
        !messageText &&
        files.length === 0
      ) {

        alert(
          "Please enter a message or select a file"
        );

        return;
      }


      if (
        !API_BASE_URL
      ) {

        alert(
          "API base URL is not configured."
        );

        return;
      }


      try {

        setIsSending(
          true
        );


        /* ===============================================
           SEND TO BACKEND
        =============================================== */

        if (
          messageText &&
          files.length === 0
        ) {

          await sendTextMessage(
            customerPhone,
            messageText
          );

        } else {

          await sendMultipartMessage(
            customerPhone,
            messageText,
            files
          );
        }


        /*
         * IMPORTANT:
         *
         * DO NOT add the message to chatMessages here.
         *
         * Backend WebSocket is responsible for
         * updating the chat.
         */


        setChatInput(
          ""
        );

        setChatPreviewFile(
          null
        );

        setAttachmentType(
          null
        );

        setShowEmojiPicker(
          false
        );

        setShowAttachMenu(
          false
        );


        if (
          fileInputRef.current
        ) {

          fileInputRef.current.value =
            "";
        }

      } catch (
        error
      ) {

        console.error(
          "Send message error:",
          error
        );


        alert(
          error instanceof
            Error
            ? error.message
            : "Error sending message"
        );

      } finally {

        setIsSending(
          false
        );
      }
    };


  /* =======================================================
     INTERNAL NOTES
  ======================================================= */

  const [
    internalNotes,
    setInternalNotes,
  ] = useState<
    {
      id: number;
      author: string;
      content: string;
      time: string;
    }[]
  >([
    {
      id: 1,

      author:
        "System",

      content:
        "WhatsApp profile verified automatically.",

      time:
        formatDate(
          firstConversation?.created_at ||
            ""
        ),
    },
  ]);


  const [
    newNote,
    setNewNote,
  ] = useState("");


  const handlePostNote =
    () => {

      const trimmed =
        newNote.trim();


      if (!trimmed) {
        return;
      }


      const now =
        new Date();


      const formattedTime =
        now.toLocaleDateString(
          "en-US",
          {
            month:
              "short",

            day:
              "numeric",
          }
        ) +
        ", " +
        now.toLocaleTimeString(
          "en-US",
          {
            hour:
              "2-digit",

            minute:
              "2-digit",

            hour12:
              true,
          }
        );


      setInternalNotes(
        (prev) => [
          ...prev,

          {
            id:
              Date.now(),

            author:
              agentName !==
              "Unassigned"
                ? agentName
                : "Rahul",

            content:
              trimmed,

            time:
              formattedTime,
          },
        ]
      );


      setNewNote(
        ""
      );
    };


  /* =======================================================
     EDIT CUSTOMER
  ======================================================= */

  const openEditContact =
    () => {

      setEditForm({
        ...customerInfo,
      });

      setEditContactOpen(
        true
      );
    };


  const saveEditContact =
    () => {

      setCustomerInfo({
        ...editForm,
      });

      setEditContactOpen(
        false
      );
    };


  /* =======================================================
     TAGS
  ======================================================= */

  const openAddTag =
    () => {

      setSelectedTags([
        ...customerInfo.tags,
      ]);

      setNewTagInput(
        ""
      );

      setAddTagOpen(
        true
      );
    };


  const toggleTag =
    (
      tag: string
    ) => {

      setSelectedTags(
        (prev) =>
          prev.includes(
            tag
          )
            ? prev.filter(
                (
                  currentTag
                ) =>
                  currentTag !==
                  tag
              )
            : [
                ...prev,
                tag,
              ]
      );
    };


  const addCustomTag =
    () => {

      const tag =
        newTagInput.trim();


      if (
        tag &&
        !selectedTags.includes(
          tag
        )
      ) {

        setSelectedTags(
          (prev) => [
            ...prev,
            tag,
          ]
        );


        setNewTagInput(
          ""
        );
      }
    };


  const removeTag =
    (
      tag: string
    ) => {

      setSelectedTags(
        (prev) =>
          prev.filter(
            (
              currentTag
            ) =>
              currentTag !==
              tag
          )
      );
    };


  const saveTags =
    async () => {

      try {

        await Promise.all(
          selectedTags.map(
            async (
              tagName
            ) => {

              const url =
                API_BASE_URL +
                "/api/tags?name=" +
                encodeURIComponent(
                  tagName
                );


              const response =
                await fetch(
                  url,
                  {
                    method:
                      "POST",

                    headers: {
                      Accept:
                        "application/json",

                      "Content-Type":
                        "application/json",
                    },

                    body:
                      JSON.stringify(
                        {
                          name:
                            tagName,
                        }
                      ),
                  }
                );


              if (
                !response.ok
              ) {

                throw new Error(
                  `Failed to save tag: ${tagName}`
                );
              }


              return response.text();
            }
          )
        );


        setCustomerInfo(
          (prev) => ({
            ...prev,

            tags: [
              ...selectedTags,
            ],
          })
        );


        setAddTagOpen(
          false
        );

      } catch (
        error
      ) {

        console.error(
          "Error saving tags:",
          error
        );
      }
    };


  /* =======================================================
     FILES
  ======================================================= */

  const [
    sharedFiles,
  ] = useState<
    SharedFile[]
  >([]);


  const openPreview =
    (
      file: SharedFile
    ) => {

      setPreviewFile(
        file
      );

      setPreviewOpen(
        true
      );
    };


  const handleDownloadFile =
    (
      file:
        | SharedFile
        | null
    ) => {

      if (
        !file?.url
      ) {

        alert(
          "Download URL is not available."
        );

        return;
      }


      const link =
        document.createElement(
          "a"
        );


      link.href =
        file.url;

      link.download =
        file.name;

      link.target =
        "_blank";

      link.rel =
        "noopener noreferrer";


      document.body.appendChild(
        link
      );


      link.click();


      document.body.removeChild(
        link
      );
    };


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-4">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex items-center justify-between">

        <div>

          <div className="text-sm text-default-500">

            Conversation#
            {firstConversation?.id ||
              "-"}

          </div>


          <div className="text-xl font-semibold">

            {customerName}

          </div>

        </div>


        {/* WS STATUS */}

        <div className="flex items-center gap-2">

          <span
            className={cn(
              "h-2 w-2 rounded-full",

              wsConnected
                ? "bg-emerald-500"
                : "bg-red-500"
            )}
          />


          <span className="text-xs text-default-500">

            {wsConnected
              ? "Live"
              : "Offline"}

          </span>

        </div>

      </div>


      {/* ===================================================
          MAIN GRID
      =================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">

        {/* LEFT */}

        <div className="flex flex-col gap-4">

          <Section1Header
            conversation={
              normalizeConversation(
                firstConversation
              )
            }

            statusStyle={
              statusStyle
            }

            statusLabel={
              statusLabel
            }

            agentInitials={
              agentInitials
            }

            agentName={
              agentName
            }
          />


          <Section2CustomerInfo
            conversation={
              normalizeConversation(
                firstConversation
              )
            }

            customerInfo={
              customerInfo
            }

            customerInitials={
              customerInitials
            }

            tagColors={
              tagColors
            }

            openEditContact={
              openEditContact
            }

            openAddTag={
              openAddTag
            }

            className="flex-1"
          />

        </div>


        {/* RIGHT */}

        <Section3ChatTimeline
          chatMessages={
            chatMessages
          }

          chatContainerRef={
            chatContainerRef
          }

          showEmojiPicker={
            showEmojiPicker
          }

          setShowEmojiPicker={
            setShowEmojiPicker
          }

          quickEmojis={
            quickEmojis
          }

          insertEmoji={
            insertEmoji
          }

          showAttachMenu={
            showAttachMenu
          }

          setShowAttachMenu={
            setShowAttachMenu
          }

          fileInputRef={
            fileInputRef
          }

          handleFileSelected={
            handleFileSelected
          }

          handleSendAttachment={
            handleSendAttachment
          }

          chatPreviewFile={
            chatPreviewFile
          }

          setChatPreviewFile={
            setChatPreviewFile
          }

          isRecording={
            isRecording
          }

          recordingTime={
            recordingTime
          }

          toggleRecording={
            toggleRecording
          }

          chatInput={
            chatInput
          }

          setChatInput={
            setChatInput
          }

          handleSendChatMessage={
            handleSendChatMessage
          }

        />

      </div>


      {/* ===================================================
          STATISTICS
      =================================================== */}

      <Section5Statistics />


      {/* ===================================================
          FILES + HISTORY
      =================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        <Section4FilesShared
          tabConfig={
            tabConfig
          }

          sharedFiles={
            sharedFiles
          }

          openPreview={
            openPreview
          }
        />


        <Section6History />

      </div>


      {/* ===================================================
          ACTIVITY + NOTES + CUSTOMER HISTORY
      =================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <Section7InternalActivity
          conversation={
            normalizeConversation(
              firstConversation
            )
          }
        />


        <Section8Notes
          internalNotes={
            internalNotes
          }

          newNote={
            newNote
          }

          setNewNote={
            setNewNote
          }

          handlePostNote={
            handlePostNote
          }
        />


        <Section9CustomerHistory />

      </div>


      {/* ===================================================
          FILE PREVIEW
      =================================================== */}

      <Dialog
        open={
          previewOpen
        }

        onOpenChange={
          setPreviewOpen
        }
      >

        <DialogContent size="md">

          <DialogHeader>

            <DialogTitle>
              Preview File
            </DialogTitle>

          </DialogHeader>


          {previewFile && (

            <div className="space-y-3">

              <div className="flex items-center gap-3">

                <div className="h-10 w-10 shrink-0 rounded-md border border-default-200 bg-default-50 flex items-center justify-center text-default-500">

                  {(() => {

                    const meta =
                      tabConfig.find(
                        (
                          tab
                        ) =>
                          tab.key ===
                          previewFile.kind
                      );


                    const KindIcon =
                      meta?.icon ||
                      Paperclip;


                    return (
                      <KindIcon className="w-5 h-5" />
                    );

                  })()}

                </div>


                <div className="min-w-0 flex-1">

                  <div className="text-sm font-semibold text-default-800 truncate">

                    {
                      previewFile.name
                    }

                  </div>


                  <div className="text-xs text-default-400">

                    {
                      previewFile.size
                    }

                    {" • "}

                    {
                      previewFile.uploadedBy
                    }

                    {" • "}

                    {
                      previewFile.uploadedAt
                    }

                  </div>

                </div>

              </div>


              <div className="border border-default-200 rounded-lg overflow-hidden bg-default-50 min-h-[320px] flex items-center justify-center">

                {previewFile.kind ===
                  "image" &&
                previewFile.thumbnail ? (

                  <img
                    src={
                      previewFile.thumbnail
                    }

                    alt={
                      previewFile.name
                    }

                    className="max-h-[480px] max-w-full object-contain"
                  />

                ) : previewFile.kind ===
                    "link" &&
                  previewFile.url ? (

                  <div className="p-6 text-center space-y-2">

                    <Link2 className="w-10 h-10 text-blue-500 mx-auto" />


                    <div className="text-sm font-medium text-default-800">

                      {
                        previewFile.name
                      }

                    </div>


                    <a
                      href={
                        previewFile.url
                      }

                      target="_blank"

                      rel="noopener noreferrer"

                      className="text-xs text-blue-600 hover:underline break-all"
                    >

                      {
                        previewFile.url
                      }

                    </a>


                    <div className="pt-2">

                      <Button
                        color="primary"
                        size="sm"

                        onClick={() =>
                          window.open(
                            previewFile.url,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >

                        Open Link

                      </Button>

                    </div>

                  </div>

                ) : (

                  <div className="p-8 text-center space-y-2">

                    <Paperclip className="w-12 h-12 text-default-300 mx-auto" />


                    <div className="text-sm font-medium text-default-700">

                      Preview not available

                    </div>


                    <div className="text-xs text-default-400">

                      Download the file to view its contents

                    </div>


                    {previewFile.url && (

                      <div className="pt-2">

                        <Button
                          variant="outline"
                          size="sm"

                          onClick={() =>
                            handleDownloadFile(
                              previewFile
                            )
                          }
                        >

                          <Download className="w-4 h-4 me-1.5" />

                          Download

                        </Button>

                      </div>

                    )}

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
              >
                Close
              </Button>

            </DialogClose>


            <Button
              color="primary"
              size="sm"

              onClick={() =>
                handleDownloadFile(
                  previewFile
                )
              }

              disabled={
                !previewFile?.url
              }
            >

              <Download className="w-4 h-4 me-1.5" />

              Download File

            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>


      {/* ===================================================
          EDIT CONTACT
      =================================================== */}

      <Dialog
        open={
          editContactOpen
        }

        onOpenChange={
          setEditContactOpen
        }
      >

        <DialogContent size="sm">

          <DialogHeader>

            <DialogTitle>
              Edit Contact
            </DialogTitle>

          </DialogHeader>


          <div className="space-y-4 py-2">

            <div className="space-y-2">

              <Label htmlFor="customerName">
                Customer Name
              </Label>

              <Input
                id="customerName"

                value={
                  editForm.customerName
                }

                onChange={(e) =>
                  setEditForm(
                    (prev) => ({
                      ...prev,

                      customerName:
                        e.target.value,
                    })
                  )
                }
              />

            </div>


            <div className="space-y-2">

              <Label htmlFor="whatsappName">
                WhatsApp Profile Name
              </Label>

              <Input
                id="whatsappName"

                value={
                  editForm.whatsappName
                }

                onChange={(e) =>
                  setEditForm(
                    (prev) => ({
                      ...prev,

                      whatsappName:
                        e.target.value,
                    })
                  )
                }
              />

            </div>


            <div className="space-y-2">

              <Label htmlFor="phone">
                Phone Number
              </Label>

              <Input
                id="phone"

                value={
                  editForm.phone
                }

                onChange={(e) =>
                  setEditForm(
                    (prev) => ({
                      ...prev,

                      phone:
                        e.target.value,
                    })
                  )
                }
              />

            </div>


            <div className="space-y-2">

              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"

                type="email"

                value={
                  editForm.email
                }

                onChange={(e) =>
                  setEditForm(
                    (prev) => ({
                      ...prev,

                      email:
                        e.target.value,
                    })
                  )
                }
              />

            </div>


            <div className="space-y-2">

              <Label htmlFor="customerSince">
                Customer Since
              </Label>

              <Input
                id="customerSince"

                value={
                  editForm.customerSince
                }

                onChange={(e) =>
                  setEditForm(
                    (prev) => ({
                      ...prev,

                      customerSince:
                        e.target.value,
                    })
                  )
                }
              />

            </div>

          </div>


          <DialogFooter>

            <DialogClose asChild>

              <Button
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>

            </DialogClose>


            <Button
              color="primary"
              size="sm"

              onClick={
                saveEditContact
              }
            >
              Save Changes
            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>


      {/* ===================================================
          TAG DIALOG
      =================================================== */}

      <Dialog
        open={
          addTagOpen
        }

        onOpenChange={
          setAddTagOpen
        }
      >

        <DialogContent size="sm">

          <DialogHeader>

            <DialogTitle>
              Add / Remove Tags
            </DialogTitle>

          </DialogHeader>


          <div className="space-y-4 py-2">

            <div className="space-y-2">

              <Label>
                Selected Tags
              </Label>


              <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 border border-default-200 rounded-md bg-background">

                {selectedTags.length >
                0 ? (

                  selectedTags.map(
                    (
                      tag
                    ) => (

                      <Badge
                        key={
                          tag
                        }

                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap inline-flex items-center gap-1",

                          tagColors[
                            tag
                          ] ||
                            "bg-default-200 text-default-700"
                        )}
                      >

                        {
                          tag
                        }


                        <button
                          type="button"

                          onClick={() =>
                            removeTag(
                              tag
                            )
                          }

                          className="ml-1 hover:opacity-70"

                          aria-label={`Remove ${tag}`}
                        >

                          <X className="w-3 h-3" />

                        </button>

                      </Badge>

                    )
                  )

                ) : (

                  <span className="text-xs text-default-400 self-center">

                    No tags selected

                  </span>

                )}

              </div>

            </div>


            <div className="space-y-2">

              <Label>
                Available Tags
              </Label>


              <div className="flex flex-wrap gap-1.5">

                {availableTags.map(
                  (
                    tag
                  ) => {

                    const isSelected =
                      selectedTags.includes(
                        tag
                      );


                    return (

                      <button
                        type="button"

                        key={
                          tag
                        }

                        onClick={() =>
                          toggleTag(
                            tag
                          )
                        }

                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-medium border transition-colors",

                          isSelected
                            ? cn(
                                "border-transparent",

                                tagColors[
                                  tag
                                ] ||
                                  "bg-default-200 text-default-700"
                              )
                            : "border-default-200 bg-background text-default-600 hover:border-default-300 hover:bg-default-50"
                        )}
                      >

                        {isSelected
                          ? "✓ "
                          : "+ "}

                        {
                          tag
                        }

                      </button>

                    );
                  }
                )}

              </div>

            </div>


            <div className="space-y-2">

              <Label htmlFor="customTag">
                Add Custom Tag
              </Label>


              <div className="flex gap-2">

                <Input
                  id="customTag"

                  value={
                    newTagInput
                  }

                  placeholder="Enter tag name..."

                  onChange={(e) =>
                    setNewTagInput(
                      e.target.value
                    )
                  }

                  onKeyDown={(e) => {

                    if (
                      e.key ===
                      "Enter"
                    ) {

                      e.preventDefault();

>>>>>>> 1baa7e2c9c410fdd1e71ad464aea08b119d620c0
                      addCustomTag();
                    }
                  }}
                />
<<<<<<< HEAD
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
=======


                <Button
                  type="button"

                  variant="outline"

                  size="sm"

                  onClick={
                    addCustomTag
                  }
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
              >
                Cancel
              </Button>

            </DialogClose>


            <Button
              color="primary"
              size="sm"

              onClick={
                saveTags
              }
            >
              Save Tags
            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>


      {/* ===================================================
          HIDDEN FILE INPUT
      =================================================== */}

      <input
        ref={
          fileInputRef
        }

        type="file"

        className="hidden"

        onChange={
          handleFileSelected
        }
      />

    </div>
  );
}
>>>>>>> 1baa7e2c9c410fdd1e71ad464aea08b119d620c0
