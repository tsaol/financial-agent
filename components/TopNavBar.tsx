"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface TopNavBarProps {
  features?: {
    showDomainSelector?: boolean;
    showViewModeSelector?: boolean;
    showPromptCaching?: boolean;
  };
  onReset?: () => void;
}

const NAV_ITEMS = [
  { href: "/", label: "AI Chat", icon: "💬" },
  { href: "/china", label: "A股市场", icon: "🇨🇳" },
];

const TopNavBar: React.FC<TopNavBarProps> = ({ features = {}, onReset }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-6">
          <div className="font-bold text-xl flex gap-2 items-center">
            <Image
              src={theme === "dark" ? "/amazon-dark.png" : "/amazon.webp"}
              alt="Company Wordmark"
              width={50}
              height={30}
              className="dark:brightness-[1.15]"
            />
          </div>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default TopNavBar;