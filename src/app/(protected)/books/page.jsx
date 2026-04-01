"use client";

/**
 * Books Component - Premium redesigned books browsing page
 *
 * @description This component provides a comprehensive books browsing interface with:
 * - Premium hero header with gradient background
 * - Glassmorphism search & filter bar
 * - Animated book cards with hover effects (Framer Motion)
 * - Staggered card entrance animations
 * - Grid/List view toggle with layout animations
 * - Favorites management with spring animations
 * - Responsive design with skeleton loading states
 *
 * @returns {JSX.Element} The Books page component
 */

import {
  ArrowUpNarrowWide,
  BookOpen,
  Grid3x3,
  Heart,
  List,
  Search,
  SlidersHorizontal,
  User,
  Library,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "../../UI/LoadingSpinner";
import { addToFav } from "../../../../lib/favorite/addToFav";
import { getCategories } from "../../../../lib/categories/categories";
import { getBooks } from "../../../../lib/books/getBooks";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { getFavoritesBooks } from "../../../../lib/favorite/getFavBook";
import { removeFromFav } from "../../../../lib/favorite/removeFromFav";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.8, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    y: -16,
    scale: 0.96,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" },
  }),
};

// ─── Skeleton Card ─────────────────────────────────────────────────────────────

const SkeletonCard = () => (
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

// ─── Main Component ────────────────────────────────────────────────────────────

const Books = () => {
  const searchParams = useSearchParams();
  const categoryQry = searchParams.get("category");
  const prefersReducedMotion = useReducedMotion();

  // ── State ──────────────────────────────────────────────────────────────────
  const [sortBy, setSortBy] = useState("title");
  const [displayMethod, setDisplayMethod] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [favLoading, setFavLoading] = useState(null);
  const [favoritesBooks, setFavoritesBooks] = useState([]);

  // ── API Functions ──────────────────────────────────────────────────────────
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooks(categoryQry);
      setBooks(data);
    } catch (err) {
      setError(err.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const getCategoriesFn = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err.message);
    }
  };

  const favoriteIds = new Set(
    favoritesBooks && favoritesBooks.map((fav) => fav.book.id),
  );

  const addToFavFn = async (bookId) => {
    try {
      await addToFav(bookId);
      await getFavoritesBooksFn();
      toast.success("تمت الإضافة إلى المفضلة");
    } catch (err) {
      toast.error("حدث خطأ أثناء الإضافة: " + err.message);
    }
  };

  const removeFromFavFn = async (bookId) => {
    try {
      await removeFromFav(bookId);
      await getFavoritesBooksFn();
      toast.success("تمت الإزالة من المفضلة");
    } catch (err) {
      toast.error("حدث خطأ أثناء الإزالة: " + err.message);
    }
  };

  const getFavoritesBooksFn = async () => {
    try {
      const data = await getFavoritesBooks();
      setFavoritesBooks(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ── Filtering & Sorting ────────────────────────────────────────────────────
  const filteredBooks = books.filter((b) => {
    const matchSearch =
      b.author?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory !== "all" ? b.category?.name === selectedCategory : true;
    return matchSearch && matchCategory;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    const getValue = (item) =>
      sortBy === "author" ? item.author?.name || "" : (item[sortBy] ?? "");
    return getValue(a).localeCompare(getValue(b));
  });

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchBooks();
    getCategoriesFn();
    getFavoritesBooksFn();
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" dir="rtl">
      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden mb-10"
        style={{
          background:
            "linear-gradient(135deg, #0F1B3C 0%, #1a2f5e 60%, #0f2251 100%)",
        }}
      >
        {/* Decorative orbs */}
        <div
          className="absolute -top-16 -left-16 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #D4930A, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-20 -right-10 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #f6c54e, transparent 70%)",
          }}
        />

        <div className="container py-14 relative z-10">
          {/* Badge */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6"
          >
            <Library size={15} className="text-amber-400" />
            <span className="text-amber-300 text-sm font-medium">خير جليس</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
          >
            تصفح <span className="gradient-text">الكتب</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={0.2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-white/70 text-lg max-w-lg"
          >
            اكتشف قراءتك الرائعة التالية من مجموعتنا الواسعة من آلاف الكتب في
            شتى المجالات.
          </motion.p>

          {/* Stats */}
          <motion.div
            custom={0.3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-8 flex flex-wrap gap-6"
          >
            {[
              { icon: BookOpen, label: "إجمالي الكتب", value: books.length },
              { icon: Search, label: "نتائج البحث", value: sortedBooks.length },
              { icon: Heart, label: "المفضلة", value: favoritesBooks.length },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-2.5"
              >
                <Icon size={18} className="text-amber-400" />
                <div>
                  <p className="text-white/60 text-xs">{label}</p>
                  <p className="text-white font-bold text-lg leading-none">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="container pb-16">
        {/* ── Search & Filter Bar ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="glass-card rounded-2xl p-5 mb-8 border border-white/60"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="البحث بالعنوان أو المؤلف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-200 rounded-xl py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200 bg-white/80 text-sm placeholder:text-gray-400"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <SlidersHorizontal
                size={16}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
              />
              <select
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-gray-600 bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200 text-sm min-w-[160px] appearance-none cursor-pointer"
              >
                <option value="all">جميع الفئات</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* ── Toolbar: Sort + Display Toggle ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex flex-wrap justify-between items-center gap-4 mb-8"
        >
          {/* Book count */}
          <p className="text-sm text-gray-500">
            عُثر على{" "}
            <span className="font-semibold text-primary">
              {sortedBooks.length}
            </span>{" "}
            كتاب
            {searchTerm && (
              <span className="text-amber-600"> · نتائج "{searchTerm}"</span>
            )}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Sort Controls */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              <span className="text-xs text-gray-400 px-2">ترتيب:</span>
              {[
                { value: "title", label: "العنوان", icon: ArrowUpNarrowWide },
                { value: "author", label: "المؤلف", icon: User },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setSortBy(value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    sortBy === value
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            {/* Display Toggle */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              {[
                { value: "grid", icon: Grid3x3 },
                { value: "list", icon: List },
              ].map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setDisplayMethod(value)}
                  className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    displayMethod === value
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={17} />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Error State ─────────────────────────────────────────────── */}
        {error && (
          <div className="text-center py-12 text-red-500 bg-red-50 rounded-2xl border border-red-100">
            {error}
          </div>
        )}

        {/* ── Loading Skeletons ─────────────────────────────────────── */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ── Books Grid / List ─────────────────────────────────────── */}
        {!loading && (
          <motion.div
            key={displayMethod}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={
              displayMethod === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-5"
            }
          >
            <AnimatePresence mode="popLayout">
              {sortedBooks.map((book) => (
                <motion.div
                  key={book.id}
                  layout={!prefersReducedMotion}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={
                    !prefersReducedMotion
                      ? { y: -6, boxShadow: "0 20px 48px rgba(15,27,60,0.18)" }
                      : {}
                  }
                  className={`book-card bg-white overflow-hidden ${
                    displayMethod === "list" ? "flex flex-row" : "flex flex-col"
                  }`}
                >
                  {/* ── Cover Image ──────────────────────────────────── */}
                  <Link
                    href={`/books/${book.id}`}
                    className={`cover-wrap block overflow-hidden flex-shrink-0 ${
                      displayMethod === "list"
                        ? "w-[120px] md:w-[160px] h-full min-h-[180px]"
                        : "w-full h-[270px]"
                    }`}
                  >
                    <Image
                      src={book.image || "/placeholder.svg"}
                      alt={book.title}
                      fill={displayMethod !== "list"}
                      width={displayMethod === "list" ? 160 : undefined}
                      height={displayMethod === "list" ? 220 : undefined}
                      className={`object-cover w-full h-full transition-transform duration-500`}
                      sizes={displayMethod === "list" ? "160px" : "400px"}
                    />
                    {/* Hover overlay */}
                    <div className="cover-overlay" />
                  </Link>

                  {/* ── Card Body ────────────────────────────────────── */}
                  <div className="flex flex-col flex-1 p-5">
                    {/* Category & Pages */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/[12%] text-accent-dark border border-accent/30">
                        {book.category?.name || "عام"}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <BookOpen size={12} />
                        {book.pages} صفحة
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-gray-900 mb-1 leading-snug line-clamp-2 text-[15px]">
                      {book.title}
                    </h3>

                    {/* Author */}
                    <p className="text-gray-500 text-sm mb-3 flex items-center gap-1.5">
                      <User size={13} className="text-gray-400" />
                      {book.author?.name || "مؤلف غير معروف"}
                    </p>

                    {/* Description */}
                    <p className="text-gray-500 text-sm line-clamp-2 mb-5 flex-1">
                      {book.description}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      {/* View Details */}
                      <Link
                        href={`/books/${book.id}`}
                        className="flex-1 text-center bg-primary hover:bg-hover-dark text-white rounded-xl py-2.5 px-4 text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
                      >
                        عرض التفاصيل
                      </Link>

                      {/* Favorite Button */}
                      {favLoading === book.id ? (
                        <div className="w-11 h-10 flex items-center justify-center border border-gray-200 rounded-xl">
                          <LoadingSpinner />
                        </div>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          whileHover={{ scale: 1.08 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 17,
                          }}
                          onClick={async () => {
                            setFavLoading(book.id);
                            favoriteIds.has(book.id)
                              ? await removeFromFavFn(book.id)
                              : await addToFavFn(book.id);
                            setFavLoading(null);
                          }}
                          className={`w-11 h-10 flex items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer ${
                            favoriteIds.has(book.id)
                              ? "bg-red-50 border-red-300 text-red-500 hover:bg-red-100"
                              : "border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50"
                          }`}
                          aria-label={
                            favoriteIds.has(book.id)
                              ? "إزالة من المفضلة"
                              : "إضافة للمفضلة"
                          }
                        >
                          <motion.div
                            animate={
                              favoriteIds.has(book.id)
                                ? { scale: [1, 1.4, 1] }
                                : { scale: 1 }
                            }
                            transition={{ duration: 0.35, ease: "easeOut" }}
                          >
                            <Heart
                              size={18}
                              className={
                                favoriteIds.has(book.id)
                                  ? "fill-red-500 text-red-500"
                                  : ""
                              }
                            />
                          </motion.div>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Empty State ──────────────────────────────────────────────── */}
        {!loading && !error && sortedBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-primary/[6%]">
              <BookOpen size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              لا توجد كتب
            </h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              لم نعثر على كتب تطابق بحثك. حاول تغيير الفلاتر أو مصطلح البحث.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="mt-6 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-hover-dark transition-colors cursor-pointer"
            >
              إعادة تعيين الفلاتر
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Books;
