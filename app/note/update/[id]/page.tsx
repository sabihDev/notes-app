"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/ui/toast";
import { Bold, Italic, List, ListOrdered, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notesApi } from "@/lib/api";

type Params = Promise<{ id: string }>;

export default function UpdateNote({ params }: { params: Params }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [note, setNote] = useState({
    title: "",
    content: "",
  });
  const [noteId, setNoteId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Extract id from params Promise
  useEffect(() => {
    async function extractId() {
      try {
        const resolvedParams = await params;
        setNoteId(resolvedParams.id);
      } catch (error) {
        console.error("Error extracting note ID:", error);
        router.push("/");
      }
    }
    extractId();
  }, [params, router]);

  // Fetch the note data
  useEffect(() => {
    if (!noteId) return;

    async function fetchNote() {
      try {
        if (noteId) {
          const noteData = await notesApi.getById(noteId);
          setNote({
            title: noteData.title,
            content: noteData.content,
          });
        }
      } catch (err) {
        console.error(err);
        showToast("Failed to load note", "error");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    }

    fetchNote();
  }, [noteId, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!noteId) return;

    setIsSaving(true);

    try {
      await notesApi.update(noteId, note);
      router.push(`/note/view/${noteId}`);
      showToast("Note updated successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update note", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Function to insert formatting at cursor position
  const insertFormatting = (startChar: string, endChar: string = startChar) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    // Get selected text
    const selectedText = text.substring(start, end);

    // Insert formatting
    const formattedText = startChar + selectedText + endChar;

    // Update both the textarea value and the state
    const newContent =
      text.substring(0, start) + formattedText + text.substring(end);
    textarea.value = newContent;
    setNote((prev) => ({ ...prev, content: newContent }));

    // Focus and set cursor position
    textarea.focus();
    textarea.selectionStart = start + startChar.length;
    textarea.selectionEnd = end + startChar.length;
  };

  // Formatting handlers
  const handleBold = () => insertFormatting("**");
  const handleItalic = () => insertFormatting("_");

  const handleUnorderedList = () => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    // Get selected text
    const selectedText = text.substring(start, end);

    // Format each line with a bullet
    const formattedText = selectedText
      .split("\n")
      .map((line) => (line.trim() ? `- ${line}` : line))
      .join("\n");

    // Update both the textarea value and the state
    const newContent =
      text.substring(0, start) + formattedText + text.substring(end);
    textarea.value = newContent;
    setNote((prev) => ({ ...prev, content: newContent }));

    // Focus and set cursor position
    textarea.focus();
    textarea.selectionStart = start;
    textarea.selectionEnd = start + formattedText.length;
  };

  const handleOrderedList = () => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    // Get selected text
    const selectedText = text.substring(start, end);

    // Format each line with a number
    const formattedText = selectedText
      .split("\n")
      .map((line, index) => (line.trim() ? `${index + 1}. ${line}` : line))
      .join("\n");

    // Update both the textarea value and the state
    const newContent =
      text.substring(0, start) + formattedText + text.substring(end);
    textarea.value = newContent;
    setNote((prev) => ({ ...prev, content: newContent }));

    // Focus and set cursor position
    textarea.focus();
    textarea.selectionStart = start;
    textarea.selectionEnd = start + formattedText.length;
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="h-8 w-40 bg-muted animate-pulse rounded mb-6"></div>
        <div className="space-y-4">
          <div className="h-10 bg-muted animate-pulse rounded"></div>
          <div className="h-8 bg-muted animate-pulse rounded w-full"></div>
          <div className="h-40 bg-muted animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link
          href={`/note/view/${noteId}`}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mr-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Note
        </Link>
        <h1 className="text-2xl font-bold">Edit Note</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            name="title"
            placeholder="Note Title"
            required
            className="mb-4"
            value={note.title}
            onChange={(e) =>
              setNote((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          <div className="flex items-center gap-2 mb-2 border rounded-md p-1 bg-muted/30">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleBold}
              className="h-8 px-2 rounded-sm"
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleItalic}
              className="h-8 px-2 rounded-sm"
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <div className="h-4 border-l mx-1"></div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleUnorderedList}
              className="h-8 px-2 rounded-sm"
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleOrderedList}
              className="h-8 px-2 rounded-sm"
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <div className="ml-auto text-xs text-muted-foreground">
              Markdown supported
            </div>
          </div>

          <textarea
            ref={textareaRef}
            name="content"
            placeholder="Note Content"
            required
            className="w-full min-h-[200px] p-2 rounded-md border bg-background resize-y font-mono text-sm"
            value={note.content}
            onChange={(e) =>
              setNote((prev) => ({ ...prev, content: e.target.value }))
            }
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
