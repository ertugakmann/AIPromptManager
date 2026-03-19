"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { clearAuthToken } from "@/lib/api";

interface NavbarProps {
  showCreateButton?: boolean;
}

export default function Navbar({ showCreateButton = true }: NavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    clearAuthToken();
    router.push("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/dashboard"
          className="text-lg font-semibold text-slate-900"
        >
          AI Prompt Manager
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Dashboard
          </Link>
          {showCreateButton ? (
            <Link
              href="/create"
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Create Prompt
            </Link>
          ) : null}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
