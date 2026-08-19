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
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ApiTag } from "./section-2-customer-info";

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

interface Section1HeaderProps {
  conversation: any;
  statusStyle: string;
  statusLabel: string;
  agentInitials?: string;
  agentName?: string;
}

/* ============================================================
   HELPERS
============================================================ */

const extractTags = (payload: any): ApiTag[] => {
  if (!payload) {
    return [];
  }

  /*
   * Direct array
   *
   * [
   *   { id: 1, name: "VIP" }
   * ]
   */
  if (Array.isArray(payload)) {
    return payload.filter(Boolean);
  }

  /*
   * {
   *   tags: [...]
   * }
   */
  if (Array.isArray(payload.tags)) {
    return payload.tags.filter(Boolean);
  }

  /*
   * {
   *   data: [...]
   * }
   */
  if (Array.isArray(payload.data)) {
    return payload.data.filter(Boolean);
  }

  /*
   * {
   *   data: {
   *     tags: [...]
   *   }
   * }
   */
  if (
    payload.data &&
    typeof payload.data === "object" &&
    Array.isArray(payload.data.tags)
  ) {
    return payload.data.tags.filter(Boolean);
  }

  /*
   * {
   *   tag: {...}
   * }
   */
  if (
    payload.tag &&
    typeof payload.tag === "object"
  ) {
    return [payload.tag];
  }

  /*
   * {
   *   data: {
   *     id: 1,
   *     name: "VIP"
   *   }
   * }
   */
  if (
    payload.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data)
  ) {
    if (
      payload.data.id !== undefined ||
      payload.data.tagId !== undefined ||
      payload.data.name !== undefined
    ) {
      return [payload.data];
    }
  }

  /*
   * Direct tag
   *
   * {
   *   id: 1,
   *   name: "VIP"
   * }
   */
  if (
    payload.id !== undefined ||
    payload.tagId !== undefined ||
    payload.name !== undefined
  ) {
    return [payload];
  }

  return [];
};

/* ============================================================
   GET TAG ID
============================================================ */

const getTagId = (
  tag: any
): string | number | undefined => {
  return tag?.id ?? tag?.tagId;
};

/* ============================================================
   COMPONENT
============================================================ */

export const Section1Header = ({
  conversation,
  statusStyle,
  statusLabel,
  agentInitials,
  agentName,
}: Section1HeaderProps) => {
  /* ==========================================================
     STATE
  ========================================================== */

  const [allTags, setAllTags] =
    useState<ApiTag[]>([]);

  const [loadingTags, setLoadingTags] =
    useState(false);

  const [wsConnected, setWsConnected] =
    useState(false);

  /* ==========================================================
     STOMP REFS
  ========================================================== */

  const stompClient =
    useRef<Client | null>(null);

  const tagSubscription =
    useRef<StompSubscription | null>(null);

  /* ==========================================================
     LOAD INITIAL TAGS
  ========================================================== */

  const loadTags = useCallback(async () => {
    try {
      setLoadingTags(true);

      console.log(
        "Loading initial tags..."
      );

      const response = await fetch(
        `${API_BASE_URL}/api/tags`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load tags: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      console.log(
        "Initial tag API response:",
        data
      );

      const tags = extractTags(data);

      console.log(
        "Initial extracted tags:",
        tags
      );

      setAllTags(tags);
    } catch (error) {
      console.error(
        "Failed to load tags:",
        error
      );
    } finally {
      setLoadingTags(false);
    }
  }, []);

  /* ==========================================================
     HANDLE STOMP MESSAGE
  ========================================================== */

  const handleWebSocketMessage =
    useCallback(
      (message: IMessage) => {
        try {
          console.log(
            "================================="
          );

          console.log(
            "TAG WEBSOCKET MESSAGE RECEIVED"
          );

          console.log(
            "STOMP MESSAGE:",
            message
          );

          console.log(
            "STOMP BODY:",
            message.body
          );

          console.log(
            "================================="
          );

          if (!message.body) {
            console.warn(
              "STOMP message has empty body"
            );

            return;
          }

          /*
           * Parse body
           */
          let rawData: any;

          try {
            rawData =
              JSON.parse(message.body);
          } catch {
            /*
             * If backend sends plain text
             */
            rawData = message.body;
          }

          console.log(
            "Parsed WebSocket data:",
            rawData
          );

          /*
           * Action
           */
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

          /*
           * Extract tags
           */
          const extractedTags =
            extractTags(rawData);

          console.log(
            "Extracted tags:",
            extractedTags
          );

          /*
           * Complete list
           */
          const isListPayload =
            Array.isArray(rawData) ||
            Array.isArray(rawData?.tags) ||
            Array.isArray(rawData?.data) ||
            (rawData?.data &&
              typeof rawData.data ===
                "object" &&
              Array.isArray(
                rawData.data.tags
              ));

          if (isListPayload) {
            console.log(
              "WebSocket contains complete tag list"
            );

            setAllTags(
              extractedTags
            );

            return;
          }

          /*
           * No tag
           */
          if (
            extractedTags.length === 0
          ) {
            console.warn(
              "WebSocket message does not contain a tag:",
              rawData
            );

            return;
          }

          const incomingTag =
            extractedTags[0];

          const incomingTagId =
            getTagId(incomingTag);

          console.log(
            "Incoming tag:",
            incomingTag
          );

          console.log(
            "Incoming tag ID:",
            incomingTagId
          );

          /* ====================================================
             DELETE
          ==================================================== */

          if (
            action.includes("DELETE") ||
            action.includes("REMOVE")
          ) {
            console.log(
              "DELETE TAG EVENT"
            );

            if (
              incomingTagId ===
              undefined
            ) {
              console.warn(
                "Cannot delete tag because tag ID is missing:",
                incomingTag
              );

              return;
            }

            setAllTags(
              (currentTags) =>
                currentTags.filter(
                  (tag: any) =>
                    getTagId(tag) !==
                    incomingTagId
                )
            );

            return;
          }

          /* ====================================================
             CREATE / UPDATE
          ==================================================== */

          setAllTags(
            (currentTags) => {
              const existingIndex =
                currentTags.findIndex(
                  (tag: any) =>
                    incomingTagId !==
                      undefined &&
                    getTagId(tag) ===
                      incomingTagId
                );

              /*
               * CREATE
               */
              if (
                existingIndex === -1
              ) {
                console.log(
                  "CREATE TAG:",
                  incomingTag
                );

                return [
                  ...currentTags,
                  incomingTag,
                ];
              }

              /*
               * UPDATE
               */
              console.log(
                "UPDATE TAG:",
                incomingTag
              );

              const updatedTags =
                [...currentTags];

              updatedTags[
                existingIndex
              ] = {
                ...updatedTags[
                  existingIndex
                ],
                ...incomingTag,
              };

              return updatedTags;
            }
          );
        } catch (error) {
          console.error(
            "Error processing STOMP message:",
            error
          );
        }
      },
      []
    );

  /* ==========================================================
     INITIAL TAG LOAD
  ========================================================== */

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  /* ==========================================================
     STOMP WEBSOCKET CONNECTION
  ========================================================== */

  useEffect(() => {
    /*
     * Prevent duplicate connections
     */
    if (
      stompClient.current?.active
    ) {
      console.log(
        "STOMP client already active"
      );

      return;
    }

    /*
     * WebSocket URL
     */
    const brokerURL =
      `${WS_API_BASE_URL}${WS_ENDPOINT}`;

    console.log(
      "================================="
    );

    console.log(
      "STARTING STOMP CONNECTION"
    );

    console.log(
      "Broker URL:",
      brokerURL
    );

    console.log(
      "Topic:",
      TAG_WEBSOCKET_TOPIC
    );

    console.log(
      "================================="
    );

    /*
     * Create STOMP client
     */
    const client = new Client({
      brokerURL,

      /*
       * Automatically reconnect
       * after 5 seconds.
       */
      reconnectDelay: 5000,

      /*
       * Heartbeat
       */
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      /*
       * STOMP debug messages
       */
      debug: (message) => {
        console.log(
          "[STOMP DEBUG]",
          message
        );
      },

      /*
       * Connected
       */
      onConnect: (frame) => {
        console.log(
          "================================="
        );

        console.log(
          "STOMP CONNECTED SUCCESSFULLY"
        );

        console.log(
          "Connected frame:",
          frame
        );

        console.log(
          "Subscribing to:",
          TAG_WEBSOCKET_TOPIC
        );

        console.log(
          "================================="
        );

        setWsConnected(true);

        /*
         * Remove previous subscription
         * if one exists.
         */
        if (
          tagSubscription.current
        ) {
          tagSubscription.current.unsubscribe();

          tagSubscription.current =
            null;
        }

        /*
         * Subscribe
         */
        tagSubscription.current =
          client.subscribe(
            TAG_WEBSOCKET_TOPIC,
            (message) => {
              console.log(
                "TAG TOPIC MESSAGE:",
                message
              );

              handleWebSocketMessage(
                message
              );
            }
          );

        console.log(
          "Tag subscription created:",
          tagSubscription.current
        );
      },

      /*
       * STOMP broker error
       */
      onStompError: (frame) => {
        console.error(
          "================================="
        );

        console.error(
          "STOMP BROKER ERROR"
        );

        console.error(
          "Headers:",
          frame.headers
        );

        console.error(
          "Body:",
          frame.body
        );

        console.error(
          "================================="
        );

        setWsConnected(false);
      },

      /*
       * Native WebSocket error
       */
      onWebSocketError: (event) => {
        console.error(
          "WEBSOCKET ERROR:",
          event
        );

        setWsConnected(false);
      },

      /*
       * WebSocket closed
       */
      onWebSocketClose: (event) => {
        console.warn(
          "WEBSOCKET CLOSED"
        );

        console.warn(
          "Code:",
          event.code
        );

        console.warn(
          "Reason:",
          event.reason
        );

        setWsConnected(false);
      },

      /*
       * STOMP disconnected
       */
      onDisconnect: () => {
        console.warn(
          "STOMP DISCONNECTED"
        );

        setWsConnected(false);
      },
    });

    /*
     * Save client in ref
     */
    stompClient.current =
      client;

    /*
     * Activate connection
     */
    client.activate();

    /*
     * Cleanup
     */
    return () => {
      console.log(
        "Cleaning up STOMP connection..."
      );

      /*
       * Unsubscribe
       */
      if (
        tagSubscription.current
      ) {
        try {
          tagSubscription.current.unsubscribe();
        } catch (error) {
          console.error(
            "Failed to unsubscribe:",
            error
          );
        }

        tagSubscription.current =
          null;
      }

      /*
       * Deactivate STOMP
       */
      if (
        stompClient.current
      ) {
        stompClient.current
          .deactivate()
          .catch((error) => {
            console.error(
              "Failed to deactivate STOMP:",
              error
            );
          });

        stompClient.current =
          null;
      }

      setWsConnected(false);
    };
  }, [handleWebSocketMessage]);

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
            Section 1: Conversation Header
          </div>

          {/* WebSocket status */}
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

        {/* Conversation information */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {/* Conversation Number */}
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Conversation No.
            </span>

            <span className="text-sm font-semibold text-default-800 truncate">
              #
              {conversation?.conversationNo ??
                "—"}
            </span>
          </div>

          {/* Status */}
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Status
            </span>

            <Badge
              className={cn(
                "rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap shrink-0",
                statusStyle
              )}
            >
              {statusLabel}
            </Badge>
          </div>

          {/* Title */}
          <div className="flex items-baseline gap-2 min-w-0 col-span-2">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Title
            </span>

            <span className="text-sm font-medium text-default-800 truncate">
              {conversation?.title ||
                "—"}
            </span>
          </div>

          {/* Assigned */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Assigned
            </span>

            <Link
              href="#"
              className="flex items-center gap-1.5 hover:underline min-w-0"
            >
              <Avatar className="h-5 w-5 shrink-0 bg-default-100 border border-default-200">
                {conversation
                  ?.assignedTo
                  ?.image ? (
                  <AvatarImage
                    src={
                      conversation
                        .assignedTo
                        .image
                    }
                    alt={
                      agentName ||
                      "Agent"
                    }
                  />
                ) : (
                  <AvatarFallback className="text-[9px] text-default-700">
                    {agentInitials ||
                      "UN"}
                  </AvatarFallback>
                )}
              </Avatar>

              <span className="text-sm font-medium text-default-800 truncate">
                {agentName ||
                  "Unassigned"}
              </span>
            </Link>
          </div>

          {/* Department */}
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Department
            </span>

            <span className="text-sm font-medium text-default-800 truncate">
              {conversation
                ?.department ||
                "—"}
            </span>
          </div>

          {/* Created */}
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Created
            </span>

            <span className="text-sm font-medium text-default-800 truncate">
              {conversation
                ?.createdDate ||
                "—"}
            </span>
          </div>

          {/* Last Activity */}
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Last Activity
            </span>

            <span className="text-sm font-medium text-default-800 truncate">
              {conversation
                ?.lastActivity ||
                "—"}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="pt-2">
          {loadingTags && (
            <div className="text-xs text-default-500">
              Loading tags...
            </div>
          )}

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {allTags.map(
                (tag: any) => (
                  <Badge
                    key={String(
                      getTagId(
                        tag
                      ) ??
                        tag.name
                    )}
                    variant="secondary"
                    className="text-xs"
                  >
                    {tag.name ||
                      tag.label ||
                      "Unnamed"}
                  </Badge>
                )
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-2 mt-1 border-t border-default-200">
          <div className="flex flex-wrap gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              Assign
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              Resolve
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              Close
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              Reopen
            </Button>

            {conversation?.isChatbot && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
              >
                Take Over
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};