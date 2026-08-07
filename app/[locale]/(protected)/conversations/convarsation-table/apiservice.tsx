// const API_URL =
//   "https://familiar-underwent-riddance.ngrok-free.dev/api/conversation";

const API_URL = "https://whatsapi.trpgps.com/api/conversation";

export async function apisericecon() {
  try {

    console.log(" From API");
    console.log(" From API");
    console.log(" From API");
    console.log(" From API");
    console.log(" From API");
    

    const response = await fetch(API_URL, {
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
