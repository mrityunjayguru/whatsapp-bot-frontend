"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ChangeEvent,
  type ElementType,
} from "react";

import { Client } from "@stomp/stompjs";

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

function determineSender(item: ApiConversation): "customer" | "employee" {
  const senderVal = String(item.sender ?? "").toLowerCase().trim();
  const statusVal = String(item.messagestatus ?? item.status ?? "").toLowerCase().trim();
  const msgId = String(item.messageId ?? item.id ?? "").toLowerCase().trim();

  // 1. Check sender string
  if (
    senderVal.includes("employee") ||
    senderVal.includes("agent") ||
    senderVal.includes("admin") ||
    senderVal.includes("staff") ||
    senderVal.includes("user") ||
    senderVal === "outgoing" ||
    senderVal === "outbound" ||
    senderVal === "me" ||
    senderVal === "sent"
  ) {
    return "employee";
  }

  // 2. Check message status (sent, delivered, read, sending, outbound)
  if (
    statusVal === "sent" ||
    statusVal === "delivered" ||
    statusVal === "read" ||
    statusVal === "sending" ||
    statusVal === "outbound" ||
    statusVal === "outgoing"
  ) {
    return "employee";
  }

  // 3. Check ID prefixes
  if (
    msgId.startsWith("sent") ||
    msgId.startsWith("opt") ||
    msgId.startsWith("local") ||
    msgId.startsWith("client")
  ) {
    return "employee";
  }

  return "customer";
}

function convertApiMessages(
  apiData: ApiConversation[]
): ChatMessage[] {
  const messages: ChatMessage[] = [];

  if (Array.isArray(apiData)) {
    apiData.forEach((item: any) => {
      const textContent = (
        item.messagebody ??
        item.messageBody ??
        item.message ??
        item.content ??
        item.text ??
        item.caption ??
        item.body ??
        (typeof item.payload === "string" ? item.payload : item.payload?.message || item.payload?.text || "") ??
        ""
      ).trim();

      const hasFile = Boolean(item.filePath || item.mediaId || item.url || item.mimeType);

      if (textContent || hasFile) {
        const type = getChatMessageType(item.mimeType, item.filePath);
        const sender = determineSender(item);

        messages.push({
          id: item.messageId ?? item.id ?? `msg-${Math.random().toString(36).slice(2, 7)}`,
          sender,
          type,
          content: textContent || undefined,
          fileName: item.filePath || undefined,
          thumbnail: item.filePath || item.url || undefined,
          time: formatTime(item.receivedAt || item.created_at || item.updated_at),
        });
      }

      /*
       * BOT MESSAGE
       */
      const botData = parseChatbotData(item.chatbaotdata);
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
  }

  // Merge locally saved sent messages for this phone number so reloads never lose sent messages
  if (typeof window !== "undefined" && apiData?.[0]?.phonenumber) {
    try {
      const phoneKey = `sent_msgs_${apiData[0].phonenumber.trim()}`;
      const saved = JSON.parse(localStorage.getItem(phoneKey) || "[]");
      if (Array.isArray(saved) && saved.length > 0) {
        saved.forEach((savedMsg: ChatMessage) => {
          const exists = messages.some((m) => String(m.id) === String(savedMsg.id) || (m.content && savedMsg.content && m.content === savedMsg.content && m.sender === savedMsg.sender));
          if (!exists) {
            messages.push(savedMsg);
          }
        });
      }
    } catch (e) {
      console.error("Failed reading sent messages from localStorage:", e);
    }
  }

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
        setIsSending(true);

        // Optimistically add message to chatMessages so it appears immediately
        const optimisticMsg: ChatMessage = {
          id: `sent-opt-${Date.now()}`,
          sender: "employee",
          type: files.length > 0 ? (files[0].type.startsWith("image/") ? "image" : files[0].type.startsWith("video/") ? "video" : files[0].type.startsWith("audio/") ? "audio" : "file") : "text",
          content: messageText,
          fileName: files.length > 0 ? files[0].name : undefined,
          fileSize: files.length > 0 ? `${(files[0].size / 1024).toFixed(1)} KB` : undefined,
          thumbnail: files.length > 0 ? URL.createObjectURL(files[0]) : undefined,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setChatMessages((prev) => [...prev, optimisticMsg]);

        // Save sent message to localStorage so it survives page reloads
        if (typeof window !== "undefined" && customerPhone) {
          try {
            const phoneKey = `sent_msgs_${customerPhone.trim()}`;
            const existing = JSON.parse(localStorage.getItem(phoneKey) || "[]");
            localStorage.setItem(phoneKey, JSON.stringify([...existing, optimisticMsg]));
          } catch (e) {
            console.error("Failed saving sent message to localStorage:", e);
          }
        }

        /* ===============================================
           SEND TO BACKEND
        =============================================== */
        if (messageText && files.length === 0) {
          await sendTextMessage(customerPhone, messageText);
        } else {
          await sendMultipartMessage(customerPhone, messageText, files);
        }

        setChatInput("");
        setChatPreviewFile(null);
        setAttachmentType(null);
        setShowEmojiPicker(false);
        setShowAttachMenu(false);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Refetch actual backend messages after send
        setTimeout(async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/conversation/byphonenumber/${customerPhone}`, {
              method: "GET",
              headers: { Accept: "application/json", "ngrok-skip-browser-warning": "1" },
              cache: "no-store",
            });
            if (res.ok) {
              const data = await res.json();
              const updated = convertApiMessages(data);
              if (Array.isArray(updated) && updated.length > 0) {
                setChatMessages(updated);
              }
            }
          } catch (fetchErr) {
            console.error("Refetch backend message failed:", fetchErr);
          }
        }, 1000);

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
    async (
      tag: string | string[]
    ) => {

      alert(tag);
      try{
            const response = await fetch(API_BASE_URL+"/api/tags/deletemultiple", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "tagIds":tag,
      }),
    });

    


    if (response.status==200) {
      alert("Tag deleted successfully");
      
        setAddTagOpen(
          false
        );
      
    }

  } catch (error) {
    console.error("Error deleting tags:", error);
    
        setAddTagOpen(
          false
        );
  }







      const tagsToRemove =
        Array.isArray(tag)
          ? tag
          : [tag];

      setSelectedTags(
        (prev) =>
          prev.filter(
            (
              currentTag
            ) =>
              !tagsToRemove.includes(
                currentTag
              )
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


            <Button
              color="primary"
              size="sm"

              onClick={() =>
                removeTag(
                  selectedTags
                )
              }
            >
              Remove Tags
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
