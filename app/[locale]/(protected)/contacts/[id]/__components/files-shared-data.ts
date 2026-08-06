import React from "react";
import { Image, FileText, Video, Music } from "lucide-react";

export type FileKind = "image" | "document" | "video" | "audio";

export interface SharedFile {
  id: string;
  name: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  kind: FileKind;
  url?: string;
  thumbnail?: string;
}

export const sharedFiles: SharedFile[] = [
  {
    id: "f1",
    name: "profile-photo.jpg",
    size: "1.4 MB",
    uploadedBy: "Jenny Wilson",
    uploadedAt: "Aug 3, 2026 09:15 AM",
    kind: "image",
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "f2",
    name: "id-front-scan.png",
    size: "2.1 MB",
    uploadedBy: "Jenny Wilson",
    uploadedAt: "Aug 3, 2026 09:20 AM",
    kind: "image",
    thumbnail:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "f3",
    name: "signature-scan.jpg",
    size: "540 KB",
    uploadedBy: "Sarah Kim",
    uploadedAt: "Aug 4, 2026 10:00 AM",
    kind: "image",
    thumbnail:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "f4",
    name: "Contract_Agreement.pdf",
    size: "342 KB",
    uploadedBy: "Sarah Kim",
    uploadedAt: "Aug 3, 2026 10:02 AM",
    kind: "document",
  },
  {
    id: "f5",
    name: "KYC_Verification.docx",
    size: "186 KB",
    uploadedBy: "Michael Chen",
    uploadedAt: "Aug 3, 2026 10:30 AM",
    kind: "document",
  },
  {
    id: "f6",
    name: "intro-video.mp4",
    size: "18.6 MB",
    uploadedBy: "Jenny Wilson",
    uploadedAt: "Aug 3, 2026 09:40 AM",
    kind: "video",
  },
  {
    id: "f7",
    name: "onboarding-call.mov",
    size: "34.2 MB",
    uploadedBy: "Emily Rodriguez",
    uploadedAt: "Aug 4, 2026 11:00 AM",
    kind: "video",
  },
  {
    id: "f8",
    name: "voicemail-message.mp3",
    size: "1.8 MB",
    uploadedBy: "Jenny Wilson",
    uploadedAt: "Aug 4, 2026 09:00 AM",
    kind: "audio",
  },
  {
    id: "f9",
    name: "support-call-recording.wav",
    size: "6.4 MB",
    uploadedBy: "Sarah Kim",
    uploadedAt: "Aug 4, 2026 11:20 AM",
    kind: "audio",
  },
];

export const tabConfig: {
  key: FileKind;
  label: string;
  icon: React.ElementType;
}[] = [
  { key: "image", label: "Images", icon: Image },
  { key: "document", label: "Documents", icon: FileText },
  { key: "video", label: "Videos", icon: Video },
  { key: "audio", label: "Audio", icon: Music },
];
