import type { ReactNode } from "react";

interface InfoPageProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function InfoPage({ title, subtitle, children }: InfoPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{title}</h1>
      <p className="mt-3 text-lg text-zinc-600">{subtitle}</p>
      <div className="mt-8 space-y-6 text-zinc-700 leading-relaxed">{children}</div>
    </div>
  );
}
