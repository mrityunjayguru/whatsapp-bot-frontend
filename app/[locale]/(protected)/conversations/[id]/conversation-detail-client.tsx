"use client";

import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type ElementType,
} from "react";

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

import { cn } from "@/lib/utils";

import {
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  Link2,
  Download,
  Paperclip,
  X,
  Plus,
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
   CHAT TYPES
========================================================= */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

type ChatMessage = {
  id: string | number;
  sender: "customer" | "employee";
  type: "text" | "file" | "image" | "audio" | "video";
  content?: string;
  fileName?: string;
  fileSize?: string;
  thumbnail?: string;
  duration?: string;
  time: string;
};

type ChatPreviewFile = {
  type: "file" | "image" | "audio" | "video";
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

const statusColors: Record<string, string> = {
  open: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  "in-progress":
    "bg-amber-500/15 text-amber-600 border-amber-500/20",
  closed:
    "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  pending:
    "bg-default-300/40 text-default-700 border-default-300",
};

const statusLabels: Record<string, string> = {
  open: "Open",
  "in-progress": "In Progress",
  closed: "Closed",
  pending: "Pending",
};

/* =========================================================
   TAGS
========================================================= */

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

function formatTime(dateString: string) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(dateString: string) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * chatbaotdata comes from the API as a JSON string.
 *
 * Example:
 * '{"reply":"Hello","intent":"greeting","should_handoff_to_human":false}'
 */
function parseChatbotData(value: string | null): {
  reply?: string;
  intent?: string;
  should_handoff_to_human?: boolean;
} | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);

    if (
      typeof parsed !== "object" ||
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
   CONVERT API ARRAY -> CHAT MESSAGES
========================================================= */

function convertApiMessages(
  apiData: ApiConversation[]
): ChatMessage[] {
  const messages: ChatMessage[] = [];

  apiData.forEach((item) => {
    /* ---------------------------------------------
       CUSTOMER MESSAGE
    --------------------------------------------- */

    if (item.messagebody?.trim()) {
      let type: ChatMessage["type"] = "text";

      if (item.mimeType?.startsWith("image/")) {
        type = "image";
      } else if (
        item.mimeType?.startsWith("audio/")
      ) {
        type = "audio";
      } else if (
        item.mimeType?.startsWith("video/")
      ) {
        type = "video";
      } else if (item.mimeType) {
        type = "file";
      }

      messages.push({
        id: `customer-${item.id}`,
        sender: "customer",
        type,
        content: item.messagebody,
        fileName:
          item.filePath || undefined,
        time: formatTime(item.created_at),
      });
    }

    /* ---------------------------------------------
       BOT / EMPLOYEE MESSAGE
    --------------------------------------------- */

    const botData = parseChatbotData(
      item.chatbaotdata
    );

    if (botData?.reply) {
      messages.push({
        id: `bot-${item.id}`,
        sender: "employee",
        type: "text",
        content: botData.reply,
        time: formatTime(item.created_at),
      });
    }
  });

  return messages;
}

/* =========================================================
   NORMALIZE FIRST API RECORD
========================================================= */

function normalizeConversation(
  item: ApiConversation
): DataProps {
  const normalizedStatus =
    item.status?.toLowerCase() || "pending";

  return {
    conversationNo: String(item.id),
    customerName:
      item.profilename || "Unknown Customer",
    mobile: item.phonenumber || "",
    tags: [],
    createdDate: formatDate(item.created_at),
    status: normalizedStatus,
    assignedTo: null,
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
  /* =====================================================
     SAFETY
  ===================================================== */

  const apiData = Array.isArray(conversation)
    ? conversation
    : [];

  const firstConversation = apiData[0];

  /* =====================================================
     NORMALIZED CONVERSATION
  ===================================================== */

  const normalizedConversation =
    firstConversation
      ? normalizeConversation(firstConversation)
      : ({
          conversationNo: "",
          customerName: "Unknown Customer",
          mobile: "",
          tags: [],
          createdDate: "",
          status: "pending",
          assignedTo: null,
        } as unknown as DataProps);

  /* =====================================================
     BASIC STATE
  ===================================================== */

  const [editContactOpen, setEditContactOpen] =
    useState(false);

  const [addTagOpen, setAddTagOpen] =
    useState(false);

  const [previewOpen, setPreviewOpen] =
    useState(false);

  const [previewFile, setPreviewFile] =
    useState<SharedFile | null>(null);

  /* =====================================================
     CUSTOMER INFO
  ===================================================== */

  const customerName =
    firstConversation?.profilename ||
    normalizedConversation.customerName ||
    "Unknown Customer";

  const phone =
    firstConversation?.phonenumber ||
    normalizedConversation.mobile ||
    "";

  const customerSince =
    firstConversation?.created_at || "";

  const createCustomerInfo = () => ({
    customerName,
    whatsappName: customerName,
    phone,
    email:
      customerName
        .toLowerCase()
        .replace(/\s+/g, ".") +
      "@example.com",
    tags: [] as string[],
    customerSince,
  });

  const [customerInfo, setCustomerInfo] =
    useState(createCustomerInfo);

  const [editForm, setEditForm] =
    useState(createCustomerInfo);

  const [newTagInput, setNewTagInput] =
    useState("");

  const [selectedTags, setSelectedTags] =
    useState<string[]>([]);

  /* =====================================================
     UPDATE CUSTOMER INFO WHEN API CONVERSATION CHANGES
  ===================================================== */

  useEffect(() => {
    const nextCustomerInfo =
      createCustomerInfo();

    setCustomerInfo(nextCustomerInfo);
    setEditForm(nextCustomerInfo);
  }, [
    firstConversation?.id,
    firstConversation?.profilename,
    firstConversation?.phonenumber,
    firstConversation?.created_at,
  ]);

  /* =====================================================
     AGENT
  ===================================================== */

  const agentName = "Unassigned";

  const agentInitials = agentName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  /* =====================================================
     CUSTOMER INITIALS
  ===================================================== */

  const customerInitials = customerName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  /* =====================================================
     STATUS
  ===================================================== */

  const statusKey =
    firstConversation?.status?.toLowerCase() ||
    "pending";

  const statusStyle =
    statusColors[statusKey] ||
    statusColors.pending;

  const statusLabel =
    statusLabels[statusKey] ||
    firstConversation?.status ||
    "Pending";

  /* =====================================================
     CHAT MESSAGES FROM API
  ===================================================== */

  const apiChatMessages =
    convertApiMessages(apiData);

  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(
      apiChatMessages
    );

  useEffect(() => {
    setChatMessages(
      convertApiMessages(apiData)
    );
  }, [conversation]);

  /* =====================================================
     CHAT INPUT
  ===================================================== */

  const [chatInput, setChatInput] =
    useState("");

  const chatContainerRef =
    useRef<HTMLDivElement | null>(null);

  /* =====================================================
     AUTO SCROLL
  ===================================================== */

  useEffect(() => {
    if (!chatContainerRef.current) {
      return;
    }

    const timer = window.setTimeout(() => {
      const container =
        chatContainerRef.current;

      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 50);

    return () => {
      window.clearTimeout(timer);
    };
  }, [chatMessages]);

  /* =====================================================
     FILE PREVIEW
  ===================================================== */

  const [
    chatPreviewFile,
    setChatPreviewFile,
  ] = useState<ChatPreviewFile | null>(null);

  /* =====================================================
     RECORDING
  ===================================================== */

  const [isRecording, setIsRecording] =
    useState(false);

  const [recordingTime, setRecordingTime] =
    useState(0);

  const recordingInterval =
    useRef<ReturnType<typeof setInterval> | null>(
      null
    );

  useEffect(() => {
    return () => {
      if (recordingInterval.current) {
        clearInterval(
          recordingInterval.current
        );
      }
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);

      if (recordingInterval.current) {
        clearInterval(
          recordingInterval.current
        );

        recordingInterval.current = null;
      }

      const now = new Date();

      const formattedTime =
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

      const minutes = Math.floor(
        recordingTime / 60
      );

      const seconds =
        recordingTime % 60;

      const durationStr = `${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;

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

      return;
    }

    setIsRecording(true);
    setRecordingTime(0);

    recordingInterval.current =
      setInterval(() => {
        setRecordingTime(
          (prev) => prev + 1
        );
      }, 1000);
  };

  /* =====================================================
     EMOJI
  ===================================================== */

  const [showEmojiPicker, setShowEmojiPicker] =
    useState(false);

  const [showAttachMenu, setShowAttachMenu] =
    useState(false);

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

  const insertEmoji = (emoji: string) => {
    setChatInput(
      (prev) => prev + emoji
    );

    setShowEmojiPicker(false);
  };

  /* =====================================================
     ATTACHMENT
  ===================================================== */

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [attachmentType, setAttachmentType] =
    useState<string | null>(null);

  const handleSendAttachment = (
    type: string
  ) => {
    setAttachmentType(type);

    if (!fileInputRef.current) {
      return;
    }

    fileInputRef.current.value = "";

    if (type === "Image") {
      fileInputRef.current.accept =
        "image/*";
    } else if (type === "Video") {
      fileInputRef.current.accept =
        "video/*";
    } else if (type === "Audio") {
      fileInputRef.current.accept =
        "audio/*";
    } else {
      fileInputRef.current.accept = "*/*";
    }

    fileInputRef.current.click();
  };

  const handleFileSelected = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file || !attachmentType) {
      return;
    }

    const formatSize = (bytes: number) => {
      if (bytes < 1024) {
        return `${bytes} B`;
      }

      if (bytes < 1024 * 1024) {
        return `${(
          bytes / 1024
        ).toFixed(1)} KB`;
      }

      return `${(
        bytes /
        (1024 * 1024)
      ).toFixed(1)} MB`;
    };

    const objectUrl =
      URL.createObjectURL(file);

    let previewData: ChatPreviewFile;

    if (attachmentType === "Image") {
      previewData = {
        type: "image",
        content: file.name,
        thumbnail: objectUrl,
        file,
      };
    } else if (attachmentType === "Audio") {
      previewData = {
        type: "audio",
        fileName: file.name,
        fileSize: formatSize(file.size),
        duration: "0:00",
        file,
      };
    } else if (attachmentType === "Video") {
      previewData = {
        type: "video",
        fileName: file.name,
        fileSize: formatSize(file.size),
        file,
      };
    } else {
      previewData = {
        type: "file",
        fileName: file.name,
        fileSize: formatSize(file.size),
        file,
      };
    }

    setChatPreviewFile(previewData);
    setShowAttachMenu(false);
  };

  /* =====================================================
     SEND CHAT MESSAGE / FILE
  ===================================================== */

  const handleSendChatMessage = async () => {
    const customerPhone =
      apiData?.[0]?.phonenumber;

    if (!customerPhone) {
      alert("Phone number not found");
      return;
    }

    const files = fileInputRef.current?.files
      ? Array.from(
          fileInputRef.current.files
        )
      : [];

    if (
      files.length === 0 &&
      chatPreviewFile?.file instanceof File
    ) {
      files.push(chatPreviewFile.file);
    }

    if (
      !chatInput.trim() &&
      files.length === 0
    ) {
      alert(
        "Please enter a message or select a file"
      );
      return;
    }

    if (!API_BASE_URL) {
      alert(
        "API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL."
      );
      return;
    }

    try {
      const formData = new FormData();

      formData.append(
        "to",
        customerPhone
      );

      formData.append(
        "message",
        chatInput.trim()
      );

      files.forEach((file) => {
        formData.append(
          "files",
          file,
          file.name
        );
      });

      const response = await fetch(
        `${API_BASE_URL}/api/whatsapp/sendmultipart`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );

      const responseText =
        await response.text();

      console.log(
        "API RESPONSE:",
        responseText
      );

      if (!response.ok) {
        throw new Error(
          responseText ||
            `HTTP ${response.status}`
        );
      }

      const now = new Date();

      const formattedTime =
        now.toLocaleTimeString(
          "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }
        );

      const messageText =
        chatInput.trim();

      /* ---------------------------------------------
         ADD TEXT MESSAGE TO UI
      --------------------------------------------- */

      if (messageText) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "employee",
            type: "text",
            content: messageText,
            time: formattedTime,
          },
        ]);
      }

      /* ---------------------------------------------
         ADD FILES TO UI
      --------------------------------------------- */

      if (files.length > 0) {
        const uploadedMessages: ChatMessage[] =
          files.map((file, index) => {
            let type:
              | "image"
              | "video"
              | "audio"
              | "file" = "file";

            if (
              file.type.startsWith(
                "image/"
              )
            ) {
              type = "image";
            } else if (
              file.type.startsWith(
                "video/"
              )
            ) {
              type = "video";
            } else if (
              file.type.startsWith(
                "audio/"
              )
            ) {
              type = "audio";
            }

            return {
              id:
                Date.now() +
                index +
                1,
              sender: "employee",
              type,
              content: file.name,
              fileName: file.name,
              fileSize:
                file.size < 1024
                  ? `${file.size} B`
                  : `${(
                      file.size /
                      1024
                    ).toFixed(1)} KB`,
              time: formattedTime,
            };
          });

        setChatMessages(
          (prev) => [
            ...prev,
            ...uploadedMessages,
          ]
        );
      }

      /* ---------------------------------------------
         CLEAR INPUT
      --------------------------------------------- */

      setChatInput("");
      setChatPreviewFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setAttachmentType(null);

      alert("Data sent successfully");
    } catch (error) {
      console.error(
        "Upload error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Error sending file/message"
      );
    }
  };

  /* =====================================================
     INTERNAL NOTES
  ===================================================== */

  const [internalNotes, setInternalNotes] =
    useState<
      {
        id: number;
        author: string;
        content: string;
        time: string;
      }[]
    >([
      {
        id: 1,
        author: "System",
        content:
          "WhatsApp profile verified automatically.",
        time: formatDate(
          firstConversation?.created_at ||
            ""
        ),
      },
    ]);

  const [newNote, setNewNote] =
    useState("");

  const handlePostNote = () => {
    const trimmed =
      newNote.trim();

    if (!trimmed) {
      return;
    }

    const now = new Date();

    const formattedTime =
      now.toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
        }
      ) +
      ", " +
      now.toLocaleTimeString(
        "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      );

    setInternalNotes(
      (prev) => [
        ...prev,
        {
          id: Date.now(),
          author:
            agentName !==
            "Unassigned"
              ? agentName
              : "Rahul",
          content: trimmed,
          time: formattedTime,
        },
      ]
    );

    setNewNote("");
  };

  /* =====================================================
     EDIT CUSTOMER
  ===================================================== */

  const openEditContact = () => {
    setEditForm({
      ...customerInfo,
    });

    setEditContactOpen(true);
  };

  const saveEditContact = () => {
    setCustomerInfo({
      ...editForm,
    });

    setEditContactOpen(false);
  };

  /* =====================================================
     TAGS
  ===================================================== */

  const openAddTag = () => {
    setSelectedTags([
      ...customerInfo.tags,
    ]);

    setNewTagInput("");
    setAddTagOpen(true);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter(
            (currentTag) =>
              currentTag !== tag
          )
        : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    const tag =
      newTagInput.trim();

    if (
      tag &&
      !selectedTags.includes(tag)
    ) {
      setSelectedTags(
        (prev) => [
          ...prev,
          tag,
        ]
      );

      setNewTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(
      (prev) =>
        prev.filter(
          (currentTag) =>
            currentTag !== tag
        )
    );
  };

  const saveTags = () => {
    setCustomerInfo(
      (prev) => ({
        ...prev,
        tags: [
          ...selectedTags,
        ],
      })
    );

    setAddTagOpen(false);
  };

  /* =====================================================
     FILES
  ===================================================== */

  const [sharedFiles] =
    useState<SharedFile[]>([]);

  const openPreview = (
    file: SharedFile
  ) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  const handleDownloadFile = (
    file: SharedFile | null
  ) => {
    if (!file?.url) {
      alert(
        "Download URL is not available."
      );
      return;
    }

    const link =
      document.createElement("a");

    link.href = file.url;
    link.download = file.name;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="space-y-4">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-default-500">
            Conversation#
            {firstConversation?.id || "-"}
          </div>

          <div className="text-xl font-semibold">
            {customerName}
          </div>
        </div>
      </div>

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* LEFT */}

        <div className="flex flex-col gap-4">
          <Section1Header
            conversation={
              normalizedConversation
            }
            statusStyle={statusStyle}
            statusLabel={statusLabel}
            agentInitials={
              agentInitials
            }
            agentName={agentName}
          />

          <Section2CustomerInfo
            conversation={
              normalizedConversation
            }
            customerInfo={
              customerInfo
            }
            customerInitials={
              customerInitials
            }
            tagColors={tagColors}
            openEditContact={
              openEditContact
            }
            openAddTag={openAddTag}
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
          quickEmojis={quickEmojis}
          insertEmoji={insertEmoji}
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
          chatInput={chatInput}
          setChatInput={
            setChatInput
          }
          handleSendChatMessage={
            handleSendChatMessage
          }
        />
      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <Section5Statistics />

      {/* =================================================
          FILES + HISTORY
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Section4FilesShared
          tabConfig={tabConfig}
          sharedFiles={sharedFiles}
          openPreview={openPreview}
        />

        <Section6History />
      </div>

      {/* =================================================
          ACTIVITY + NOTES + CUSTOMER HISTORY
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section7InternalActivity
          conversation={
            normalizedConversation
          }
        />

        <Section8Notes
          internalNotes={
            internalNotes
          }
          newNote={newNote}
          setNewNote={setNewNote}
          handlePostNote={
            handlePostNote
          }
        />

        <Section9CustomerHistory />
      </div>

      {/* =================================================
          FILE PREVIEW DIALOG
      ================================================= */}

      <Dialog
        open={previewOpen}
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
              {/* FILE INFO */}

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-md border border-default-200 bg-default-50 flex items-center justify-center text-default-500">
                  {(() => {
                    const meta =
                      tabConfig.find(
                        (tab) =>
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
                    }{" "}
                    •{" "}
                    {
                      previewFile.uploadedBy
                    }{" "}
                    •{" "}
                    {
                      previewFile.uploadedAt
                    }
                  </div>
                </div>
              </div>

              {/* PREVIEW */}

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
            <DialogClose
              asChild
            >
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

      {/* =================================================
          EDIT CONTACT
      ================================================= */}

      <Dialog
        open={editContactOpen}
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
            {/* CUSTOMER NAME */}

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

            {/* WHATSAPP NAME */}

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

            {/* PHONE */}

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

            {/* EMAIL */}

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

            {/* CUSTOMER SINCE */}

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
            <DialogClose
              asChild
            >
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

      {/* =================================================
          TAG DIALOG
      ================================================= */}

      <Dialog
        open={addTagOpen}
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
            {/* SELECTED TAGS */}

            <div className="space-y-2">
              <Label>
                Selected Tags
              </Label>

              <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 border border-default-200 rounded-md bg-background">
                {selectedTags.length >
                0 ? (
                  selectedTags.map(
                    (tag) => (
                      <Badge
                        key={tag}
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap inline-flex items-center gap-1",
                          tagColors[
                            tag
                          ] ||
                            "bg-default-200 text-default-700"
                        )}
                      >
                        {tag}

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

            {/* AVAILABLE TAGS */}

            <div className="space-y-2">
              <Label>
                Available Tags
              </Label>

              <div className="flex flex-wrap gap-1.5">
                {availableTags.map(
                  (tag) => {
                    const isSelected =
                      selectedTags.includes(
                        tag
                      );

                    return (
                      <button
                        type="button"
                        key={tag}
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
                        {tag}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* CUSTOM TAG */}

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
                      addCustomTag();
                    }
                  }}
                />

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
            <DialogClose
              asChild
            >
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
              onClick={saveTags}
            >
              Save Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =================================================
          HIDDEN FILE INPUT
      ================================================= */}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={
          handleFileSelected
        }
      />
    </div>
  );
}