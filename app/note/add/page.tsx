"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/ui/toast";
import { Bold, Italic, List, ListOrdered } from "lucide-react";

export default function AddNote() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
    };

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create note");

      router.push("/");
      showToast("Note created successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to create note", "error");
    } finally {
      setIsLoading(false);
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
    textarea.value = text.substring(0, start) + formattedText + text.substring(end);
    
    // Focus and set cursor position
    textarea.focus();
    textarea.selectionStart = start + startChar.length;
    textarea.selectionEnd = end + startChar.length;
  };

  // Formatting handlers
  const handleBold = () => insertFormatting('**');
  const handleItalic = () => insertFormatting('_');
  
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
      .split('\n')
      .map(line => line.trim() ? `- ${line}` : line)
      .join('\n');
    
    textarea.value = text.substring(0, start) + formattedText + text.substring(end);
    
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
      .split('\n')
      .map((line, index) => line.trim() ? `${index + 1}. ${line}` : line)
      .join('\n');
    
    textarea.value = text.substring(0, start) + formattedText + text.substring(end);
    
    // Focus and set cursor position
    textarea.focus();
    textarea.selectionStart = start;
    textarea.selectionEnd = start + formattedText.length;
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Note</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            name="title"
            placeholder="Note Title"
            required
            className="mb-4"
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
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Note"}
          </Button>
        </div>
      </form>
    </div>
  );
}