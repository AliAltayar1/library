"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, User, ChevronLeft, ChevronRight } from "lucide-react";
import { getRecommendations } from "../../../lib/books/getRecommendations";

// ── Skeleton loader ──────────────────────────────────────────────────────────
const RecoSkeleton = () => (
  <div className="flex-shrink-0 w-[160px] sm:w-[190px] animate-pulse rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm">
    <div className="h-[220px] sm:h-[255px] bg-gray-200" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
  </div>
);

// ── Individual recommendation card ─────────────────────────────────────────
const RecoCard = ({ book, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
    className="flex-shrink-0 w-[160px] sm:w-[190px]"
  >
    <Link href={`/books/${book.id}`} className="group block">
      <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1.5 transition-all duration-300 h-full">
        {/* Book cover */}
        <div className="relative h-[220px] sm:h-[255px] overflow-hidden bg-gray-100">
          <Image
            src={book.image || "/placeholder.svg"}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 160px, 190px"
          />
          {/* Availability badge */}
          <span
            className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              book.is_avaiable
                ? "bg-emerald-500 text-white"
                : "bg-rose-500 text-white"
            }`}
          >
            {book.is_avaiable ? "متاح" : "غير متاح"}
          </span>
        </div>

        {/* Info */}
        <div className="p-3">
          {/* Category */}
          {book.category && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/[12%] text-accent-dark border border-accent/25 mb-1.5 inline-block">
              {book.category.name}
            </span>
          )}

          {/* Title */}
          <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-1">
            {book.title}
          </h4>

          {/* Author */}
          <p className="text-gray-400 text-xs flex items-center gap-1">
            <User size={11} />
            {book.author?.name || "مؤلف غير معروف"}
          </p>

          {/* Pages */}
          <p className="text-gray-300 text-[10px] flex items-center gap-1 mt-1">
            <BookOpen size={10} />
            {book.pages} صفحة
          </p>
        </div>
      </div>
    </Link>
  </motion.div>
);

// ── Main exported component ──────────────────────────────────────────────────
/**
 * @param {{ compact?: boolean }} props
 *   compact — when true, reduces heading size (suitable for profile page tab)
 */
const RecommendedBooks = ({ compact = false }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getRecommendations();
        setRecommendations(data.results || []);
      } catch (err) {
        setError(err.message || "تعذّر تحميل التوصيات");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -220 : 220,
        behavior: "smooth",
      });
    }
  };

  // Don't render at all if loaded and empty
  if (!loading && !error && recommendations.length === 0) return null;

  return (
    <section className="pb-10" dir="rtl">
      {/* ── Section header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 flex-shrink-0 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-200">
            <Sparkles size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <h2
              className={`font-black text-primary leading-tight ${
                compact ? "text-base" : "text-lg sm:text-xl"
              }`}
            >
              كتب مقترحة لك
            </h2>
            <p className="text-xs text-muted">بناءً على سجل قراءتك</p>
          </div>
        </div>

        {/* Scroll arrows */}
        {!loading && recommendations.length > 2 && (
          <div className="flex gap-1.5 flex-shrink-0">
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer"
              aria-label="سابق"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer"
              aria-label="تالي"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        )}
      </div>

      {/* ── Error state ─────────────────────────────────────────────── */}
      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
          {error}
        </p>
      )}

      {/* ── Scrollable horizontal row ────────────────────────────────── */}
      {!error && (
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 scroll-smooth custom-scroll"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <RecoSkeleton key={i} />)
            : recommendations.map((book, i) => (
                <RecoCard key={book.id} book={book} index={i} />
              ))}
        </div>
      )}
    </section>
  );
};

export default RecommendedBooks;
