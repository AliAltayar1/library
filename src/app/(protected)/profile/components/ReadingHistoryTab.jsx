"use client";

import { BookOpen, RotateCcw, Stars, TrendingUp } from "lucide-react";
import Link from "next/link";
import BookRow from "./BookRow";
import SectionTitle from "./SectionTitle";
import EmptyState from "./EmptyState";
import LoadingSpinner from "@/app/UI/LoadingSpinner";
import StarRating from "./StarRating";

const ReadingHistoryTab = ({
  booksLog,
  booksLogLoading,
  booksLogError,
  borrowedBookIds,
  borrowBookLoading,
  setBorrowBookLoading,
  borrowBookFn,
  availableBooks,
}) => {
  if (booksLogLoading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 max-h-[600px] overflow-y-auto">
      <SectionTitle>سجل القراءة</SectionTitle>
      {booksLogError ? (
        <p className="text-center text-rose-500 text-sm">{booksLogError}</p>
      ) : booksLog.length > 0 ? (
        booksLog.map((log) => (
          <BookRow
            key={log.id}
            book={log.book}
            image={log.book.image}
            status={`مُرجَع${log.return_date ? " · " + log.return_date : ""}`}
            statusClass="bg-emerald-600"
            extra={
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-1">
                <span className="text-xs font-semibold text-slate-500">تقييمك للكتاب:</span>
                <StarRating bookId={log.book.id} initialRating={Math.round(log.book.average_rating || 0)} />
              </div>
            }
            actions={
              <>
                <Link href={`/books/${log.book.id}`}>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer hover:opacity-80 bg-primary/[7%] text-primary">
                    عرض التفاصيل
                  </button>
                </Link>
                {borrowBookLoading === log.book.id ? (
                  <div className="flex justify-center">
                    <LoadingSpinner />
                  </div>
                ) : borrowedBookIds.has(log.book.id) ? (
                  <button
                    disabled
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold opacity-60 cursor-not-allowed bg-green-50 text-green-700"
                  >
                    <BookOpen className="w-3 h-3" />
                    مُستعار حاليًا
                  </button>
                ) : availableBooks === 0 ? (
                  <button
                    disabled
                    title="لقد وصلت إلى الحد الأقصى للاستعارة"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold opacity-50 cursor-not-allowed bg-rose-50 text-rose-500"
                  >
                    <Stars className="w-3 h-3" />
                    الحد الأقصى
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      setBorrowBookLoading(log.book.id);
                      await borrowBookFn(log.book.id);
                      setBorrowBookLoading(null);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer hover:opacity-80 bg-accent/[12%] text-accent"
                  >
                    <RotateCcw className="w-3 h-3" />
                    استعر مجددًا
                  </button>
                )}
              </>
            }
          />
        ))
      ) : (
        <EmptyState
          icon={TrendingUp}
          text="لا توجد كتب مقروءة حتى الآن"
          cta="ابدأ القراءة الآن"
          ctaHref="/books"
        />
      )}
    </div>
  );
};

export default ReadingHistoryTab;
