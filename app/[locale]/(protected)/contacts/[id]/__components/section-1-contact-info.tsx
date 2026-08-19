import React, { useCallback, useEffect, useRef, useState } from "react";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Tag, TagIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiTag } from "../../../conversations/[id]/__components/section-2-customer-info";
import { Item } from "@radix-ui/react-dropdown-menu";


export const Section1ContactInfo = ({
  contact,
  customerInitials,
  tagColors,
  openEditContact,
  openAddTag,
}: any) => {
 

  
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://whatsapi.trpgps.com";

const WS_API_BASE_URL =
  process.env.NEXT_PUBLIC_WS_API_BASE_URL ||
  "wss://whatsapi.trpgps.com";

const WS_ENDPOINT = "/ws";

const TAG_WEBSOCKET_TOPIC = "/topic/tags";


  const [allTags, setAllTags] = useState<ApiTag[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [, setWsConnected] = useState(false);
  const stompClient = useRef<Client | null>(null);
  const tagSubscription = useRef<StompSubscription | null>(null);

  const handleWebSocketMessage = useCallback((data: unknown) => {
    const payload = data as ApiTag[] | { tags?: ApiTag[] };
    const tags = Array.isArray(payload)
      ? payload
      : payload.tags;

      
    if (tags) {
      setAllTags(tags);
    }
  }, []);

  
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
                  "Client contact 222222222222222222222Parsed TAG WebSocket message:",
                  parsedData
                );

                setAllTags(parsedData);
                
                console.log(
                  "Client contact 222222222222222222222Parsed TAG WebSocket message:",
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
          (data);

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
  }, []);
  
    
    console.log("contact");
    console.log(contact);
    console.log("contact");   



  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
            Section 1: Contact Information
          </div>
        </div>

       

        <div className="flex items-center gap-3 pb-2 border-b border-default-200">
          <Avatar className="h-10 w-10 shrink-0 bg-default-100 border border-default-200">
            {contact.customerImage ? (
              <AvatarImage src={contact.customerImage} />
            ) : (
              <AvatarFallback className="text-xs text-default-700">
                {customerInitials || "AB"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-default-800 truncate">
              {contact.customname || "Unknown Customer"}
            </div>
            <div className="text-[11px] text-default-500 truncate">
              Since {contact.createdAt}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32">
              Custom Name
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {contact.customname || "Unknown nn Customer"}
            </span>
          </div>
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32">
              WhatsApp Profile Name
            </span>
            <span className="text-sm font-medium truncate text-blue-600">
              {" "}{contact.whatsappName}
            </span>
          </div>
          
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32">
              Phone Number
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {contact.mobile}
            </span>
          </div>
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32">
              Email
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {contact.email}
            </span>
          </div>
          <div className="col-span-2 flex items-start gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32 pt-0.5">
            Tags:
            </span>
                <div className="flex flex-wrap gap-1.5 min-w-0">
                    {allTags?.map((tag, index) => (
                      <span key={index}>{tag.name}</span>
                    ))}
                  </div>
                      </div>
          <div className="flex items-baseline gap-2 min-w-0 col-span-2">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-32">
              Customer Since
            </span>
            <span className="text-sm font-medium text-default-800 truncate">
              {contact.createdAt}
            </span>
          </div>
        </div>

        <div className="pt-2 mt-1 border-t border-default-200">
          <div className="flex flex-wrap gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={openEditContact}
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              <User className="w-3.5 h-3.5 me-1.5" />
              Edit Contact  
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openAddTag}
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
            >
              <Tag className="w-3.5 h-3.5 me-1.5" />
              Add Tag
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openAddTag}
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200 text-destructive border-destructive/30 hover:border-destructive hover:text-destructive"
            >
              <Tag className="w-3.5 h-3.5 me-1.5" />
              Remove Tag
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

