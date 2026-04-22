// ─── BookCard ──────────────────────────────────────────────────────────────────

import { BookOpen, Heart, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import LoadingSpinner from "../../../UI/LoadingSpinner";
import { cardVariants } from "@/app/lib/motionVariants";

/**
 * @param {{ book: object, displayMethod: "grid"|"list", isFav: boolean, favLoading: number|null, onToggleFav: (id:number)=>void, prefersReducedMotion: boolean }} props
 */
const BookCard = ({
  book,
  displayMethod,
  isFav,
  favLoading,
  onToggleFav,
  prefersReducedMotion,
}) => {
  return (
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
      {/* Cover Image */}
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
          className="object-cover w-full h-full transition-transform duration-500"
          sizes={displayMethod === "list" ? "160px" : "400px"}
        />
        <div className="cover-overlay" />
      </Link>

      {/* Card Body */}
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
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => onToggleFav(book.id)}
              className={`w-11 h-10 flex items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer ${
                isFav
                  ? "bg-red-50 border-red-300 text-red-500 hover:bg-red-100"
                  : "border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50"
              }`}
              aria-label={isFav ? "إزالة من المفضلة" : "إضافة للمفضلة"}
            >
              <motion.div
                animate={isFav ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Heart
                  size={18}
                  className={isFav ? "fill-red-500 text-red-500" : ""}
                />
              </motion.div>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
