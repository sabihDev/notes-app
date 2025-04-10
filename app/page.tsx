"use client";

import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { notesApi } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

// Define type for API response notes
interface ApiNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

// Helper function to decode HTML entities and escape sequences
function decodeText(text: string): string {
  // First decode any HTML entities
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  const decodedHtml = textarea.value;

  // Then handle JavaScript escape sequences
  return decodedHtml
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");
}

export default function Home() {
  const [notes, setNotes] = useState<ApiNote[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchNotes() {
      try {
        if (user) {
          const data = await notesApi.getAll();
          setNotes(data);
        }
      } catch {
        // Error already handled by API
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              My Notes
            </h1>
            <p className="mt-2 text-muted-foreground">
              Create and manage your notes with ease
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/note/add"
              className={`${buttonVariants({ variant: "default" })} gap-2`}
            >
              <Plus className="h-4 w-4" />
              Add New Note
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse h-6 w-24 bg-muted rounded"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="group relative rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md flex flex-col h-full"
                >
                  <div className="flex-1 min-h-0 flex flex-col">
                    <h3 className="font-semibold text-lg mb-2 text-card-foreground truncate">
                      {decodeText(note.title)}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
                      {decodeText(note.content)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t">
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                    <Link
                      href={`/note/view/${note.id}`}
                      className={`${buttonVariants({
                        variant: "secondary",
                        size: "sm",
                      })} opacity-0 group-hover:opacity-100 transition-opacity`}
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No notes yet. Get started by creating your first note.
                </p>
                <Link
                  href="/note/add"
                  className={buttonVariants({ variant: "default" })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Note
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
