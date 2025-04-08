import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Home() {
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
            <Link href='/note/add' className={`${buttonVariants({ variant: 'default' })} gap-2`}>
              <Plus className="h-4 w-4" />
              Add New Note
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group relative rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col h-full">
              <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                Welcome Note
              </h3>
              <p className="text-sm text-muted-foreground mb-4 flex-grow">
                This is your first note. Click the Add New Note button to create
                more notes.
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Created: {new Date().toLocaleDateString()}</span>
                <Link
                  href='/note/view/1'
                  className={`${buttonVariants({variant: "secondary", size: "sm"})} opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
