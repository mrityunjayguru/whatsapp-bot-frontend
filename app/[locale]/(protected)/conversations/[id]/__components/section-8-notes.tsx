import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Section8Notes = ({ internalNotes, newNote, setNewNote, handlePostNote }: any) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
            Section 8: Notes
          </div>
          <div className="text-[11px] text-default-400 mt-0.5">
            Only employees can see.
          </div>
        </div>

        <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1 no-scrollbar">
          {internalNotes.map((note: any) => (
            <div key={note.id} className="p-2 bg-default-50 rounded-lg border border-default-100">
              <div className="text-xs font-semibold text-default-800">{note.author}</div>
              <div className="text-xs text-default-600 mt-0.5">{note.content}</div>
              <div className="text-[10px] text-default-400 mt-1">{note.time}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Type an internal note..."
            className="h-8 text-xs"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handlePostNote();
              }
            }}
          />
          <Button size="sm" className="h-8 px-3 shrink-0" onClick={handlePostNote}>Post</Button>
        </div>
      </CardContent>
    </Card>
  );
};
