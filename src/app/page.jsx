"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChartColumnStacked,
  Clock,
  Star,
  ArrowLeft,
} from "lucide-react";

import { getBooks } from "../../lib/books/getBooks";
import { getCategories } from "../../lib/categories/categories";
import LoadingSpinner from "./UI/LoadingSpinner";
import { toast } from "sonner";

// ── Home-page components ──────────────────────────────────────
import HeroSection from "./home/HeroSection";
import StatCard from "./home/StatCard";
import CategoryPill from "./home/CategoryPill";
import BookCard from "./home/BookCard";
import BookSkeleton from "./home/BookSkeleton";
import CTASection from "./home/CTASection";

/* ─────────────────────────────────────────────────────────────
   Home Page — orchestrates data fetching and renders sections
   ───────────────────────────────────────────────────────────── */
export default function Home() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cateLoading, setCateLoading] = useState(false);
  const [cateError, setCateError] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      setError(err.message || "فشل تحميل الكتب");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setCateLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setCateError(err.message);
    } finally {
      setCateLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  /* Stats config — values derived from fetched data */
  const stats = [
    {
      icon: BookOpen,
      value: `${books.length || 0}+`,
      label: "الكتب المتاحة",
      color: "#1a2f5e",
      delay: "delay-100",
    },
    {
      icon: ChartColumnStacked,
      value: `${categories.length || 0}+`,
      label: "الفئات المتاحة",
      color: "#7c3aed",
      delay: "delay-200",
    },
    {
      icon: Clock,
      value: "50,000+",
      label: "الساعات المحفوظة",
      color: "#0891b2",
      delay: "delay-300",
    },
    {
      icon: Star,
      value: "4.8/5",
      label: "متوسط التقييم",
      color: "#D4930A",
      delay: "delay-400",
    },
  ];

  return (
    <div dir="rtl" className="overflow-x-hidden">
      {/* ══════════ 1. HERO ══════════════════════════════════════ */}
      <HeroSection />

      {/* ══════════ 2. STATS ═════════════════════════════════════ */}
      <section className="relative py-20 bg-background">
        <div className="container">
          <div className="flex flex-col sm:flex-row gap-5 justify-center flex-wrap">
            {stats.map((s, i) => (
              <StatCard key={i} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 3. CATEGORIES ════════════════════════════════ */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(180deg, #F3EFE8 0%, #FAF8F5 100%)",
        }}
      >
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="animate-fadeSlideUp section-title text-3xl sm:text-4xl font-bold mb-4 text-primary">
              استكشف الفئات
            </h2>
            <p className="animate-fadeSlideUp delay-100 text-base mt-6 text-text-muted">
              اعثر على قراءتك الرائعة التالية من مجموعتنا المتنوعة
            </p>
          </div>

          {/* States */}
          {cateLoading && (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          )}
          {cateError && (
            <p className="text-center text-rose-500">{cateError}</p>
          )}
          {categories.length > 0 && (
            <div className="flex gap-4 flex-wrap justify-center">
              {categories.map((cat, i) => (
                <CategoryPill key={cat.id} category={cat} index={i} />
              ))}
            </div>
          )}

          {/* Footer link */}
          <div className="text-center mt-10">
            <Link
              href="/books"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200 text-accent"
            >
              <ArrowLeft className="w-4 h-4" />
              عرض جميع الفئات
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ 4. FEATURED BOOKS ════════════════════════════ */}
      <section className="py-20 bg-background">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="animate-fadeSlideUp section-title text-3xl sm:text-4xl font-bold mb-4 text-primary">
              الكتب المميزة
            </h2>
            <p className="animate-fadeSlideUp delay-100 text-base mt-6 text-text-muted">
              اختيارات مميزة من أفضل الكتب في مكتبتنا
            </p>
          </div>

          {/* Error */}
          {error && <p className="text-center text-rose-500 mb-6">{error}</p>}

          {/* Grid — skeleton while loading, cards when ready */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <BookSkeleton key={i} />
                ))
              : books.map((book) => <BookCard key={book.id} book={book} />)}
          </div>

          {/* View-all button */}
          {!loading && books.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/books">
                <button className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-base cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-primary to-primary-light text-white hover:from-accent hover:to-accent-light hover:text-primary">
                  <ArrowLeft className="w-4 h-4" />
                  عرض جميع الكتب
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ══════════ 5. CTA ═══════════════════════════════════════ */}
      <CTASection />
    </div>
  );
}
