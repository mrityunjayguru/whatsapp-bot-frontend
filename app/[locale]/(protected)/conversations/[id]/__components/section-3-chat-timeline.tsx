import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Section3ChatTimeline = ({
  chatMessages,
  chatContainerRef,
  showEmojiPicker,
  setShowEmojiPicker,
  quickEmojis,
  insertEmoji,
  showAttachMenu,
  setShowAttachMenu,
  fileInputRef,
  handleFileSelected,
  handleSendAttachment,
  chatPreviewFile,
  setChatPreviewFile,
  isRecording,
  recordingTime,
  toggleRecording,
  chatInput,
  setChatInput,
  handleSendChatMessage,
}: any) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
            Section 3: Conversation Timeline 
          </div>
        </div>

        <div className="border border-default-200 rounded-lg overflow-hidden flex flex-col">
          {/* Chat Body - Increased height here! */}
          <div 
            ref={chatContainerRef}
            className="p-4 space-y-2 overflow-y-auto max-h-[480px] min-h-[480px] flex flex-col no-scrollbar scroll-smooth"
          >
            {chatMessages.map((msg: any) => {
              const isCustomer = msg.sender === "customer";
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full",
                    isCustomer ? "justify-start" : "justify-end"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[72%] rounded-2xl px-3 py-2 shadow-sm text-xs",
                      isCustomer
                        ? "bg-default-100 text-default-800 rounded-tl-sm"
                        : "bg-emerald-500 text-white rounded-tr-sm"
                    )}
                  >
                    {/* Message Content depending on Type */}
                    {msg.type === "text" && (
                      <div className="leading-relaxed">{msg.content}</div>
                    )}

                    {msg.type === "reply" && (
                      <div className="space-y-1.5">
                        <div className={cn(
                          "border-l-4 p-1.5 rounded text-[10px] italic",
                          isCustomer
                            ? "border-emerald-500 bg-default-200/60 text-default-600"
                            : "border-white/50 bg-white/10 text-white/80"
                        )}>
                          {msg.replyTo}
                        </div>
                        <div className="leading-relaxed">{msg.content}</div>
                      </div>
                    )}

                    {msg.type === "file" && (
                      <div className={cn(
                        "flex items-center gap-3 p-2 rounded-lg",
                        isCustomer ? "bg-default-200/60" : "bg-white/10"
                      )}>
                        <div className={cn(
                          "p-2 rounded flex items-center justify-center",
                          isCustomer ? "bg-emerald-500 text-white" : "bg-white/20 text-white"
                        )}>
                          <Icon icon="heroicons:document-text" className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold truncate">{msg.fileName}</div>
                          <div className={cn("text-[10px]", isCustomer ? "text-default-500" : "text-white/70")}>{msg.fileSize}</div>
                        </div>
                        <button className={cn(
                          "h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                          isCustomer ? "bg-background border border-default-200" : "bg-white/20"
                        )}>
                          <Icon icon="heroicons:arrow-down-tray" className={cn("w-3.5 h-3.5", isCustomer ? "text-default-800" : "text-white")} />
                        </button>
                      </div>
                    )}

                    {msg.type === "image" && (
                      <div className="space-y-1.5">
                        <div className="rounded-xl overflow-hidden max-w-[200px]">
                          <img src={msg.thumbnail} alt={msg.content} className="w-full h-auto object-cover max-h-[140px]" />
                        </div>
                        <div className={cn("text-[11px] font-medium truncate", isCustomer ? "text-default-700" : "text-white/90")}>{msg.content}</div>
                      </div>
                    )}

                    {msg.type === "audio" && (
                      <div className="flex items-center gap-2 min-w-[180px]">
                        <button className={cn(
                          "h-7 w-7 rounded-full shrink-0 flex items-center justify-center",
                          isCustomer ? "bg-emerald-500 text-white" : "bg-white/20 text-white"
                        )}>
                          <Icon icon="heroicons:play-solid" className="w-3 h-3" />
                        </button>
                        <div className="flex-1 h-1 bg-white/30 rounded-full relative">
                          <div className={cn(
                            "absolute left-0 top-0 bottom-0 w-1/3 rounded-full",
                            isCustomer ? "bg-emerald-500" : "bg-white"
                          )} />
                        </div>
                        <span className={cn("text-[10px]", isCustomer ? "text-default-500" : "text-white/80")}>{msg.duration}</span>
                        <Icon icon="heroicons:microphone" className={cn("w-3.5 h-3.5", isCustomer ? "text-emerald-500" : "text-white/80")} />
                      </div>
                    )}

                    {/* Timestamp & Ticks */}
                    <div className={cn(
                      "flex items-center justify-end gap-1 mt-1 text-[9px] select-none",
                      isCustomer ? "text-default-400" : "text-white/70"
                    )}>
                      <span>{msg.time}</span>
                      {!isCustomer && (
                        <Icon icon="heroicons:check-20-solid" className="w-3.5 h-3.5 text-white/90" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Emoji Picker Panel */}
          {showEmojiPicker && (
            <div className="px-4 py-3 bg-default-50 border-t border-default-200 flex flex-wrap gap-2">
              {quickEmojis.map((emoji: string) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="text-xl hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Attach Menu */}
          {showAttachMenu && (
            <div className="px-4 py-2 bg-default-50 border-t border-default-200 flex gap-3 relative">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileSelected}
              />
              {[
                { icon: "heroicons:photo", label: "Image", color: "text-violet-500" },
                { icon: "heroicons:document-text", label: "Document", color: "text-blue-500" },
                { icon: "heroicons:film", label: "Video", color: "text-rose-500" },
                { icon: "heroicons:microphone", label: "Audio", color: "text-amber-500" },
              ].map(({ icon, label, color }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleSendAttachment(label)}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-default-200 transition-colors"
                >
                  <span className={`${color} flex items-center justify-center w-9 h-9 rounded-full bg-default-200`}>
                    <Icon icon={icon} width={20} height={20} />
                  </span>
                  <span className="text-[10px] text-default-600">{label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Preview Panel */}
          {chatPreviewFile && (
            <div className="px-4 py-3 bg-default-50 border-t border-default-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {chatPreviewFile.type === "image" ? (
                  <img src={chatPreviewFile.thumbnail} alt="preview" className="w-12 h-12 object-cover rounded-md" />
                ) : (
                  <div className="p-3 bg-default-200 rounded-md">
                    <Icon icon="heroicons:document" className="w-6 h-6 text-default-600" />
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium">{chatPreviewFile.fileName || chatPreviewFile.content || "Audio File"}</div>
                  <div className="text-xs text-default-500">{chatPreviewFile.fileSize || "Ready to send"}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChatPreviewFile(null)}
                className="p-1.5 rounded-full hover:bg-default-200 text-default-500"
              >
                <Icon icon="heroicons:x-mark" className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Input Bar */}
          <div className="px-3 py-2.5 bg-default-50 border-t border-default-200 flex items-center gap-3">
            {/* Emoji */}
            {!isRecording && (
              <>
                <button
                  type="button"
                  onClick={() => { setShowEmojiPicker((p: boolean) => !p); setShowAttachMenu(false); }}
                  className={cn(
                    "h-9 w-9 rounded-full shrink-0 flex items-center justify-center transition-colors",
                    showEmojiPicker
                      ? "bg-emerald-100 text-emerald-600"
                      : "text-default-500 hover:text-default-700 hover:bg-default-200"
                  )}
                >
                  <Icon icon="heroicons:face-smile" width={22} height={22} />
                </button>

                {/* Attach */}
                <button
                  type="button"
                  onClick={() => { setShowAttachMenu((p: boolean) => !p); setShowEmojiPicker(false); }}
                  className={cn(
                    "h-9 w-9 rounded-full shrink-0 flex items-center justify-center transition-colors",
                    showAttachMenu
                      ? "bg-blue-100 text-blue-600"
                      : "text-default-500 hover:text-default-700 hover:bg-default-200"
                  )}
                >
                  <Icon icon="heroicons:paper-clip" width={22} height={22} />
                </button>
              </>
            )}

            {/* Message Input or Recording UI */}
            {isRecording ? (
              <div className="flex-1 h-9 rounded-full bg-red-50 text-sm border border-red-200 px-4 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-500 font-medium">Recording... {Math.floor(recordingTime / 60)}:{recordingTime % 60 < 10 ? '0' : ''}{recordingTime % 60}</span>
              </div>
            ) : (
              <Input
                placeholder="Type a message..."
                className="flex-1 h-9 rounded-full bg-white dark:bg-default-800 text-sm border border-default-200 px-4"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendChatMessage();
                  }
                }}
              />
            )}

            {/* Text Send Button */}
            {(!isRecording && (chatInput.trim() || chatPreviewFile)) && (
              <button
                type="button"
                onClick={handleSendChatMessage}
                className="h-9 px-4 rounded-full shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Icon icon="heroicons:paper-airplane" width={15} height={15} />
                Send
              </button>
            )}

            {/* Mic / Stop Recording Button */}
            {(!chatInput.trim() && !chatPreviewFile) && (
              <button
                type="button"
                onClick={toggleRecording}
                className={cn(
                  "h-9 w-9 rounded-full shrink-0 text-white flex items-center justify-center transition-colors shadow-sm",
                  isRecording ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
                )}
              >
                {isRecording ? (
                  <Icon icon="heroicons:stop" width={17} height={17} />
                ) : (
                  <Icon icon="heroicons:microphone" width={17} height={17} />
                )}
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
