"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";
import BookRow from "./BookRow";
import SectionTitle from "./SectionTitle";
import EmptyState from "./EmptyState";
import DueDateBar from "./DueDateBar";
import LoadingSpinner from "@/app/UI/LoadingSpinner";
import { NAVY, NAVY2 } from "@/lib/constants/colors";

const BorrowingTab = ({
  borrowedBooks,
  borrowedBooksLoading,
  borrowedBooksError,
  returnBookLoading,
  setReturnBookLoading,
  returnBookRequestFn,
}) => {
  if (borrowedBooksLoading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 max-h-[600px] overflow-y-auto">
      <SectionTitle>الكتب المُستعارة حالياً</SectionTitle>
      {borrowedBooksError ? (
        <p className="text-center text-rose-500 text-sm">{borrowedBooksError}</p>
      ) : borrowedBooks.length > 0 ? (
        borrowedBooks.map((borrowed) => (
          <BookRow
            key={borrowed.id}
            book={borrowed.book}
            image={borrowed.book.image}
            status={
              borrowed.return_request
                ? "تم طلب الاسترجاع"
                : borrowed.late_day > 0
                  ? `متأخر ${borrowed.late_day} يوم`
                  : "مُستعار"
            }
            statusClass={
              borrowed.return_request
                ? "bg-primary"
                : borrowed.late_day > 0
                  ? "bg-rose-600"
                  : "bg-primary-light"
            }
            extra={
              <DueDateBar
                borrowDate={borrowed.borrow_date}
                dueDate={borrowed.due_date}
              />
            }
            actions={
              <>
                <Link href={`/books/${borrowed.book.id}`}>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer hover:opacity-80 bg-primary/[7%] text-primary">
                    عرض التفاصيل
                  </button>
                </Link>
                {returnBookLoading === borrowed.id ? (
                  <div className="flex justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <button
                    disabled={borrowed.return_request}
                    onClick={async () => {
                      setReturnBookLoading(borrowed.id);
                      await returnBookRequestFn(borrowed.id);
                      setReturnBookLoading(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 bg-accent/[12%] text-accent ${
                      borrowed.return_request
                        ? "opacity-40 cursor-not-allowed"
                        : "cursor-pointer hover:opacity-80"
                    }`}
                  >
                    طلب إرجاع
                  </button>
                )}
              </>
            }
          />
        ))
      ) : (
        <EmptyState
          icon={BookOpen}
          text="لم تتم استعارة أيِّ كتابٍ حتى الآن"
          cta="تصفح الكتب"
          ctaHref="/books"
        />
      )}
    </div>
  );
};

export default BorrowingTab;
