import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const Section5Statistics = () => {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
            Section 5: Conversation Statistics
          </div>
          <div className="text-[11px] text-default-400 mt-0.5">
            Breakdown of messages and media sharing statistics
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-4">
          {/* 1. Total Messages */}
          <Card className="bg-primary/10 relative overflow-hidden border-none shadow-none rounded-lg">
            <CardContent className="p-4 flex flex-col justify-between min-h-[140px]">
              <img
                src="/images/all-img/shade-1.png"
                alt="images"
                draggable="false"
                className="absolute top-0 start-0 w-full h-full object-contain pointer-events-none"
              />
              <div className="mb-4 text-xs font-semibold text-default-700 uppercase tracking-wide z-10">Total</div>
              <div className="text-4xl font-bold text-default-900 mb-4 z-10">45</div>
            </CardContent>
          </Card>

          {/* 2. Customer Messages */}
          <Card className="bg-info/10 relative overflow-hidden border-none shadow-none rounded-lg">
            <CardContent className="p-4 flex flex-col justify-between min-h-[140px]">
              <img
                src="/images/all-img/shade-2.png"
                alt="images"
                draggable="false"
                className="absolute top-0 start-0 w-full h-full object-contain pointer-events-none"
              />
              <div className="mb-4 text-xs font-semibold text-default-700 uppercase tracking-wide z-10">Customer</div>
              <div className="text-4xl font-bold text-blue-600 mb-4 z-10">20</div>
            </CardContent>
          </Card>

          {/* 3. Employee Messages */}
          <Card className="bg-success/10 relative overflow-hidden border-none shadow-none rounded-lg">
            <CardContent className="p-4 flex flex-col justify-between min-h-[140px]">
              <img
                src="/images/all-img/shade-4.png"
                alt="images"
                draggable="false"
                className="absolute top-0 start-0 w-full h-full object-contain pointer-events-none"
              />
              <div className="mb-4 text-xs font-semibold text-default-700 uppercase tracking-wide z-10">Employee</div>
              <div className="text-4xl font-bold text-emerald-600 mb-4 z-10">15</div>
            </CardContent>
          </Card>

          {/* 4. Chatbot Messages */}
          <Card className="bg-warning/10 relative overflow-hidden border-none shadow-none rounded-lg">
            <CardContent className="p-4 flex flex-col justify-between min-h-[140px]">
              <img
                src="/images/all-img/shade-3.png"
                alt="images"
                draggable="false"
                className="absolute top-0 start-0 w-full h-full object-contain pointer-events-none"
              />
              <div className="mb-4 text-xs font-semibold text-default-700 uppercase tracking-wide z-10">Chatbot</div>
              <div className="text-4xl font-bold text-amber-600 mb-4 z-10">10</div>
            </CardContent>
          </Card>

          {/* 5. Attachments */}
          <Card className="bg-default-300/10 relative overflow-hidden border-none shadow-none rounded-lg">
            <CardContent className="p-4 flex flex-col justify-between min-h-[140px]">
              <img
                src="/images/all-img/shade-1.png"
                alt="images"
                draggable="false"
                className="absolute top-0 start-0 w-full h-full object-contain pointer-events-none"
              />
              <div className="mb-4 text-xs font-semibold text-default-700 uppercase tracking-wide z-10">Attachments</div>
              <div className="text-4xl font-bold text-default-800 mb-4 z-10">9</div>
            </CardContent>
          </Card>

          {/* 6. Images */}
          <Card className="bg-indigo-500/10 relative overflow-hidden border-none shadow-none rounded-lg">
            <CardContent className="p-4 flex flex-col justify-between min-h-[140px]">
              <img
                src="/images/all-img/shade-2.png"
                alt="images"
                draggable="false"
                className="absolute top-0 start-0 w-full h-full object-contain pointer-events-none"
              />
              <div className="mb-4 text-xs font-semibold text-default-700 uppercase tracking-wide z-10">Images</div>
              <div className="text-4xl font-bold text-indigo-600 mb-4 z-10">2</div>
            </CardContent>
          </Card>

          {/* 7. Documents */}
          <Card className="bg-amber-500/10 relative overflow-hidden border-none shadow-none rounded-lg">
            <CardContent className="p-4 flex flex-col justify-between min-h-[140px]">
              <img
                src="/images/all-img/shade-3.png"
                alt="images"
                draggable="false"
                className="absolute top-0 start-0 w-full h-full object-contain pointer-events-none"
              />
              <div className="mb-4 text-xs font-semibold text-default-700 uppercase tracking-wide z-10">Documents</div>
              <div className="text-4xl font-bold text-amber-600 mb-4 z-10">3</div>
            </CardContent>
          </Card>

          {/* 8. Videos */}
          <Card className="bg-red-500/10 relative overflow-hidden border-none shadow-none rounded-lg">
            <CardContent className="p-4 flex flex-col justify-between min-h-[140px]">
              <img
                src="/images/all-img/shade-4.png"
                alt="images"
                draggable="false"
                className="absolute top-0 start-0 w-full h-full object-contain pointer-events-none"
              />
              <div className="mb-4 text-xs font-semibold text-default-700 uppercase tracking-wide z-10">Videos</div>
              <div className="text-4xl font-bold text-red-600 mb-4 z-10">2</div>
            </CardContent>
          </Card>

          {/* 9. Audio */}
          <Card className="bg-pink-500/10 relative overflow-hidden border-none shadow-none rounded-lg">
            <CardContent className="p-4 flex flex-col justify-between min-h-[140px]">
              <img
                src="/images/all-img/shade-1.png"
                alt="images"
                draggable="false"
                className="absolute top-0 start-0 w-full h-full object-contain pointer-events-none"
              />
              <div className="mb-4 text-xs font-semibold text-default-700 uppercase tracking-wide z-10">Audio</div>
              <div className="text-4xl font-bold text-pink-600 mb-4 z-10">2</div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
