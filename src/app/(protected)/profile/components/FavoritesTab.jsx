"use client";

import { ChevronLeft, Heart } from "lucide-react";
import Link from "next/link";
import BookRow from "./BookRow";
import SectionTitle from "./SectionTitle";
import EmptyState from "./EmptyState";
import LoadingSpinner from "@/app/UI/LoadingSpinner";
import { GOLD } from "@/lib/constants/colors";

const FavoritesTab = ({
  favoritesBooks,
  favoritesBooksloading,
  favoritesBooksError,
  favLoading,
  setFavLoading,
  removeFromFavFn,
}) => {
  if (favoritesBooksloading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 max-h-[600px] overflow-y-auto">
      <div className="flex items-center justify-between mb-1">
        <SectionTitle>مفضلتي</SectionTitle>
        <Link
          href="/favorites"
          className="flex items-center gap-1 text-sm font-semibold mb-6 transition-colors duration-200"
          style={{ color: GOLD }}
        >
          <ChevronLeft className="w-4 h-4" />
          عرض الكل
        </Link>
      </div>

      {favoritesBooksError ? (
        <p className="text-center text-rose-500 text-sm">{favoritesBooksError}</p>
      ) : favoritesBooks.length > 0 ? (
        favoritesBooks.slice(0, 3).map((b) => (
          <BookRow
            key={b.book.id}
            book={b.book}
            image={b.book.image}
            status="مفضلة"
            statusClass="bg-accent"
            actions={
              <>
                <Link href={`/books/${b.book.id}`}>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer hover:opacity-80 bg-primary/[7%] text-primary">
                    عرض التفاصيل
                  </button>
                </Link>
                {favLoading === b.book.id ? (
                  <div className="flex justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <button
                    onClick={async () => {
                      setFavLoading(b.book.id);
                      await removeFromFavFn(b.book.id);
                      setFavLoading(null);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer hover:opacity-80 bg-rose-50 text-rose-600"
                  >
                    <Heart className="w-3 h-3" />
                    إزالة
                  </button>
                )}
              </>
            }
          />
        ))
      ) : (
        <EmptyState
          icon={Heart}
          text="لا توجد مفضلة بعد"
          cta="اكتشف الكتب"
          ctaHref="/books"
        />
      )}
    </div>
  );
};

export default FavoritesTab;
