"use client";

import { useEffect, useState } from "react";
import { notesApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { showToast } from "@/components/ui/toast";

// Define API note type
interface ApiNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

type Params = Promise<{ slug: string }>;

export default function ViewNote({ params }: { params: Params }) {
  const router = useRouter();
  const [note, setNote] = useState<ApiNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string | null>(null);

  // Extract slug from params Promise
  useEffect(() => {
    async function extractSlug() {
      try {
        const data = await params;
        setSlug(data.slug);
      } catch (error) {
        console.error("Error extracting slug:", error);
        router.push("/");
      }
    }
    extractSlug();
  }, [params, router]);

  // Fetch note when slug is available
  useEffect(() => {
    if (!slug) return;

    async function fetchNote() {
      try {
        if (slug) {
          const data = await notesApi.getById(slug);
          setNote(data);
        }
      } catch {
        // Error already handled by API
      } finally {
        setLoading(false);
      }
    }

    fetchNote();
  }, [slug, router]);

  const handleDelete = async () => {
    if (!note) return;

    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await notesApi.delete(note.id);
        showToast("Note deleted successfully", "success");
        router.push("/");
      } catch {
        // Error already handled by API
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <div className="h-6 w-24 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-muted animate-pulse rounded w-3/4"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-5/6"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-4/5"></div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-muted-foreground">Note not found</p>
        <Link
          href="/"
          className={buttonVariants({ variant: "default", className: "mt-4" })}
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "gap-2",
          })}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="flex gap-2">
          <Link
            href={`/note/edit/${note.id}`}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "gap-2",
            })}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className={buttonVariants({
              variant: "destructive",
              size: "sm",
              className: "gap-2",
            })}
          >
            <Trash className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{note.title}</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date(note.updatedAt).toLocaleString()}
        </div>
        <div className="mt-6 whitespace-pre-wrap">{note.content}</div>
      </div>
    </div>
  );
}
