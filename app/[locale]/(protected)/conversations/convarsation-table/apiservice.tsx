const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export interface ApiConversationItem {
  id?: string | number;
  conversationNo?: string;
  profilename?: string;
  customerName?: string;
  customerImage?: string;
  phonenumber?: string;
  mobile?: string;
  title?: string;
  tags?: string[];
  assignedTo?: {
    name?: string;
    image?: string;
    [key: string]: any;
  };
  department?: string;
  status?: string;
  createdDate?: string;
  lastMessage?: string;
  lastActivity?: string;
  unread?: number;
  isChatbot?: boolean;
  customer?: {
    name?: string;
    image?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface ApiConversationResponse {
  body?: ApiConversationItem[];
  data?: ApiConversationItem[];
  [key: string]: any;
}

export async function apisericecon(): Promise<ApiConversationResponse | ApiConversationItem[]> {
  try {
    const endpoint = `${API_BASE_URL}/api/conversation/byuniquephonenumber`;
    console.log("Fetching conversation API from:", endpoint);

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "1",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Conversation API error ${response.status}: ${response.statusText}`);
    }

    const data: ApiConversationResponse | ApiConversationItem[] = await response.json();
    console.log("Conversation API Data:", data);

    return data;
  } catch (error) {
    console.error("API Service Error (apisericecon):", error);
    throw error;
  }
}

export const fetchConversations = apisericecon;
