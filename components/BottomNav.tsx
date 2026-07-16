"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/",
    label: "Home",
    icon: (
      <path d="M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" />
    ),
  },
  {
    href: "/tickets",
    label: "Tiket Saya",
    icon: (
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a1.5 1.5 0 0 0 0 3v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a1.5 1.5 0 0 0 0-3V8ZM10 6v12" strokeDasharray="2 2" />
    ),
  },
  {
    href: "/promo",
    label: "Promo",
    icon: (
      <>
        <path d="M4 12 12 4h8v8l-8 8-8-8Z" />
        <circle cx="14.5" cy="9.5" r="1.5" />
      </>
    ),
  },
  {
    href: "/account",
    label: "Akun",
    icon: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      </>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Hidden during the booking flow — those pages have their own sticky
  // action bar (Continue to Seats/Payment, Pay Now) occupying the same
  // fixed-bottom space, mirroring how most booking apps swap the tab bar
  // for a contextual action bar once you're mid-flow.
  if (pathname.startsWith("/movie/")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-brand/20 bg-white/[0.04] shadow-[0_-4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {TABS.map((tab) => {
          const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 rounded-lg px-3 py-1 text-[11px] font-medium transition-colors ${
                isActive ? "text-brand-light" : "text-neutral-500"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {tab.icon}
              </svg>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
