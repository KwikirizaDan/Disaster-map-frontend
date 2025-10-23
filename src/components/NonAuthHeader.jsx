"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ThemeToggle";

const links = [
  { href: "/livemap", label: "Map" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/docs", label: "Docs" },
  { href: "/disaster/Cards", label: "Disasters" },
];

const NonAuthHeader = () => {
  const pathname = usePathname();
  return (
    <header className="flex items-center bg-white dark:bg-gray-800 justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-10 py-3">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-gray-900">
          <div className="size-8 text-[var(--primary-500)]">
            <img 
              src="/DMU-LOG.svg" 
              alt="Disaster Map Uganda Logo" 
              className="h-8 w-8"
            />
          </div>
          <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            Disaster Map Uganda
          </h2>
        </div>
        
      </div>
          <nav className="flex rounded-md border border-border-light dark:border-gray-700 py-2 px-2 items-center gap-6">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium leading-normal px-3 py-1 rounded-md transition-colors duration-300 ${
              isActive
                ? "bg-yellow-400 text-black"
                : "text-gray-600 dark:text-gray-300 hover:bg-yellow-400 hover:text-gray-900"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
      <div className="flex gap-2 items-center">
        <ModeToggle />
        <Link
          href="/login"
          className="flex min-w-[84px] items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-yellow-400 hover:bg-yellow-500 transition text-white text-sm font-bold shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50"
        >
          Log in
        </Link>

        <Link
          href="/register"
          className="flex min-w-[84px] items-center hover:bg-yellow-400 transition justify-center overflow-hidden rounded-md h-10 px-4 bg-gray-200 text-gray-800 text-sm font-bold transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-gray-50"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default NonAuthHeader;
