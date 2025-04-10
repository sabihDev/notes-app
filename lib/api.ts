import { Note } from "@prisma/client";
import { showToast } from "@/components/ui/toast";

// Generic fetch wrapper with error handling
async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || `Error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    showToast(message, "error");
    throw error;
  }
}

// API response types with string dates
type ApiNote = Omit<Note, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

// Notes API
export const notesApi = {
  // Get all notes
  getAll: () => fetchWithErrorHandling<ApiNote[]>("/api/notes"),

  // Get a single note by ID
  getById: (id: string) => fetchWithErrorHandling<ApiNote>(`/api/notes/${id}`),

  // Create a new note
  create: (data: { title: string; content: string }) =>
    fetchWithErrorHandling<ApiNote>("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  // Update a note
  update: (id: string, data: { title: string; content: string }) =>
    fetchWithErrorHandling<ApiNote>(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  // Delete a note
  delete: (id: string) =>
    fetchWithErrorHandling<{ success: boolean }>(`/api/notes/${id}`, {
      method: "DELETE",
    }),
};
