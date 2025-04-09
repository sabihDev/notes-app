"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { showToast } from "@/components/ui/toast";

export function Navbar() {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
    showToast("Logged out successfully", "success");
  };

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
                <Button variant="default" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="default">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="outline">Sign Up</Button>
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
