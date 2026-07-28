// ─── BooksPagination ───────────────────────────────────────────────────────────

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Builds the page-number list with ellipsis around the current page.
 */
function buildPageList(currentPage, totalPages) {
  const pages = [];
  const delta = 2;
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  pages.push(1);
  if (left > 2) pages.push("...");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push("...");
  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

/**
 * @param {{ currentPage: number, totalPages: number, totalBooks: number, onPageChange: (page:number)=>void }} props
 */
const BooksPagination = ({ currentPage, totalPages, totalBooks, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages);

  const navBtnClass =
    "flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-600 disabled:hover:bg-white cursor-pointer shadow-sm";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex justify-center items-center gap-2 mt-12 flex-wrap"
      >
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={navBtnClass}
        >
          <ChevronRight size={16} />
          السابق
        </button>

        {/* Page Numbers */}
        {pages.map((p, idx) =>
          p === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 py-2 text-gray-400 text-sm select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[40px] h-10 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer shadow-sm ${
                currentPage === p
                  ? "bg-primary text-white border-primary shadow-primary/25 shadow-md"
                  : "bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5"
              }`}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={navBtnClass}
        >
          التالي
          <ChevronLeft size={16} />
        </button>
      </motion.div>

      {/* Page info */}
      <p className="text-center text-xs text-gray-400 mt-4">
        صفحة {currentPage} من {totalPages} · إجمالي {totalBooks} كتاب
      </p>
    </>
  );
};

export default BooksPagination;
