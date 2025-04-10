"use client";

import { useEffect, useState } from "react";
import { notesApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { showToast } from "@/components/ui/toast";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

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

export default function ViewNote({ params }: { params: Params }) {
  const router = useRouter();
  const [note, setNote] = useState<ApiNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string | null>(null);

  // Extract slug from params Promise
  useEffect(() => {
    async function extractSlug() {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);
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
            href={`/note/update/${note.id}`}
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
        <h1 className="text-3xl font-bold">{decodeText(note.title)}</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date(note.updatedAt).toLocaleString()}
        </div>
        <div className="mt-6">
          <ReactMarkdown
            rehypePlugins={[rehypeSanitize]}
            components={{
              // Apply className to the root div that contains markdown
              p: ({ children, ...props }) => (
                <p className="my-4" {...props}>
                  {children}
                </p>
              ),
              h1: ({ children, ...props }) => (
                <h1 className="text-2xl font-bold mt-6 mb-4" {...props}>
                  {children}
                </h1>
              ),
              h2: ({ children, ...props }) => (
                <h2 className="text-xl font-bold mt-5 mb-3" {...props}>
                  {children}
                </h2>
              ),
              h3: ({ children, ...props }) => (
                <h3 className="text-lg font-bold mt-4 mb-2" {...props}>
                  {children}
                </h3>
              ),
              ul: ({ children, ...props }) => (
                <ul className="list-disc pl-6 my-4" {...props}>
                  {children}
                </ul>
              ),
              ol: ({ children, ...props }) => (
                <ol className="list-decimal pl-6 my-4" {...props}>
                  {children}
                </ol>
              ),
              li: ({ children, ...props }) => (
                <li className="my-1" {...props}>
                  {children}
                </li>
              ),
              blockquote: ({ children, ...props }) => (
                <blockquote
                  className="border-l-4 border-primary pl-4 italic my-4"
                  {...props}
                >
                  {children}
                </blockquote>
              ),
              pre: ({ children, ...props }) => (
                <pre
                  className="bg-muted p-4 rounded-md overflow-x-auto my-4"
                  {...props}
                >
                  {children}
                </pre>
              ),
              code: ({ className, children, ...props }) => (
                <code
                  className={`${className || ""} ${
                    props.node?.position?.start?.line
                      ? ""
                      : "bg-muted px-1.5 py-0.5 rounded text-sm"
                  }`}
                  {...props}
                >
                  {children}
                </code>
              ),
              a: ({ children, ...props }) => (
                <a className="text-primary hover:underline" {...props}>
                  {children}
                </a>
              ),
              hr: ({ ...props }) => (
                <hr className="my-6 border-t border-border" {...props} />
              ),
              table: ({ children, ...props }) => (
                <table className="w-full border-collapse my-4" {...props}>
                  {children}
                </table>
              ),
              th: ({ children, ...props }) => (
                <th
                  className="border border-border p-2 bg-muted font-semibold"
                  {...props}
                >
                  {children}
                </th>
              ),
              td: ({ children, ...props }) => (
                <td className="border border-border p-2" {...props}>
                  {children}
                </td>
              ),
            }}
          >
            {decodeText(note.content)}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
