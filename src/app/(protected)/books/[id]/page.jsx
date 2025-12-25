"use client";
import {
  ArrowLeft,
  BookCheck,
  BookCopy,
  BookOpen,
  Calendar,
  Hash,
  Heart,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBook } from "../../../../../lib/books/getBooks";
import { borrowBook } from "../../../../../lib/user/borrow";
import { toast } from "sonner";
import LoadingSpinner from "@/app/UI/LoadingSpinner";

const Book = () => {
  const params = useParams();
  const id = Number(params.id);

  const [book, setBook] = useState([]);
  const [loading, setLoading] = useState(false);

  const [borrowLoading, setBorrorLoading] = useState(false);

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

  const borrowBookFn = async (bookId) => {
    setBorrorLoading(true);
    try {
      await borrowBook(bookId);
      toast.success("تمت استعارة الكتاب بنجاح");
    } catch (error) {
      toast.success("حدث خطأ اثناء استعارة الكتاب " + error.message);
    } finally {
      setBorrorLoading(false);
    }
  };

  useEffect(() => {
    fetchBook(id);
  }, []);

  return (
    <section className="book container min-w-full my-10">
      <Link
        href={"/books"}
        className="border border-gray-200 rounded-lg px-4 py-2 hover:bg-orange-500 hover:text-white flex justify-between items-center gap-x-1 transition-colors duration-150 w-fit mb-8"
      >
        <ArrowLeft size={18} />
        العودة إلى الكتب
      </Link>
      {loading && <LoadingSpinner />}
      {!loading && (
        <div className="book-details flex flex-col lg:flex-row items-center lg:items-start  justify-center gap-x-10 gap-y-14 min-w-full ">
          {/* Book Cover */}
          <div className="bg-white rounded-xl transition-shadow duration-200 shadow-xl flex flex-col items-center gap-5 hover:shadow-2xl p-4 max-w-[500px] w-full flex-1">
            <div className="aspect-[3/4] relative overflow-hidden rounded-lg w-full h-full">
              <Image
                alt={book.title || "book cover"}
                src={book.image || "/placeholder.svg"}
                className="object-cover w-full h-full"
                fill
              />
            </div>

            {borrowLoading && <LoadingSpinner />}
            {!borrowLoading && (
              <button
                disabled={!book.is_avaiable}
                onClick={() => {
                  borrowBookFn(book.id);
                }}
                className={`${
                  book.is_avaiable
                    ? "bg-primary-light hover:bg-hover-dark cursor-pointer"
                    : "bg-gray-500 cursor-not-allowed"
                } flex items-center justify-center gap-x-2.5 w-full border border-gray-200 py-2 px-5 rounded-xl  text-white  transition-colors duration-150 `}
              >
                <BookCheck size={18} />
                استعارة{" "}
              </button>
            )}

            <button
              className={`flex items-center justify-center gap-x-2.5 bg-gray-50  w-full border border-gray-200 py-2 px-5 rounded-xl hover:bg-accent hover:text-white cursor-pointer transition-colors duration-150 `}
            >
              <Heart size={18} />
              أضف إلى المفضلة
            </button>

            <div className="brrowing flex justify-between items-center bg-gray-100 py-3 px-4 w-full rounded-xl">
              التوفر:
              <span
                className={`${
                  book.is_avaiable ? "bg-primary" : "bg-red-500"
                } text-white rounded-lg px-3 py-1.5 text-xs`}
              >
                {book.is_avaiable ? "متاح" : "مُستعار حالياً"}
              </span>
            </div>
          </div>

          {/* Book Details */}
          <div className="flex flex-col gap-10 flex-2">
            <div className="flex flex-col gap-2 border-b border-gray-400 pb-6">
              <h2 className="text-3xl font-bold">{book.title}</h2>
              <p className="text-2xl font-medium text-gray-500">
                بقلم {book.author?.name}
              </p>
              <span className="py-1 px-2 font-medium w-fit bg-blue-600 text-white rounded-xl">
                {book.category?.name}
              </span>
            </div>

            <div className="flex flex-col gap-2 border-b border-gray-400 pb-6">
              <h3 className="text-2xl font-semibold">{book.title}</h3>
              <p className="text-gray-500 font-medium">{book.description}</p>
            </div>

            <div className="flex flex-col gap-2 border-b border-gray-400 pb-6">
              <h3 className="text-2xl font-semibold">معلومات الكتاب</h3>

              <div className="flex items-center gap-x-2">
                <Hash className="text-gray-500" />
                <div className="flex flex-col ">
                  <span className="font-semibold ">الرقم المعياري</span>
                  <span className="text-gray-500">{book?.isbn || "00000"}</span>
                </div>
              </div>

              <div className="flex items-center gap-x-2">
                <Calendar className="text-gray-500" />
                <div className="flex flex-col ">
                  <span className="font-semibold ">سنة النشر</span>
                  <span className="text-gray-500">
                    {book?.publishedYear || "2000"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-x-2">
                <BookOpen className="text-gray-500" />
                <div className="flex flex-col ">
                  <span className="font-semibold ">عدد الصفحات</span>
                  <span className="text-gray-500">{book.pages || 0}</span>
                </div>
              </div>

              <div className="flex items-center gap-x-2">
                <User className="text-gray-500" />
                <div className="flex flex-col ">
                  <span className="font-semibold ">المؤلف</span>
                  <span className="text-gray-500">
                    {book.author?.name || "غير محدد"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-x-2">
                <BookCopy className="text-gray-500" />
                <div className="flex flex-col ">
                  <span className="font-semibold ">
                    عدد النسخ الكلية للكتاب
                  </span>
                  <span className="text-gray-500">
                    {book.total_copies || 0}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-x-2">
                <BookCopy className="text-gray-500" />
                <div className="flex flex-col ">
                  <span className="font-semibold ">النسخ المتبقية للكتاب</span>
                  <span className="text-gray-500">
                    {book.available_copies || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pb-6">
              <h3 className="text-2xl font-semibold">المزيد من هذه الفئة</h3>
              <Link
                href={{
                  pathname: "/books",
                  query: { categore: book.category?.name },
                }}
                className="border border-gray-400 rounded-lg py-2.5 px-4 text-gray-500 font-bold text-center cursor-pointer hover:bg-accent hover:border-gray-100 hover:text-white transition-colors duration-150"
              >
                تصفح كتب {book.category?.name || "الخيال"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Book;
