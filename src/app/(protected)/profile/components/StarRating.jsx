"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { rateBook } from "../../../../../lib/books/rateBook";

/**
 * Interactive star-rating widget.
 * Shows 5 stars with hover preview and click-to-rate.
 *
 * @param {{ bookId: number, initialRating?: number, size?: string }} props
 */
export default function StarRating({
  bookId,
  initialRating = 0,
  size = "w-4 h-4",
}) {
  const [rating, setRating] = useState(initialRating);
  const [hovered, setHovered] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleRate = async (value) => {
    if (loading) return;
    setLoading(true);
    try {
      await rateBook(bookId, value);
      setRating(value);
      toast.success("تم التقييم بنجاح!");
    } catch (err) {
      toast.error("حدث خطأ أثناء التقييم: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const display = hovered || rating;

  return (
    <div
      className={`flex items-center gap-0.5 ${loading ? "opacity-50 pointer-events-none" : ""}`}
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => handleRate(s)}
          onMouseEnter={() => setHovered(s)}
          className="cursor-pointer transition-transform duration-150 hover:scale-125 p-0 border-0 bg-transparent"
          title={`${s} من 5`}
        >
          <Star
            className={`${size} transition-colors duration-150 ${
              s <= display ? "text-amber-400 fill-amber-400" : "text-slate-200"
            }`}
          />
        </button>
      ))}
      {rating > 0 && (
        <span className="text-xs text-gray-400 mr-1.5 font-medium">
          {rating}/5
        </span>
      )}
    </div>
  );
}
