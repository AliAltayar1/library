"use client";

import React, { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { getBooks } from "../../../../lib/books/getBooks";
import { getCategories } from "../../../../lib/categories/categories";
import { addToFav } from "../../../../lib/favorite/addToFav";
import { removeFromFav } from "../../../../lib/favorite/removeFromFav";

import BooksHero from "./_components/BooksHero";
import BooksFilterBar from "./_components/BooksFilterBar";
import BookCardSkeleton from "../../components/BookCardSkeleton";
import BookCard from "./_components/BookCard";
import BooksPagination from "./_components/BooksPagination";
import { containerVariants } from "@/app/lib/motionVariants";

// ─── Main Page ─────────────────────────────────────────────────────────────────

const Books = () => {
  const searchParams = useSearchParams();
  const categoryQry = searchParams.get("category");
  const prefersReducedMotion = useReducedMotion();

  // ── State ───────────────────────────────────────────────────────────────────
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favLoading, setFavLoading] = useState(null);

  // Filters & display
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [displayMethod, setDisplayMethod] = useState("grid");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  // ── Derived Data ────────────────────────────────────────────────────────────
  const favCount = books.filter((b) => b.is_like).length;

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

  // ── API Calls ───────────────────────────────────────────────────────────────
  const fetchBooks = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBooks(categoryQry, page);
      setBooks(data.results);
      const count = data.count || 0;
      setTotalBooks(count);
      setTotalPages(Math.ceil(count / 10));
    } catch (err) {
      setError(err.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err.message);
    }
  };

  const handleToggleFav = async (bookId) => {
    const book = books.find((b) => b.id === bookId);
    const isFav = book?.is_like;
    setFavLoading(bookId);
    // Optimistic update
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, is_like: !isFav } : b)),
    );
    try {
      if (isFav) {
        await removeFromFav(bookId);
        toast.success("تمت الإزالة من المفضلة");
      } else {
        await addToFav(bookId);
        toast.success("تمت الإضافة إلى المفضلة");
      }
    } catch (err) {
      // Rollback on failure
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, is_like: isFav } : b)),
      );
      toast.error("حدث خطأ: " + err.message);
    } finally {
      setFavLoading(null);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchBooks(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Effects ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchBooks(1);
    fetchCategories();
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" dir="rtl">
      {/* Hero */}
      <BooksHero
        totalBooks={totalBooks}
        filteredCount={sortedBooks.length}
        favCount={favCount}
      />

      <div className="container pb-16">
        {/* Search / Filter / Sort toolbar */}
        <BooksFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categories={categories}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          displayMethod={displayMethod}
          onDisplayChange={setDisplayMethod}
          resultCount={sortedBooks.length}
        />

        {/* Error */}
        {error && (
          <div className="text-center py-12 text-red-500 bg-red-50 rounded-2xl border border-red-100">
            {error}
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Books Grid / List */}
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
                <BookCard
                  key={book.id}
                  book={book}
                  displayMethod={displayMethod}
                  isFav={book.is_like}
                  favLoading={favLoading}
                  onToggleFav={handleToggleFav}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
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

        {/* Pagination */}
        {!loading && !error && (
          <BooksPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalBooks={totalBooks}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Books;
