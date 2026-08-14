import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Client, IMessage, IFrame, StompSubscription } from "@stomp/stompjs";

/* ============================================================
   CONFIG
============================================================ */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://whatsapi.trpgps.com";
const WS_API_BASE_URL = process.env.NEXT_PUBLIC_WS_API_BASE_URL || "wss://whatsapi.trpgps.com";
const WS_ENDPOINT = "/ws";

const DEFAULT_SOCKET_TOPICS = "/topic/tags";
const DEFAULT_CHAT_SEND_DESTINATION = "/app/tags";

/* ============================================================
   TYPES
============================================================ */

export type ChatMessage = {
  id: string | number;
  sender: "customer" | "agent" | "user" | "admin" | string;
  type?: "text" | "reply" | "file" | "image" | "audio" | "video" | string;
  content?: string;
  replyTo?: string;
  fileName?: string;
  fileSize?: string | number;
  thumbnail?: string;
  duration?: string | number;
  time?: string;
  timestamp?: string;
  createdAt?: string;
  url?: string;
  status?: string;
  clientMessageId?: string;
  [key: string]: any;
};

export type ChatPreviewFile = {
  type: "image" | "file" | "audio" | "video";
  fileName?: string;
  fileSize?: string | number;
  content?: string;
  thumbnail?: string;
  file?: File;
  url?: string;
};

export type Section3ChatTimelineProps = {
  chatMessages?: ChatMessage[];
  chatContainerRef?: React.RefObject<HTMLDivElement | null>;
  showEmojiPicker?: boolean;
  setShowEmojiPicker?: React.Dispatch<React.SetStateAction<boolean>>;
  quickEmojis?: string[];
  insertEmoji?: (emoji: string) => void;
  showAttachMenu?: boolean;
  setShowAttachMenu?: React.Dispatch<React.SetStateAction<boolean>>;
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
  handleFileSelected?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendAttachment?: (type: string) => void;
  chatPreviewFile?: ChatPreviewFile | null;
  setChatPreviewFile?: React.Dispatch<React.SetStateAction<any>>;
  isRecording?: boolean;
  recordingTime?: number;
  toggleRecording?: () => void;
  chatInput?: string;
  setChatInput?: React.Dispatch<React.SetStateAction<string>>;
  handleSendChatMessage?: () => void;
  socketTopic?: string | string[];
  chatSendDestination?: string;
  conversationId?: string | number;
  customerId?: string | number;
  onSocketMessage?: (message: any) => void;
};

/* ============================================================
   DEFAULT EMOJIS
============================================================ */

const DEFAULT_QUICK_EMOJIS = [
  "😀", "😂", "😍", "🥰", "😊", "👍", "👏", "🙏", "❤️", "🔥", "🎉", "😢", "😡", "🤔", "👋", "✅",
];

/* ============================================================
   HELPERS
============================================================ */

function parseSocketBody(message: IMessage): any {
  if (!message?.body) return null;
  try {
    return JSON.parse(message.body);
  } catch {
    return message.body;
  }
}

function normalizeSender(messageOrSender: any): string {
  if (!messageOrSender) return "customer";

  let senderVal = "";
  let statusVal = "";
  let directionVal = "";
  let idVal = "";

  if (typeof messageOrSender === "string") {
    senderVal = messageOrSender.toLowerCase().trim();
  } else if (typeof messageOrSender === "object") {
    senderVal = String(messageOrSender.sender ?? messageOrSender.from ?? "").toLowerCase().trim();
    statusVal = String(messageOrSender.status ?? messageOrSender.messagestatus ?? messageOrSender.messageStatus ?? "").toLowerCase().trim();
    directionVal = String(messageOrSender.direction ?? messageOrSender.messageDirection ?? "").toLowerCase().trim();
    idVal = String(messageOrSender.id ?? messageOrSender.clientMessageId ?? messageOrSender.messageId ?? "").toLowerCase().trim();
  }

  // 1. Explicit employee / agent sender string
  if (
    senderVal.includes("employee") ||
    senderVal.includes("agent") ||
    senderVal.includes("admin") ||
    senderVal.includes("staff") ||
    senderVal.includes("support") ||
    senderVal.includes("operator") ||
    senderVal.includes("user") ||
    senderVal === "outgoing" ||
    senderVal === "outbound" ||
    senderVal === "me" ||
    senderVal === "sent"
  ) {
    return "agent";
  }

  // 2. Outgoing message status (sent, delivered, read, sending, outbound)
  if (
    directionVal === "outgoing" ||
    directionVal === "outbound" ||
    directionVal === "sent" ||
    statusVal === "sent" ||
    statusVal === "delivered" ||
    statusVal === "read" ||
    statusVal === "sending" ||
    statusVal === "outbound" ||
    statusVal === "outgoing"
  ) {
    return "agent";
  }

  // 3. Sent message ID prefixes
  if (
    idVal.startsWith("sent") ||
    idVal.startsWith("opt") ||
    idVal.startsWith("local") ||
    idVal.startsWith("client")
  ) {
    return "agent";
  }

  return "customer";
}

function normalizeMessageType(message: any): string {
  const rawType = String(
    message?.type ?? message?.messageType ?? message?.mediaType ?? message?.contentType ?? "text"
  ).toLowerCase();

  if (rawType.includes("image") || rawType === "photo") return "image";
  if (rawType.includes("audio") || rawType === "voice") return "audio";
  if (rawType.includes("video")) return "video";
  if (rawType.includes("file") || rawType.includes("document")) return "file";
  if (rawType.includes("reply")) return "reply";
  return "text";
}

function extractChatObject(payload: any): any | null {
  if (!payload) return null;
  if (typeof payload === "string") {
    return {
      content: payload,
      sender: "customer",
      type: "text",
      timestamp: new Date().toISOString(),
    };
  }
  if (Array.isArray(payload)) {
    for (const item of payload) {
      const res = extractChatObject(item);
      if (res) return res;
    }
    return null;
  }
  if (typeof payload !== "object") return null;

  if (
    payload.messageId !== undefined ||
    payload.id !== undefined ||
    payload.uuid !== undefined ||
    payload._id !== undefined ||
    payload.sender !== undefined ||
    payload.content !== undefined ||
    payload.text !== undefined ||
    payload.messagebody !== undefined ||
    payload.messageBody !== undefined
  ) {
    return payload;
  }

  if (payload.message !== undefined) {
    if (typeof payload.message === "object") {
      const res = extractChatObject(payload.message);
      if (res) return { ...payload.message, clientMessageId: payload.clientMessageId ?? payload.message.clientMessageId };
    }
    if (typeof payload.message === "string") {
      return { ...payload, content: payload.message };
    }
  }

  if (payload.data !== undefined) return extractChatObject(payload.data);
  if (payload.result !== undefined) return extractChatObject(payload.result);
  if (payload.payload !== undefined) return extractChatObject(payload.payload);

  return null;
}

function normalizeChatMessage(payload: any): ChatMessage | null {
  const message = extractChatObject(payload);
  if (!message) return null;

  const backendId = message.id ?? message.messageId ?? message.uuid ?? message._id;
  const clientMessageId =
    message.clientMessageId ??
    payload?.clientMessageId ??
    payload?.data?.clientMessageId ??
    payload?.message?.clientMessageId;

  const finalId = backendId ?? clientMessageId ?? `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const content =
    message.content ??
    message.text ??
    message.message ??
    message.body ??
    message.messagebody ??
    message.messageBody ??
    "";
  const time =
    message.time ??
    message.timestamp ??
    message.createdAt ??
    message.created_at ??
    message.receivedAt ??
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return {
    ...message,
    id: finalId,
    clientMessageId: clientMessageId ? String(clientMessageId) : backendId ? String(backendId) : undefined,
    sender: normalizeSender(message.sender ?? message.from ?? message.direction),
    type: normalizeMessageType(message),
    content,
    replyTo: message.replyTo ?? message.reply_to,
    fileName: message.fileName ?? message.filename ?? message.file_name,
    fileSize: message.fileSize ?? message.filesize ?? message.file_size,
    thumbnail: message.thumbnail ?? message.thumbnailUrl ?? message.thumbnail_url,
    duration: message.duration,
    time,
    timestamp: message.timestamp ?? message.createdAt ?? message.created_at ?? new Date().toISOString(),
    url: message.url ?? message.filePath ?? message.file_path ?? message.mediaUrl,
    status: message.status ?? "sent",
  };
}

function mergeChatMessages(existingList: ChatMessage[], incomingList: ChatMessage[]): ChatMessage[] {
  if (!incomingList || incomingList.length === 0) return existingList;
  if (!existingList || existingList.length === 0) return incomingList;

  const merged = [...existingList];

  incomingList.forEach((incoming) => {
    const existingIndex = merged.findIndex((item) => {
      if (item.id === incoming.id) return true;
      if (item.clientMessageId && incoming.clientMessageId && item.clientMessageId === incoming.clientMessageId) return true;
      return false;
    });

    if (existingIndex !== -1) {
      merged[existingIndex] = { ...merged[existingIndex], ...incoming };
    } else {
      merged.push(incoming);
    }
  });

  return merged;
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export const Section3ChatTimeline: React.FC<Section3ChatTimelineProps> = ({
  chatMessages: externalChatMessages = [],
  chatContainerRef: externalChatContainerRef,
  showEmojiPicker: externalShowEmojiPicker,
  setShowEmojiPicker: externalSetShowEmojiPicker,
  quickEmojis = DEFAULT_QUICK_EMOJIS,
  insertEmoji: externalInsertEmoji,
  showAttachMenu: externalShowAttachMenu,
  setShowAttachMenu: externalSetShowAttachMenu,
  fileInputRef: externalFileInputRef,
  handleFileSelected: externalHandleFileSelected,
  handleSendAttachment: externalHandleSendAttachment,
  chatPreviewFile: externalChatPreviewFile,
  setChatPreviewFile: externalSetChatPreviewFile,
  isRecording: externalIsRecording = false,
  recordingTime: externalRecordingTime = 0,
  toggleRecording: externalToggleRecording,
  chatInput: externalChatInput = "",
  setChatInput: externalSetChatInput,
  handleSendChatMessage: externalHandleSendChatMessage,
  socketTopic = DEFAULT_SOCKET_TOPICS,
  chatSendDestination = DEFAULT_CHAT_SEND_DESTINATION,
  conversationId,
  customerId,
  onSocketMessage,
}) => {
  /* ================= REFS & STATES ================= */
  const internalChatContainerRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = externalChatContainerRef ?? internalChatContainerRef;

  const internalFileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = externalFileInputRef ?? internalFileInputRef;

  const stompClientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<StompSubscription[]>([]);

  const [localFetchedMessages, setLocalFetchedMessages] = useState<ChatMessage[]>([]);
  const [internalChatMessages, setInternalChatMessages] = useState<ChatMessage[]>([]);
  const [internalShowEmojiPicker, setInternalShowEmojiPicker] = useState(false);
  const [internalShowAttachMenu, setInternalShowAttachMenu] = useState(false);
  const [internalChatInput, setInternalChatInput] = useState("");
  const [internalChatPreviewFile, setInternalChatPreviewFile] = useState<ChatPreviewFile | null>(null);
  const [internalIsRecording, setInternalIsRecording] = useState(false);
  const [internalRecordingTime, setInternalRecordingTime] = useState<number>(externalRecordingTime || 0);

  const [socketConnected, setSocketConnected] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);

  const showEmojiPicker = externalShowEmojiPicker ?? internalShowEmojiPicker;
  const setShowEmojiPicker = externalSetShowEmojiPicker ?? setInternalShowEmojiPicker;

  const showAttachMenu = externalShowAttachMenu ?? internalShowAttachMenu;
  const setShowAttachMenu = externalSetShowAttachMenu ?? setInternalShowAttachMenu;

  const chatInput = externalChatInput ?? internalChatInput;
  const setChatInput = externalSetChatInput ?? setInternalChatInput;

  const chatPreviewFile = externalChatPreviewFile ?? internalChatPreviewFile;
  const setChatPreviewFile = externalSetChatPreviewFile ?? setInternalChatPreviewFile;

  const isRecording = externalIsRecording || internalIsRecording;
  const recordingTime = externalRecordingTime || internalRecordingTime;

  /* ================= FETCH MESSAGES FOR LOCAL STATE ================= */
  useEffect(() => {
    if (!conversationId) return;

    async function fetchLocalMessages() {
      try {
        const url = `${API_BASE_URL}/api/conversation/byphonenumber/${conversationId}`;
        const res = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json", "ngrok-skip-browser-warning": "1" },
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          const rawList = Array.isArray(data) ? data : data?.messages ?? data?.body ?? data?.data ?? [];
          if (Array.isArray(rawList)) {
            const formatted = rawList.map(normalizeChatMessage).filter(Boolean) as ChatMessage[];
            setLocalFetchedMessages(formatted);
          }
        }
      } catch (err) {
        console.error("Local timeline message fetch failed:", err);
      }
    }

    fetchLocalMessages();
  }, [conversationId]);

  /* ================= MERGE DISPLAY MESSAGES ================= */
  const displayMessages = useMemo(() => {
    let combined = mergeChatMessages(localFetchedMessages, externalChatMessages);
    combined = mergeChatMessages(combined, internalChatMessages);
    return combined;
  }, [localFetchedMessages, externalChatMessages, internalChatMessages]);

  /* ================= SCROLL TO BOTTOM ================= */
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatContainerRef]);

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages.length, scrollToBottom]);

  /* ================= STOMP WEBSOCKET CLIENT ================= */
  const handleWebSocketMessage = useCallback(
    (rawMessage: any) => {
      const normalized = normalizeChatMessage(rawMessage);
      if (!normalized) return;

      setInternalChatMessages((prev) => mergeChatMessages(prev, [normalized]));
      if (onSocketMessage) onSocketMessage(rawMessage);
    },
    [onSocketMessage]
  );

  useEffect(() => {
    const topics = Array.isArray(socketTopic) ? socketTopic : [socketTopic];
    const cleanTopics = topics.filter(Boolean);
    if (cleanTopics.length === 0) return;

    const brokerURL = WS_API_BASE_URL.startsWith("ws")
      ? `${WS_API_BASE_URL}${WS_ENDPOINT}`
      : `wss://${WS_API_BASE_URL}${WS_ENDPOINT}`;

    const client = new Client({
      brokerURL,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (msg: string) => {
        if (process.env.NODE_ENV === "development") console.log("[STOMP]", msg);
      },
      onConnect: () => {
        setSocketConnected(true);
        setSocketError(null);

        subscriptionsRef.current.forEach((sub) => {
          try { sub.unsubscribe(); } catch {}
        });
        subscriptionsRef.current = [];

        cleanTopics.forEach((topic) => {
          try {
            const sub = client.subscribe(topic, (msg: IMessage) => {
              const body = parseSocketBody(msg);
              handleWebSocketMessage(body);
            });
            subscriptionsRef.current.push(sub);
          } catch (e) {
            console.error("STOMP subscription failed:", topic, e);
          }
        });
      },
      onDisconnect: () => setSocketConnected(false),
      onStompError: (frame: IFrame) => {
        console.error("STOMP error:", frame);
        setSocketConnected(false);
        setSocketError(frame.headers?.message || "STOMP connection error");
      },
      onWebSocketError: (event) => {
        console.error("WebSocket error:", event);
        setSocketConnected(false);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      subscriptionsRef.current.forEach((sub) => {
        try { sub.unsubscribe(); } catch {}
      });
      client.deactivate();
    };
  }, [socketTopic, handleWebSocketMessage]);

  /* ================= MESSAGE ACTIONS ================= */
  const handleInsertEmoji = (emoji: string) => {
    if (externalInsertEmoji) {
      externalInsertEmoji(emoji);
    } else {
      setChatInput((prev) => prev + emoji);
    }
  };

  const handleSend = () => {
    if (externalHandleSendChatMessage) {
      externalHandleSendChatMessage();
      return;
    }

    if (!chatInput.trim() && !chatPreviewFile) return;

    const newMsg: ChatMessage = {
      id: `client-${Date.now()}`,
      sender: "agent",
      type: chatPreviewFile ? chatPreviewFile.type : "text",
      content: chatInput,
      url: chatPreviewFile?.url || (chatPreviewFile?.file ? URL.createObjectURL(chatPreviewFile.file) : undefined),
      fileName: chatPreviewFile?.fileName,
      fileSize: chatPreviewFile?.fileSize,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    setInternalChatMessages((prev) => [...prev, newMsg]);

    if (stompClientRef.current && stompClientRef.current.connected) {
      try {
        stompClientRef.current.publish({
          destination: chatSendDestination,
          body: JSON.stringify(newMsg),
        });
      } catch (err) {
        console.error("STOMP publish failed:", err);
      }
    }

    setChatInput("");
    setChatPreviewFile(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (externalHandleFileSelected) {
      externalHandleFileSelected(e);
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    let type: ChatPreviewFile["type"] = "file";
    if (file.type.startsWith("image/")) type = "image";
    else if (file.type.startsWith("audio/")) type = "audio";
    else if (file.type.startsWith("video/")) type = "video";

    setChatPreviewFile({
      type,
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      file,
      url: URL.createObjectURL(file),
    });
    setShowAttachMenu(false);
  };

  const handleToggleRec = () => {
    if (externalToggleRecording) {
      externalToggleRecording();
    } else {
      setInternalIsRecording((prev) => !prev);
    }
  };

  return (
    <Card className="shadow-sm border border-default-200 bg-background">
      <CardContent className="p-4 space-y-3">
        {/* CARD HEADER */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-default-600">
              SECTION 3: CONVERSATION TIMELINE
            </h3>
            <div className="flex items-center gap-1.5">
              <span className={cn("w-2 h-2 rounded-full", socketConnected ? "bg-emerald-500" : "bg-amber-500 animate-pulse")} />
              <span className="text-[11px] text-default-500 font-medium">
                {socketConnected ? "Connected" : "Connecting..."}
              </span>
            </div>
          </div>
          {socketError && <div className="text-[10px] text-destructive max-w-[200px] text-right">{socketError}</div>}
        </div>

        {/* CHAT CONTAINER BOX */}
        <div className="border border-default-200 rounded-lg overflow-hidden flex flex-col bg-background">
          {/* MESSAGES SCROLL AREA */}
          <div
            ref={chatContainerRef as any}
            className="p-4 space-y-3 overflow-y-auto max-h-[480px] min-h-[480px] flex flex-col no-scrollbar scroll-smooth bg-default-50/30"
          >
            {displayMessages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center py-16">
                <div className="text-center text-default-400 space-y-2">
                  <Icon icon="heroicons:chat-bubble-left-right" className="w-10 h-10 mx-auto opacity-40" />
                  <div className="text-xs font-medium">No messages yet</div>
                </div>
              </div>
            ) : (
              displayMessages.map((msg, index) => {
                const isCustomer = normalizeSender(msg) === "customer";
                const messageText = msg.content ?? msg.text ?? msg.messagebody ?? msg.messageBody ?? msg.message ?? "";
                const mediaUrl = msg.url ?? msg.thumbnail ?? msg.filePath ?? msg.file_path;

                return (
                  <div key={msg.id || index} className={cn("flex w-full", isCustomer ? "justify-start" : "justify-end")}>
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-3.5 py-2.5 shadow-xs text-xs space-y-1.5",
                        isCustomer
                          ? "bg-default-100 dark:bg-default-800 text-default-800 dark:text-default-100 rounded-tl-xs"
                          : "bg-emerald-500 text-white rounded-tr-xs"
                      )}
                    >
                      {/* TEXT CONTENT */}
                      {messageText && (
                        <div className="leading-relaxed whitespace-pre-wrap break-words font-normal">
                          {messageText}
                        </div>
                      )}

                      {/* MEDIA CONTENT */}
                      {mediaUrl && (
                        <div className="mt-1 space-y-1">
                          {msg.type === "image" && (
                            <img src={mediaUrl} alt={msg.fileName || "Image"} className="max-w-[240px] rounded-lg object-cover" />
                          )}
                          {msg.type === "video" && (
                            <video src={mediaUrl} controls className="max-w-[240px] rounded-lg" />
                          )}
                          {msg.type === "audio" && (
                            <audio src={mediaUrl} controls className="max-w-[240px]" />
                          )}
                          {msg.type === "file" && (
                            <a href={mediaUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 underline font-medium text-xs">
                              <Icon icon="heroicons:document-text" className="w-4 h-4 shrink-0" />
                              <span className="truncate">{msg.fileName || "Download attachment"}</span>
                            </a>
                          )}
                        </div>
                      )}

                      {/* TIMESTAMP */}
                      <div className={cn("text-[9px] text-right opacity-75 mt-1 font-sans", isCustomer ? "text-default-500" : "text-white/80")}>
                        {msg.time || "Just now"}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* PREVIEW SELECTED FILE */}
          {chatPreviewFile && (
            <div className="px-3 py-2 bg-default-100 border-t border-default-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <Icon icon="heroicons:paper-clip" className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-medium truncate">{chatPreviewFile.fileName || "File selected"}</span>
                {chatPreviewFile.fileSize && <span className="text-default-400 text-[10px]">({chatPreviewFile.fileSize})</span>}
              </div>
              <button type="button" onClick={() => setChatPreviewFile(null)} className="p-1 rounded-full hover:bg-default-200 text-default-500">
                <Icon icon="heroicons:x-mark" className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ATTACHMENT MENU OPTIONS */}
          {showAttachMenu && (
            <div className="px-3 py-2 bg-default-50 border-t border-default-200 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-default-700 hover:bg-default-200 px-2.5 py-1.5 rounded-md transition-colors"
              >
                <Icon icon="heroicons:photo" className="w-4 h-4 text-emerald-500" />
                <span>Image / Video</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-default-700 hover:bg-default-200 px-2.5 py-1.5 rounded-md transition-colors"
              >
                <Icon icon="heroicons:document-text" className="w-4 h-4 text-blue-500" />
                <span>Document</span>
              </button>
            </div>
          )}

          {/* QUICK EMOJI BAR */}
          {showEmojiPicker && (
            <div className="px-3 py-2 bg-default-50 border-t border-default-200 flex flex-wrap gap-1">
              {quickEmojis.map((emoji, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleInsertEmoji(emoji)}
                  className="p-1 hover:bg-default-200 rounded text-sm transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* INPUT BAR */}
          <div className="px-3 py-2.5 bg-default-50 border-t border-default-200 flex items-center gap-2">
            <input type="file" ref={fileInputRef as any} className="hidden" onChange={handleFileSelect} />

            {!isRecording && (
              <>
                {/* EMOJI BUTTON */}
                <button
                  type="button"
                  onClick={() => {
                    setShowEmojiPicker((prev) => !prev);
                    setShowAttachMenu(false);
                  }}
                  className={cn(
                    "h-9 w-9 rounded-full shrink-0 flex items-center justify-center transition-colors",
                    showEmojiPicker ? "bg-emerald-100 text-emerald-600" : "text-default-500 hover:text-default-700 hover:bg-default-200"
                  )}
                >
                  <Icon icon="heroicons:face-smile" width={22} height={22} />
                </button>

                {/* ATTACH BUTTON */}
                <button
                  type="button"
                  onClick={() => {
                    setShowAttachMenu((prev) => !prev);
                    setShowEmojiPicker(false);
                  }}
                  className={cn(
                    "h-9 w-9 rounded-full shrink-0 flex items-center justify-center transition-colors",
                    showAttachMenu ? "bg-blue-100 text-blue-600" : "text-default-500 hover:text-default-700 hover:bg-default-200"
                  )}
                >
                  <Icon icon="heroicons:paper-clip" width={22} height={22} />
                </button>
              </>
            )}

            {/* RECORDING OR INPUT */}
            {isRecording ? (
              <div className="flex-1 h-9 rounded-full bg-red-50 text-xs border border-red-200 px-4 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-500 font-medium">
                  Recording... {Math.floor(recordingTime / 60)}:{recordingTime % 60 < 10 ? "0" : ""}{recordingTime % 60}
                </span>
              </div>
            ) : (
              <Input
                placeholder="Type a message..."
                className="flex-1 h-9 rounded-full bg-background text-xs border border-default-200 px-4 shadow-none focus-visible:ring-1"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
            )}

            {/* SEND OR MIC BUTTON */}
            {!isRecording && (chatInput.trim() || chatPreviewFile) ? (
              <button
                type="button"
                onClick={handleSend}
                className="h-9 px-4 rounded-full shrink-0 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors bg-emerald-500 hover:bg-emerald-600 shadow-sm"
              >
                <Icon icon="heroicons:paper-airplane" width={15} height={15} />
                <span>Send</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleToggleRec}
                className={cn(
                  "h-9 w-9 rounded-full shrink-0 text-white flex items-center justify-center transition-colors shadow-sm",
                  isRecording ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
                )}
              >
                <Icon icon={isRecording ? "heroicons:stop" : "heroicons:microphone"} width={18} height={18} />
              </button>
            )}
          </div>
        </div>

        {/* DEV DEBUG INFO */}
        {process.env.NODE_ENV === "development" && (
          <div className="text-[10px] text-default-400 space-y-0.5 pt-1">
            <div>WebSocket: {socketConnected ? "CONNECTED" : "DISCONNECTED"}</div>
            <div>Messages: {displayMessages.length}</div>
            <div>Topics: {Array.isArray(socketTopic) ? socketTopic.join(", ") : socketTopic}</div>
            <div>Send: {chatSendDestination}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Section3ChatTimeline;
