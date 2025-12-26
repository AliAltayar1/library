/**
 * AdminStats Component - Administrative Statistics Dashboard
 *
 * @description Comprehensive statistics and analytics dashboard for library system with:
 * - Key metrics summary cards (total books, users, borrowed books, etc.)
 * - Visual analytics with multiple chart types:
 *   - Pie chart for category distribution
 *   - Bar chart for top borrowed books
 *   - Line chart for borrowing trends over last 7 days
 * - Top 5 most borrowed books list with detailed view
 * - Real-time data loading and error handling
 * - Token verification for security
 *
 * Features:
 * - Six summary statistic cards with icons and color coding
 * - Dynamic data transformation for chart compatibility
 * - Date formatting for borrowing trends
 * - Responsive grid layout for charts and cards
 * - Empty states with fallback UI
 *
 * @returns {JSX.Element} The statistics dashboard with metrics and visualizations
 */

import React, { useEffect, useState } from "react";
import { getBooks } from "../../../lib/admin/getBooks";
import { getStats } from "../../../lib/admin/getStats";
import { toast } from "sonner";
import LoadingSpinner from "../UI/LoadingSpinner";
import {
  BookOpen,
  Calendar,
  Heart,
  LogOut,
  Plus,
  RotateCcw,
  TriangleAlert,
  Users,
  X,
  Redo2,
  TicketCheck,
  Archive,
} from "lucide-react";
import BorrowLineChart from "./BorrowLineChart";
import CategoriesPieChart from "./CategoriesPieChart";
import TopBooksBarChart from "./TopBooksBarChart";
import Image from "next/image";
import { verifyToken } from "../../../lib/user/verifyToken";

const AdminStats = () => {
  // ============ State Management ============

  /**
   * Statistics state - stores all statistical data from API
   * Includes: total books, users, borrowed books, available books, archived books,
   * pending returns, category stats, and borrowing trends for last 7 days
   * @type {Object}
   */
  const [statistics, setStatistics] = useState([]);

  /**
   * Loading state for statistics fetch operation
   * @type {boolean}
   */
  const [statisticsLoading, setStatisticsLoading] = useState(false);

  /**
   * Books state - stores complete books list with borrowing counts
   * Used for top borrowed books display and chart
   * @type {Array}
   */
  const [books, setBooks] = useState([]);

  /**
   * Loading state for books fetch operation
   * @type {boolean}
   */
  const [booksLoading, setBooksLoading] = useState(false);

  /**
   * Error state for books fetch operation
   * @type {string|null}
   */
  const [booksError, setBooksError] = useState(null);

  // ============ API Functions ============

  /**
   * Fetches all statistical data from the API
   * Includes counts, category breakdown, and borrowing trends
   *
   * @async
   * @function getStatsFn
   * @returns {Promise<void>}
   */
  const getStatsFn = async () => {
    setStatisticsLoading(true);
    try {
      const data = await getStats();
      setStatistics(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setStatisticsLoading(false);
    }
  };

  /**
   * Fetches all books with their borrowing counts
   * Used to determine top borrowed books for display and charts
   *
   * @async
   * @function getBooksFn
   * @returns {Promise<void>}
   */
  const getBooksFn = async () => {
    setBooksLoading(true);
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      setBooksError(error.message);
    } finally {
      setBooksLoading(false);
    }
  };

  /**
   * Verifies user authentication token for security
   * Ensures admin has valid session before displaying sensitive data
   *
   * @async
   * @function verifyTokenFn
   * @returns {Promise<void>}
   */
  const verifyTokenFn = async () => {
    try {
      const res = await verifyToken();
    } catch (error) {
      console.log(error.message);
    }
  };

  // ============ Data Transformation for Charts ============

  /**
   * Transforms top 5 books data for bar chart visualization
   * Extracts title and borrow count from books array
   * @type {Array<{title: string, count: number}>}
   */
  const topFiveBooks = books.slice(0, 5).map((book) => ({
    title: book.title,
    count: book.count_borrowed,
  }));

  /**
   * Transforms category statistics for pie chart visualization
   * Maps category names to their book counts
   * @type {Array<{name: string, value: number}>}
   */
  const categoriesData =
    statistics?.category_stats &&
    statistics?.category_stats.map((category) => ({
      name: category.name,
      value: category.books_count,
    }));

  /**
   * Transforms borrowing statistics for line chart visualization
   * Converts dates from "YYYY MM DD" format to "Mon DD" format
   * Maps each date to its borrowing count for trend analysis
   *
   * @example
   * Input: { date: "2024 12 25", count: 5 }
   * Output: { date: "Dec 25", count: 5 }
   *
   * @type {Array<{date: string, count: number}>}
   */
  const borrowStats =
    statistics?.borrowed_last_7_days &&
    statistics?.borrowed_last_7_days.map((borrow) => {
      // Parse date string in format "YYYY MM DD"
      const dateStr = borrow.date;
      const [, month, day] = dateStr.split(" ").map(Number);

      // Month names array for formatting
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      // Format date as "Mon DD" for chart display
      const formattedDate = `${monthNames[month - 1]} ${day}`;

      return {
        date: formattedDate,
        count: borrow.count,
      };
    });

  // ============ Side Effects ============

  /**
   * Initial data fetch and authentication verification on component mount
   * Loads statistics, books, and verifies admin token
   */
  useEffect(() => {
    getStatsFn();
    getBooksFn();
    verifyTokenFn();
  }, []);

  // ============ JSX Render ============

  return (
    <>
      {/* Show loading spinner while fetching statistics */}
      {statisticsLoading && <LoadingSpinner />}

      {/* Main statistics dashboard content */}
      {!statisticsLoading && (
        <div className="statistics">
          {/* ============ Statistics Summary Cards Section ============ */}
          <section className="information mt-10 flex gap-8 flex-wrap justify-center flex-col sm:flex-row">
            {/* Total Books Card */}
            <div className="total-books min-h-44 bg-white rounded-2xl shadow border border-gray-300 p-8 flex gap-x-10 justify-between items-center flex-col sm:flex-row flex-1 ">
              <div className="text-primary-light font-semibold flex flex-col items-center gap-1 whitespace-nowrap">
                إجمالي الكتب
                <span className="text-2xl text-primary-light font-bold ">
                  {statistics.total_books || 0}
                </span>
              </div>
              <BookOpen size={40} className="text-primary-light" />
            </div>

            {/* Total Users Card */}
            <div className=" total-users min-h-44 bg-white rounded-2xl shadow border border-gray-300 p-8 flex gap-x-10 justify-between items-center flex-col sm:flex-row flex-1">
              <div className="text-primary-light font-semibold flex flex-col items-center gap-1">
                إجمالي المستخدمين
                <span className="text-2xl text-primary-light font-bold ">
                  {statistics.total_users || 0}
                </span>
              </div>
              <Users size={40} className="text-primary-light" />
            </div>

            {/* Currently Borrowed Books Card */}
            <div className="curr-borrowing-books min-h-44 bg-white rounded-2xl shadow border border-gray-300 p-8 flex gap-x-10 justify-between items-center flex-col sm:flex-row flex-1">
              <div className="text-accent-dark font-semibold flex flex-col items-center gap-1">
                الكتب المستعارة حالياً
                <span className="text-2xl text-accent-dark font-bold ">
                  {statistics.borrowed_books || 0}
                </span>
              </div>
              <TicketCheck size={40} className="text-accent-dark" />
            </div>

            {/* Available Books Card */}
            <div className="availabe-book min-h-44 bg-white rounded-2xl shadow border border-gray-300 p-8 flex gap-x-10 justify-between items-center flex-col sm:flex-row flex-1">
              <div className="text-accent-dark font-semibold flex flex-col items-center gap-1">
                الكتب المتاحة
                <span className="text-2xl text-accent-dark font-bold ">
                  {statistics.available_books || 0}
                </span>
              </div>
              <BookOpen size={40} className="text-accent-dark" />
            </div>

            {/* Archived Books Card */}
            <div className="availabe-book min-h-44 bg-white rounded-2xl shadow border border-gray-300 p-8 flex gap-x-10 justify-between items-center flex-col sm:flex-row flex-1">
              <div className="text-gray-600 font-semibold flex flex-col items-center gap-1">
                الكتب المؤرشفة
                <span className="text-2xl text-gray-600 font-bold ">
                  {statistics.archived_books || 0}
                </span>
              </div>
              <Archive size={40} className="text-gray-600" />
            </div>

            {/* Pending Return Requests Card */}
            <div className="availabe-book min-h-44 bg-white rounded-2xl shadow border border-gray-300 p-8 flex gap-x-10 justify-between items-center flex-col sm:flex-row flex-1">
              <div className="text-red-500 font-semibold flex flex-col items-center gap-1">
                طلبات الاسترجاع
                <span className="text-2xl text-red-500 font-bold ">
                  {statistics.pending_returns || 0}
                </span>
              </div>
              <Redo2 size={40} className="text-red-500" />
            </div>
          </section>

          {/* ============ Charts Grid Section ============ */}
          {/* Two-column grid layout for pie chart and bar chart */}
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categories Distribution Pie Chart - shows book distribution across categories */}
            {categoriesData && <CategoriesPieChart data={categoriesData} />}

            {/* Top 5 Books Bar Chart - shows most borrowed books with counts */}
            <TopBooksBarChart data={topFiveBooks} />
          </div>

          {/* ============ Borrowing Trends Line Chart Section ============ */}
          {/* Full-width line chart showing borrowing activity over last 7 days */}
          <div className="mt-5">
            <BorrowLineChart data={borrowStats} />
          </div>

          {/* ============ Top Borrowed Books Detailed List Section ============ */}
          <div className="statistics-tab bg-white rounded-2xl p-6 mt-6 shadow">
            <h2 className="font-semibold">الكتب الأكثر استعارة</h2>
            <h3 className="text-gray-500">
              الكتب التي تم استعارتها بشكل متكرر
            </h3>

            {/* Show loading spinner while fetching books */}
            {booksLoading && <LoadingSpinner />}

            {/* Show error message if books fetch failed */}
            {booksError ? (
              <div className="mt-3 text-red-500 font-semibold">
                {booksError}
              </div>
            ) : books.length !== 0 ? (
              // Map through top 5 books to display detailed cards
              books.slice(0, 5).map((book, idx) => (
                <div
                  key={book.id}
                  className="mt-5 border border-gray-300 p-5 rounded-2xl flex justify-between flex-col-reverse lg:flex-row items-center gap-y-3"
                >
                  {/* Left Section: Ranking Badge */}
                  <div className="flex flex-col-reverse lg:flex-row gap-3 items-center lg:items-start">
                    {/* Ranking number badge (1-5) */}
                    <span className="py-1 px-2 text-sm bg-accent-dark w-f'it rounded-md text-white">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Right Section: Book Information and Cover */}
                  <div className="text-gray-500 flex flex-col-reverse lg:flex-row gap-3 items-center lg:items-end">
                    {/* Book Details */}
                    <div className="text-center lg:text-start">
                      {/* Book Title */}
                      <p className="font-semibold text-blue-950">
                        {book.title}
                      </p>
                      {/* Author Name */}
                      <p className="text-gray-500">بقلم {book.author?.name}</p>
                      {/* Borrow Count */}
                      <p className="text-gray-500 text-xs">
                        تمت الاستعارة{" "}
                        <span className="text-gray-600 font-semibold ">
                          {book.count_borrowed}
                        </span>{" "}
                        من المرات
                      </p>
                    </div>

                    {/* Book Cover Image */}
                    <div className="aspect-[3/4] relative overflow-hidden rounded-lg w-16 h-20">
                      <Image
                        src={book.image || "/placeholder.svg"}
                        alt={book.title}
                        className="object-cover w-full h-full"
                        fill
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Empty State - shown when no books have been borrowed yet
              <div className="flex flex-col gap-6 items-center my-6">
                <BookOpen size={50} color="gray" />
                <p className="text-gray-400">
                  لم تتم استعارة أيِّ كتابٍ حتى الآن
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminStats;
