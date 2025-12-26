"use client";

/**
 * Favorites Component - User's Favorite Books Management Page
 *
 * @description This component displays and manages the user's favorite books collection with:
 * - Search functionality by book title or author
 * - Category filtering from dropdown
 * - Sorting by title or author name
 * - Grid/List display toggle
 * - Remove from favorites functionality
 * - Empty state with "clear filters" option when no results found
 * - Loading states and error handling
 *
 * @returns {JSX.Element} The Favorites page component
 */

import {
  ArrowUpNarrowWide,
  Grid3x3,
  Heart,
  List,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
// import Button from "../../../components/button";
import Image from "next/image";
import Link from "next/link";
import { books } from "../../../../lib/data";
import LoadingSpinner from "@/app/UI/LoadingSpinner";
import { getFavoritesBooks } from "../../../../lib/favorite/getFavBook";
import { removeFromFav } from "../../../../lib/favorite/removeFromFav";
import { toast } from "sonner";
import { getCategories } from "../../../../lib/categories/categories";

const Favorites = () => {
  // ============ State Management ============

  // Sorting state - controls whether favorites are sorted by "title" or "author"
  const [sortBy, setSortBy] = useState("title");

  // Display method state - toggles between "grid" and "list" view
  const [displayMethod, setDisplayMethod] = useState("grid");

  // Search term state - stores user's search input for filtering favorites
  const [searchTerm, setSearchTerm] = useState("");

  // Category filter state - stores selected category for filtering, "all" shows all favorites
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Favorites books state - stores array of favorite book objects from API
  // Note: Each item has structure { id, book: {...}, created_at }
  const [favoritesBooks, setFavoritesBooks] = useState([]);

  // Loading state for favorites fetch operation
  const [loading, setLoading] = useState(false);

  // Error state for favorites fetch operation
  const [error, setError] = useState(null);

  // Favorite removal loading state - stores the ID of book being removed
  const [favLoading, setFavLoading] = useState(false);

  // Categories data state - stores available book categories for filter dropdown
  const [categories, setCategories] = useState([]);

  // ============ Filtering and Sorting Logic ============

  /**
   * Filtered favorites based on search term and selected category
   * Filters by both author name and book title (case-insensitive)
   * Note: favoritesBooks structure has nested book object (b.book.property)
   */
  const filteredBooks =
    favoritesBooks &&
    favoritesBooks.filter((b) => {
      // Check if search term matches author name or book title
      const filteredBySearch =
        b.book.author?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.title.toLowerCase().includes(searchTerm.toLowerCase());

      // Check if book matches selected category (or show all if "all" is selected)
      const filteredByCategory =
        selectedCategory !== "all"
          ? b.category?.name === selectedCategory
          : true;

      // Book must match both filters to be displayed
      return filteredBySearch && filteredByCategory;
    });

  /**
   * Sorted favorites array based on the selected sort criteria (title or author)
   * Uses localeCompare for proper alphabetical sorting in any locale
   */
  const sortedBooks = filteredBooks.sort((a, b) => {
    // Helper function to get the value to sort by from nested book object
    const getValue = (item) => {
      if (sortBy === "author") {
        return item.author?.name || "";
      }
      return item[sortBy] ?? "";
    };

    // Compare values alphabetically using localeCompare
    // Note: Accessing nested book object with getValue(a.book)
    return getValue(a.book).localeCompare(getValue(b.book));
  });

  // ============ Utility Functions ============

  /**
   * Clears all active filters and resets to default state
   * Used when no results found to help user reset search/filter criteria
   *
   * @function clearFilters
   * @returns {void}
   */
  function clearFilters() {
    setSearchTerm("");
    setSelectedCategory("all");
  }

  // ============ API Functions ============

  /**
   * Fetches all favorite books for the current user from the API
   *
   * @async
   * @function getFavoritesBooksFn
   * @returns {Promise<void>}
   * @throws {Error} Displays error toast if fetch fails
   */
  const getFavoritesBooksFn = async () => {
    setLoading(true);
    try {
      const data = await getFavoritesBooks();
      setFavoritesBooks(data);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Removes a book from the user's favorites list
   * Refreshes favorites list after successful removal
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
      // Refresh favorites list to update UI
      await getFavoritesBooksFn();
      toast.success("تمت الإزالة من المفضلة");
    } catch (error) {
      console.log(error.message);
      toast.error("حث خطأ اثناء الإزالة من المفضلة بسبب: " + error.message);
    }
  };

  /**
   * Fetches all available book categories from the API
   * Used to populate the category filter dropdown
   *
   * @async
   * @function getCategoriesFn
   * @returns {Promise<void>}
   */
  const getCategoriesFn = async () => {
    // setCateLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching books:", error.message);
    }
  };

  // ============ Side Effects ============

  /**
   * Initial data fetch on component mount
   * Loads user's favorite books and available categories
   */
  useEffect(() => {
    getFavoritesBooksFn();
    getCategoriesFn();
  }, []);

  // ============ JSX Render ============

  return (
    <section className="favorites container min-w-full py-15">
      {/* Page Title and Description */}
      <h1 className="text-4xl font-bold text-blue-950">مفضلتي</h1>
      <p className=" text-gray-500 font-medium mt-4 mb-8">كتاب في مفضلتك </p>

      {/* Search and Filter Section */}
      <div className="search bg-white p-6 rounded-2xl border border-gray-300">
        <div className="flex gap-5 flex-1 flex-col sm:flex-row">
          {/* Search Input - filters by title or author */}
          <div className="relative flex-3">
            <input
              type="text"
              placeholder="ابحث في مفضلتك..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="w-full border border-gray-300 rounded-lg py-2 px-2 focus:outline-4 outline-blue-300 transition-all duration-100 ps-9"
            />
            <Search className="text-gray-400 absolute top-2 right-2 " />
          </div>

          {/* Category Filter Dropdown */}
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border flex-1 border-gray-300 rounded-lg px-3 text-gray-500 "
          >
            <option value={"all"}>جميع الفئات</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sort Controls and Display Method Toggle */}
      <div className="sort-display px-1 flex justify-between items-center mt-10 text-gray-500 flex-wrap gap-x-10 gap-y-5">
        {/* Display count of filtered favorites */}
        <p className="">{sortedBooks.length} من مفضلة معروضة</p>
        <div className="flex gap-x-4 flex-wrap gap-y-2">
          {/* Sort By Controls - Title or Author */}
          <div className="sortBy flex items-center gap-x-3">
            <span className="">ترتيب حسب: </span>
            {/* Sort by Title Button */}
            <button
              className={`py-1.5 px-3 border border-gray-400 rounded-lg  cursor-pointer flex items-center gap-x-2  ${
                sortBy === "title"
                  ? "bg-primary-light text-white hover:bg-hover-dark  "
                  : "text-black hover:bg-accent hover:text-white hover:border-gray-200"
              }`}
              onClick={() => setSortBy("title")}
            >
              العنوان
              <ArrowUpNarrowWide size={18} />
            </button>
            {/* Sort by Author Button */}
            <button
              className={`py-1.5 px-3 border border-gray-300 rounded-lg  cursor-pointer flex items-center gap-x-2  ${
                sortBy === "author"
                  ? "bg-primary-light text-white hover:bg-hover-dark  "
                  : "text-black hover:bg-accent hover:text-white hover:border-gray-200"
              }`}
              onClick={() => setSortBy("author")}
            >
              المؤلف
              <User size={18} />
            </button>
          </div>
          {/* Display Method Controls - Grid or List View */}
          <div className="displayBooks flex items-center gap-2.5">
            <span className="">طريقة العرض: </span>
            {/* Grid View Button */}
            <button
              className={`-me-1 border-gray-300 border p-2 rounded-lg cursor-pointer flex items-center gap-x-2  ${
                displayMethod === "grid"
                  ? "bg-primary-light text-white hover:bg-hover-dark  "
                  : "text-black hover:bg-accent hover:text-white hover:border-gray-200"
              }`}
              onClick={() => setDisplayMethod("grid")}
            >
              <Grid3x3 size={18} />
            </button>
            {/* List View Button */}
            <button
              className={`-me-1 border-gray-300 border p-2 rounded-lg cursor-pointer flex items-center gap-x-2  ${
                displayMethod === "list"
                  ? "bg-primary-light text-white hover:bg-hover-dark  "
                  : "text-black hover:bg-accent hover:text-white hover:border-gray-200"
              }`}
              onClick={() => setDisplayMethod("list")}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Favorites Display Section */}
      <section className="books mt-10 text-center ">
        {/* Show loading spinner while fetching favorites */}
        {loading && <LoadingSpinner />}

        {/* Show error message if favorites fetch failed */}
        {error && <div className="text-red-400">{error}</div>}

        {/* Conditional rendering: Show favorites grid or empty state */}
        {sortedBooks.length > 1 ? (
          // Favorites Grid/List - layout changes based on displayMethod state
          <div
            className={`${
              displayMethod === "grid" ? "grid" : "flex"
            } flex-col items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10 `}
          >
            {/* Map through sorted and filtered favorites to render book cards */}
            {sortedBooks.map((b) => (
              <div
                key={b.book.id}
                className="bg-white rounded-xl transition-shadow duration-200 shadow-xl flex flex-col items-start hover:shadow-2xl p-4 w-full max-w-[600px] h-full"
              >
                {/* Book Cover Image */}
                <div className="aspect-[3/4] relative mb-4 overflow-hidden rounded-lg w-full h-[300px]">
                  <Image
                    src={b.book.image || "/placeholder.svg"}
                    alt={b.book.title}
                    className="object-contain "
                    fill
                    sizes="200px"
                  />
                </div>

                {/* Book Title */}
                <span className="font-medium mb-2">{b.book.title}</span>
                {/* Book Author */}
                <span className="text-gray-500 text-start">
                  {b.book.author?.name}
                </span>

                {/* Book Category and Page Count */}
                <div className="flex justify-between w-full items-center my-5">
                  {/* Category Badge */}
                  <span className="bg-accent text-gray-50 px-2 py-1 rounded ">
                    {b.book.category?.name || "لا يوجد فئة"}
                  </span>
                  {/* Page Count */}
                  <span className="text-gray-400">{b.book.pages} صفحة</span>
                </div>

                {/* Book Description - limited to 2 lines with ellipsis */}
                <p className="text-gray-500 mb-5 line-clamp-2 h-[45px]">
                  {b.book.description}
                </p>

                {/* View Details Button - navigates to individual book page */}
                <Link
                  href={`/books/${b.book.id}`}
                  className="bg-primary-light hover:bg-hover-dark w-full text-white rounded-md py-2 px-4 cursor-pointer transform transition-all duration-300  whitespace-nowrap "
                >
                  عرض التفاصيل
                </Link>

                {/* Remove from Favorites Button Section */}
                <div className="flex items-center gap-x-3 justify-between w-full mt-5 flex-wrap gap-y-2 ">
                  {/* Show loading spinner if this specific book is being removed */}
                  {favLoading === b.book.id ? (
                    <LoadingSpinner />
                  ) : (
                    // Remove from Favorites Button
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State - shown when no favorites match the search/filter criteria
          <section className="flex flex-col items-center gap-y-3 mt-10">
            {/* Search icon for empty state visual */}
            <Search size={60} color="gray" />
            {/* No results message */}
            <p className="text-xl font-semibold text-gray-600">
              لم يتم العثور على نتائج
            </p>
            {/* Suggestion text */}
            <span className="text-gray-500">
              جرب تعديل معايير البحث أو التصفية.
            </span>

            {/* Clear Filters Button - resets all search and filter criteria */}
            <button
              className={
                "rounded-xl px-4 py-2 cursor-pointer transform transition-all duration-300  whitespace-nowrap text-white bg-primary-light hover:bg-hover-dark"
              }
              onClick={() => {
                clearFilters();
              }}
            >
              مسح المرشحات
            </button>
          </section>
        )}
      </section>
    </section>
  );
};

export default Favorites;
