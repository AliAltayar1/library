"use client";

/**
 * Profile Component - User Profile Dashboard Page
 *
 * @description Comprehensive user profile page with tabbed interface displaying:
 * - User information header (name, email, join date, avatar initials)
 * - Statistics cards (borrowed books count, overdue books, favorites count)
 * - Overdue books alert banner
 * - Three tabs with different views:
 *   1. Borrowed Books - Currently borrowed books with return request functionality
 *   2. Reading History - Previously borrowed and returned books with re-borrow option
 *   3. Favorites - User's favorite books with remove functionality (limited to 3 items)
 * - Empty states for each tab with call-to-action buttons
 * - Loading states and error handling for all data operations
 *
 * @returns {JSX.Element} The Profile page component with tabbed interface
 */

import {
  BookOpen,
  Calendar,
  Heart,
  Redo2,
  RotateCcw,
  Settings,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { borrowBook } from "../../../../lib/user/borrow";
import LoadingSpinner from "@/app/UI/LoadingSpinner";
import { profileBorrowed } from "../../../../lib/user/profileBorrowed";
import { profile } from "../../../../lib/user/profile";
import { returnBookRequest } from "../../../../lib/user/returnBookRequest";
import { profileReturned } from "../../../../lib/user/profileReturend";
import { getFavoritesBooks } from "../../../../lib/favorite/getFavBook";
import { removeFromFav } from "../../../../lib/favorite/removeFromFav";

const Profile = () => {
  // ============ State Management ============

  // Active tab state - controls which tab content is displayed
  // Values: "borrowing" | "readingHistory" | "favorites"
  const [tabs, setTabs] = useState("borrowing");

  // User information state - stores complete user profile data
  const [userInfo, setUserInfo] = useState({
    username: "Demo User",
    email: "demo@mail.com",
    first_name: "Demo",
    last_name: "User",
    date_joined: "2000-01-01",
    borrowed_books_count: 0,
  });

  // Loading state for user info fetch operation
  const [userInfoLoading, setUserInfoLoading] = useState(false);

  // Borrowed books state - stores array of currently borrowed book objects
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  // Loading state for borrowed books fetch operation
  const [borrowedBooksLoading, setBorrowedBooksLoading] = useState(false);

  // Error state for borrowed books fetch operation
  const [borrowedBooksError, setBorrowedBooksError] = useState(null);

  // Books log state - stores array of previously borrowed/returned book objects (reading history)
  const [booksLog, setBooksLog] = useState([]);

  // Loading state for books log fetch operation
  const [booksLogLoading, setBooksLogLoading] = useState(false);

  // Error state for books log fetch operation
  const [booksLogError, setBooksLogError] = useState(null);

  // Favorites books state - stores array of user's favorite book objects
  const [favoritesBooks, setFavoritesBooks] = useState([]);

  // Loading state for favorites fetch operation
  const [favoritesBooksloading, setFavoritesBooksLoading] = useState(false);

  // Error state for favorites fetch operation
  const [favoritesBooksError, setFavoritesBooksError] = useState(null);

  // Favorite removal loading state - stores the ID of book being removed
  const [favLoading, setFavLoading] = useState(false);

  // Return book loading state - stores the borrowed record ID being processed
  const [returnBookLoading, setReturnBookLoading] = useState(null);

  // Borrow book loading state - stores the book ID being borrowed
  const [borrowBookLoading, setBorrowBookLoading] = useState(null);

  // ============ API Functions ============

  /**
   * Fetches the current user's profile information from the API
   * Includes username, email, name, join date, and book counts
   *
   * @async
   * @function getUserProfileFn
   * @returns {Promise<void>}
   * @throws {Error} Displays error toast if fetch fails
   */
  const getUserProfileFn = async () => {
    setUserInfoLoading(true);
    try {
      const data = await profile();
      setUserInfo(data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch books");
    } finally {
      setUserInfoLoading(false);
    }
  };

  /**
   * Fetches all currently borrowed books for the user
   * Includes book details, borrow date, due date, late status, and return request status
   *
   * @async
   * @function getBorrowedBooksFn
   * @returns {Promise<void>}
   * @throws {Error} Displays error toast if fetch fails
   */
  const getBorrowedBooksFn = async () => {
    setBorrowedBooksLoading(true);
    try {
      const data = await profileBorrowed();
      setBorrowedBooks(data);
    } catch (error) {
      setBorrowedBooksError(error.message || "Failed to fetch books");
      toast.error(error.message || "Failed to fetch books");
    } finally {
      setBorrowedBooksLoading(false);
    }
  };

  /**
   * Fetches the user's reading history (previously borrowed and returned books)
   * Used to display books log in the reading history tab
   *
   * @async
   * @function getBooksLogFn
   * @returns {Promise<void>}
   * @throws {Error} Displays error toast if fetch fails
   */
  const getBooksLogFn = async () => {
    setBooksLogLoading(true);
    try {
      const data = await profileReturned();
      setBooksLog(data);
    } catch (error) {
      setBooksLogError(error.message);
      toast.error(error.message);
    } finally {
      setBooksLogLoading(false);
    }
  };

  /**
   * Submits a return request for a borrowed book
   * Refreshes borrowed books list after successful request
   *
   * @async
   * @function returnBookRequestFn
   * @param {number} bookId - The ID of the borrowed record to request return for
   * @returns {Promise<void>}
   * @throws {Error} Displays error toast if request fails
   */
  const returnBookRequestFn = async (bookId) => {
    try {
      await returnBookRequest(bookId);
      // Refresh borrowed books to update UI with return request status
      getBorrowedBooksFn();
      toast.success("تم طلب الإرجاع بنجاح");
    } catch (error) {
      toast.error("حدث خطأ اثناء الإرجاع " + error.message);
    }
  };

  /**
   * Borrows a book (used for re-borrowing from reading history)
   * Refreshes borrowed books list after successful borrow
   *
   * @async
   * @function borrowBookFn
   * @param {number} bookId - The ID of the book to borrow
   * @returns {Promise<void>}
   * @throws {Error} Displays error toast if borrow fails
   */
  const borrowBookFn = async (bookId) => {
    try {
      await borrowBook(bookId);
      // Refresh borrowed books list to show newly borrowed book
      getBorrowedBooksFn();
      toast.success("تمت الإستعارة بنجاح");
    } catch (error) {
      toast.error("حدث خطأ اثناء الإستعارة " + error.message);
    }
  };

  /**
   * Fetches all favorite books for the current user
   *
   * @async
   * @function getFavoritesBooksFn
   * @returns {Promise<void>}
   * @throws {Error} Displays error toast if fetch fails
   */
  const getFavoritesBooksFn = async () => {
    setFavoritesBooksLoading(true);
    try {
      const data = await getFavoritesBooks();
      setFavoritesBooks(data);
    } catch (error) {
      setFavoritesBooksError(error.message);
      toast.error(error.message);
    } finally {
      setFavoritesBooksLoading(false);
    }
  };

  /**
   * Removes a book from the user's favorites list
   * Refreshes both favorites list and user profile to update counts
   *
   * @async
   * @function removeFromFavFn
   * @param {number} bookId - The ID of the book to remove from favorites
   * @returns {Promise<void>}
   * @throws {Error} Displays error toast if removal fails
   */
  const removeFromFavFn = async (bookId) => {
    try {
      const res = await removeFromFav(bookId);
      // Refresh favorites list and user profile to update favorites count
      getFavoritesBooksFn();
      getUserProfileFn();
      toast.success("تمت الإزالة من المفضلة");
    } catch (error) {
      console.log(error.message);
      toast.error("حث خطأ اثناء الإزالة من المفضلة بسبب: " + error.message);
    }
  };

  // ============ Side Effects ============

  /**
   * Initial data fetch on component mount
   * Loads user profile, borrowed books, reading history, and favorites
   */
  useEffect(() => {
    getUserProfileFn();
    getBorrowedBooksFn();
    getBooksLogFn();
    getFavoritesBooksFn();
  }, []);

  // ============ JSX Render ============

  return (
    <section className="profile container min-w-full my-10">
      {/* Show loading spinner while fetching user info */}
      {userInfoLoading && <LoadingSpinner />}

      {/* Main profile content - only shown when user info is loaded */}
      {!userInfoLoading && (
        <>
          {/* ============ Profile Header Section ============ */}
          <section className="profile-heading flex justify-center md:justify-between gap-x-16 gap-y-10 flex-wrap">
            {/* User Information Display */}
            <div className="flex items-center gap-10 flex-wrap justify-center">
              {/* User Avatar - displays first letter of first and last name */}
              <div className="logo bg-white min-w-14 min-h-14 rounded-full w-fit flex items-center justify-center text-xl">
                {userInfo.first_name?.[0]?.toUpperCase() +
                  " " +
                  userInfo.last_name?.[0]?.toUpperCase()}
              </div>
              {/* User Details - name, email, and join date */}
              <div className="text-center sm:text-start">
                {/* Full name in capitalized format */}
                <div className="font-bold text-3xl mb-1 text-blue-950 capitalize">
                  {userInfo.first_name + " " + userInfo.last_name}
                </div>
                {/* User email */}
                <div className="text-gray-500 ">{userInfo.email}</div>
                {/* Join date - splits ISO datetime string to show only date part */}
                <div className="text-gray-500">
                  عضو منذ <span>{userInfo.date_joined?.split("T")[0]}</span>
                </div>
              </div>
            </div>

            {/* Settings Navigation Button */}
            <div className="settings flex items-center gap-3 flex-wrap justify-center">
              <Link
                href={"/settings"}
                className="hover:bg-accent hover:text-white transition-colors duration-150 flex items-center gap-2 py-2 px-3 border border-gray-300 shadow rounded-lg"
              >
                <Settings />
                الإعدادات
              </Link>
            </div>
          </section>

          {/* ============ Statistics Cards Section ============ */}
          <section className="information mt-10 flex gap-8 flex-wrap justify-center flex-col sm:flex-row">
            {/* Currently Borrowed Books Count Card */}
            <div className="borrowing min-h-44 bg-white rounded-2xl shadow border border-gray-300 p-8 flex gap-x-10 justify-between items-center flex-col sm:flex-row ">
              <div className="text-primary-light  font-semibold flex flex-col items-center gap-1 whitespace-nowrap">
                مُستعارة حالياً
                <span className="text-2xl text-primary-light font-bold">
                  {userInfo.borrowed_books_count}
                </span>
              </div>
              <BookOpen size={40} className="text-primary-light " />
            </div>

            {/* Overdue Books Count Card */}
            <div className="late-books min-h-44 bg-white rounded-2xl shadow border border-gray-300 p-8 flex gap-x-10 justify-between items-center flex-col sm:flex-row">
              <div className="text-red-500 font-semibold flex flex-col items-center gap-1">
                كتب متأخرة
                <span className="text-2xl text-red-500 font-bold ">
                  {userInfo.overdue_books_count}
                </span>
              </div>
              <TriangleAlert size={40} color="red" />
            </div>

            {/* Favorites Count Card */}
            <div className="favorites min-h-44 bg-white rounded-2xl shadow border border-gray-300 p-8 flex gap-x-10 justify-between items-center flex-col sm:flex-row">
              <div className="text-accent font-semibold flex flex-col items-center gap-1">
                المفضلة
                <span className="text-2xl text-accent font-bold ">
                  {userInfo.favorites_count}
                </span>
              </div>
              <Heart size={40} className="text-accent" />
            </div>
          </section>

          {/* ============ Overdue Books Alert Banner ============ */}
          {/* Only displayed when user has overdue books */}
          {userInfo.overdue_books_count > 0 && (
            <div className="late-book-alert border border-red-500 bg-white rounded-2xl p-8 flex items-center sm:flex-row flex-col gap-2 text-gray-500 mt-10">
              <TriangleAlert color="red" size={24} />
              لديك {userInfo.overdue_books_count} كتاب متأخر. يرجى إرجاعها في
              أقرب وقت ممكن لتجنب الرسوم المتأخرة.
            </div>
          )}
        </>
      )}

      {/* ============ Tabbed Interface Section ============ */}
      <section className="quick-tabs mt-12">
        {/* Tab Navigation Buttons */}
        <div className="tabs custom-scroll flex justify-between font-semibold text-blue-950 overflow-x-auto p-2">
          {/* Borrowed Books Tab Button */}
          <button
            onClick={() => {
              setTabs("borrowing");
            }}
            className={`${
              tabs === "borrowing"
                ? "transition-all duration-100  rounded-xl shadow-[0px_2px_3px_0px_rgba(0,0,0,0.09)]"
                : ""
            } cursor-pointer px-4 py-1.5 whitespace-nowrap flex-1`}
          >
            الكتب المُستعارة
          </button>

          {/* Reading History Tab Button */}
          <button
            onClick={() => {
              setTabs("readingHistory");
            }}
            className={`${
              tabs === "readingHistory"
                ? "transition-all duration-100  rounded-xl shadow-[0px_2px_3px_0px_rgba(0,0,0,0.09)]"
                : ""
            } cursor-pointer px-4 py-1.5 whitespace-nowrap flex-1`}
          >
            سجل القراءة
          </button>

          {/* Favorites Tab Button */}
          <button
            onClick={() => {
              setTabs("favorites");
            }}
            className={`${
              tabs === "favorites"
                ? " transition-all duration-100  rounded-xl  shadow-[0px_2px_3px_0px_rgba(0,0,0,0.09)]"
                : ""
            } cursor-pointer px-4 py-1.5 flex-1`}
          >
            المفضلة
          </button>
        </div>

        {/* ============ Tab 1: Borrowed Books Content ============ */}
        {/* Show loading spinner while fetching borrowed books */}
        {borrowedBooksLoading && <LoadingSpinner />}

        {/* Display borrowed books tab content when active and loaded */}
        {!borrowedBooksLoading && tabs === "borrowing" && (
          <div className="borrowing-tab bg-white rounded-2xl p-6 mt-6 shadow">
            {/* Tab header */}
            <h2 className="font-semibold">الكتب المُستعارة حالياً</h2>
            <h3 className="text-gray-500">الكتب التي استعرتها حالياً</h3>

            {/* Show error message if fetch failed */}
            {borrowedBooksError ? (
              <div className="text-red-500 text-center font-semibold">
                {borrowedBooksError}
              </div>
            ) : borrowedBooks.length !== 0 ? (
              // Map through borrowed books and display each one
              borrowedBooks.map((borrowed) => (
                <div
                  key={borrowed.id}
                  className="mt-5 border border-gray-300 p-5 rounded-2xl flex justify-between flex-col-reverse lg:flex-row items-center gap-y-3"
                >
                  {/* Left Section: Action Buttons and Book Info */}
                  <div className="flex flex-col-reverse lg:flex-row gap-3 items-center ">
                    {/* Action Buttons Container */}
                    <div className="flex flex-col gap-2">
                      {/* View Details Button */}
                      <Link
                        href={`/books/${borrowed.book.id}`}
                        className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 text-blue-950 font-medium hover:bg-accent hover:text-white transition-colors duration-200 cursor-pointer text-xs sm:text-base text-center"
                      >
                        عرض التفاصيل
                      </Link>

                      {/* Return Request Button - shows loading or button based on state */}
                      {returnBookLoading == borrowed.id ? (
                        <LoadingSpinner />
                      ) : (
                        <button
                          onClick={async () => {
                            setReturnBookLoading(borrowed.id);
                            await returnBookRequestFn(borrowed.id);
                            setReturnBookLoading(null);
                          }}
                          // Disable button if return request already submitted
                          disabled={borrowed.return_request}
                          className={`${
                            borrowed.return_request
                              ? "text-gray-300 cursor-not-allowed"
                              : "cursor-pointer  hover:bg-accent hover:text-white"
                          }  px-3 py-1.5 rounded-lg border bg-gray-100 border-gray-200 text-blue-950 font-medium  transition-colors duration-200  text-xs sm:text-base`}
                        >
                          طلب استرجاع الكتاب
                        </button>
                      )}
                    </div>

                    {/* Book Title and Author */}
                    <div className="text-center lg:text-start">
                      <p className="font-semibold text-blue-950">
                        {borrowed.book.title}
                      </p>
                      <p className="text-gray-500">
                        بقلم {borrowed.book.author?.name}
                      </p>
                    </div>
                  </div>

                  {/* Right Section: Status Badge and Book Image */}
                  <div className="text-gray-500 flex flex-col-reverse lg:flex-row gap-3 items-center">
                    {/* Status Badge - changes color based on book status */}
                    <span
                      className={`flex items-center gap-1 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs text-white ${
                        borrowed.late_day == 0 && !borrowed.return_request
                          ? "bg-primary-light" // Blue for borrowed (not late)
                          : borrowed.late_day > 0 && !borrowed.return_request
                          ? "bg-red-500" // Red for overdue
                          : "bg-primary" // Different shade for return requested
                      }`}
                    >
                      {/* Status text and icon based on conditions */}
                      {!borrowed.return_request ? (
                        borrowed.late_day == 0 ? (
                          <>
                            مُستعار <BookOpen size={14} />
                          </>
                        ) : (
                          <>
                            متأخر <TriangleAlert size={14} />
                          </>
                        )
                      ) : (
                        <>
                          تم طلب الاسترجاع <Redo2 size={14} />
                        </>
                      )}
                    </span>

                    {/* Book Cover Thumbnail */}
                    <div className="aspect-[3/4] relative overflow-hidden rounded-lg w-16 h-20">
                      <Image
                        src={borrowed.book.image || "/placeholder.svg"}
                        alt={borrowed.book.title}
                        className="object-cover w-full h-full"
                        fill
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Empty State - shown when no books are borrowed
              <div className="flex flex-col gap-6 items-center my-6">
                <BookOpen size={50} color="gray" />
                <p className="text-gray-400">
                  لم تتم استعارة أيِّ كتابٍ حتى الآن
                </p>
                {/* Call-to-action button to browse books */}
                <Link
                  href={"/books"}
                  className="bg-primary-light text-white transition-colors duration-200 hover:bg-hover-dark rounded-lg py-1.5 px-4 "
                >
                  قم بالاستعارة الآن
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ============ Tab 2: Reading History Content ============ */}
        {/* Show loading spinner while fetching books log */}
        {booksLogLoading && <LoadingSpinner />}

        {/* Display reading history tab content when active and loaded */}
        {!booksLogLoading && tabs === "readingHistory" && (
          <div className="reading-history-tab bg-white rounded-2xl p-6 mt-6 shadow">
            {/* Tab header */}
            <h2 className="font-semibold">سجل القراءة</h2>
            <h3 className="text-gray-500">
              الكتب التي استعرتها وأرجعتها سابقاً
            </h3>

            {/* Show error message if fetch failed */}
            {booksLogError ? (
              <div className="text-red-500 font-semibold text-center">
                {booksLogError}
              </div>
            ) : booksLog.length !== 0 ? (
              // Map through books log and display each returned book
              booksLog.map((log) => (
                <div
                  key={log.id}
                  className="mt-5 border border-gray-300 p-5 rounded-2xl flex justify-between flex-col-reverse lg:flex-row items-center gap-y-3"
                >
                  {/* Left Section: Action Buttons and Book Info */}
                  <div className="flex flex-col-reverse lg:flex-row gap-3 items-center ">
                    {/* Action Buttons Container */}
                    <div className="flex flex-col gap-2">
                      {/* View Details Button */}
                      <Link
                        href={`/books/${log.book.id}`}
                        className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 text-blue-950 font-medium hover:bg-accent hover:text-white transition-colors duration-200 cursor-pointer text-xs sm:text-base"
                      >
                        عرض التفاصيل
                      </Link>

                      {/* Re-borrow Button - allows borrowing previously read books again */}
                      {borrowBookLoading == log.book.id ? (
                        <LoadingSpinner />
                      ) : (
                        <button
                          onClick={async () => {
                            setBorrowBookLoading(log.book.id);
                            await borrowBookFn(log.book.id);
                            setBorrowBookLoading(null);
                          }}
                          className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 text-blue-950 font-medium flex gap-1 justify-center items-center hover:bg-accent hover:text-white transition-colors duration-200 cursor-pointer text-xs sm:text-base"
                        >
                          تجديد
                          <RotateCcw size={16} />
                        </button>
                      )}
                    </div>

                    {/* Book Title and Author */}
                    <div className="text-center lg:text-start">
                      <p className="font-semibold text-blue-950">
                        {log.book.title}
                      </p>
                      <p className="text-gray-500">
                        بقلم {log.book.author?.name}
                      </p>
                    </div>
                  </div>

                  {/* Right Section: Status Badge, Return Date, and Book Image */}
                  <div className="text-gray-500 flex flex-col-reverse lg:flex-row gap-3 items-center ">
                    {/* Returned Status Badge */}
                    <span
                      className={`flex items-center gap-1 rounded-sm px-3 py-1.5 text-xs text-white bg-primary-light
                          `}
                    >
                      مرجع <BookOpen size={14} />
                    </span>

                    {/* Return Date Display */}
                    <span className="return-time whitespace-nowrap flex text-xs items-center gap-0.5">
                      تاريخ الإرجاع: {log.return_date || "لم يتم الإرجاع بعد"}
                      <Calendar size={14} />
                    </span>

                    {/* Book Cover Thumbnail */}
                    <div className="aspect-[3/4] relative overflow-hidden rounded-lg w-16 h-20">
                      <Image
                        src={log.book.image || "/placeholder.svg"}
                        alt={log.book.title}
                        className="object-cover w-full h-full"
                        fill
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Empty State - shown when no reading history exists
              <div className="flex flex-col gap-6 items-center my-6">
                <BookOpen size={50} color="gray" />
                <p className="text-gray-400">لا توجد كتب مقروءة حتى الآن</p>
                {/* Call-to-action button to start reading */}
                <Link
                  href={"/books"}
                  className="bg-primary-light text-white transition-colors duration-200 hover:bg-hover-dark rounded-lg py-1.5 px-3 "
                >
                  اقرأ الآن
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ============ Tab 3: Favorites Content ============ */}
        {/* Show loading spinner while fetching favorites */}
        {favoritesBooksloading && <LoadingSpinner />}

        {/* Show error message if favorites fetch failed */}
        {favoritesBooksError && (
          <p className="text-red-500 font-semibold">{favoritesBooksError}</p>
        )}

        {/* Display favorites tab content when active and loaded */}
        {!favoritesBooksloading && tabs === "favorites" && (
          <div className="reading-history-tab bg-white rounded-2xl p-6 mt-6 shadow">
            {/* Tab header with "View All" link */}
            <div className="flex justify-between gap-2 items-start flex-wrap ">
              <div>
                <h2 className="font-semibold">مفضلتي</h2>
                <h3 className="text-gray-500">الكتب التي حفظتها لوقت لاحق</h3>
              </div>
              {/* Link to full favorites page */}
              <Link
                href={"/favorites"}
                className=" rounded-md font-medium text-sm text-white border border-accent-dark  py-1.5 px-3  transition-colors duration-300 bg-accent hover:bg-accent-dark"
              >
                عرض الكل
              </Link>
            </div>

            {/* Display favorites or empty state */}
            {favoritesBooks.length !== 0 ? (
              // Map through first 3 favorites only (limited preview)
              favoritesBooks.slice(0, 3).map((b) => {
                return (
                  <div
                    key={b.book.id}
                    className="mt-5 border border-gray-300 p-5 rounded-2xl flex justify-between flex-col-reverse lg:flex-row items-center gap-y-3"
                  >
                    {/* Left Section: Action Button and Book Info */}
                    <div className="flex flex-col-reverse lg:flex-row gap-3 items-center lg:items-start">
                      {/* View Details Button */}
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/books/${b.book.id}`}
                          className="bg-primary-light px-3 py-1.5 rounded-lg border border-gray-200 text-white font-medium hover:bg-hover hover:text-white transition-colors duration-200 cursor-pointer text-xs sm:text-base"
                        >
                          عرض التفاصيل
                        </Link>
                      </div>

                      {/* Book Title and Author */}
                      <div className="text-center lg:text-start">
                        <p className="font-semibold text-blue-950">
                          {b.book.title}
                        </p>
                        <p className="text-gray-500">
                          بقلم {b.book.author.name}
                        </p>
                      </div>
                    </div>

                    {/* Right Section: Remove Button and Book Image */}
                    <div className="text-gray-500 flex flex-col-reverse lg:flex-row gap-3 items-center ">
                      {/* Remove from Favorites Button - shows loading or button */}
                      {favLoading === b.book.id ? (
                        <LoadingSpinner />
                      ) : (
                        <button
                          onClick={async () => {
                            setFavLoading(b.book.id);
                            await removeFromFavFn(b.book.id);
                            setFavLoading(null);
                          }}
                          className="group flex items-center gap-x-2 border border-gray-300 px-3 py-1.5 rounded-lg justify-center flex-1 cursor-pointer hover:bg-red-300 hover:text-white transition-colors duration-200"
                        >
                          <Heart
                            size={18}
                            className="text-red-500 group-hover:text-white transition-colors duration-200"
                          />
                          إزالة من المفضلة
                        </button>
                      )}

                      {/* Book Cover Thumbnail */}
                      <div className="aspect-[3/4] relative overflow-hidden rounded-lg w-16 h-20">
                        <Image
                          src={b.book.image || "/placeholder.svg"}
                          alt={b.book.title}
                          className="object-cover w-full h-full"
                          fill
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // Empty State - shown when no favorites exist
              <div className="flex flex-col gap-6 items-center my-6">
                <Heart size={50} color="gray" />
                <p className="text-gray-400">لا توجد مفضلة بعد</p>
                {/* Call-to-action button to discover books */}
                <Link
                  href={"/books"}
                  className="bg-blue-950 text-white transition-colors duration-200 hover:bg-blue-900 rounded-lg py-1.5 px-4 "
                >
                  اكتشف الكتب
                </Link>
              </div>
            )}
          </div>
        )}
      </section>
    </section>
  );
};

export default Profile;
