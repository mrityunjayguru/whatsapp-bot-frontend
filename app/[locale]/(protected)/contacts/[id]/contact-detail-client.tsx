"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "@/components/navigation";
import { DataProps } from "../contacts-table/columns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

import {
  ArrowLeft,
  Mail,
  Phone,
  UserCircle2,
  X,
  Plus,
} from "lucide-react";

import { Section1ContactInfo } from "./__components/section-1-contact-info";
import { Section4ContactStatistics } from "./__components/section-4-contact-statistics";
import { Section2ConversationHistory } from "./__components/section-2-conversation-history";
import { Section3ActivityTimeline } from "./__components/section-3-activity-timeline";
import { Section4FilesShared } from "./__components/section-4-files-shared";
import { Section5Tags } from "./__components/section-5-tags";
import { FilePreviewDialog } from "./__components/file-preview-dialog";

import {
  sharedFiles,
  SharedFile,
} from "./__components/files-shared-data";

/* =========================================================
   API
========================================================= */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/* =========================================================
   TAG COLORS
========================================================= */

const tagColors: Record<string, string> = {
  VIP: "bg-amber-500/15 text-amber-600",
  Priority: "bg-red-500/15 text-red-600",
  Support: "bg-blue-500/15 text-blue-600",
  Sales: "bg-emerald-500/15 text-emerald-600",
  New: "bg-purple-500/15 text-purple-600",
  Returning: "bg-cyan-500/15 text-cyan-600",
  Billing: "bg-orange-500/15 text-orange-600",
  Technical: "bg-indigo-500/15 text-indigo-600",
  Onboarding: "bg-pink-500/15 text-pink-600",
  Feedback: "bg-teal-500/15 text-teal-600",
};

/* =========================================================
   AVAILABLE TAGS FOR ADD TAG DIALOG
========================================================= */

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
   NORMALIZE ONE TAG
========================================================= */

function normalizeSingleTag(
  value: unknown
): string | null {
  if (typeof value === "string") {
    const result = value.trim();

    return result.length > 0
      ? result
      : null;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (
    typeof value === "object" &&
    value !== null
  ) {
    const object =
      value as Record<string, unknown>;

    const possibleName =
      object.name ??
      object.tagName ??
      object.tag_name ??
      object.label ??
      object.title ??
      object.value;

    if (
      typeof possibleName ===
      "string"
    ) {
      const result =
        possibleName.trim();

      return result.length > 0
        ? result
        : null;
    }
  }

  return null;
}

/* =========================================================
   NORMALIZE CONTACT TAGS
========================================================= */

function normalizeTags(
  value: unknown
): string[] {
  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  ) {
    const object =
      value as Record<string, unknown>;

    if (
      Array.isArray(
        object.tags
      )
    ) {
      return normalizeTags(
        object.tags
      );
    }

    const single =
      normalizeSingleTag(
        object
      );

    return single
      ? [single]
      : [];
  }

  if (Array.isArray(value)) {
    const result: string[] =
      [];

    for (
      const item of value
    ) {
      if (
        Array.isArray(item)
      ) {
        result.push(
          ...normalizeTags(item)
        );

        continue;
      }

      if (
        typeof item ===
          "object" &&
        item !== null
      ) {
        const object =
          item as Record<
            string,
            unknown
          >;

        if (
          Array.isArray(
            object.tags
          )
        ) {
          result.push(
            ...normalizeTags(
              object.tags
            )
          );

          continue;
        }
      }

      const tag =
        normalizeSingleTag(
          item
        );

      if (tag) {
        result.push(tag);
      }
    }

    return Array.from(
      new Set(result)
    );
  }

  const single =
    normalizeSingleTag(value);

  return single
    ? [single]
    : [];
}

/* =========================================================
   EXTRACT ALL TAG NAMES FROM GET /api/tags
========================================================= */

/*
 * This handles API responses such as:
 *
 * [
 *   { id: 1, name: "VIP" },
 *   { id: 2, name: "Sales" }
 * ]
 *
 * OR
 *
 * {
 *   data: [
 *     { id: 1, name: "VIP" }
 *   ]
 * }
 *
 * OR
 *
 * {
 *   tags: [
 *     { name: "VIP" }
 *   ]
 * }
 *
 * OR
 *
 * {
 *   results: [
 *     { name: "VIP" }
 *   ]
 * }
 *
 * OR
 *
 * [
 *   "VIP",
 *   "Sales"
 * ]
 */

function extractTagNames(
  value: unknown
): string[] {
  const result: string[] = [];

  const addTag = (
    item: unknown
  ) => {
    const tag =
      normalizeSingleTag(item);

    if (tag) {
      result.push(tag);
    }
  };

  const walk = (
    current: unknown
  ) => {
    if (
      Array.isArray(current)
    ) {
      current.forEach(
        (item) => {
          walk(item);
        }
      );

      return;
    }

    if (
      typeof current ===
        "object" &&
      current !== null
    ) {
      const object =
        current as Record<
          string,
          unknown
        >;

      /*
       * API:
       * { data: [...] }
       */
      if (
        Array.isArray(
          object.data
        )
      ) {
        walk(object.data);
        return;
      }

      /*
       * API:
       * { tags: [...] }
       */
      if (
        Array.isArray(
          object.tags
        )
      ) {
        walk(object.tags);
        return;
      }

      /*
       * API:
       * { results: [...] }
       */
      if (
        Array.isArray(
          object.results
        )
      ) {
        walk(object.results);
        return;
      }

      /*
       * API:
       * { items: [...] }
       */
      if (
        Array.isArray(
          object.items
        )
      ) {
        walk(object.items);
        return;
      }

      /*
       * API:
       * { content: [...] }
       */
      if (
        Array.isArray(
          object.content
        )
      ) {
        walk(object.content);
        return;
      }

      /*
       * Single object:
       * { id: 1, name: "VIP" }
       */
      addTag(current);

      return;
    }

    /*
     * String:
     * "VIP"
     */
    addTag(current);
  };

  walk(value);

  return Array.from(
    new Set(
      result
        .map(
          (tag) =>
            tag.trim()
        )
        .filter(Boolean)
    )
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export function ContactDetailClient({
  contact,
}: {
  contact: DataProps;
}) {
  /* =======================================================
     CONTACT DATA
  ======================================================= */

  const contactData =
    typeof contact === "string"
      ? JSON.parse(contact)
      : contact;

  /* =======================================================
     INITIAL CONTACT TAGS
  ======================================================= */

  const initialTags =
    normalizeTags(
      contactData?.tags
    );

  /* =======================================================
     CUSTOMER INFO
  ======================================================= */

  const [
    customerInfo,
    setCustomerInfo,
  ] = useState({
    customname:
      contactData?.customerName ||
      contactData?.customname ||
      "Unknown Customer",

    whatsappName:
      contactData?.whatsappName ||
      "",

    phone:
      contactData?.mobile ||
      "",

    email:
      contactData?.email ||
      "",

    tags: [
      ...initialTags,
    ],

    customerSince:
      contactData?.createdAt ||
      "",

    whatsappphonenumberid:
      contactData
        ?.whatsappphonenumberid !=
      null
        ? String(
            contactData.whatsappphonenumberid
          )
        : "",
  });

  /* =======================================================
     EDIT CONTACT DIALOG
  ======================================================= */

  const [
    editContactOpen,
    setEditContactOpen,
  ] = useState(false);

  /* =======================================================
     ADD TAG DIALOG
  ======================================================= */

  const [
    addTagOpen,
    setAddTagOpen,
  ] = useState(false);

  /* =======================================================
     REMOVE TAG DIALOG
  ======================================================= */

  const [
    deleteTagOpen,
    setDeleteTagOpen,
  ] = useState(false);

  /* =======================================================
     ALL TAGS FROM API
  ======================================================= */

  const [
    allTags,
    setAllTags,
  ] = useState<string[]>([]);

  /* =======================================================
     LOADING TAGS
  ======================================================= */

  const [
    loadingTags,
    setLoadingTags,
  ] = useState(false);

  /* =======================================================
     TAG API ERROR
  ======================================================= */

  const [
    tagFetchError,
    setTagFetchError,
  ] = useState<
    string | null
  >(null);

  /* =======================================================
     SELECTED DELETE TAGS
  ======================================================= */

  const [
    selectedDeleteTags,
    setSelectedDeleteTags,
  ] = useState<string[]>(
    []
  );

  /* =======================================================
     ADD TAGS
  ======================================================= */

  const [
    selectedTags,
    setSelectedTags,
  ] = useState<string[]>(
    [...initialTags]
  );

  const [
    newTagInput,
    setNewTagInput,
  ] = useState("");

  /* =======================================================
     FILE PREVIEW
  ======================================================= */

  const [
    previewOpen,
    setPreviewOpen,
  ] = useState(false);

  const [
    previewFile,
    setPreviewFile,
  ] = useState<SharedFile | null>(
    null
  );

  /* =======================================================
     EDIT FORM
  ======================================================= */

  const [
    editForm,
    setEditForm,
  ] = useState({
    customname:
      contactData?.customerName ||
      contactData?.customname ||
      "Unknown Customer",

    whatsappName:
      contactData?.whatsappName ||
      "",

    phone:
      contactData?.mobile ||
      "",

    email:
      contactData?.email ||
      "",

    tags: [
      ...initialTags,
    ],

    customerSince:
      contactData?.createdAt ||
      "",

    whatsappphonenumberid:
      contactData
        ?.whatsappphonenumberid !=
      null
        ? String(
            contactData.whatsappphonenumberid
          )
        : "",
  });

  /* =======================================================
     CUSTOMER INITIALS
  ======================================================= */

  const customerInitials =
    customerInfo.customname
      .split(" ")
      .filter(Boolean)
      .map(
        (name) => name[0]
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();

  /* =======================================================
     OPEN FILE PREVIEW
  ======================================================= */

  const openPreview = (
    file: SharedFile
  ) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  /* =======================================================
     OPEN EDIT CONTACT
  ======================================================= */

  const openEditContact =
    () => {
      setEditForm({
        ...customerInfo,

        tags: [
          ...customerInfo.tags,
        ],
      });

      setEditContactOpen(
        true
      );
    };

  /* =======================================================
     SAVE EDIT CONTACT
  ======================================================= */

  const saveEditContact =
    async () => {
      try {
        const response =
          await fetch(
            `${API_BASE_URL}/allcontactentity/byphonenumber/${encodeURIComponent(
              editForm.phone
            )}`,
            {
              method: "GET",

              headers: {
                Accept:
                  "application/json",

                "ngrok-skip-browser-warning":
                  "1",
              },
            }
          );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch contact: ${response.status}`
          );
        }

        const data =
          await response.json();

        data.customname =
          editForm.customname;

        data.email =
          editForm.email;

        data.whatsappName =
          editForm.whatsappName;

        data.mobile =
          editForm.phone;

        data.whatsappphonenumberid =
          editForm.whatsappphonenumberid;

        data.createdAt =
          editForm.customerSince;

        const updateResponse =
          await fetch(
            `${API_BASE_URL}/allcontactentity/update`,
            {
              method: "POST",

              headers: {
                Accept:
                  "application/json",

                "Content-Type":
                  "application/json",

                "ngrok-skip-browser-warning":
                  "1",
              },

              body: JSON.stringify(
                data
              ),
            }
          );

        if (!updateResponse.ok) {
          throw new Error(
            `Update failed: ${updateResponse.status}`
          );
        }

        setCustomerInfo({
          ...editForm,

          tags: normalizeTags(
            editForm.tags
          ),
        });

        setEditContactOpen(
          false
        );

        alert(
          "Contact updated successfully."
        );
      } catch (error) {
        console.error(
          "Error updating contact:",
          error
        );

        alert(
          "Error updating contact."
        );
      }
    };

  /* =======================================================
     OPEN ADD TAG
  ======================================================= */

  const openAddTag = () => {
    setSelectedTags([
      ...customerInfo.tags,
    ]);

    setNewTagInput("");

    setAddTagOpen(true);
  };

  /* =======================================================
     TOGGLE ADD TAG
  ======================================================= */

  const toggleTag = (
    tag: string
  ) => {
    setSelectedTags(
      (previous) => {
        if (
          previous.includes(tag)
        ) {
          return previous.filter(
            (item) =>
              item !== tag
          );
        }

        return [
          ...previous,
          tag,
        ];
      }
    );
  };

  /* =======================================================
     ADD CUSTOM TAG
  ======================================================= */

  const addCustomTag = () => {
    const tag =
      newTagInput.trim();

    if (!tag) {
      return;
    }

    const exists =
      selectedTags.some(
        (item) =>
          item.toLowerCase() ===
          tag.toLowerCase()
      );

    if (exists) {
      alert(
        "Tag already selected."
      );

      return;
    }

    setSelectedTags(
      (previous) => [
        ...previous,
        tag,
      ]
    );

    setNewTagInput("");
  };

  /* =======================================================
     REMOVE TAG FROM ADD DIALOG
  ======================================================= */

  const removeTag = (
    tag: string
  ) => {
    setSelectedTags(
      (previous) =>
        previous.filter(
          (item) =>
            item !== tag
        )
    );
  };

  /* =======================================================
     SAVE TAGS
  ======================================================= */

  const saveTags = async () => {
    try {
      const currentTags =
        normalizeTags(
          customerInfo.tags
        );

      const normalizedSelected =
        normalizeTags(
          selectedTags
        );

      const newTags =
        normalizedSelected.filter(
          (tag) =>
            !currentTags.includes(
              tag
            )
        );

      if (
        newTags.length > 0
      ) {
        for (
          const tagName of newTags
        ) {
          const response =
            await fetch(
              `${API_BASE_URL}/api/tags`,
              {
                method: "POST",

                headers: {
                  Accept:
                    "application/json",

                  "Content-Type":
                    "application/json",

                  "ngrok-skip-browser-warning":
                    "1",
                },

                body: JSON.stringify({
                  name: tagName,
                }),
              }
            );

          const responseText =
            await response.text();

          console.log(
            "SAVE TAG RESPONSE:",
            {
              tagName,
              status:
                response.status,
              responseText,
            }
          );

          if (!response.ok) {
            throw new Error(
              `Failed to save tag: ${tagName}`
            );
          }
        }
      }

      setCustomerInfo(
        (previous) => ({
          ...previous,

          tags: [
            ...normalizedSelected,
          ],
        })
      );

      /*
       * Also update the all-tags list
       * so the remove dialog immediately
       * contains newly created tags.
       */
      setAllTags(
        (previous) =>
          Array.from(
            new Set([
              ...previous,
              ...normalizedSelected,
            ])
          )
      );

      setAddTagOpen(false);

      alert(
        "Tags saved successfully."
      );
    } catch (error) {
      console.error(
        "Error saving tags:",
        error
      );

      alert(
        "Error saving tags."
      );
    }
  };

  /* =======================================================
     GET ALL TAGS FROM API
  ======================================================= */

  const fetchAllTags =
    async () => {
      console.log(
        "================================="
      );

      console.log(
        "FETCHING ALL TAGS"
      );

      console.log(
        "URL:",
        `${API_BASE_URL}/api/tags`
      );

      console.log(
        "================================="
      );

      setLoadingTags(true);
      setTagFetchError(null);

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/api/tags`,
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

        console.log(
          "GET /api/tags STATUS:",
          response.status
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch tags. Status: ${response.status}`
          );
        }

        const responseData =
          await response.json();

        console.log(
          "RAW /api/tags RESPONSE:",
          responseData
        );

        const tagNames =
          extractTagNames(
            responseData
          );

        console.log(
          "EXTRACTED TAG NAMES:",
          tagNames
        );

        setAllTags(
          tagNames
        );

        return tagNames;
      } catch (error) {
        console.error(
          "GET TAGS ERROR:",
          error
        );

        setAllTags([]);

        const message =
          error instanceof Error
            ? error.message
            : "Failed to load tags.";

        setTagFetchError(
          message
        );

        return [];
      } finally {
        setLoadingTags(false);
      }
    };

  /* =======================================================
     OPEN REMOVE TAG DIALOG
  ======================================================= */

  const openDeleteTag =
    async () => {
      console.log(
        "================================="
      );

      console.log(
        "REMOVE TAG BUTTON CLICKED"
      );

      console.log(
        "================================="
      );

      /*
       * Clear previous selections.
       */
      setSelectedDeleteTags([]);

      /*
       * Open dialog immediately.
       */
      setDeleteTagOpen(true);

      /*
       * Get ALL tags from API.
       */
      await fetchAllTags();
    };

  /* =======================================================
     TOGGLE DELETE TAG
  ======================================================= */

  const toggleDeleteTag = (
    tag: string
  ) => {
    setSelectedDeleteTags(
      (previous) => {
        if (
          previous.includes(tag)
        ) {
          return previous.filter(
            (item) =>
              item !== tag
          );
        }

        return [
          ...previous,
          tag,
        ];
      }
    );
  };

  /* =======================================================
     DELETE SELECTED TAGS
  ======================================================= */

  const removeTags =
    async () => {
      const tagsToDelete =
        normalizeTags(
          selectedDeleteTags
        );

      console.log(
        "================================="
      );

      console.log(
        "TAGS SELECTED FOR DELETE:",
        tagsToDelete
      );

      console.log(
        "================================="
      );

      if (
        tagsToDelete.length ===
        0
      ) {
        alert(
          "Please select at least one tag."
        );

        return;
      }

      try {
        /*
         * Delete each selected tag.
         */
        for (
          const tagName of tagsToDelete
        ) {
          console.log(
            "Deleting tag:",
            tagName
          );

          const response =
            await fetch(
              `${API_BASE_URL}/api/tags/deletemultiple`,
              {
                method: "POST",

                headers: {
                  Accept:
                    "application/json",

                  "Content-Type":
                    "application/json",

                  "ngrok-skip-browser-warning":
                    "1",
                },

                body: JSON.stringify({
                  tagIds: [tagName],
                  }),
              }
            );

          const responseText =
            await response.text();

          console.log(
            "DELETE RESPONSE:",
            {
              tagName,
              status:
                response.status,
              responseText,
            }
          );

          if (!response.ok) {
            throw new Error(
              `Failed to delete tag "${tagName}". Status: ${response.status}`
            );
          }
        }

        /*
         * Remove deleted tags from
         * the API tag list.
         */
        setAllTags(
          (previous) =>
            previous.filter(
              (tag) =>
                !tagsToDelete.includes(
                  tag
                )
            )
        );

        /*
         * Remove deleted tags from
         * current contact UI.
         */
        setCustomerInfo(
          (previous) => ({
            ...previous,

            tags:
              previous.tags.filter(
                (tag) =>
                  !tagsToDelete.includes(
                    tag
                  )
              ),
          })
        );

        /*
         * Clear selection.
         */
        setSelectedDeleteTags(
          []
        );

        /*
         * Close dialog.
         */
        setDeleteTagOpen(
          false
        );

        alert(
          "Tag(s) deleted successfully."
        );
      } catch (error) {
        console.error(
          "Error deleting tags:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Error deleting tags."
        );
      }
    };

  /* =======================================================
     REMOVE TAG FROM CONTACT SECTION
  ======================================================= */

  const removeTagFromContact =
    (tag: string) => {
      setCustomerInfo(
        (previous) => ({
          ...previous,

          tags:
            previous.tags.filter(
              (item) =>
                item !== tag
            ),
        })
      );
    };

  /* =======================================================
     DISPLAY CONTACT
  ======================================================= */

  const displayContact = {
    ...contact,

    customname:
      customerInfo.customname,

    whatsappName:
      customerInfo.whatsappName,

    mobile:
      customerInfo.phone,

    email:
      customerInfo.email,

    tags:
      customerInfo.tags,

    createdAt:
      customerInfo.customerSince,
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-4">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-3">

        <div className="flex items-center gap-2">

          <Link href="/contacts">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9"
            >
              <ArrowLeft className="w-4 h-4 me-1.5" />
              Back
            </Button>
          </Link>

          <div className="text-xs text-default-500">
            Contact ID #{" "}
            <span className="font-semibold text-default-700">
              {contact.contactId}
            </span>
          </div>

        </div>

        <div className="flex flex-wrap items-center gap-2">

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9"
          >
            <Mail className="w-4 h-4 me-1.5" />
            Email Contact
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9"
          >
            <Phone className="w-4 h-4 me-1.5" />
            Call Contact
          </Button>

          <Button
            type="button"
            color="primary"
            size="sm"
            className="h-9"
            onClick={
              openEditContact
            }
          >
            <UserCircle2 className="w-4 h-4 me-1.5" />
            Edit Contact
          </Button>

        </div>

      </div>

      {/* ===================================================
          CONTACT SECTIONS
      =================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">

        <Section1ContactInfo
          contact={
            displayContact
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
          openDeleteTag={
            openDeleteTag
          }
        />

        <Section3ActivityTimeline />

      </div>

      <Section4ContactStatistics
        contact={
          displayContact
        }
      />

      <Section2ConversationHistory />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">

        <Section4FilesShared
          sharedFiles={
            sharedFiles
          }
          openPreview={
            openPreview
          }
        />

        <Section5Tags
          tags={
            customerInfo.tags
          }
          tagColors={
            tagColors
          }
          onAddTag={
            openAddTag
          }
          onRemoveTag={
            removeTagFromContact
          }
        />

      </div>

      {/* ===================================================
          FILE PREVIEW DIALOG
      =================================================== */}

      <FilePreviewDialog
        open={
          previewOpen
        }
        onOpenChange={
          setPreviewOpen
        }
        file={
          previewFile
        }
      />

      {/* ===================================================
          EDIT CONTACT DIALOG
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

            {/* CUSTOMER NAME */}

            <div className="space-y-2">
              <Label>
                Customer Name
              </Label>

              <Input
                value={
                  editForm.customname
                }
                onChange={(event) =>
                  setEditForm(
                    (previous) => ({
                      ...previous,

                      customname:
                        event.target
                          .value,
                    })
                  )
                }
              />
            </div>

            {/* WHATSAPP NAME */}

            <div className="space-y-2">
              <Label>
                WhatsApp Profile Name
              </Label>

              <Input
                value={
                  editForm.whatsappName
                }
                onChange={(event) =>
                  setEditForm(
                    (previous) => ({
                      ...previous,

                      whatsappName:
                        event.target
                          .value,
                    })
                  )
                }
              />
            </div>

            {/* PHONE */}

            <div className="space-y-2">
              <Label>
                Phone Number
              </Label>

              <Input
                value={
                  editForm.phone
                }
                onChange={(event) =>
                  setEditForm(
                    (previous) => ({
                      ...previous,

                      phone:
                        event.target
                          .value,
                    })
                  )
                }
              />
            </div>

            {/* EMAIL */}

            <div className="space-y-2">
              <Label>
                Email
              </Label>

              <Input
                type="email"
                value={
                  editForm.email
                }
                onChange={(event) =>
                  setEditForm(
                    (previous) => ({
                      ...previous,

                      email:
                        event.target
                          .value,
                    })
                  )
                }
              />
            </div>

            {/* WHATSAPP PHONE NUMBER ID */}

            <div className="space-y-2">
              <Label>
                WhatsApp phonenumberid
              </Label>

              <Input
                value={
                  editForm.whatsappphonenumberid
                }
                onChange={(event) =>
                  setEditForm(
                    (previous) => ({
                      ...previous,

                      whatsappphonenumberid:
                        event.target
                          .value,
                    })
                  )
                }
              />
            </div>

            {/* CUSTOMER SINCE */}

            <div className="space-y-2">
              <Label>
                Customer Since
              </Label>

              <Input
                value={
                  editForm.customerSince
                }
                onChange={(event) =>
                  setEditForm(
                    (previous) => ({
                      ...previous,

                      customerSince:
                        event.target
                          .value,
                    })
                  )
                }
              />
            </div>

          </div>

          <DialogFooter>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setEditContactOpen(
                  false
                )
              }
            >
              Cancel
            </Button>

            <Button
              type="button"
              color="primary"
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
          ADD TAG DIALOG
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
              Add Tags
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">

            {/* SELECTED TAGS */}

            <div className="space-y-2">

              <Label>
                Selected Tags
              </Label>

              <div className="min-h-[40px] p-2 border border-default-200 rounded-md">

                {selectedTags.length ===
                0 ? (

                  <span className="text-xs text-default-400">
                    No tags selected
                  </span>

                ) : (

                  <div className="flex flex-wrap gap-2">

                    {selectedTags.map(
                      (tag) => (
                        <Badge
                          key={tag}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full",

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
                          >
                            <X className="w-3 h-3" />
                          </button>

                        </Badge>
                      )
                    )}

                  </div>
                )}

              </div>

            </div>

            {/* AVAILABLE TAGS */}

            <div className="space-y-2">

              <Label>
                Available Tags
              </Label>

              <div className="flex flex-wrap gap-2">

                {availableTags.map(
                  (tag) => {

                    const selected =
                      selectedTags.includes(
                        tag
                      );

                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          toggleTag(
                            tag
                          )
                        }
                        className={cn(
                          "rounded-full px-3 py-1 text-xs border",

                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-background border-default-200"
                        )}
                      >
                        {selected
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

              <Label>
                Add Custom Tag
              </Label>

              <div className="flex gap-2">

                <Input
                  value={
                    newTagInput
                  }
                  placeholder="Enter tag name..."
                  onChange={(event) =>
                    setNewTagInput(
                      event.target
                        .value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      event.preventDefault();

                      addCustomTag();
                    }
                  }}
                />

                <Button
                  type="button"
                  variant="outline"
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

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setAddTagOpen(
                  false
                )
              }
            >
              Cancel
            </Button>

            <Button
              type="button"
              color="primary"
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
          REMOVE TAG DIALOG
          
          IMPORTANT:
          
          This dialog gets its list from:
          
          GET /api/tags
          
          NOT from customerInfo.tags.
      =================================================== */}

      <Dialog
        open={
          deleteTagOpen
        }
        onOpenChange={(open) => {

          setDeleteTagOpen(
            open
          );

          if (!open) {
            setSelectedDeleteTags(
              []
            );

            setTagFetchError(
              null
            );
          }

        }}
      >

        <DialogContent
          size="sm"
          className="z-[9999]"
        >

          <DialogHeader>

            <DialogTitle>
              Remove Tags
            </DialogTitle>

          </DialogHeader>

          <div className="space-y-4 py-2">

            {/* =================================================
                ALL TAGS FROM API
            ================================================= */}

            <div className="space-y-2">

              <Label>
                Select Tags To Delete
              </Label>

              <div
                className="
                  w-full
                  min-h-[100px]
                  max-h-[250px]
                  overflow-y-auto
                  p-3
                  border
                  border-default-200
                  rounded-md
                  bg-background
                "
              >

                {/* LOADING */}

                {loadingTags ? (

                  <div className="flex items-center justify-center min-h-[70px]">

                    <span className="text-sm text-default-500">
                      Loading tags...
                    </span>

                  </div>

                ) : tagFetchError ? (

                  /* ERROR */

                  <div className="flex flex-col items-center justify-center min-h-[70px] gap-3">

                    <span className="text-sm text-red-500 text-center">
                      {tagFetchError}
                    </span>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={
                        fetchAllTags
                      }
                    >
                      Retry
                    </Button>

                  </div>

                ) : allTags.length ===
                  0 ? (

                  /* NO TAGS */

                  <div className="flex items-center justify-center min-h-[70px]">

                    <span className="text-sm text-default-400">
                      No tags found.
                    </span>

                  </div>

                ) : (

                  /* =================================================
                     ALL API TAG NAMES
                  ================================================= */

                  <div className="flex flex-wrap gap-2">

                    {allTags.map(
                      (
                        tag,
                        index
                      ) => {

                        const selected =
                          selectedDeleteTags.includes(
                            tag
                          );

                        return (

                          <button
                            key={`${tag}-${index}`}
                            type="button"
                            onClick={() =>
                              toggleDeleteTag(
                                tag
                              )
                            }
                            className={cn(
                              "inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium border cursor-pointer transition-all",

                              selected
                                ? "bg-red-500 text-white border-red-500"
                                : tagColors[
                                    tag
                                  ]
                                ? `${tagColors[tag]} border-transparent hover:opacity-80`
                                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                            )}
                          >

                            {selected && (
                              <span className="mr-1">
                                ✓
                              </span>
                            )}

                            <span>
                              {tag}
                            </span>

                          </button>

                        );
                      }
                    )}

                  </div>
                )}

              </div>

            </div>

            {/* =================================================
                SELECTED TAGS
            ================================================= */}

            <div className="space-y-2">

              <Label>
                Tags To Delete
              </Label>

              <div
                className="
                  w-full
                  min-h-[60px]
                  p-3
                  border
                  border-red-200
                  rounded-md
                  bg-red-50/30
                "
              >

                {selectedDeleteTags.length ===
                0 ? (

                  <span className="text-sm text-default-400">
                    Click a tag above to
                    select it.
                  </span>

                ) : (

                  <div className="flex flex-wrap gap-2">

                    {selectedDeleteTags.map(
                      (tag) => (

                        <Badge
                          key={tag}
                          className="
                            rounded-full
                            px-3
                            py-1
                            bg-red-500/15
                            text-red-600
                            inline-flex
                            items-center
                            gap-1
                          "
                        >

                          {tag}

                          <button
                            type="button"
                            onClick={() =>
                              toggleDeleteTag(
                                tag
                              )
                            }
                            className="ml-1 hover:opacity-70"
                            aria-label={`Remove ${tag} from selection`}
                          >
                            <X className="w-3 h-3" />
                          </button>

                        </Badge>

                      )
                    )}

                  </div>
                )}

              </div>

            </div>

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <DialogFooter>

            <Button
              type="button"
              variant="outline"
              onClick={() => {

                setSelectedDeleteTags(
                  []
                );

                setDeleteTagOpen(
                  false
                );

              }}
            >
              Cancel
            </Button>

            <Button
              type="button"
              color="destructive"
              disabled={
                loadingTags ||
                selectedDeleteTags.length ===
                  0
              }
              onClick={
                removeTags
              }
            >
              Delete Selected Tags
            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

    </div>
  );
}
