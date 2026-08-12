import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Tag, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Add this interface
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
  payload?: any;
}

type ApiTag = {
  id: number;
  tagid: number;
  name: string;
  createdat: string;
  updatedat: string;
};

export const Section2CustomerInfo = ({
  conversation,
  customerInfo,
  customerInitials,
  tagColors,
  openEditContact,
  openAddTag,
}: any) => {
  const [allTags, setAllTags] = useState<ApiTag[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);

  // Update this line with the Contact[] type
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoadingTags(true);

        const response = await fetch(
          "https://whatsapi.trpgps.com/api/tags",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "ngrok-skip-browser-warning": "1",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch tags: ${response.status}`
          );
        }

        const data = await response.json();

        console.log("Tags API response:", data);

        setAllTags(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Unable to load tags:", error);
        setAllTags([]);
      } finally {
        setLoadingTags(false);
      }
    };

    fetchTags();
  }, []);

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
            Section 2: Customer Information
          </div>
        </div>

        {/* Customer */}
        <div className="flex items-center gap-3 pb-2 border-b border-default-200">
          <Avatar className="h-10 w-10 shrink-0 bg-default-100 border border-default-200">
            {conversation.customerImage ? (
              <AvatarImage src={conversation.customerImage} />
            ) : (
              <AvatarFallback className="text-xs text-default-700">
                {customerInitials || "AB"}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="min-w-0">
            <div className="text-sm font-semibold text-default-800 truncate">
              {customerInfo.customerName}
            </div>

            <div className="text-[11px] text-default-500 truncate">
              Since {customerInfo.customerSince}
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {/* Name */}
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Name
            </span>

            <span className="text-sm font-medium text-default-800 truncate">
              {customerInfo.customerName}
            </span>
          </div>

          {/* WhatsApp */}
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              WhatsApp
            </span>

            <span className="text-sm font-medium truncate text-blue-600">
              {customerInfo.whatsappName}
            </span>
          </div>

          {/* Phone */}
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Phone
            </span>

            <span className="text-sm font-medium text-default-800 truncate">
              {customerInfo.phone}
            </span>
          </div>

          {/* Email */}
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Email
            </span>

            <span className="text-sm font-medium text-default-800 truncate">
              {customerInfo.email}
            </span>
          </div>

          {/* Tags */}
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
                    key={tag.id}
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

          {/* Customer Since */}
          <div className="flex items-baseline gap-2 min-w-0 col-span-2">
            <span className="text-xs text-default-500 shrink-0 whitespace-nowrap w-28">
              Customer Since
            </span>

            <span className="text-sm font-medium text-default-800 truncate">
              {customerInfo.customerSince}
            </span>
          </div>
        </div>

        {/* Buttons */}
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
              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
              onClick={() => {
                setContactLoading(true);

                fetch("https://whatsapi.trpgps.com/allcontactentity", {
                  method: "GET",
                  headers: {
                    Accept: "application/json",
                    "ngrok-skip-browser-warning": "1",
                  },
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Failed to fetch contacts");
                    }
                    return response.json();
                  })
                  .then((data: any) => {
                    console.log("Contacts:", data);
                    // Ensure data is an array
                    const contactsArray = Array.isArray(data) ? data : [];
                    setContacts(contactsArray);
                    setContactDialogOpen(true);
                  })
                  .catch((error) => {
                    console.error(error);
                    alert("Unable to load contacts.");
                  })
                  .finally(() => {
                    setContactLoading(false);
                  });
              }}
            >
              <Eye className="w-3.5 h-3.5 me-1.5" />
              View Contact
            </Button>

            <Dialog
              open={contactDialogOpen}
              onOpenChange={setContactDialogOpen}
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
                          <th className="p-2 text-left">ID</th>
                          <th className="p-2 text-left">Tenant ID</th>
                          <th className="p-2 text-left">WhatsApp Phone ID</th>
                          <th className="p-2 text-left">Phone Number</th>
                          <th className="p-2 text-left">Profile Name</th>
                          <th className="p-2 text-left">Custom Name</th>
                          <th className="p-2 text-left">Email</th>
                          <th className="p-2 text-left">Created At</th>
                          <th className="p-2 text-left">Updated At</th>
                          <th className="p-2 text-left">Payload</th>
                        </tr>
                      </thead>

                      <tbody>
                        {contacts.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="p-6 text-center">
                              No contacts found.
                            </td>
                          </tr>
                        ) : (
                          contacts.map((contact) => (
                            <tr
                              key={contact.id}
                              className="border-b hover:bg-muted/50"
                            >
                              <td className="p-2">{contact.id || "-"}</td>
                              <td className="p-2">{contact.tenantid || "-"}</td>
                              <td className="p-2">{contact.whatsappphonenumberid || "-"}</td>
                              <td className="p-2">{contact.phonenumber || "-"}</td>
                              <td className="p-2">{contact.whatsappprofilename || "-"}</td>
                              <td className="p-2">{contact.customname || "-"}</td>
                              <td className="p-2">{contact.email || "-"}</td>
                              <td className="p-2 whitespace-nowrap">{contact.createdat || "-"}</td>
                              <td className="p-2 whitespace-nowrap">{contact.updatedat || "-"}</td>
                              <td className="p-2 max-w-[300px]">
                                <pre className="max-h-24 overflow-auto whitespace-pre-wrap break-all text-xs">
                                  {typeof contact.payload === "object"
                                    ? JSON.stringify(contact.payload, null, 2)
                                    : contact.payload || "-"}
                                </pre>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
