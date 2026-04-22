// ─── QuoteCard ─────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Quote, Heart } from "lucide-react";
import { NAVY, NAVY2 } from "@/lib/constants/colors";

const TEXT_LIMIT = 120;

/**
 * @param {{ quote: object, onLikeToggle: (q:object)=>void, loadingId: number|null, user: object }} props
 */
export default function QuoteCard({ quote, onLikeToggle, loadingId, user }) {
  const isLiked = quote.is_liked;
  const likeCount = quote.likes_count ?? 0;
  const isLoading = loadingId === quote.id;
  const authorName = quote.writer_full_name || "مجهول";
  const authorUsername = quote.username || "";

  const [expanded, setExpanded] = useState(false);
  const isLong = quote.content?.length > TEXT_LIMIT;

  return (
    <div
      className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4
        transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-200 group"
    >
      {/* Decorative quote mark */}
      <div className="absolute top-4 left-4 opacity-[0.06] pointer-events-none select-none">
        <Quote className="w-16 h-16 text-primary" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 text-right">
        <p
          className={`text-primary font-semibold text-base leading-relaxed break-words whitespace-pre-wrap ${
            !expanded && isLong ? "line-clamp-3" : ""
          }`}
        >
          {quote.content}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="text-xs font-bold text-accent hover:text-accent-light mt-1 cursor-pointer transition-colors"
          >
            {expanded ? "أقل" : "اقرأ المزيد"}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
        {/* Author */}
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
            style={{
              background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
            }}
          >
            {authorName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-primary truncate">
              {authorName}
            </p>
            {authorUsername && (
              <p className="text-[10px] text-gray-400 truncate">
                @{authorUsername}
              </p>
            )}
          </div>
        </div>

        {/* Like button */}
        <button
          onClick={() => onLikeToggle(quote)}
          disabled={!user?.isValid || isLoading}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
            transition-all duration-200 cursor-pointer active:scale-90 disabled:cursor-not-allowed
            ${
              isLiked
                ? "bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-100"
                : "bg-gray-50 text-gray-400 border border-gray-200 hover:bg-rose-50 hover:text-rose-400 hover:border-rose-200"
            }
            ${!user?.isValid ? "opacity-60" : ""}
          `}
          title={
            !user?.isValid
              ? "سجّل الدخول للإعجاب"
              : isLiked
                ? "إلغاء الإعجاب"
                : "إعجاب"
          }
        >
          {isLoading ? (
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
          ) : (
            <Heart
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isLiked
                  ? "fill-rose-500 text-rose-500 scale-110"
                  : "fill-transparent"
              }`}
            />
          )}
          <span>{likeCount}</span>
        </button>
      </div>
    </div>
  );
}
