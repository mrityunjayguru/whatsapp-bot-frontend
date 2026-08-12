"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  User,
  Tag,
  Eye,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Client,
  IMessage,
  StompSubscription,
} from "@stomp/stompjs";

/* ============================================================
   API / WEBSOCKET CONFIG
============================================================ */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://whatsapi.trpgps.com";

const WS_API_BASE_URL =
  process.env.NEXT_PUBLIC_WS_API_BASE_URL ||
  "wss://whatsapi.trpgps.com";

const WS_ENDPOINT = "/ws";

const TAG_WEBSOCKET_TOPIC = "/topic/tags";

/* ============================================================
   TYPES
============================================================ */

interface Contact {
  id: string | number;
  tenantid?: string | number;
  whatsappphonenumberid?: string;
  phonenumber?: string;
  whatsappprofilename?: string;
  customname?: string;
  email?: string;
  createdat?: string;
  updatedat?: string;
  payload?: unknown;
}

export interface ApiTag {
  id: number;
  tagid?: number;
  name: string;
  createdat?: string;
  updatedat?: string;
}

interface CustomerInfo {
  customerName?: string;
  customerSince?: string;
  whatsappName?: string;
  phone?: string;
  email?: string;
}

interface Conversation {
  customerImage?: string;
}

interface Section2CustomerInfoProps {
  conversation?: Conversation;
  customerInfo?: CustomerInfo;
  customerInitials?: string;
  tagColors?: Record<string, string>;
  openEditContact?: () => void;
  openAddTag?: () => void;
}

/* ============================================================
   COMPONENT
============================================================ */

export const Section2CustomerInfo = ({
  conversation,
  customerInfo,
  customerInitials,
  tagColors,
  openEditContact,
  openAddTag,
}: Section2CustomerInfoProps) => {
  /* ==========================================================
     STATE
  ========================================================== */

  const [allTags, setAllTags] = useState<ApiTag[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  const [wsConnected, setWsConnected] = useState(false);

  const stompClient = useRef<Client | null>(null);
  const tagSubscription =
    useRef<StompSubscription | null>(null);

  /* ==========================================================
     TAG IDENTIFIER
  ========================================================== */

  const getTagIdentifier = useCallback(
    (tag?: Partial<ApiTag>) => {
      if (!tag) {
        return null;
      }

      if (
        tag.tagid !== undefined &&
        tag.tagid !== null
      ) {
        return `tagid:${tag.tagid}`;
      }

      if (
        tag.id !== undefined &&
        tag.id !== null
      ) {
        return `id:${tag.id}`;
      }

      return null;
    },
    []
  );

  /* ==========================================================
     NORMALIZE TAG
  ========================================================== */

  const normalizeTag = useCallback(
    (tag: any): ApiTag | null => {
      if (!tag || typeof tag !== "object") {
        return null;
      }

      const id =
        tag.id ??
        tag.tagId ??
        tag.tagid;

      const tagid =
        tag.tagid ??
        tag.tagId ??
        tag.id;

      if (
        id === undefined ||
        id === null ||
        tag.name === undefined ||
        tag.name === null
      ) {
        return null;
      }

      const numericId = Number(id);

      if (Number.isNaN(numericId)) {
        return null;
      }

      return {
        id: numericId,

        tagid:
          tagid !== undefined &&
          tagid !== null
            ? Number(tagid)
            : numericId,

        name: String(tag.name),

        createdat:
          tag.createdat ??
          tag.createdAt ??
          "",

        updatedat:
          tag.updatedat ??
          tag.updatedAt ??
          "",
      };
    },
    []
  );

  /* ==========================================================
     UPSERT TAG
  ========================================================== */

  const upsertTag = useCallback(
    (incomingTag: ApiTag) => {
      const normalizedTag =
        normalizeTag(incomingTag);

      if (!normalizedTag) {
        console.warn(
          "Invalid tag received:",
          incomingTag
        );
        return;
      }

      const incomingIdentifier =
        getTagIdentifier(normalizedTag);

      if (!incomingIdentifier) {
        return;
      }

      setAllTags((previousTags) => {
        const existingIndex =
          previousTags.findIndex(
            (existingTag) =>
              getTagIdentifier(existingTag) ===
              incomingIdentifier
          );

        if (existingIndex === -1) {
          console.log(
            "WebSocket: adding new tag",
            normalizedTag
          );

          return [
            ...previousTags,
            normalizedTag,
          ];
        }

        console.log(
          "WebSocket: updating tag",
          normalizedTag
        );

        const updatedTags = [
          ...previousTags,
        ];

        updatedTags[existingIndex] = {
          ...updatedTags[existingIndex],
          ...normalizedTag,
        };

        return updatedTags;
      });
    },
    [
      getTagIdentifier,
      normalizeTag,
    ]
  );

  /* ==========================================================
     DELETE TAG
  ========================================================== */

  const deleteTag = useCallback(
    (incomingTag: Partial<ApiTag>) => {
      const identifier =
        getTagIdentifier(incomingTag);

      if (!identifier) {
        return;
      }

      setAllTags((previousTags) =>
        previousTags.filter(
          (tag) =>
            getTagIdentifier(tag) !==
            identifier
        )
      );

      console.log(
        "WebSocket: deleted tag",
        incomingTag
      );
    },
    [getTagIdentifier]
  );

  /* ==========================================================
     EXTRACT TAGS FROM PAYLOAD
  ========================================================== */

  const extractTags = useCallback(
    (payload: any): ApiTag[] => {
      if (!payload) {
        return [];
      }

      /* Array */
      if (Array.isArray(payload)) {
        return payload
          .map(normalizeTag)
          .filter(
            (tag): tag is ApiTag =>
              tag !== null
          );
      }

      /* { tags: [] } */
      if (Array.isArray(payload.tags)) {
        return payload.tags
          .map(normalizeTag)
          .filter(
            (tag): tag is ApiTag =>
              tag !== null
          );
      }

      /* { data: [] } */
      if (Array.isArray(payload.data)) {
        return payload.data
          .map(normalizeTag)
          .filter(
            (tag): tag is ApiTag =>
              tag !== null
          );
      }

      /* { data: { tags: [] } } */
      if (
        payload.data &&
        typeof payload.data === "object" &&
        Array.isArray(payload.data.tags)
      ) {
        return payload.data.tags
          .map(normalizeTag)
          .filter(
            (tag): tag is ApiTag =>
              tag !== null
          );
      }

      /* { tag: {} } */
      if (
        payload.tag &&
        typeof payload.tag === "object"
      ) {
        const tag =
          normalizeTag(payload.tag);

        return tag ? [tag] : [];
      }

      /* { data: { tag: {} } } */
      if (
        payload.data &&
        typeof payload.data === "object" &&
        payload.data.tag
      ) {
        const tag =
          normalizeTag(
            payload.data.tag
          );

        return tag ? [tag] : [];
      }

      /* Direct tag */
      const directTag =
        normalizeTag(payload);

      return directTag
        ? [directTag]
        : [];
    },
    [normalizeTag]
  );

  /* ==========================================================
     HANDLE WEBSOCKET MESSAGE
  ========================================================== */

  const handleWebSocketMessage =
    useCallback(
      (rawData: any) => {
        console.log(
          "Incoming TAG WebSocket data:",
          rawData
        );

        if (!rawData) {
          return;
        }

        const action = String(
          rawData?.action ??
            rawData?.event ??
            rawData?.type ??
            ""
        ).toUpperCase();

        console.log(
          "WebSocket action:",
          action
        );

        const extractedTags =
          extractTags(rawData);

        const isListPayload =
          Array.isArray(rawData) ||
          Array.isArray(rawData?.tags) ||
          Array.isArray(rawData?.data) ||
          (
            rawData?.data &&
            typeof rawData.data === "object" &&
            Array.isArray(
              rawData.data.tags
            )
          );

        /* Complete list */
        if (isListPayload) {
          console.log(
            "WebSocket: received complete tag list",
            extractedTags
          );

          setAllTags(extractedTags);

          return;
        }

        /* No tag */
        if (extractedTags.length === 0) {
          console.warn(
            "WebSocket message does not contain a tag:",
            rawData
          );

          return;
        }

        const incomingTag =
          extractedTags[0];

        /* Delete */
        if (
          action.includes("DELETE") ||
          action.includes("REMOVE")
        ) {
          deleteTag(incomingTag);
          return;
        }

        /* Create / Update */
        upsertTag(incomingTag);
      },
      [
        deleteTag,
        extractTags,
        upsertTag,
      ]
    );

  /* ==========================================================
     INITIAL FETCH TAGS
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    const fetchTags = async () => {
      try {
        setLoadingTags(true);

        const response = await fetch(
          `${API_BASE_URL}/api/tags`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "ngrok-skip-browser-warning": "1",
            },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch tags: ${response.status} ${response.statusText}`
          );
        }

        const data =
          await response.json();

        console.log(
          "Initial Tags API response:",
          data
        );

        if (cancelled) {
          return;
        }

        const tags =
          extractTags(data);

        console.log(
          "Normalized initial tags:",
          tags
        );

        setAllTags(tags);
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Unable to load tags:",
            error
          );

          setAllTags([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingTags(false);
        }
      }
    };

    fetchTags();

    return () => {
      cancelled = true;
    };
  }, [extractTags]);

  /* ==========================================================
     CONVERT HTTP URL TO WS URL
  ========================================================== */

  const getWebSocketUrl =
    useCallback(() => {
      if (!WS_API_BASE_URL) {
        return "";
      }

      let baseUrl =
        WS_API_BASE_URL.trim();

      if (
        baseUrl.startsWith("https://")
      ) {
        baseUrl =
          "wss://" +
          baseUrl.substring(8);
      } else if (
        baseUrl.startsWith("http://")
      ) {
        baseUrl =
          "ws://" +
          baseUrl.substring(7);
      }

      baseUrl =
        baseUrl.replace(/\/$/, "");

      return `${baseUrl}${WS_ENDPOINT}`;
    }, []);

  /* ==========================================================
     STOMP WEBSOCKET
  ========================================================== */

  useEffect(() => {
    const brokerUrl =
      getWebSocketUrl();

    if (!brokerUrl) {
      console.error(
        "NEXT_PUBLIC_WS_API_BASE_URL is missing."
      );

      return;
    }

    console.log(
      "Starting STOMP WebSocket:",
      brokerUrl
    );

    const client = new Client({
      brokerURL: brokerUrl,

      reconnectDelay: 5000,

      heartbeatIncoming: 10000,

      heartbeatOutgoing: 10000,

      debug: (message) => {
        console.log(
          "[STOMP]",
          message
        );
      },

      /* ======================================================
         CONNECT
      ====================================================== */

      onConnect: () => {
        console.log(
          "STOMP connected successfully"
        );

        setWsConnected(true);

        /* Remove old subscription */
        if (
          tagSubscription.current
        ) {
          try {
            tagSubscription.current.unsubscribe();
          } catch {
            // Ignore unsubscribe error
          }

          tagSubscription.current =
            null;
        }

        console.log(
          "Subscribing to:",
          TAG_WEBSOCKET_TOPIC
        );

        const subscription =
          client.subscribe(
            TAG_WEBSOCKET_TOPIC,
            (message: IMessage) => {
              console.log(
                "Raw TAG WebSocket message:",
                message.body
              );

              if (!message.body) {
                return;
              }

              try {
                const parsedData =
                  JSON.parse(
                    message.body
                  );

                console.log(
                  "Client 222222222222222222222Parsed TAG WebSocket message:",
                  parsedData
                );

                console.log(
                  "Client 222222222222222222222Parsed TAG WebSocket message:",
                  parsedData
                );
                handleWebSocketMessage(
                  parsedData
                );
              } catch (error) {
                console.error(
                  "Invalid TAG WebSocket JSON:",
                  error
                );

                console.error(
                  "Raw body:",
                  message.body
                );
              }
            }
          );

        tagSubscription.current =
          subscription;
      },

      /* ======================================================
         DISCONNECT
      ====================================================== */

      onDisconnect: () => {
        console.log(
          "STOMP disconnected"
        );

        setWsConnected(false);

        tagSubscription.current =
          null;
      },

      /* ======================================================
         STOMP ERROR
      ====================================================== */

      onStompError: (frame) => {
        console.error(
          "STOMP error:",
          frame.headers?.message
        );

        console.error(
          "STOMP error body:",
          frame.body
        );

        setWsConnected(false);
      },

      /* ======================================================
         WEBSOCKET ERROR
      ====================================================== */

      onWebSocketError: (error) => {
        console.error(
          "WebSocket error:",
          error
        );

        setWsConnected(false);
      },

      /* ======================================================
         WEBSOCKET CLOSE
      ====================================================== */

      onWebSocketClose: (event) => {
        console.log(
          "WebSocket closed:",
          event
        );

        setWsConnected(false);

        tagSubscription.current =
          null;
      },
    });

    stompClient.current =
      client;

    client.activate();

    /* ========================================================
       CLEANUP
    ======================================================== */

    return () => {
      console.log(
        "Cleaning up STOMP WebSocket..."
      );

      setWsConnected(false);

      if (
        tagSubscription.current
      ) {
        try {
          tagSubscription.current.unsubscribe();
        } catch {
          // Ignore
        }

        tagSubscription.current =
          null;
      }

      if (
        client.active ||
        client.connected
      ) {
        void client.deactivate();
      }

      if (
        stompClient.current ===
        client
      ) {
        stompClient.current =
          null;
      }
    };
  }, [
    getWebSocketUrl,
    handleWebSocketMessage,
  ]);

  /* ==========================================================
     FETCH CONTACTS
  ========================================================== */

  const fetchContacts =
    useCallback(async () => {
      try {
        setContactLoading(true);

        const response =
          await fetch(
            `${API_BASE_URL}/allcontactentity`,
            {
              method: "GET",
              headers: {
                Accept:
                  "application/json",
                "ngrok-skip-browser-warning":
                  "1",
              },
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch contacts: ${response.status} ${response.statusText}`
          );
        }

        const data =
          await response.json();

        console.log(
          "Contacts:",
          data
        );

        const contactsArray =
          Array.isArray(data)
            ? data
            : Array.isArray(
                data?.data
              )
            ? data.data
            : Array.isArray(
                data?.contacts
              )
            ? data.contacts
            : [];

        setContacts(
          contactsArray
        );

        setContactDialogOpen(
          true
        );
      } catch (error) {
        console.error(
          "Unable to load contacts:",
          error
        );

        window.alert(
          "Unable to load contacts."
        );
      } finally {
        setContactLoading(
          false
        );
      }
    }, []);

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <Card>
      <CardContent className="p-4 space-y-3">

        {/* HEADER */}

        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
            Section 2: Customer Information
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                wsConnected
                  ? "bg-green-500"
                  : "bg-red-500"
              )}
            />

            <span className="text-[10px] text-default-500">
              {wsConnected
                ? "Live"
                : "Disconnected"}
            </span>
          </div>
        </div>

        {/* CUSTOMER */}

        <div className="flex items-center gap-3 pb-2 border-b border-default-200">
          <Avatar className="h-10 w-10 shrink-0 bg-default-100 border border-default-200">
            {conversation?.customerImage ? (
              <AvatarImage
                src={
                  conversation.customerImage
                }
                alt={
                  customerInfo?.customerName ||
                  "Customer"
                }
              />
            ) : (
              <AvatarFallback className="text-xs text-default-700">
                {customerInitials || "AB"}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="min-w-0">
            <div className="text-sm font-semibold text-default-800 truncate">
              {customerInfo?.customerName ||
                "-"}
            </div>

            <div className="text-[11px] text-default-500 truncate">
              Since{" "}
              {customerInfo?.customerSince ||
                "-"}
            </div>
          </div>
        </div>

        {/* CUSTOMER INFORMATION */}

        <div className="grid grid-cols-2 gap-x-4 gap-y-6">

          {/* NAME */}

          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Name
            </span>

            <span className="text-sm font-medium text-default-800 truncate">
              {customerInfo?.customerName ||
                "-"}
            </span>
          </div>

          {/* WHATSAPP */}

          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              WhatsApp
            </span>

            <span className="text-sm font-medium truncate text-blue-600">
              {customerInfo?.whatsappName ||
                "-"}
            </span>
          </div>

          {/* PHONE */}

          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Phone
            </span>

            <span className="text-sm font-medium text-default-800 truncate">
              {customerInfo?.phone || "-"}
            </span>
          </div>

          {/* EMAIL */}

          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Email
            </span>

            <span className="text-sm font-medium text-default-800 truncate">
              {customerInfo?.email || "-"}
            </span>
          </div>

          {/* TAGS */}

          <div className="col-span-2 flex items-start gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28 pt-0.5">
              Tags
            </span>

            <div className="flex flex-wrap gap-1.5 min-w-0">
              {loadingTags ? (
                <span className="text-xs text-default-400">
                  Loading tags...
                </span>
              ) : allTags.length > 0 ? (
                allTags.map((tag) => (
                  <Badge
                    key={
                      getTagIdentifier(tag) ||
                      `tag-${tag.id}`
                    }
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
                      tagColors?.[tag.name] ||
                        "bg-default-200 text-default-700"
                    )}
                  >
                    {tag.name}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-default-400">
                  No tags
                </span>
              )}
            </div>
          </div>

          {/* CUSTOMER SINCE */}

          <div className="flex items-baseline gap-2 min-w-0 col-span-2">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Customer Since
            </span>

            <span className="text-sm font-medium text-default-800 truncate">
              {customerInfo?.customerSince ||
                "-"}
            </span>
          </div>
        </div>

        {/* BUTTONS */}

        <div className="pt-2 mt-1 border-t border-default-200">
          <div className="flex flex-wrap gap-1.5">

            {/* EDIT CONTACT */}

            <Button
              variant="outline"
              size="sm"
              onClick={openEditContact}
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              <User className="w-3.5 h-3.5 me-1.5" />
              Edit Contact
            </Button>

            {/* ADD TAG */}

            <Button
              variant="outline"
              size="sm"
              onClick={openAddTag}
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              <Tag className="w-3.5 h-3.5 me-1.5" />
              Add Tag
            </Button>

            {/* VIEW CONTACT */}

            <Button
              variant="outline"
              size="sm"
              disabled={contactLoading}
              onClick={fetchContacts}
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              <Eye className="w-3.5 h-3.5 me-1.5" />

              {contactLoading
                ? "Loading..."
                : "View Contact"}
            </Button>
          </div>
        </div>

        {/* CONTACT DIALOG */}

        <Dialog
          open={contactDialogOpen}
          onOpenChange={
            setContactDialogOpen
          }
        >
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                All Contacts
              </DialogTitle>
            </DialogHeader>

            {contactLoading ? (
              <div className="flex justify-center py-10">
                Loading contacts...
              </div>
            ) : (
              <div className="max-h-[70vh] overflow-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b">
                      <th className="p-2 text-left">
                        ID
                      </th>

                      <th className="p-2 text-left">
                        Tenant ID
                      </th>

                      <th className="p-2 text-left">
                        WhatsApp Phone ID
                      </th>

                      <th className="p-2 text-left">
                        Phone Number
                      </th>

                      <th className="p-2 text-left">
                        Profile Name
                      </th>

                      <th className="p-2 text-left">
                        Custom Name
                      </th>

                      <th className="p-2 text-left">
                        Email
                      </th>

                      <th className="p-2 text-left">
                        Created At
                      </th>

                      <th className="p-2 text-left">
                        Updated At
                      </th>

                      <th className="p-2 text-left">
                        Payload
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {contacts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={10}
                          className="p-6 text-center"
                        >
                          No contacts found.
                        </td>
                      </tr>
                    ) : (
                      contacts.map(
                        (contact, index) => (
                          <tr
                            key={`${String(
                              contact.id
                            )}-${index}`}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="p-2">
                              {contact.id || "-"}
                            </td>

                            <td className="p-2">
                              {contact.tenantid ||
                                "-"}
                            </td>

                            <td className="p-2">
                              {contact.whatsappphonenumberid ||
                                "-"}
                            </td>

                            <td className="p-2">
                              {contact.phonenumber ||
                                "-"}
                            </td>

                            <td className="p-2">
                              {contact.whatsappprofilename ||
                                "-"}
                            </td>

                            <td className="p-2">
                              {contact.customname ||
                                "-"}
                            </td>

                            <td className="p-2">
                              {contact.email ||
                                "-"}
                            </td>

                            <td className="p-2 whitespace-nowrap">
                              {contact.createdat ||
                                "-"}
                            </td>

                            <td className="p-2 whitespace-nowrap">
                              {contact.updatedat ||
                                "-"}
                            </td>

                            <td className="p-2 max-w-[300px]">
                              <pre className="max-h-24 overflow-auto whitespace-pre-wrap break-all text-xs">
                                {typeof contact.payload ===
                                "object"
                                  ? JSON.stringify(
                                      contact.payload,
                                      null,
                                      2
                                    )
                                  : String(
                                      contact.payload ??
                                        "-"
                                    )}
                              </pre>
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};