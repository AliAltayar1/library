/**
 * BookSkeleton — Animated loading placeholder for BookCard
 * Rendered while books are being fetched from the API
 */
export default function BookSkeleton() {
  return (
    <div className="book-card animate-pulse">
      <div className="h-64 bg-slate-200" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2 mt-1" />
        <div className="h-9 bg-slate-200 rounded-xl mt-auto" />
      </div>
    </div>
  );
}
