
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apisericecon() {
  try {
    const response = await fetch(API_BASE_URL+"/api/conversation", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "1",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Conversation API error ${response.status}`
      );
    }

    const data = await response.json();

    console.log("Conversation API Data:", data);

    return data;

  } catch (error) {
    console.error("API Service Error:", error);
    throw error;
  }
}
