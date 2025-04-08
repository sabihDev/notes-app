import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href='/'  className="font-bold text-xl">Notey</Link>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
