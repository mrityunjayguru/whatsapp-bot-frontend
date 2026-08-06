import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Paperclip, Clock, Eye, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export const Section4FilesShared = ({ tabConfig, sharedFiles, openPreview }: any) => {
  return (
    <Card className="lg:col-span-3">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
              Section 4: Files Shared
            </div>
            <div className="text-[11px] text-default-400 mt-0.5">
              Employee can Preview & Download any shared file
            </div>
          </div>
        </div>

        <Tabs defaultValue="image" className="w-full">
          <TabsList className="border-b border-default-200 p-0 gap-0 overflow-x-auto no-scrollbar">
            {tabConfig.map(({ key, label, icon: Icon }: any) => {
              const count = sharedFiles.filter((f: any) => f.kind === key).length;
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="!px-3 !py-2.5 text-xs relative data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:-bottom-px data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary data-[state=active]:shadow-none data-[state=active]:text-default-800 data-[state=active]:font-semibold"
                >
                  <Icon className="w-3.5 h-3.5 me-1.5" />
                  {label}
                  <span className="ms-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full bg-default-100 text-[10px] font-medium text-default-600 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                    {count}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {tabConfig.map(({ key }: any) => {
            const files = sharedFiles.filter((f: any) => f.kind === key);
            return (
              <TabsContent key={key} value={key} className="!mt-3">
                {files.length === 0 ? (
                  <div className="py-10 text-center text-xs text-default-400">
                    No files in this category
                  </div>
                ) : (
                  <div className="divide-y divide-default-100 border border-default-200 rounded-lg overflow-hidden">
                    {files.map((file: any) => {
                      const meta = tabConfig.find((t: any) => t.key === file.kind);
                      const KindIcon = meta?.icon ?? Paperclip;
                      return (
                        <div
                          key={file.id}
                          className="flex items-center gap-3 p-3 bg-background hover:bg-default-50 transition-colors"
                        >
                          <div className="h-9 w-9 shrink-0 rounded-md border border-default-200 bg-default-50 overflow-hidden flex items-center justify-center text-default-500">
                            {file.kind === "image" && file.thumbnail ? (
                              <img
                                src={file.thumbnail}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <KindIcon className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div
                              className="text-sm font-medium text-default-800 truncate"
                              title={file.name}
                            >
                              {file.kind === "link" && file.url ? (
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {file.name}
                                </a>
                              ) : (
                                file.name
                              )}
                            </div>
                            <div className="text-[11px] text-default-400 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                              <span>{file.size}</span>
                              <span className="text-default-300">•</span>
                              <span>Uploaded by {file.uploadedBy}</span>
                              <span className="text-default-300">•</span>
                              <span className="inline-flex items-center">
                                <Clock className="w-3 h-3 me-0.5" />
                                {file.uploadedAt}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                file.kind === "link" && file.url
                                  ? window.open(file.url, "_blank")
                                  : openPreview(file)
                              }
                              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
                            >
                              <Eye className="w-3.5 h-3.5 me-1" />
                              Preview
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs !border !border-default-200 bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
                            >
                              <Download className="w-3.5 h-3.5 me-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};
