"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/ui/toast";

export default function AddNote() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
          <textarea
            name="content"
            placeholder="Note Content"
            required
            className="w-full min-h-[200px] p-2 rounded-md border bg-background resize-y"
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