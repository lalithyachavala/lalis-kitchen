import React from "react";

export default function InlineBanner({ kind = "info", message }: { kind?: "info"|"error"; message: string }) {
  const styles = kind === "error"
    ? "bg-red-50 text-red-800 ring-red-200 dark:bg-red-900/30 dark:text-red-100 dark:ring-red-800/50"
    : "bg-amber-100 text-stone-900 ring-black/5 dark:bg-stone-800/80 dark:text-amber-50 dark:ring-white/10";
  return (
    <div className={`rounded-xl ring-1 px-4 py-3 ${styles}`}>
      {message}
    </div>
  );
}
