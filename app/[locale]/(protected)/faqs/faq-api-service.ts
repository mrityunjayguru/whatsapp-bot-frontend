import { FAQDataProps } from "./faqs-table/data";

const FAQ_API_BASE = "https://whatsapi.trpgps.com/faq";

export interface FAQSource {
  id: string;
  name: string;
  type: string;
  source_url?: string | null;
  added_at?: string | null;
}

export function mapSourceToFaqRow(s: FAQSource): FAQDataProps {
  return {
    id: s.id,
    faqId: s.id,
    question: s.name,
    category: "General",
    keywords: [],
    answerPreview: s.name || "",
    fullAnswer: s.name || "",
    attachment: s.type === "document" ? s.source_url ?? null : null,
    url: s.type === "url" || s.type === "video" ? s.source_url ?? "" : "",
    matchType: "AI Semantic",
    priority: "Medium",
    status: "Active",
    createdBy: {
      name: "—",
      avatar: "",
    },
    createdAt: s.added_at ? s.added_at.split("T")[0] : "",
    updatedAt: s.added_at ? s.added_at.split("T")[0] : "",
  };
}

export async function listFaqSources(): Promise<FAQSource[]> {
  const res = await fetch(`${FAQ_API_BASE}/sources`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch FAQ sources: ${res.status}`);
  return res.json();
}

export async function uploadFaqDocument(file: File, sendAsLink = true) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("send_as_link", String(sendAsLink));
  const res = await fetch(`${FAQ_API_BASE}/upload/document`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res.json();
}

export async function uploadFaqUrl(url: string, name?: string) {
  const res = await fetch(`${FAQ_API_BASE}/upload/url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, name }),
  });
  if (!res.ok) throw new Error(`URL ingest failed: ${res.status}`);
  return res.json();
}

export async function uploadFaqVideo(url: string, name?: string) {
  const res = await fetch(`${FAQ_API_BASE}/upload/video`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, name }),
  });
  if (!res.ok) throw new Error(`Video ingest failed: ${res.status}`);
  return res.json();
}

export async function uploadFaqText(
  text: string,
  name: string,
  sourceUrl?: string,
  sendAsLink?: boolean
) {
  const res = await fetch(`${FAQ_API_BASE}/upload/text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, name, source_url: sourceUrl, send_as_link: sendAsLink }),
  });
  if (!res.ok) throw new Error(`Text ingest failed: ${res.status}`);
  return res.json();
}

export async function deleteFaqSource(sourceId: string) {
  const res = await fetch(`${FAQ_API_BASE}/sources/${sourceId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  return res.json();
}

export async function searchFaq(query: string, topK = 3) {
  const res = await fetch(`${FAQ_API_BASE}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, top_k: topK }),
  });
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json();
}

export async function attachFaqFile(file: File): Promise<{ id: string; url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`https://whatsapi.trpgps.com/faq/files/attach`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(`File attach failed: ${res.status}`);
  return res.json();
}
