import type { DataProps } from "./columns";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const avatars = [
  "/images/avatar/avatar-1.png",
  "/images/avatar/avatar-2.png",
  "/images/avatar/avatar-3.png",
  "/images/avatar/avatar-4.png",
  "/images/avatar/avatar-5.png",
];

/* =====================================================
   API CONTACT TYPE
===================================================== */

interface ApiContact {
  id?: string | number | null;
  tenantid?: string | number | null;

  profilename?: string | null;
  customname?: string | null;

  whatsappprofilename?: string | null;
  whatsappphonenumberid?: string | number | null;

  phonenumber?: string | number | null;
  email?: string | null;

  tags?: unknown;

  totalconversations?: string | number | null;
  lastconversation?: string | null;
  createdat?: string | null;
}

/* =====================================================
   CONVERT API CONTACT -> DataProps
===================================================== */

function mapContact(
  contact: ApiContact,
  index: number
): DataProps {
  const customerName =
    String(
      contact.profilename ??
        contact.customname ??
        ""
    );

  const tags: string[] =
    Array.isArray(contact.tags)
      ? contact.tags.filter(
          (tag): tag is string =>
            typeof tag === "string"
        )
      : [];

  return {
    /*
     * DataProps.id
     */
    id:
      contact.id != null
        ? String(contact.id)
        : `contact-${index}`,

    /*
     * DataProps.contactId
     */
    contactId:
      contact.tenantid != null
        ? String(contact.tenantid)
        : `CUS-${String(
            1000 + index
          ).padStart(4, "0")}`,

    /*
     * DataProps.customname
     */
    customname: customerName,

    /*
     * DataProps.customerName
     *
     * This was missing in your old code.
     */
    customerName: customerName,

    /*
     * DataProps.customerImage
     */
    customerImage:
      avatars.length > 0
        ? avatars[index % avatars.length]
        : "",

    /*
     * DataProps.whatsappName
     */
    whatsappName:
      String(
        contact.whatsappprofilename ?? ""
      ),

    /*
     * DataProps.mobile
     */
    mobile:
      String(
        contact.phonenumber ?? ""
      ),

    /*
     * DataProps.email
     */
    email:
      String(
        contact.email ?? ""
      ),

    /*
     * DataProps.tags
     */
    tags,

    /*
     * DataProps.totalConversations
     */
    totalConversations:
      Number(
        contact.totalconversations ?? 0
      ) || 0,

    /*
     * DataProps.whatsappphonenumberid
     *
     * This was also missing in your old code.
     */
    whatsappphonenumberid:
      Number(
        contact.whatsappphonenumberid ?? 0
      ) || 0,

    /*
     * DataProps.lastConversation
     */
    lastConversation:
      String(
        contact.lastconversation ?? ""
      ),

    /*
     * DataProps.createdAt
     */
    createdAt:
      String(
        contact.createdat ?? ""
      ),

    /*
     * DataProps.action
     */
    action: null,
  };
}

/* =====================================================
   GET ALL CONTACTS
===================================================== */

export async function getContacts(): Promise<
  DataProps[]
> {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not defined"
    );
  }

  try {
    const response = await fetch(
      `${API_URL}/allcontactentity`,
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
        `Failed to fetch contacts: ${response.status}`
      );
    }

    const result =
      await response.json();

    console.log(
      "Raw contacts API response:",
      result
    );

    /*
     * Your API appears to return an array.
     *
     * But this also supports:
     *
     * {
     *   data: [...]
     * }
     *
     * and:
     *
     * {
     *   contacts: [...]
     * }
     */

    let contacts: ApiContact[] = [];

    if (Array.isArray(result)) {
      contacts = result;
    } else if (
      Array.isArray(result?.data)
    ) {
      contacts = result.data;
    } else if (
      Array.isArray(result?.contacts)
    ) {
      contacts = result.contacts;
    }

    console.log(
      "Contacts array:",
      contacts
    );

    /*
     * ALWAYS return an array.
     *
     * Never return undefined.
     */
    const formattedData =
      contacts.map(
        mapContact
      );

    console.log(
      "Formatted contact data:",
      formattedData
    );

    return formattedData;
  } catch (error) {
    console.error(
      "Failed to load contacts:",
      error
    );

    throw error;
  }
}

/* =====================================================
   GET CONTACT BY ID
===================================================== */

export async function getContactById(
  id: string | number
): Promise<
  DataProps | undefined
> {
  const contacts =
    await getContacts();

  return contacts.find(
    (contact) =>
      String(contact.id) ===
      String(id)
  );
}
