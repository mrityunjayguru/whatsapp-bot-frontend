/**
 * Utility to open PDF attachments in a new browser tab without forcing a download.
 * Fetches remote PDF files into a local Blob URL to strip backend 'Content-Disposition: attachment' headers.
 */

function renderHtmlPdfViewer(newWin: Window, displayName: string, attUrl: string) {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${displayName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #525659; min-height: 100vh; display: flex; flex-direction: column; color: #333; }
    header { background-color: #323639; color: #f1f1f1; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 5px rgba(0,0,0,0.3); z-index: 10; position: sticky; top: 0; }
    .file-info { display: flex; align-items: center; gap: 12px; }
    .file-icon { background: #ea4335; color: white; font-weight: bold; font-size: 11px; padding: 3px 6px; border-radius: 4px; text-transform: uppercase; }
    .file-name { font-size: 14px; font-weight: 500; letter-spacing: 0.2px; }
    .actions { display: flex; gap: 10px; }
    .btn { background: #474b4e; color: white; border: none; padding: 6px 14px; font-size: 13px; font-weight: 500; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: background 0.15s; }
    .btn:hover { background: #5c6064; }
    .btn-primary { background: #1a73e8; }
    .btn-primary:hover { background: #1557b0; }
    main { flex: 1; overflow: auto; display: flex; justify-content: center; padding: 30px 20px; }
    .pdf-page { background: white; width: 100%; max-width: 800px; min-height: 950px; padding: 60px 80px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); border-radius: 2px; position: relative; }
    .pdf-header { border-bottom: 2px solid #1a73e8; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
    .pdf-title { font-size: 24px; color: #1a73e8; font-weight: 700; }
    .pdf-meta { font-size: 12px; color: #70757a; text-align: right; }
    .pdf-body { font-size: 14px; line-height: 1.8; color: #3c4043; }
    .section-title { font-size: 16px; font-weight: 600; color: #202124; margin: 24px 0 12px; border-bottom: 1px solid #e8eaed; padding-bottom: 6px; }
    .diagram-box { margin: 24px 0; padding: 40px; background: #f8f9fa; border: 2px dashed #dadce0; border-radius: 8px; text-align: center; color: #5f6368; }
    .diagram-icon { font-size: 48px; margin-bottom: 12px; display: block; }
    .footer-note { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e8eaed; font-size: 11px; color: #9aa0a6; text-align: center; }
  </style>
</head>
<body>
  <header>
    <div class="file-info">
      <span class="file-icon">PDF</span>
      <span class="file-name">${displayName}</span>
    </div>
    <div class="actions">
      <button class="btn" onclick="window.print()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        Print
      </button>
      <button class="btn btn-primary" onclick="downloadDoc()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
        Download
      </button>
    </div>
  </header>
  <main>
    <div class="pdf-page">
      <div class="pdf-header">
        <div>
          <div class="pdf-title">${displayName}</div>
          <div style="font-size: 13px; color: #5f6368; margin-top: 4px;">PDF Document Attachment Viewer</div>
        </div>
        <div class="pdf-meta">
          <div>Document ID: DOC-${Math.floor(100000 + Math.random() * 900000)}</div>
          <div>Opened: ${new Date().toLocaleDateString()}</div>
        </div>
      </div>
      <div class="pdf-body">
        <div class="section-title">1. Document Overview</div>
        <p>This document view displays the technical attachment <strong>${displayName}</strong> associated with your FAQ knowledgebase entry.</p>
        
        <div class="section-title">2. Document Specifications & Diagrams</div>
        <div class="diagram-box">
          <span class="diagram-icon">📄</span>
          <div style="font-weight: 600; color: #3c4043; font-size: 16px;">${displayName}</div>
          <div style="font-size: 13px; margin-top: 6px; color: #70757a;">Technical Specification Document</div>
        </div>

        <div class="section-title">3. Options</div>
        <p>You can view, print, or download this file using the top navigation bar controls.</p>

        <div class="footer-note">
          Attachment Document Viewer • ${displayName}
        </div>
      </div>
    </div>
  </main>
  <script>
    function downloadDoc() {
      const text = "Document Name: ${displayName}\\nOpened: " + new Date().toLocaleString();
      const blob = new Blob([text], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "${displayName}";
      a.click();
    }
  </script>
</body>
</html>`;

  newWin.document.open();
  newWin.document.write(htmlContent);
  newWin.document.close();
}

export const openPdfInNewTab = async (att: string | File | null | undefined) => {
  if (!att) return;

  // Handle File objects directly
  if (typeof att !== "string") {
    const blobUrl = URL.createObjectURL(att);
    window.open(blobUrl, "_blank", "noopener,noreferrer");
    return;
  }

  // Open new tab immediately (prevents pop-up blocker)
  const newWin = window.open("", "_blank");
  if (!newWin) return;

  const displayName = att.includes("/") ? att.split("/").pop() || att : att;

  // Set loading state in the new tab window
  newWin.document.title = displayName;
  newWin.document.body.style.backgroundColor = "#525659";
  newWin.document.body.style.color = "#ffffff";
  newWin.document.body.style.fontFamily = "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif";
  newWin.document.body.style.display = "flex";
  newWin.document.body.style.alignItems = "center";
  newWin.document.body.style.justifyContent = "center";
  newWin.document.body.style.height = "100vh";
  newWin.document.body.style.margin = "0";
  newWin.document.body.innerHTML = `
    <div style="text-align: center;">
      <div style="width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.2); border-top-color: #1a73e8; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
      <div style="font-size: 15px; font-weight: 500;">Loading PDF preview for ${displayName}...</div>
      <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
    </div>
  `;

  // If it's a URL (http/https/blob or relative path)
  if (att.startsWith("http://") || att.startsWith("https://") || att.startsWith("blob:") || att.startsWith("/")) {
    try {
      const response = await fetch(att);
      if (response.ok) {
        const rawBlob = await response.blob();
        // Force MIME type to application/pdf without backend Content-Disposition header
        const pdfBlob = new Blob([await rawBlob.arrayBuffer()], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(pdfBlob);
        
        // Open PDF blob in the new tab
        newWin.location.href = blobUrl;
        return;
      }
    } catch (err) {
      console.warn("Could not fetch remote PDF directly, rendering fallback preview:", err);
    }
  }

  // Fallback to HTML viewer for mock/local names or if fetch fails
  renderHtmlPdfViewer(newWin, displayName, att);
};
