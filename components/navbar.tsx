"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export function Navbar() {
  const { user, logout, isLoading } = useAuth();

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="font-bold text-xl">
          Notey
        </Link>
        <div className="ml-auto flex items-center gap-4">
          {!isLoading && (
            <>
              {user ? (
                <Button variant="ghost" onClick={logout}>
                  Logout
                </Button>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
