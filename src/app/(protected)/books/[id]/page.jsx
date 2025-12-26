"use client";

/**
 * Book Component - Individual Book Details Page (Dynamic Route)
 *
 * @description This component displays detailed information about a single book including:
 * - Book cover image with high-resolution display
 * - Borrow functionality with availability checking
 * - Add to favorites feature
 * - Complete book metadata (ISBN, publication year, pages, author)
 * - Copy availability information (total and available copies)
 * - Related category navigation
 * - Back navigation to books listing
 *
 * @route /books/[id] - Dynamic route that accepts book ID as URL parameter
 * @returns {JSX.Element} The Book detail page component
 */

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
  // Extract the book ID from the URL parameter using Next.js useParams hook
  // Example: /books/123 -> params.id = "123"
  const params = useParams();
  const id = Number(params.id);

  // ============ State Management ============

  // Book data state - stores the complete book object fetched from API
  const [book, setBook] = useState([]);

  // Loading state for book fetch operation
  const [loading, setLoading] = useState(false);

  // Loading state for borrow operation - prevents multiple borrow requests
  const [borrowLoading, setBorrorLoading] = useState(false);

  // ============ API Functions ============

  /**
   * Fetches a single book's details from the API by ID
   *
   * @async
   * @function fetchBook
   * @param {number} id - The unique identifier of the book to fetch
   * @returns {Promise<void>}
   * @throws {Error} Displays error toast if fetch fails
   */
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

  /**
   * Handles the book borrowing process
   * Sends a borrow request to the API and shows success/error notifications
   *
   * @async
   * @function borrowBookFn
   * @param {number} bookId - The ID of the book to borrow
   * @returns {Promise<void>}
   * @throws {Error} Displays error toast with message if borrowing fails
   */
  const borrowBookFn = async (bookId) => {
    setBorrorLoading(true);
    try {
      await borrowBook(bookId);
      toast.success("تمت استعارة الكتاب بنجاح");
    } catch (error) {
      toast.error("حدث خطأ اثناء استعارة الكتاب " + error.message);
    } finally {
      setBorrorLoading(false);
    }
  };

  // ============ Side Effects ============

  /**
   * Fetch book data on component mount or when ID changes
   * Runs once when the component loads to retrieve book details
   */
  useEffect(() => {
    fetchBook(id);
  }, []);

  // ============ JSX Render ============

  return (
    <section className="book container min-w-full my-10">
      {/* Back to Books Navigation Link */}
      <Link
        href={"/books"}
        className="border border-gray-200 rounded-lg px-4 py-2 hover:bg-accent hover:text-white flex justify-between items-center gap-x-1 transition-colors duration-150 w-fit mb-8"
      >
        <ArrowLeft size={18} />
        العودة إلى الكتب
      </Link>

      {/* Show loading spinner while fetching book data */}
      {loading && <LoadingSpinner />}

      {/* Main book details section - only shown when loading is complete */}
      {!loading && (
        <div className="book-details flex flex-col lg:flex-row items-center lg:items-start  justify-center gap-x-10 gap-y-14 min-w-full ">
          {/* ============ Left Section: Book Cover and Actions ============ */}
          <div className="bg-white rounded-xl transition-shadow duration-200 shadow-xl flex flex-col items-center gap-5 hover:shadow-2xl p-4 max-w-[400px] w-full flex-1">
            {/* Book Cover Image - maintains 3:4 aspect ratio */}
            <div className="aspect-[3/4] relative overflow-hidden rounded-lg w-full h-[400px]">
              <Image
                alt={book.title || "book cover"}
                src={book.image || "/placeholder.svg"}
                className="object-contain w-full h-full"
                fill
              />
            </div>

            {/* Borrow Button Section - shows loading spinner during borrow operation */}
            {borrowLoading && <LoadingSpinner />}
            {!borrowLoading && (
              <button
                // Disable button if book is not available
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

            {/* Add to Favorites Button */}
            <button
              className={`flex items-center justify-center gap-x-2.5 bg-gray-50  w-full border border-gray-200 py-2 px-5 rounded-xl hover:bg-red-300 hover:text-white cursor-pointer transition-colors duration-150 `}
            >
              <Heart size={18} />
              أضف إلى المفضلة
            </button>

            {/* Book Availability Status Badge */}
            <div className="brrowing flex justify-between items-center bg-gray-100 py-3 px-4 w-full rounded-xl">
              التوفر:
              <span
                className={`${
                  book.is_avaiable ? "bg-primary" : "bg-red-500"
                } text-white rounded-md px-3 py-1.5 text-xs`}
              >
                {book.is_avaiable ? "متاح" : "مُستعار حالياً"}
              </span>
            </div>
          </div>

          {/* ============ Right Section: Book Details and Information ============ */}
          <div className="flex flex-col gap-10 flex-2">
            {/* Book Title, Author, and Category Section */}
            <div className="flex flex-col gap-2 border-b border-gray-400 pb-6">
              {/* Main book title */}
              <h2 className="text-3xl font-bold">{book.title}</h2>
              {/* Author name */}
              <p className="text-2xl font-medium text-gray-500">
                بقلم {book.author?.name}
              </p>
              {/* Category badge with fallback text */}
              <span className="py-1 px-2 font-medium w-fit bg-primary-light text-white rounded-lg">
                {book.category?.name || "لا يوجد فئة"}
              </span>
            </div>

            {/* Book Description Section */}
            <div className="flex flex-col gap-2 border-b border-gray-400 pb-6">
              <h3 className="text-2xl font-semibold">{book.title}</h3>
              <p className="text-gray-500 font-medium">{book.description}</p>
            </div>

            {/* Book Metadata Information Section */}
            <div className="flex flex-col gap-2 border-b border-gray-400 pb-6">
              <h3 className="text-2xl font-semibold">معلومات الكتاب</h3>

              {/* ISBN Number */}
              <div className="flex items-center gap-x-2">
                <Hash className="text-gray-500" />
                <div className="flex flex-col ">
                  <span className="font-semibold ">الرقم المعياري</span>
                  <span className="text-gray-500">{book?.isbn || "00000"}</span>
                </div>
              </div>

              {/* Publication Year */}
              <div className="flex items-center gap-x-2">
                <Calendar className="text-gray-500" />
                <div className="flex flex-col ">
                  <span className="font-semibold ">سنة النشر</span>
                  <span className="text-gray-500">
                    {book?.publishedYear || "2000"}
                  </span>
                </div>
              </div>

              {/* Page Count */}
              <div className="flex items-center gap-x-2">
                <BookOpen className="text-gray-500" />
                <div className="flex flex-col ">
                  <span className="font-semibold ">عدد الصفحات</span>
                  <span className="text-gray-500">{book.pages || 0}</span>
                </div>
              </div>

              {/* Author Information */}
              <div className="flex items-center gap-x-2">
                <User className="text-gray-500" />
                <div className="flex flex-col ">
                  <span className="font-semibold ">المؤلف</span>
                  <span className="text-gray-500">
                    {book.author?.name || "غير محدد"}
                  </span>
                </div>
              </div>

              {/* Total Copies Available in Library */}
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

              {/* Available Copies (Not Currently Borrowed) */}
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

            {/* Related Books by Category Section */}
            <div className="flex flex-col gap-2 pb-6">
              <h3 className="text-2xl font-semibold">المزيد من هذه الفئة</h3>
              {/* Link to browse books filtered by this book's category */}
              <Link
                href={{
                  pathname: "/books",
                  query: { category: book.category?.name },
                }}
                className="border border-gray-400 rounded-lg py-2.5 px-4 text-gray-500 font-bold text-center cursor-pointer hover:bg-accent hover:border-gray-100 hover:text-white transition-colors duration-150"
              >
                تصفح كتب {book.category?.name || "جميع الفئات"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Book;
