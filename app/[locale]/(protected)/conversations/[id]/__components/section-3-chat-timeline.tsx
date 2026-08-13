"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  Client,
  IMessage,
  StompSubscription,
} from "@stomp/stompjs";

/* ============================================================
   CONFIG
============================================================ */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://whatsapi.trpgps.com";

const WS_API_BASE_URL =
  process.env.NEXT_PUBLIC_WS_API_BASE_URL ||
  "wss://whatsapi.trpgps.com";

const WS_ENDPOINT = "/ws";

const DEFAULT_SOCKET_TOPICS = "/topic/tags";

const DEFAULT_CHAT_SEND_DESTINATION =
  "/app/tags";

/* ============================================================
   TYPES
============================================================ */

export type ChatMessage = {
  id: string | number;

  sender:
    | "customer"
    | "agent"
    | "user"
    | "admin"
    | string;

  type?:
    | "text"
    | "reply"
    | "file"
    | "image"
    | "audio"
    | "video"
    | string;

  content?: string;

  replyTo?: string;

  fileName?: string;

  fileSize?: string;

  thumbnail?: string;

  duration?: string;

  time?: string;

  timestamp?: string;

  createdAt?: string;

  url?: string;

  status?: string;

  clientMessageId?: string;

  [key: string]: any;
};

export type ChatPreviewFile = {
  type:
    | "image"
    | "file"
    | "audio"
    | "video";

  fileName?: string;

  fileSize?: string;

  content?: string;

  thumbnail?: string;

  file?: File;

  url?: string;
};

type Section3ChatTimelineProps = {
  chatMessages?: any[];

  chatContainerRef?: React.RefObject<HTMLDivElement | null>;

  showEmojiPicker?: boolean;

  setShowEmojiPicker?: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  quickEmojis?: string[];

  insertEmoji?: (
    emoji: string
  ) => void;

  showAttachMenu?: boolean;

  setShowAttachMenu?: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  fileInputRef?: React.RefObject<HTMLInputElement | null>;

  handleFileSelected?: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;

  handleSendAttachment?: (
    type: string
  ) => void;

  chatPreviewFile?: any;

  setChatPreviewFile?: any;

  isRecording?: boolean;

  recordingTime?: number;

  toggleRecording?: () => void;

  chatInput?: string;

  setChatInput?: React.Dispatch<
    React.SetStateAction<string>
  >;

  handleSendChatMessage?: () => void;

  socketTopic?: string | string[];

  chatSendDestination?: string;

  conversationId?: string | number;

  customerId?: string | number;

  onSocketMessage?: (
    message: any
  ) => void;
};

/* ============================================================
   EMOJIS
============================================================ */

const DEFAULT_QUICK_EMOJIS = [
  "😀",
  "😂",
  "😍",
  "🥰",
  "😊",
  "👍",
  "👏",
  "🙏",
  "❤️",
  "🔥",
  "🎉",
  "😢",
  "😡",
  "🤔",
  "👋",
  "✅",
];

/* ============================================================
   HELPERS
============================================================ */

function parseSocketBody(
  message: IMessage
): any {
  if (!message?.body) {
    return null;
  }

  try {
    return JSON.parse(message.body);
  } catch {
    return message.body;
  }
}

/* ============================================================
   NORMALIZE SENDER
============================================================ */

function normalizeSender(
  sender: any
): string {
  const value = String(
    sender ?? ""
  ).toLowerCase();

  if (
    value.includes("customer") ||
    value.includes("client") ||
    value.includes("contact")
  ) {
    return "customer";
  }

  if (
    value.includes("agent") ||
    value.includes("admin") ||
    value.includes("staff") ||
    value.includes("support") ||
    value.includes("operator")
  ) {
    return "agent";
  }

  if (
    value === "outgoing" ||
    value === "outbound" ||
    value === "me"
  ) {
    return "agent";
  }

  if (
    value === "incoming" ||
    value === "inbound"
  ) {
    return "customer";
  }

  return value || "customer";
}

/* ============================================================
   NORMALIZE MESSAGE TYPE
============================================================ */

function normalizeMessageType(
  message: any
): string {
  const rawType = String(
    message?.type ??
      message?.messageType ??
      message?.mediaType ??
      message?.contentType ??
      "text"
  ).toLowerCase();

  if (
    rawType.includes("image") ||
    rawType === "photo"
  ) {
    return "image";
  }

  if (
    rawType.includes("audio") ||
    rawType === "voice"
  ) {
    return "audio";
  }

  if (
    rawType.includes("video")
  ) {
    return "video";
  }

  if (
    rawType.includes("file") ||
    rawType.includes("document")
  ) {
    return "file";
  }

  if (
    rawType.includes("reply")
  ) {
    return "reply";
  }

  return "text";
}

/* ============================================================
   EXTRACT CHAT OBJECT
============================================================ */

function extractChatObject(
  payload: any
): any | null {
  if (!payload) {
    return null;
  }

  if (
    typeof payload ===
    "string"
  ) {
    return {
      content: payload,
      sender: "customer",
      type: "text",
      timestamp:
        new Date().toISOString(),
    };
  }

  if (
    Array.isArray(payload)
  ) {
    for (
      const item of payload
    ) {
      const result =
        extractChatObject(item);

      if (result) {
        return result;
      }
    }

    return null;
  }

  if (
    typeof payload !==
    "object"
  ) {
    return null;
  }

  if (
    payload.messageId !==
      undefined ||
    payload.id !== undefined ||
    payload.uuid !==
      undefined ||
    payload._id !== undefined ||
    payload.sender !==
      undefined ||
    payload.senderType !==
      undefined ||
    payload.from !==
      undefined ||
    payload.author !==
      undefined ||
    payload.content !==
      undefined ||
    payload.text !==
      undefined
  ) {
    return payload;
  }

  if (
    payload.message !==
    undefined
  ) {
    if (
      typeof payload.message ===
      "object"
    ) {
      const result =
        extractChatObject(
          payload.message
        );

      if (result) {
        return {
          ...payload.message,
          clientMessageId:
            payload.clientMessageId ??
            payload.message
              .clientMessageId,
        };
      }
    }

    if (
      typeof payload.message ===
      "string"
    ) {
      return {
        ...payload,
        content:
          payload.message,
      };
    }
  }

  if (
    payload.data !==
    undefined
  ) {
    const result =
      extractChatObject(
        payload.data
      );

    if (result) {
      return result;
    }
  }

  if (
    payload.result !==
    undefined
  ) {
    const result =
      extractChatObject(
        payload.result
      );

    if (result) {
      return result;
    }
  }

  if (
    payload.payload !==
    undefined
  ) {
    const result =
      extractChatObject(
        payload.payload
      );

    if (result) {
      return result;
    }
  }

  if (
    payload.event !==
    undefined &&
    typeof payload.event ===
      "object"
  ) {
    const result =
      extractChatObject(
        payload.event
      );

    if (result) {
      return result;
    }
  }

  return null;
}

/* ============================================================
   NORMALIZE MESSAGE
============================================================ */

function normalizeChatMessage(
  payload: any
): ChatMessage | null {
  const message =
    extractChatObject(payload);

  if (!message) {
    return null;
  }

  const backendId =
    message.id ??
    message.messageId ??
    message.uuid ??
    message._id;

  const clientMessageId =
    message.clientMessageId ??
    payload?.clientMessageId ??
    payload?.data?.clientMessageId ??
    payload?.message?.clientMessageId ??
    payload?.data?.message
      ?.clientMessageId;

  const finalId =
    backendId ??
    clientMessageId ??
    `ws-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;

  const sender =
    normalizeSender(
      message.sender ??
        message.senderType ??
        message.from ??
        message.direction ??
        message.author ??
        message.role
    );

  const type =
    normalizeMessageType(message);

  let content =
    message.content ??
    message.text ??
    message.body ??
    "";

  if (
    !content &&
    typeof message.message ===
      "string"
  ) {
    content =
      message.message;
  }

  const timestamp =
    message.timestamp ??
    message.createdAt ??
    message.sentAt ??
    message.time ??
    new Date().toISOString();

  return {
    ...message,

    id: finalId,

    clientMessageId,

    sender,

    type,

    content,

    timestamp,

    time:
      message.time ??
      formatMessageTime(timestamp),

    fileName:
      message.fileName ??
      message.filename ??
      message.attachment?.fileName,

    fileSize:
      message.fileSize != null ? String(message.fileSize) : message.attachment?.fileSize != null ? String(message.attachment.fileSize) : undefined,

    url:
      message.url ??
      message.mediaUrl ??
      message.fileUrl ??
      message.attachment?.url,

    thumbnail:
      message.thumbnail ??
      message.thumbnailUrl ??
      message.mediaThumbnail,

    duration:
      message.duration ??
      message.audioDuration,

    replyTo:
      message.replyTo ??
      message.replyMessage ??
      message.quotedText,

    status:
      message.status ??
      "sent",
  };
}

/* ============================================================
   TIME
============================================================ */

function formatMessageTime(
  timestamp: any
): string {
  if (!timestamp) {
    return "";
  }

  try {
    return new Date(
      timestamp
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(timestamp);
  }
}

/* ============================================================
   MESSAGE KEY
============================================================ */

function getMessageKey(
  message: ChatMessage
): string {
  const id =
    message.id ??
    message.messageId ??
    message.uuid ??
    message._id;

  if (
    id !== undefined &&
    id !== null &&
    id !== ""
  ) {
    return String(id);
  }

  if (
    message.clientMessageId
  ) {
    return `client:${message.clientMessageId}`;
  }

  return [
    normalizeSender(
      message.sender
    ),
    message.type ??
      "text",
    message.content ??
      "",
    message.timestamp ??
      "",
  ].join("|");
}

/* ============================================================
   FIND SAME MESSAGE
============================================================ */

function isSameMessage(
  a: ChatMessage,
  b: ChatMessage
): boolean {
  const aId =
    a.id ??
    a.messageId ??
    a.uuid ??
    a._id;

  const bId =
    b.id ??
    b.messageId ??
    b.uuid ??
    b._id;

  if (
    aId !== undefined &&
    aId !== null &&
    bId !== undefined &&
    bId !== null &&
    String(aId) === String(bId)
  ) {
    return true;
  }

  if (
    a.clientMessageId &&
    b.clientMessageId &&
    a.clientMessageId ===
      b.clientMessageId
  ) {
    return true;
  }

  return false;
}

/* ============================================================
   MERGE MESSAGES
============================================================ */

function mergeChatMessages(
  current: ChatMessage[],
  incoming: ChatMessage[]
): ChatMessage[] {
  const result = [
    ...current,
  ];

  for (
    const newMessage of incoming
  ) {
    const existingIndex =
      result.findIndex(
        (oldMessage) =>
          isSameMessage(
            oldMessage,
            newMessage
          )
      );

    if (
      existingIndex !== -1
    ) {
      result[
        existingIndex
      ] = {
        ...result[
          existingIndex
        ],
        ...newMessage,

        clientMessageId:
          newMessage.clientMessageId ??
          result[
            existingIndex
          ].clientMessageId,

        status:
          newMessage.status ??
          "sent",
      };
    } else {
      result.push(
        newMessage
      );
    }
  }

  return result;
}

/* ============================================================
   FILE SIZE
============================================================ */

function formatFileSize(
  bytes: number
): string {
  if (!bytes) {
    return "0 Bytes";
  }

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB",
  ];

  const index = Math.min(
    Math.floor(
      Math.log(bytes) /
        Math.log(1024)
    ),
    units.length - 1
  );

  const size =
    bytes /
    Math.pow(1024, index);

  return `${size.toFixed(
    index === 0 ? 0 : 2
  )} ${units[index]}`;
}

/* ============================================================
   COMPONENT
============================================================ */

export const Section3ChatTimeline =
  ({
    chatMessages:
      externalChatMessages = [],

    chatContainerRef:
      externalChatContainerRef,

    showEmojiPicker:
      externalShowEmojiPicker,

    setShowEmojiPicker:
      externalSetShowEmojiPicker,

    quickEmojis =
      DEFAULT_QUICK_EMOJIS,

    insertEmoji:
      externalInsertEmoji,

    showAttachMenu:
      externalShowAttachMenu,

    setShowAttachMenu:
      externalSetShowAttachMenu,

    fileInputRef:
      externalFileInputRef,

    handleFileSelected:
      externalHandleFileSelected,

    handleSendAttachment:
      externalHandleSendAttachment,

    chatPreviewFile:
      externalChatPreviewFile,

    setChatPreviewFile:
      externalSetChatPreviewFile,

    isRecording:
      externalIsRecording = false,

    recordingTime:
      externalRecordingTime = 0,

    toggleRecording:
      externalToggleRecording,

    chatInput:
      externalChatInput = "",

    setChatInput:
      externalSetChatInput,

    handleSendChatMessage:
      externalHandleSendChatMessage,

    socketTopic =
      DEFAULT_SOCKET_TOPICS,

    chatSendDestination =
      DEFAULT_CHAT_SEND_DESTINATION,

    conversationId,

    customerId,

    onSocketMessage,
  }: Section3ChatTimelineProps) => {

    const internalChatContainerRef =
      useRef<HTMLDivElement | null>(
        null
      );

    const chatContainerRef =
      externalChatContainerRef ??
      internalChatContainerRef;

    const internalFileInputRef =
      useRef<HTMLInputElement | null>(
        null
      );

    const fileInputRef =
      externalFileInputRef ??
      internalFileInputRef;

    const stompClientRef =
      useRef<Client | null>(null);

    const subscriptionsRef =
      useRef<
        StompSubscription[]
      >([]);

    const isUnmountedRef =
      useRef(false);

    const previousExternalMessagesRef =
      useRef<ChatMessage[]>([]);

    const [
      socketConnected,
      setSocketConnected,
    ] = useState(false);

    const [
      socketError,
      setSocketError,
    ] = useState<string | null>(
      null
    );

    const normalizedExternalMessages = useMemo(() => {
      return (externalChatMessages || [])
        .map((msg) => normalizeChatMessage(msg))
        .filter((msg): msg is ChatMessage => msg !== null);
    }, [externalChatMessages]);

    const [
      internalChatMessages,
      setInternalChatMessages,
    ] = useState<
      ChatMessage[]
    >(
      normalizedExternalMessages
    );

    const [
      internalShowEmojiPicker,
      setInternalShowEmojiPicker,
    ] = useState(false);

    const [
      internalShowAttachMenu,
      setInternalShowAttachMenu,
    ] = useState(false);

    const [
      internalChatInput,
      setInternalChatInput,
    ] = useState("");

    const [
      internalChatPreviewFile,
      setInternalChatPreviewFile,
    ] =
      useState<ChatPreviewFile | null>(
        null
      );

    const [
      internalIsRecording,
      setInternalIsRecording,
    ] = useState(false);

    const [
      internalRecordingTime,
      setInternalRecordingTime,
    ] = useState(0);

    useEffect(() => {
      if (
        !normalizedExternalMessages
      ) {
        return;
      }

      setInternalChatMessages(
        (current) =>
          mergeChatMessages(
            current,
            normalizedExternalMessages
          )
      );

      previousExternalMessagesRef.current =
        normalizedExternalMessages;
    }, [
      normalizedExternalMessages,
    ]);

    const chatMessages =
      internalChatMessages;

    const showEmojiPicker =
      externalShowEmojiPicker ??
      internalShowEmojiPicker;

    const showAttachMenu =
      externalShowAttachMenu ??
      internalShowAttachMenu;

    const chatInput =
      externalChatInput ??
      internalChatInput;

    const chatPreviewFile =
      externalChatPreviewFile ??
      internalChatPreviewFile;

    const isRecording =
      externalIsRecording ||
      internalIsRecording;

    const recordingTime =
      externalRecordingTime ||
      internalRecordingTime;

    const setShowEmojiPicker =
      useCallback(
        (
          value:
            | boolean
            | ((
                previous: boolean
              ) => boolean)
        ) => {
          if (
            externalSetShowEmojiPicker
          ) {
            externalSetShowEmojiPicker(
              value
            );
          } else {
            setInternalShowEmojiPicker(
              value
            );
          }
        },
        [
          externalSetShowEmojiPicker,
        ]
      );

    const setShowAttachMenu =
      useCallback(
        (
          value:
            | boolean
            | ((
                previous: boolean
              ) => boolean)
        ) => {
          if (
            externalSetShowAttachMenu
          ) {
            externalSetShowAttachMenu(
              value
            );
          } else {
            setInternalShowAttachMenu(
              value
            );
          }
        },
        [
          externalSetShowAttachMenu,
        ]
      );

    const setChatInput =
      useCallback(
        (
          value:
            | string
            | ((
                previous: string
              ) => string)
        ) => {
          if (
            externalSetChatInput
          ) {
            externalSetChatInput(
              value
            );
          } else {
            setInternalChatInput(
              value
            );
          }
        },
        [
          externalSetChatInput,
        ]
      );

    const setChatPreviewFile =
      useCallback(
        (
          value: any
        ) => {
          if (
            externalSetChatPreviewFile
          ) {
            externalSetChatPreviewFile(
              value
            );
          } else {
            setInternalChatPreviewFile(
              value
            );
          }
        },
        [
          externalSetChatPreviewFile,
        ]
      );

    const addLocalChatMessage =
      useCallback(
        (
          message: ChatMessage
        ) => {
          setInternalChatMessages(
            (previous) => {
              const exists =
                previous.some(
                  (existing) =>
                    isSameMessage(
                      existing,
                      message
                    )
                );

              if (exists) {
                return previous;
              }

              return [
                ...previous,
                message,
              ];
            }
          );
        },
        []
      );

    const handleWebSocketMessage =
      useCallback(
        (rawData: any) => {
          if (!rawData) {
            return;
          }

          onSocketMessage?.(
            rawData
          );

          const incomingMessage =
            normalizeChatMessage(
              rawData
            );

          if (
            !incomingMessage
          ) {
            return;
          }

          setInternalChatMessages(
            (previousMessages) => {
              const existingIndex =
                previousMessages.findIndex(
                  (message) =>
                    isSameMessage(
                      message,
                      incomingMessage
                    )
                );

              if (
                existingIndex !==
                -1
              ) {
                return previousMessages.map(
                  (
                    message,
                    index
                  ) => {
                    if (
                      index !==
                      existingIndex
                    ) {
                      return message;
                    }

                    return {
                      ...message,

                      ...incomingMessage,

                      clientMessageId:
                        incomingMessage.clientMessageId ??
                        message.clientMessageId,

                      status:
                        incomingMessage.status ??
                        "sent",
                    };
                  }
                );
              }

              return [
                ...previousMessages,
                incomingMessage,
              ];
            }
          );
        },
        [onSocketMessage]
      );

    const socketTopics =
      useMemo(() => {
        if (
          Array.isArray(
            socketTopic
          )
        ) {
          return socketTopic.filter(
            Boolean
          );
        }

        if (
          socketTopic
        ) {
          return [
            socketTopic,
          ];
        }

        return [DEFAULT_SOCKET_TOPICS];
      }, [socketTopic]);

    const connectWebSocket =
      useCallback(() => {
        if (
          isUnmountedRef.current
        ) {
          return;
        }

        const existingClient =
          stompClientRef.current;

        if (
          existingClient?.active ||
          existingClient?.connected
        ) {
          return;
        }

        setSocketError(null);

        const brokerURL =
          `${WS_API_BASE_URL}${WS_ENDPOINT}`;

        const client =
          new Client({
            brokerURL,

            reconnectDelay: 5000,

            heartbeatIncoming: 10000,

            heartbeatOutgoing: 10000,

            debug: (message) => {
              if (
                process.env
                  .NODE_ENV ===
                "development"
              ) {
                console.log(
                  "[STOMP]",
                  message
                );
              }
            },

            onConnect: () => {
              setSocketConnected(
                true
              );

              setSocketError(
                null
              );

              subscriptionsRef.current.forEach(
                (
                  subscription
                ) => {
                  try {
                    subscription.unsubscribe();
                  } catch {}
                }
              );

              subscriptionsRef.current =
                [];

              if (Array.isArray(socketTopics)) {
                socketTopics.forEach(
                  (topic) => {
                    if (!topic) {
                      return;
                    }

                    try {
                      const subscription =
                        client.subscribe(
                          topic,
                          (
                            message: IMessage
                          ) => {
                            try {
                              const data =
                                parseSocketBody(
                                  message
                                );

                              handleWebSocketMessage(
                                data
                              );
                            } catch (
                              error
                            ) {
                              console.error(
                                "SOCKET MESSAGE HANDLING ERROR:",
                                error
                              );
                            }
                          }
                        );

                      subscriptionsRef.current.push(
                        subscription
                      );
                    } catch (
                      error
                    ) {
                      console.error(
                        `FAILED TO SUBSCRIBE TO ${topic}:`,
                        error
                      );
                    }
                  }
                );
              }
            },

            onDisconnect:
              () => {
                setSocketConnected(
                  false
                );
              },

            onStompError:
              (frame) => {
                setSocketConnected(
                  false
                );

                setSocketError(
                  frame.headers
                    ?.message ||
                    "WebSocket STOMP error"
                );
              },

            onWebSocketError:
              () => {
                setSocketConnected(
                  false
                );

                setSocketError(
                  "WebSocket connection error"
                );
              },
          });

        stompClientRef.current =
          client;

        client.activate();
      }, [
        handleWebSocketMessage,
        socketTopics,
      ]);

    const disconnectWebSocket =
      useCallback(
        async () => {
          subscriptionsRef.current.forEach(
            (
              subscription
            ) => {
              try {
                subscription.unsubscribe();
              } catch {}
            }
          );

          subscriptionsRef.current =
            [];

          const client =
            stompClientRef.current;

          stompClientRef.current =
            null;

          if (client) {
            try {
              await client.deactivate();
            } catch (
              error
            ) {
              console.error(
                "WebSocket disconnect error:",
                error
              );
            }
          }

          setSocketConnected(
            false
          );
        },
        []
      );

    useEffect(() => {
      isUnmountedRef.current =
        false;

      connectWebSocket();

      return () => {
        isUnmountedRef.current =
          true;

        disconnectWebSocket();
      };
    }, [
      connectWebSocket,
      disconnectWebSocket,
    ]);

    useEffect(() => {
      const container =
        chatContainerRef.current;

      if (!container) {
        return;
      }

      requestAnimationFrame(
        () => {
          container.scrollTop =
            container.scrollHeight;
        }
      );
    }, [
      chatMessages.length,
      chatContainerRef,
    ]);

    const insertEmoji =
      useCallback(
        (emoji: string) => {
          if (
            externalInsertEmoji
          ) {
            externalInsertEmoji(
              emoji
            );

            return;
          }

          setChatInput(
            (previous) =>
              `${previous}${emoji}`
          );
        },
        [
          externalInsertEmoji,
          setChatInput,
        ]
      );

    const handleFileSelected =
      useCallback(
        (
          event: React.ChangeEvent<HTMLInputElement>
        ) => {
          if (
            externalHandleFileSelected
          ) {
            externalHandleFileSelected(
              event
            );

            return;
          }

          const file =
            event.target.files?.[0];

          if (!file) {
            return;
          }

          const mime =
            file.type || "";

          let type:
            | "image"
            | "video"
            | "audio"
            | "file" =
            "file";

          if (
            mime.startsWith(
              "image/"
            )
          ) {
            type = "image";
          } else if (
            mime.startsWith(
              "video/"
            )
          ) {
            type = "video";
          } else if (
            mime.startsWith(
              "audio/"
            )
          ) {
            type = "audio";
          }

          let thumbnail:
            | string
            | undefined;

          if (
            type === "image"
          ) {
            thumbnail =
              URL.createObjectURL(
                file
              );
          }

          setChatPreviewFile({
            type,
            fileName:
              file.name,
            fileSize:
              formatFileSize(
                file.size
              ),
            file,
            thumbnail,
          });

          setShowAttachMenu(
            false
          );
        },
        [
          externalHandleFileSelected,
          setChatPreviewFile,
          setShowAttachMenu,
        ]
      );

    const handleSendAttachment =
      useCallback(
        (type: string) => {
          if (
            externalHandleSendAttachment
          ) {
            externalHandleSendAttachment(
              type
            );

            return;
          }

          const input =
            fileInputRef.current;

          if (!input) {
            return;
          }

          const acceptMap: Record<
            string,
            string
          > = {
            Image: "image/*",

            Document:
              ".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv",

            Video: "video/*",

            Audio: "audio/*",
          };

          input.accept =
            acceptMap[type] ||
            "*/*";

          input.value = "";

          input.click();

          setShowAttachMenu(
            false
          );
        },
        [
          externalHandleSendAttachment,
          fileInputRef,
          setShowAttachMenu,
        ]
      );

    const sendThroughSocket =
      useCallback(
        (payload: any) => {
          const client =
            stompClientRef.current;

          if (
            !client ||
            !client.connected
          ) {
            return false;
          }

          try {
            client.publish({
              destination:
                chatSendDestination,

              body: JSON.stringify(
                payload
              ),
            });

            return true;
          } catch {
            return false;
          }
        },
        [
          chatSendDestination,
        ]
      );

    const handleSendChatMessage =
      useCallback(() => {
        if (
          externalHandleSendChatMessage
        ) {
          externalHandleSendChatMessage();

          return;
        }

        const text =
          chatInput.trim();

        if (
          !text &&
          !chatPreviewFile
        ) {
          return;
        }

        if (text) {
          const clientMessageId =
            `client-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}`;

          const timestamp =
            new Date().toISOString();

          const optimisticMessage: ChatMessage =
            {
              id: clientMessageId,

              clientMessageId,

              sender:
                "agent",

              type:
                "text",

              content:
                text,

              timestamp,

              time:
                formatMessageTime(
                  timestamp
                ),

              status:
                "sending",
            };

          addLocalChatMessage(
            optimisticMessage
          );

          const payload = {
            action:
              "SEND_MESSAGE",

            type:
              "MESSAGE",

            conversationId,

            customerId,

            clientMessageId,

            message: {
              type:
                "text",

              content:
                text,

              sender:
                "agent",

              clientMessageId,
            },

            content:
              text,

            sender:
              "agent",

            timestamp,
          };

          const sent =
            sendThroughSocket(
              payload
            );

          if (!sent) {
            setInternalChatMessages(
              (previous) =>
                previous.map(
                  (message) =>
                    message.clientMessageId ===
                    clientMessageId
                      ? {
                          ...message,
                          status:
                            "failed",
                        }
                      : message
                )
            );

            return;
          }

          setChatInput("");
        }

        if (
          chatPreviewFile
        ) {
          const clientMessageId =
            `client-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}`;

          const timestamp =
            new Date().toISOString();

          const optimisticMessage: ChatMessage =
            {
              id: clientMessageId,

              clientMessageId,

              sender:
                "agent",

              type:
                chatPreviewFile.type,

              content:
                chatPreviewFile.content ??
                "",

              fileName:
                chatPreviewFile.fileName,

              fileSize:
                chatPreviewFile.fileSize,

              thumbnail:
                chatPreviewFile.thumbnail,

              url:
                chatPreviewFile.url,

              timestamp,

              time:
                formatMessageTime(
                  timestamp
                ),

              status:
                "sending",
            };

          addLocalChatMessage(
            optimisticMessage
          );

          const payload = {
            action:
              "SEND_ATTACHMENT",

            type:
              "ATTACHMENT",

            conversationId,

            customerId,

            clientMessageId,

            attachment: {
              type:
                chatPreviewFile.type,

              fileName:
                chatPreviewFile.fileName,

              fileSize:
                chatPreviewFile.fileSize,

              url:
                chatPreviewFile.url ??
                null,

              clientMessageId,
            },

            timestamp,
          };

          const sent =
            sendThroughSocket(
              payload
            );

          if (!sent) {
            setInternalChatMessages(
              (previous) =>
                previous.map(
                  (message) =>
                    message.clientMessageId ===
                    clientMessageId
                      ? {
                          ...message,
                          status:
                            "failed",
                        }
                      : message
                )
            );

            return;
          }

          setChatPreviewFile(
            null
          );
        }
      }, [
        chatInput,
        chatPreviewFile,
        conversationId,
        customerId,
        externalHandleSendChatMessage,
        sendThroughSocket,
        setChatInput,
        setChatPreviewFile,
        addLocalChatMessage,
      ]);

    useEffect(() => {
      if (
        !internalIsRecording
      ) {
        return;
      }

      const timer =
        window.setInterval(
          () => {
            setInternalRecordingTime(
              (previous) =>
                previous + 1
            );
          },
          1000
        );

      return () => {
        window.clearInterval(
          timer
        );
      };
    }, [
      internalIsRecording,
    ]);

    const toggleRecording =
      useCallback(() => {
        if (
          externalToggleRecording
        ) {
          externalToggleRecording();

          return;
        }

        setInternalIsRecording(
          (previous) => {
            const next =
              !previous;

            if (next) {
              setInternalRecordingTime(
                0
              );
            }

            return next;
          }
        );
      }, [
        externalToggleRecording,
      ]);

    return (
      <Card>
        <CardContent className="p-4 space-y-4">

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
                Section 3: Conversation Timeline
              </div>

              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    socketConnected
                      ? "bg-emerald-500"
                      : "bg-red-500"
                  )}
                />
                <span className="text-[10px] text-default-500">
                  {socketConnected
                    ? "Connected"
                    : "Disconnected"}
                </span>
              </div>
            </div>

            {socketError && (
              <div className="text-[10px] text-red-500 max-w-[300px] text-right">
                {socketError}
              </div>
            )}
          </div>

          <div className="border border-default-200 rounded-lg overflow-hidden flex flex-col">
            <div
              ref={chatContainerRef as React.LegacyRef<HTMLDivElement>}
              className="p-4 space-y-2 overflow-y-auto max-h-[480px] min-h-[480px] flex flex-col no-scrollbar scroll-smooth"
            >
              {chatMessages.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-default-400">
                    <Icon
                      icon="heroicons:chat-bubble-left-right"
                      className="w-10 h-10 mx-auto mb-2"
                    />
                    <div className="text-xs">
                      No messages yet
                    </div>
                  </div>
                </div>
              )}

              {chatMessages.map(
                (
                  rawMsg: any,
                  index: number
                ) => {
                  const msg = normalizeChatMessage(rawMsg) || rawMsg;
                  const isCustomer =
                    normalizeSender(
                      msg.sender
                    ) ===
                    "customer";

                  return (
                    <div
                      key={getMessageKey(
                        msg
                      ) || index}
                      className={cn(
                        "flex w-full",
                        isCustomer
                          ? "justify-start"
                          : "justify-end"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[72%] rounded-2xl px-3 py-2 shadow-sm text-xs",
                          isCustomer
                            ? "bg-default-100 text-default-800 rounded-tl-sm"
                            : "bg-emerald-500 text-white rounded-tr-sm"
                        )}
                      >
                        {msg.type ===
                          "text" && (
                          <div className="leading-relaxed whitespace-pre-wrap break-words">
                            {
                              msg.content
                            }
                          </div>
                        )}

                        {msg.type ===
                          "reply" && (
                          <div className="space-y-1.5">
                            {msg.replyTo && (
                              <div
                                className={cn(
                                  "border-l-4 p-1.5 rounded text-[10px] italic",
                                  isCustomer
                                    ? "border-emerald-500 bg-default-200/60 text-default-600"
                                    : "border-white/50 bg-white/10 text-white/80"
                                )}
                              >
                                {
                                  msg.replyTo
                                }
                              </div>
                            )}

                            <div className="leading-relaxed whitespace-pre-wrap">
                              {
                                msg.content
                              }
                            </div>
                          </div>
                        )}

                        {msg.type ===
                          "file" && (
                          <div
                            className={cn(
                              "flex items-center gap-3 p-2 rounded-lg",
                              isCustomer
                                ? "bg-default-200/60"
                                : "bg-white/10"
                            )}
                          >
                            <div
                              className={cn(
                                "p-2 rounded flex items-center justify-center",
                                isCustomer
                                  ? "bg-emerald-500 text-white"
                                  : "bg-white/20 text-white"
                              )}
                            >
                              <Icon
                                icon="heroicons:document-text"
                                className="w-5 h-5"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="font-semibold truncate">
                                {
                                  msg.fileName
                                }
                              </div>

                              <div
                                className={cn(
                                  "text-[10px]",
                                  isCustomer
                                    ? "text-default-500"
                                    : "text-white/70"
                                )}
                              >
                                {
                                  msg.fileSize
                                }
                              </div>
                            </div>

                            {msg.url && (
                              <a
                                href={
                                  msg.url
                                }
                                target="_blank"
                                rel="noreferrer"
                                className={cn(
                                  "h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                                  isCustomer
                                    ? "bg-background border border-default-200"
                                    : "bg-white/20"
                                )}
                              >
                                <Icon
                                  icon="heroicons:arrow-down-tray"
                                  className={cn(
                                    "w-3.5 h-3.5",
                                    isCustomer
                                      ? "text-default-800"
                                      : "text-white"
                                  )}
                                />
                              </a>
                            )}
                          </div>
                        )}

                        {msg.type ===
                          "image" && (
                          <div className="space-y-1.5">
                            {msg.thumbnail && (
                              <div className="rounded-xl overflow-hidden max-w-[200px]">
                                <img
                                  src={
                                    msg.thumbnail
                                  }
                                  alt={
                                    msg.content ||
                                    "Image"
                                  }
                                  className="w-full h-auto object-cover max-h-[140px]"
                                />
                              </div>
                            )}

                            {msg.content && (
                              <div
                                className={cn(
                                  "text-[11px] font-medium",
                                  isCustomer
                                    ? "text-default-700"
                                    : "text-white/90"
                                )}
                              >
                                {
                                  msg.content
                                }
                              </div>
                            )}
                          </div>
                        )}

                        {msg.type ===
                          "video" && (
                          <div className="space-y-2">
                            {msg.url && (
                              <video
                                src={
                                  msg.url
                                }
                                controls
                                className="max-w-[220px] rounded-lg"
                              />
                            )}

                            {msg.content && (
                              <div className="text-[11px]">
                                {
                                  msg.content
                                }
                              </div>
                            )}
                          </div>
                        )}

                        {msg.type ===
                          "audio" && (
                          <div className="flex items-center gap-2 min-w-[180px]">
                            {msg.url ? (
                              <audio
                                controls
                                src={
                                  msg.url
                                }
                                className="max-w-[220px]"
                              />
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className={cn(
                                    "h-7 w-7 rounded-full shrink-0 flex items-center justify-center",
                                    isCustomer
                                      ? "bg-emerald-500 text-white"
                                      : "bg-white/20 text-white"
                                  )}
                                >
                                  <Icon
                                    icon="heroicons:play-solid"
                                    className="w-3 h-3"
                                  />
                                </button>

                                <div className="flex-1 h-1 bg-white/30 rounded-full">
                                  <div
                                    className={cn(
                                      "h-full w-1/3 rounded-full",
                                      isCustomer
                                        ? "bg-emerald-500"
                                        : "bg-white"
                                    )}
                                  />
                                </div>

                                <span className="text-[10px]">
                                  {
                                    msg.duration
                                  }
                                </span>
                              </>
                            )}
                          </div>
                        )}

                        <div
                          className={cn(
                            "flex items-center justify-end gap-1 mt-1 text-[9px] select-none",
                            isCustomer
                              ? "text-default-400"
                              : "text-white/70"
                          )}
                        >
                          <span>
                            {msg.time}
                          </span>

                          {!isCustomer && (
                            <>
                              {msg.status ===
                              "sending" ? (
                                <Icon
                                  icon="heroicons:clock"
                                  className="w-3.5 h-3.5 text-white/70"
                                />
                              ) : msg.status ===
                                "failed" ? (
                                <Icon
                                  icon="heroicons:exclamation-circle"
                                  className="w-3.5 h-3.5 text-red-200"
                                />
                              ) : (
                                <Icon
                                  icon="heroicons:check-20-solid"
                                  className="w-3.5 h-3.5 text-white/90"
                                />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {showEmojiPicker && (
              <div className="px-4 py-3 bg-default-50 border-t border-default-200 flex flex-wrap gap-2">
                {quickEmojis.map(
                  (emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() =>
                        insertEmoji(
                          emoji
                        )
                      }
                      className="text-xl hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  )
                )}
              </div>
            )}

            {showAttachMenu && (
              <div className="px-4 py-2 bg-default-50 border-t border-default-200 flex gap-3 relative">
                <input
                  type="file"
                  ref={fileInputRef as React.LegacyRef<HTMLInputElement>}
                  className="hidden"
                  onChange={
                    handleFileSelected
                  }
                />

                {[
                  {
                    icon: "heroicons:photo",
                    label: "Image",
                    color:
                      "text-violet-500",
                  },
                  {
                    icon: "heroicons:document-text",
                    label: "Document",
                    color:
                      "text-blue-500",
                  },
                  {
                    icon: "heroicons:film",
                    label: "Video",
                    color:
                      "text-rose-500",
                  },
                  {
                    icon: "heroicons:microphone",
                    label: "Audio",
                    color:
                      "text-amber-500",
                  },
                ].map(
                  ({
                    icon,
                    label,
                    color,
                  }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() =>
                        handleSendAttachment(
                          label
                        )
                      }
                      className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-default-200 transition-colors"
                    >
                      <span
                        className={`${color} flex items-center justify-center w-9 h-9 rounded-full bg-default-200`}
                      >
                        <Icon
                          icon={icon}
                          width={20}
                          height={20}
                        />
                      </span>

                      <span className="text-[10px] text-default-600">
                        {label}
                      </span>
                    </button>
                  )
                )}
              </div>
            )}

            {chatPreviewFile && (
              <div className="px-4 py-3 bg-default-50 border-t border-default-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {chatPreviewFile.type ===
                    "image" &&
                  chatPreviewFile.thumbnail ? (
                    <img
                      src={
                        chatPreviewFile.thumbnail
                      }
                      alt="preview"
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  ) : (
                    <div className="p-3 bg-default-200 rounded-md">
                      <Icon
                        icon="heroicons:document"
                        className="w-6 h-6 text-default-600"
                      />
                    </div>
                  )}

                  <div>
                    <div className="text-sm font-medium">
                      {
                        chatPreviewFile.fileName ||
                        chatPreviewFile.content ||
                        "Audio File"
                      }
                    </div>

                    <div className="text-xs text-default-500">
                      {
                        chatPreviewFile.fileSize ||
                        "Ready to send"
                      }
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setChatPreviewFile(
                      null
                    )
                  }
                  className="p-1.5 rounded-full hover:bg-default-200 text-default-500"
                >
                  <Icon
                    icon="heroicons:x-mark"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            )}

            <div className="px-3 py-2.5 bg-default-50 border-t border-default-200 flex items-center gap-3">
              {!isRecording && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmojiPicker(
                        (
                          previous
                        ) =>
                          !previous
                      );

                      setShowAttachMenu(
                        false
                      );
                    }}
                    className={cn(
                      "h-9 w-9 rounded-full shrink-0 flex items-center justify-center transition-colors",
                      showEmojiPicker
                        ? "bg-emerald-100 text-emerald-600"
                        : "text-default-500 hover:text-default-700 hover:bg-default-200"
                    )}
                  >
                    <Icon
                      icon="heroicons:face-smile"
                      width={22}
                      height={22}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAttachMenu(
                        (
                          previous
                        ) =>
                          !previous
                      );

                      setShowEmojiPicker(
                        false
                      );
                    }}
                    className={cn(
                      "h-9 w-9 rounded-full shrink-0 flex items-center justify-center transition-colors",
                      showAttachMenu
                        ? "bg-blue-100 text-blue-600"
                        : "text-default-500 hover:text-default-700 hover:bg-default-200"
                    )}
                  >
                    <Icon
                      icon="heroicons:paper-clip"
                      width={22}
                      height={22}
                    />
                  </button>
                </>
              )}

              {isRecording ? (
                <div className="flex-1 h-9 rounded-full bg-red-50 text-sm border border-red-200 px-4 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />

                  <span className="text-red-500 font-medium">
                    Recording...{" "}
                    {Math.floor(
                      recordingTime /
                        60
                    )}
                    :
                    {recordingTime %
                      60 <
                    10
                      ? "0"
                      : ""}
                    {recordingTime %
                      60}
                  </span>
                </div>
              ) : (
                <Input
                  placeholder="Type a message..."
                  className="flex-1 h-9 rounded-full bg-white dark:bg-default-800 text-sm border border-default-200 px-4"
                  value={
                    chatInput
                  }
                  onChange={(
                    event
                  ) =>
                    setChatInput(
                      event.target
                        .value
                    )
                  }
                  onKeyDown={(
                    event
                  ) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      event.preventDefault();

                      handleSendChatMessage();
                    }
                  }}
                />
              )}

              {!isRecording &&
                (chatInput.trim() ||
                  chatPreviewFile) && (
                  <button
                    type="button"
                    onClick={
                      handleSendChatMessage
                    }
                    disabled={
                      !socketConnected
                    }
                    className={cn(
                      "h-9 px-4 rounded-full shrink-0 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm",
                      socketConnected
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : "bg-gray-400 cursor-not-allowed"
                    )}
                  >
                    <Icon
                      icon="heroicons:paper-airplane"
                      width={15}
                      height={15}
                    />

                    Send
                  </button>
                )}

              {!chatInput.trim() &&
                !chatPreviewFile && (
                  <button
                    type="button"
                    onClick={
                      toggleRecording
                    }
                    className={cn(
                      "h-9 w-9 rounded-full shrink-0 text-white flex items-center justify-center transition-colors shadow-sm",
                      isRecording
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-emerald-500 hover:bg-emerald-600"
                    )}
                  >
                    {isRecording ? (
                      <Icon
                        icon="heroicons:stop"
                        width={17}
                        height={17}
                      />
                    ) : (
                      <Icon
                        icon="heroicons:microphone"
                        width={17}
                        height={17}
                      />
                    )}
                  </button>
                )}
            </div>
          </div>

        </CardContent>
      </Card>
    );
  };

export default Section3ChatTimeline;
