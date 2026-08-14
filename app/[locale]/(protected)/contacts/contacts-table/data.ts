import { DataProps } from "./columns";

const API_URL = "https://whatsapi.trpgps.com/allcontactentity";

const avatars = [
  "/images/avatar/avatar-1.png",
  "/images/avatar/avatar-2.png",
  "/images/avatar/avatar-3.png",
  "/images/avatar/avatar-4.png",
  "/images/avatar/avatar-5.png",
];

export const data: DataProps[] = [];

fetch(API_URL, {
  method: "GET",
  headers: {
    Accept: "application/json",
    "ngrok-skip-browser-warning": "1",
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new
       Error(
        `Failed to fetch contacts: ${response.status}`
      );
    }

    return response.json();
  })
  .then((contacts) => {
    if (!Array.isArray(contacts)) {
      throw new Error("API response is not an array");
    }

          console.log(" Contacts ");
          console.log( contacts);
          console.log(" Contacts ");



    contacts.forEach((contact: any, index: number) => {
      data.push({
        id: contact.id,

        contactId:
          contact.tenantid?.toString() ||
          `CUS-${String(1000 + index).padStart(4, "0")}`,

        customerName:
          contact.profilename ||
          contact.customname ||
          "",

        customerImage:
          avatars[index % avatars.length],

        whatsappName:
          contact.whatsappprofilename ||
          "",

        mobile:
          contact.phonenumber ||
          "",

        email:
          contact.email ||
          "",

        tags:
          Array.isArray(contact.tags)
            ? contact.tags
            : [],

        totalConversations:
          contact.totalconversations || 0,

        lastConversation:
          contact.lastconversation || "",

        createdAt:
          contact.createdat || "",

        action: null,
      });
    });

    console.log("Contact data:", data);
  })
  .catch((error) => {
    console.error("Failed to load contacts:", error);
  });

export const getContactById = (id: string | number) => {
  return data.find(
    (item) =>
      item.id.toString() === id.toString()
  );
};
