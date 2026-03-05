"use client";

import { Header } from "./Header";

interface AppShellProps {
  locale: string;
  children: React.ReactNode;
}

export function AppShell({ locale, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header locale={locale} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
