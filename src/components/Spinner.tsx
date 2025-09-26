export default function Spinner() {
  return (
    <div className="w-full flex items-center justify-center py-10">
      <div
        role="status"
        aria-live="polite"
        aria-label="loading"
        className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-700 dark:border-amber-200/50 dark:border-t-amber-400"
      />
    </div>
  );
}
