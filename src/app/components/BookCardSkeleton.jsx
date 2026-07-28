// ─── BookCardSkeleton — Global reusable loading placeholder ───────────────────

/**
 * Animated skeleton that matches the BookCard layout.
 * Use it anywhere you need a book-card loading state.
 */
const BookCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
    <div className="w-full h-[270px] bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-5/6" />
      <div className="h-9 bg-gray-200 rounded-xl mt-4" />
    </div>
  </div>
);

export default BookCardSkeleton;
