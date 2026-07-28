"use client";

/**
 * Book Component - Individual Book Details Page (Dynamic Route)
 *
 * Premium redesign:
 * - Dark navy hero banner with book cover and title
 * - Glassmorphism action card (borrow + favorite)
 * - Metadata grid with icon pills
 * - Category browse CTA
 * All existing API logic preserved unchanged.
 */

import {
  ArrowRight,
  BookCheck,
  BookCopy,
  BookOpen,
  Calendar,
  Hash,
  Heart,
  User,
  Layers,
  MapPin,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronUp,
  Star,
  Stars,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBook } from "../../../../../lib/books/getBooks";
import { borrowBook } from "../../../../../lib/user/borrow";
import { reserveBook } from "../../../../../lib/user/reserve";
import { profileBorrowed } from "../../../../../lib/user/profileBorrowed";
import { toast } from "sonner";
import LoadingSpinner from "@/app/UI/LoadingSpinner";
import { addToFav } from "../../../../../lib/favorite/addToFav";
import { removeFromFav } from "../../../../../lib/favorite/removeFromFav";
import { motion } from "framer-motion";
import { addSummary } from "../../../../../lib/books/addSummary";
import { getBookSummaries } from "../../../../../lib/books/getBookSummaries";
import { useAuth } from "@/app/components/AuthContext";
import { NAVY, NAVY2, GOLD, GOLD2, PARCH } from "@/lib/constants/colors";

const Book = () => {
  const params = useParams();
  const id = Number(params.id);
  const { user } = useAuth();

  // ─── State ────────────────────────────────────────────────────
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const [borrowLoading, setBorrorLoading] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  // ─── Summary state ────────────────────────────────────────────
  const [summaries, setSummaries] = useState([]);
  const [summaryText, setSummaryText] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [submittingSummary, setSubmittingSummary] = useState(false);
  const [showSummaries, setShowSummaries] = useState(true);

  // Derive if the current book is already borrowed by the user
  const isBorrowed = borrowedBooks.some((b) => b.book?.id === book.id);

  // ─── API ──────────────────────────────────────────────────────
  const fetchBook = async (id) => {
    setLoading(true);
    try {
      const data = await getBook(id);
      setBook(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFav = async () => {
    const isFav = book.is_like;
    setFavLoading(true);
    // Optimistic update
    setBook((prev) => ({ ...prev, is_like: !isFav }));
    try {
      if (isFav) {
        await removeFromFav(book.id);
        toast.success("تمت الإزالة من المفضلة");
      } else {
        await addToFav(book.id);
        toast.success("تمت الإضافة إلى المفضلة");
      }
    } catch (error) {
      // Rollback on failure
      setBook((prev) => ({ ...prev, is_like: isFav }));
      toast.error("حدث خطأ: " + error.message);
    } finally {
      setFavLoading(false);
    }
  };

  const borrowBookFn = async (bookId) => {
    setBorrorLoading(true);
    try {
      await borrowBook(bookId);
      toast.success("تمت استعارة الكتاب بنجاح");
      // Refresh borrowed list so isBorrowed updates immediately
      const updated = await profileBorrowed();
      setBorrowedBooks(updated);
    } catch (error) {
      toast.error("حدث خطأ أثناء الاستعارة: " + error.message);
    } finally {
      setBorrorLoading(false);
    }
  };

  const reserveBookFn = async (bookId) => {
    setBorrorLoading(true);
    try {
      await reserveBook(bookId);
      toast.success("تم حجز الكتاب مسبقاً بنجاح!");
    } catch (error) {
      toast.error("حدث خطأ أثناء الحجز: " + error.message);
    } finally {
      setBorrorLoading(false);
    }
  };

  // ─── Summary API ──────────────────────────────────────────────
  const fetchSummaries = async () => {
    setSummaryLoading(true);
    try {
      const data = await getBookSummaries(id);
      setSummaries(data);
    } catch (_) {
      // silently fail
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleSubmitSummary = async () => {
    if (!user) {
      toast.error("يرجى تسجيل الدخول أولاً لإضافة تعليق");
      return;
    }
    if (!summaryText.trim()) {
      toast.error("يرجى كتابة التعليق قبل الإرسال");
      return;
    }
    setSubmittingSummary(true);
    try {
      await addSummary(id, summaryText.trim());
      toast.success("تم نشر تعليقك بنجاح!");
      setSummaryText("");
      fetchSummaries();
    } catch (err) {
      toast.error("حدث خطأ: " + err.message);
    } finally {
      setSubmittingSummary(false);
    }
  };

  useEffect(() => {
    fetchBook(id);
    fetchSummaries();
    // Fetch current borrowed books to check if this one is already borrowed
    profileBorrowed()
      .then(setBorrowedBooks)
      .catch(() => {});
  }, []);

  const isFav = book.is_like;

  // ─── Metadata items ───────────────────────────────────────────
  const metaItems = [
    { icon: User, label: "المؤلف", value: book.author?.name || "غير محدد" },
    { icon: Layers, label: "الفئة", value: book.category?.name || "عام" },
    { icon: Hash, label: "الرقم المعياري", value: book.isbn || "—" },
    { icon: Calendar, label: "سنة النشر", value: book.publication_year || "—" },
    { icon: BookOpen, label: "عدد الصفحات", value: book.pages || 0 },
    { icon: BookCopy, label: "النسخ الكلية", value: book.total_copies || 0 },
    {
      icon: BookCopy,
      label: "النسخ المتاحة",
      value: book.available_copies || 0,
    },
    {
      icon: MapPin,
      label: "رف الكتاب",
      value: book.possition || "لا يوجد",
    },
  ];

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div dir="rtl" style={{ background: PARCH, minHeight: "100vh" }}>
      {/* ── Hero Banner ──────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 60%, #0c1628 100%)`,
          minHeight: 320,
        }}
      >
        {/* Glow orbs */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 10% 50%, rgba(212,147,10,0.10) 0%, transparent 70%), " +
              "radial-gradient(ellipse 40% 50% at 85% 40%, rgba(79,172,254,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="container relative z-10 py-10 flex flex-col lg:flex-row items-center lg:items-end gap-8">
          {/* Cover thumbnail */}
          {!loading && book.image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0 w-[160px] h-[220px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10"
            >
              <Image
                src={book.image}
                alt={book.title || "book cover"}
                width={160}
                height={220}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {/* Title block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 text-center lg:text-right pb-2"
          >
            {/* Category pill */}
            {book.category?.name && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                style={{
                  background: "rgba(212,147,10,0.18)",
                  color: GOLD2,
                  border: `1px solid ${GOLD}44`,
                }}
              >
                <Layers className="w-3 h-3" />
                {book.category.name}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
              {book.title || "..."}
            </h1>
            <p
              className="text-lg font-medium"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              بقلم {book.author?.name || "—"}
            </p>

            {/* Star rating */}
            <div className="flex items-center gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.round(book.average_rating || 0)
                      ? "text-amber-400 fill-amber-400"
                      : "text-white/20"
                  }`}
                />
              ))}
              <span className="text-xs font-medium mr-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>
                {Number(book.average_rating || 0).toFixed(1)} ({book.rating_count || 0} تقييم)
              </span>
            </div>

            {/* Availability badge */}
            <div className="mt-4 inline-flex">
              <span
                className="px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: book.is_avaiable
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(239,68,68,0.15)",
                  color: book.is_avaiable ? "#4ade80" : "#f87171",
                  border: book.is_avaiable
                    ? "1px solid rgba(34,197,94,0.30)"
                    : "1px solid rgba(239,68,68,0.30)",
                }}
              >
                {book.is_avaiable ? "متاح للاستعارة" : "مُستعار حالياً"}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Diagonal clip */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ lineHeight: 0 }}
        >
          <svg
            viewBox="0 0 1440 60"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full"
            style={{ display: "block", height: 60 }}
          >
            <path d="M0,60 L1440,0 L1440,60 Z" fill={PARCH} />
          </svg>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="container py-10 pb-20">
        {/* Back link */}
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-sm font-semibold mb-8 transition-all duration-200 hover:gap-3 text-primary"
        >
          <ArrowRight className="w-4 h-4" />
          العودة إلى الكتب
        </Link>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-24">
            <LoadingSpinner />
          </div>
        )}

        {!loading && (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* ── Left Column: Cover + Actions ──────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-[300px] flex-shrink-0 flex flex-col gap-4"
            >
              {/* Full cover */}
              <div
                className="w-full rounded-2xl overflow-hidden shadow-2xl"
                style={{ aspectRatio: "3/4", position: "relative" }}
              >
                <Image
                  src={book.image || "/placeholder.svg"}
                  alt={book.title || "book cover"}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Action card */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{
                  background: "white",
                  border: "1.5px solid #e2e8f0",
                  boxShadow: "0 4px 24px rgba(15,27,60,0.07)",
                }}
              >
                {/* Borrow / Reserve button */}
                {borrowLoading ? (
                  <div className="flex justify-center py-2">
                    <LoadingSpinner />
                  </div>
                ) : (
                  (() => {
                    const atLimit =
                      book.available_books !== undefined &&
                      book.available_books === 0;

                    if (!book.is_avaiable) {
                      return (
                        <button
                          onClick={() => reserveBookFn(book.id)}
                          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer shadow-[0_4px_16px_rgba(212,147,10,0.25)]"
                          style={{
                            background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`,
                            color: NAVY,
                          }}
                        >
                          <BookCheck className="w-4 h-4" />
                          حجز مسبق (الكتاب مُستعار)
                        </button>
                      );
                    }

                    const canBorrow = !isBorrowed && !atLimit;
                    return (
                      <>
                        <button
                          disabled={!canBorrow}
                          onClick={() => borrowBookFn(book.id)}
                          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all duration-200"
                          style={{
                            background: isBorrowed
                              ? "rgba(34,197,94,0.10)"
                              : atLimit
                                ? "rgba(239,68,68,0.08)"
                                : `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
                            color: isBorrowed
                              ? "#16a34a"
                              : atLimit
                                ? "#dc2626"
                                : "white",
                            border: isBorrowed
                              ? "1.5px solid rgba(34,197,94,0.30)"
                              : atLimit
                                ? "1.5px solid rgba(239,68,68,0.25)"
                                : "none",
                            cursor: canBorrow ? "pointer" : "not-allowed",
                            boxShadow: canBorrow
                              ? "0 4px 16px rgba(15,27,60,0.25)"
                              : "none",
                          }}
                        >
                          {atLimit ? (
                            <Stars className="w-4 h-4" />
                          ) : (
                            <BookCheck className="w-4 h-4" />
                          )}
                          {isBorrowed
                            ? "مُستعار بالفعل"
                            : atLimit
                              ? "وصلت للحد الأقصى"
                              : "استعارة الكتاب"}
                        </button>
                        {atLimit && (
                          <p className="text-xs text-center text-rose-500 -mt-1">
                            أرجع كتاباً من{" "}
                            <a
                              href="/profile"
                              className="underline font-semibold"
                            >
                              ملفك الشخصي
                            </a>{" "}
                            لتتمكن من الاستعارة.
                          </p>
                        )}
                      </>
                    );
                  })()
                )}

                {/* Favorite button */}
                {favLoading ? (
                  <div className="flex justify-center py-2">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <button
                    onClick={handleToggleFav}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer"
                    style={{
                      background: isFav ? "rgba(239,68,68,0.08)" : `${NAVY}08`,
                      color: isFav ? "#ef4444" : NAVY,
                      border: isFav
                        ? "1.5px solid rgba(239,68,68,0.25)"
                        : `1.5px solid ${NAVY}20`,
                    }}
                  >
                    <Heart
                      className="w-4 h-4"
                      style={{ fill: isFav ? "#ef4444" : "none" }}
                    />
                    {isFav ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                  </button>
                )}

                {/* Category browse */}
                <Link
                  href={{
                    pathname: "/books",
                    query: { category: book.category?.name },
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 text-center"
                  style={{
                    background: `${GOLD}12`,
                    color: GOLD,
                    border: `1.5px solid ${GOLD}30`,
                  }}
                >
                  <Layers className="w-4 h-4" />
                  تصفح كتب {book.category?.name || "هذه الفئة"}
                </Link>
              </div>
            </motion.div>

            {/* ── Right Column: Info ─────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 flex flex-col gap-6"
            >
              {/* Description card */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "white",
                  border: "1.5px solid #e2e8f0",
                  boxShadow: "0 2px 16px rgba(15,27,60,0.05)",
                }}
              >
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-primary">
                  <span
                    className="w-1 h-5 rounded-full inline-block"
                    style={{
                      background: `linear-gradient(180deg, ${GOLD} 0%, ${GOLD2} 100%)`,
                    }}
                  />
                  نبذة عن الكتاب
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {book.description || "لا يوجد وصف متاح لهذا الكتاب."}
                </p>
              </div>

              {/* Metadata card */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "white",
                  border: "1.5px solid #e2e8f0",
                  boxShadow: "0 2px 16px rgba(15,27,60,0.05)",
                }}
              >
                <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-primary">
                  <span
                    className="w-1 h-5 rounded-full inline-block"
                    style={{
                      background: `linear-gradient(180deg, ${GOLD} 0%, ${GOLD2} 100%)`,
                    }}
                  />
                  معلومات الكتاب
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {metaItems.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 p-3 rounded-xl transition-colors duration-150 hover:bg-gray-50"
                      style={{ border: "1px solid #f1f5f9" }}
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/[8%]">
                        <Icon className="w-4 h-4 text-primary-light" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-gray-400 font-medium">
                          {label}
                        </span>
                        <span className="text-sm font-bold truncate text-primary">
                          {value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Comments Section ──────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl p-6"
                style={{
                  background: "white",
                  border: "1.5px solid #e2e8f0",
                  boxShadow: "0 2px 16px rgba(15,27,60,0.05)",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold flex items-center gap-2 text-primary">
                    <span
                      className="w-1 h-5 rounded-full inline-block"
                      style={{
                        background: `linear-gradient(180deg, ${GOLD} 0%, ${GOLD2} 100%)`,
                      }}
                    />
                    <MessageSquare className="w-5 h-5 text-accent" />
                    تعليقات وآراء القراء
                    {summaries.length > 0 && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/[10%] text-primary-light">
                        {summaries.length}
                      </span>
                    )}
                  </h2>
                  <button
                    onClick={() => setShowSummaries((v) => !v)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    {showSummaries ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>

                {showSummaries && (
                  <>
                    {/* Add comment form */}
                    <div
                      className="rounded-xl p-4 mb-5"
                      style={{
                        background: `${NAVY}05`,
                        border: `1px solid ${NAVY}10`,
                      }}
                    >
                      <textarea
                        value={summaryText}
                        onChange={(e) => setSummaryText(e.target.value)}
                        placeholder="شاركنا رأيك وتعليقك حول الكتاب..."
                        rows={4}
                        disabled={!user}
                        className="w-full py-2.5 px-3 border border-gray-200 rounded-xl outline-none
                                   focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                                   transition-all text-gray-800 text-sm resize-none
                                   disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                      <div className="flex justify-end mt-2">
                        {
                          <button
                            onClick={handleSubmitSummary}
                            disabled={submittingSummary || !summaryText.trim()}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm
                                       text-white transition-all duration-200 cursor-pointer
                                       hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{
                              background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
                            }}
                          >
                            <Send className="w-3.5 h-3.5" />
                            {submittingSummary
                              ? "جارٍ النشر..."
                              : "نشر التعليق"}
                          </button>
                        }
                      </div>
                    </div>

                    {/* Comments list */}
                    {summaryLoading && (
                      <div className="flex justify-center py-6">
                        <LoadingSpinner />
                      </div>
                    )}

                    {!summaryLoading && summaries.length === 0 && (
                      <div className="text-center text-gray-400 py-8">
                        <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm font-medium">
                          لا توجد تعليقات بعد
                        </p>
                        <p className="text-xs mt-1">
                          كن أول من يشارك رأيه حول هذا الكتاب
                        </p>
                      </div>
                    )}

                    {!summaryLoading && summaries.length > 0 && (
                      <div className="flex flex-col gap-3 w-full">
                        {summaries.map((s, i) => (
                          <div
                            key={s.id ?? i}
                            className="rounded-xl p-4 overflow-hidden w-full min-w-0"
                            style={{
                              background: i % 2 === 0 ? `${NAVY}04` : "#fafaf9",
                              border: "1px solid #f1f5f9",
                            }}
                          >
                            {/* User info row */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-primary/[8%] text-primary">
                                {s.username[0].toUpperCase()}
                              </div>
                              <span className="text-xs font-semibold text-primary-light">
                                {`${s.first_name} ${s.last_name}`}
                              </span>
                              {s.created_at && (
                                <span className="text-xs text-gray-300 mr-auto">
                                  {new Date(s.created_at).toLocaleDateString(
                                    "ar-SA",
                                  )}
                                </span>
                              )}
                            </div>
                            {/* Comment text */}
                            <p
                              className="text-sm text-gray-600 leading-relaxed break-words"
                              style={{
                                overflowWrap: "anywhere",
                                wordBreak: "break-word",
                              }}
                            >
                              {s.summary}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Book;
