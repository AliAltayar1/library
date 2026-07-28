import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

const STARS = [1, 2, 3, 4, 5];

/**
 * BookCard — Premium card for displaying a single book
 * @param {{ book: { id: number, title: string, image: string, author: { name: string }, category: { name: string }, is_avaiable: boolean } }} props
 */
export default function BookCard({ book }) {
  return (
    <div className="book-card flex flex-col h-full">
      {/* ── Cover image ── */}
      <div className="cover-wrap relative h-64 w-full">
        <Image
          src={book.image || "/placeholder.svg"}
          alt={book.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="cover-overlay" />

        {/* Category badge */}
        <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full text-white backdrop-blur-sm bg-primary/70">
          {book.category?.name || "عام"}
        </span>

        {/* Availability chip */}
        <span
          className={`absolute bottom-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${
            book.is_avaiable
              ? "bg-emerald-500 text-white"
              : "bg-rose-500 text-white"
          }`}
        >
          {book.is_avaiable ? "✓ متاح" : "✗ مُستعار"}
        </span>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Star rating */}
        <div className="flex items-center gap-0.5">
          {STARS.map((s) => (
            <Star
              key={s}
              className={`w-3.5 h-3.5 ${
                s <= Math.round(book.average_rating || 0)
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-200"
              }`}
            />
          ))}
          <span className="text-xs text-gray-400 mr-1">
            ({book.rating_count || 0})
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base leading-snug line-clamp-2 text-primary">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-sm italic text-text-muted">
          {book.author?.name || "مؤلف غير معروف"}
        </p>

        {/* View details button */}
        <Link href={`/books/${book.id}`} className="mt-auto">
          <button className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer bg-gradient-to-br from-primary to-primary-light text-white hover:from-accent hover:to-accent-light hover:text-primary">
            عرض التفاصيل
          </button>
        </Link>
      </div>
    </div>
  );
}
