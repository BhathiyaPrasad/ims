"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const links = [
  { label: "Overview", href: "/student/dashboard" },
  { label: "GPA Calculator", href: "/student/gpa" },
  { label: "Portfolio", href: "/student/portfolio" },
  { label: "InternshipStatus", href: "/student/internship-status" },
  { label: "Record Book", href: "/student/record-book" },
];

export function StudentNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="bg-navy-deep text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/student/dashboard" className="text-2xl font-bold tracking-wide">
          IMS
        </Link>

        <ul className="hidden flex-1 items-center justify-center gap-8 text-sm font-medium lg:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className={`transition-colors ${
                    active ? "text-white" : "text-white/75 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/25"
          >
            Logout
          </button>
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-2 ring-white/30">
            <UserRound className="h-6 w-6 text-white/80" />
          </span>
        </div>
      </nav>
    </header>
  );
}
