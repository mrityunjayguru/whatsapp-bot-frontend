const FAQ_API_BASE = "https://whatsapi.trpgps.com/faq";

export async function listFaqSources() {
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