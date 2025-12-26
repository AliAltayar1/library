"use client";

/**
 * Books Component - Main books browsing and management page
 *
 * @description This component provides a comprehensive books browsing interface with features including:
 * - Search functionality by title or author
 * - Category filtering
 * - Sorting by title or author
 * - Grid/List display toggle
 * - Favorites management (add/remove)
 * - Responsive design with loading states
 *
 * @returns {JSX.Element} The Books page component with search, filter, and favorites functionality
 */

import {
  ArrowUpNarrowWide,
  Grid3x3,
  Heart,
  List,
  Search,
  User,
} from "lucide-react";
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
// import { getBooks } from "../../../lib/books/getBooks";
import LoadingSpinner from "../../UI/LoadingSpinner";
import { addToFav } from "../../../../lib/favorite/addToFav";
import { getCategories } from "../../../../lib/categories/categories";
import { getBooks } from "../../../../lib/books/getBooks";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { getFavoritesBooks } from "../../../../lib/favorite/getFavBook";
import { removeFromFav } from "../../../../lib/favorite/removeFromFav";

const Books = () => {
  // Get category query parameter from URL (e.g., ?category=fiction)
  const searchParams = useSearchParams();
  const categoryQry = searchParams.get("category");

  // ============ State Management ============

  // Sorting state - controls whether books are sorted by "title" or "author"
  const [sortBy, setSortBy] = useState("title");

  // Display method state - toggles between "grid" and "list" view
  const [displayMethod, setDisplayMethod] = useState("grid");

  // Search term state - stores user's search input for filtering books
  const [searchTerm, setSearchTerm] = useState("");

  // Category filter state - stores selected category for filtering, "all" shows all books
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Books data state - stores the array of book objects fetched from API
  const [books, setBooks] = useState([]);

  // Loading state for books fetch operation
  const [loading, setLoading] = useState(false);

  // Error state for books fetch operation
  const [error, setError] = useState(null);

  // Categories data state - stores available book categories for filter dropdown
  const [categories, setCategories] = useState([]);

  // Favorite button loading state - stores the ID of the book currently being added/removed
  const [favLoading, setFavLoading] = useState(false);

  // User's favorite books state - stores array of favorite book objects
  const [favoritesBooks, setFavoritesBooks] = useState([]);

  // Loading state for favorites fetch operation
  const [favoritesBookLoading, setFavoritesBookLoading] = useState(false);

  // Error state for favorites fetch operation
  const [favoritesBookLerror, setFavoritesBookError] = useState(null);

  // ============ API Functions ============

  /**
   * Fetches all books from the API, optionally filtered by category
   *
   * @async
   * @function fetchBooks
   * @returns {Promise<void>}
   */
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooks(categoryQry);
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);

      console.error("Error fetching books:", error.message);

      setError(error.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches all available book categories from the API
   *
   * @async
   * @function getCategoriesFn
   * @returns {Promise<void>}
   */
  const getCategoriesFn = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching books:", error.message);
    }
  };

  // Create a Set of favorite book IDs for O(1) lookup performance
  // Used to quickly check if a book is favorited without iterating through array
  const favoriteIds = new Set(
    favoritesBooks && favoritesBooks.map((fav) => fav.book.id)
  );

  /**
   * Adds a book to the user's favorites list
   *
   * @async
   * @function addToFavFn
   * @param {number} bookId - The ID of the book to add to favorites
   * @returns {Promise<void>}
   */
  const addToFavFn = async (bookId) => {
    try {
      await addToFav(bookId);
      // Refresh favorites list to update UI
      await getFavoritesBooksFn();
      toast.success("تمت الإضافة إلى المفضلة");
    } catch (error) {
      console.log(error.message);
      toast.error("حث خطأ اثناء الإضافة إلى المفضلة بسبب: " + error.message);
    }
  };

  /**
   * Removes a book from the user's favorites list
   *
   * @async
   * @function removeFromFavFn
   * @param {number} bookId - The ID of the book to remove from favorites
   * @returns {Promise<void>}
   */
  const removeFromFavFn = async (bookId) => {
    try {
      await removeFromFav(bookId);
      // Refresh favorites list to update UI
      await getFavoritesBooksFn();
      toast.success("تمت الإزالة من المفضلة");
    } catch (error) {
      console.log(error.message);
      toast.error("حث خطأ اثناء الإزالة من المفضلة بسبب: " + error.message);
    }
  };

  /**
   * Fetches the user's favorite books from the API
   *
   * @async
   * @function getFavoritesBooksFn
   * @returns {Promise<void>}
   */
  const getFavoritesBooksFn = async () => {
    setFavoritesBookLoading(true);
    try {
      const data = await getFavoritesBooks();
      setFavoritesBooks(data);
    } catch (error) {
      setFavoritesBookError(error.message);
      toast.error(error.message);
    } finally {
      setFavoritesBookLoading(false);
    }
  };

  // ============ Filtering and Sorting Logic ============

  /**
   * Filtered books based on search term and selected category
   * Filters by both author name and book title (case-insensitive)
   */
  const filteredBooks = books.filter((b) => {
    // Check if search term matches author name or book title
    const filteredBySearch =
      b.author?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.title.toLowerCase().includes(searchTerm.toLowerCase());

    // Check if book matches selected category (or show all if "all" is selected)
    const filteredByCategory =
      selectedCategory !== "all" ? b.category?.name === selectedCategory : true;

    // Book must match both filters to be displayed
    return filteredBySearch && filteredByCategory;
  });

  /**
   * Sorted books array based on the selected sort criteria (title or author)
   * Uses localeCompare for proper alphabetical sorting
   */
  const sortedBooks = filteredBooks.sort((a, b) => {
    // Helper function to get the value to sort by
    const getValue = (item) => {
      if (sortBy === "author") {
        return item.author?.name || "";
      }
      return item[sortBy] ?? "";
    };

    // Compare values alphabetically using localeCompare
    return getValue(a).localeCompare(getValue(b));
  });

  console.log(favoritesBooks);

  // ============ Side Effects ============

  /**
   * Initial data fetch on component mount
   * Loads books, categories, and user's favorite books
   */
  useEffect(() => {
    fetchBooks();
    getCategoriesFn();
    getFavoritesBooksFn();
  }, []);

  // ============ JSX Render ============

  return (
    <div className="books container min-w-full my-10 ">
      {/* Page Title and Description */}
      <h1 className="text-4xl font-bold text-blue-950">تصفح الكتب</h1>
      <p className="text-xl text-gray-500 font-medium my-8">
        اكتشف قراءتك الرائعة التالية من مجموعتنا الواسعة.
      </p>

      {/* Search and Filter Section */}
      <div className="search bg-white p-6 rounded-2xl border border-gray-300">
        <div className="flex gap-5 flex-1 flex-col sm:flex-row">
          {/* Search Input - filters by title or author */}
          <div className="relative flex-3">
            <input
              type="text"
              placeholder="البحث بالعنوان أو المؤلف..."
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
        {/* Display total number of books found */}
        <p className="">تم العثور على {books.length} كتاب</p>
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
              className={`-me-1 border-gray-400 border p-2 rounded-lg cursor-pointer flex items-center gap-x-2  ${
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
              className={`-me-1 border-gray-400 border p-2 rounded-lg cursor-pointer flex items-center gap-x-2  ${
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

      {/* Books Display Section */}
      <section className="books mt-10 text-center ">
        {/* Show loading spinner while fetching books */}
        {loading && <LoadingSpinner />}

        {/* Show error message if books fetch failed */}
        {error && <div className="text-red-400">{error}</div>}

        {/* Books Grid/List Container - layout changes based on displayMethod state */}
        <div
          className={`${
            displayMethod === "grid" ? "grid" : "flex"
          } flex-col items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10 `}
        >
          {/* Map through sorted and filtered books to render book cards */}
          {sortedBooks.map((book, idx) => (
            <div
              key={book.id}
              className="bg-white rounded-xl transition-shadow duration-200 shadow-xl flex flex-col items-start hover:shadow-2xl p-4 w-full max-w-[600px] h-full"
            >
              {/* Book Cover Image */}
              <div className="aspect-[3/4] relative mb-4 overflow-hidden rounded-lg w-full h-[300px]">
                <Image
                  src={book.image || "/placeholder.svg"}
                  alt={book.title}
                  className="object-contain w-full h-full"
                  fill
                  sizes="200px"
                />
              </div>

              {/* Book Title */}
              <span className="font-medium mb-2">{book.title}</span>
              {/* Book Author - shows fallback text if no author */}
              <span className="text-gray-500 text-start">
                {book.author?.name || "لا يوجد مؤلف"}
              </span>

              {/* Book Category and Page Count */}
              <div className="flex justify-between w-full items-center my-5">
                {/* Category Badge */}
                <span className="bg-accent text-gray-50 px-2 py-1 rounded ">
                  {book.category?.name || "لا يوجد فئة"}
                </span>
                {/* Page Count */}
                <span className="text-gray-400">{book.pages}صفحة</span>
              </div>

              {/* Book Description - limited to 2 lines with ellipsis */}
              <p className="text-gray-500 mb-5 line-clamp-2 h-[45px]">
                {book.description}
              </p>

              {/* View Details Button - navigates to individual book page */}
              <Link
                href={`/books/${book.id}`}
                className="bg-primary-light hover:bg-hover-dark w-full text-white rounded-md py-2 px-4 cursor-pointer transform transition-all duration-300  whitespace-nowrap "
              >
                عرض التفاصيل
              </Link>

              {/* Favorite Button Section */}
              <div className="flex items-center gap-x-3 justify-between w-full mt-5 flex-wrap gap-y-2 ">
                {/* Show loading spinner if this specific book's favorite status is being updated */}
                {favLoading === book.id ? (
                  <LoadingSpinner />
                ) : (
                  // Favorite Toggle Button - adds or removes book from favorites
                  <button
                    onClick={async () => {
                      setFavLoading(book.id);
                      // Check if book is already favorited, then remove or add accordingly
                      favoriteIds.has(book.id)
                        ? await removeFromFavFn(book.id)
                        : await addToFavFn(book.id);
                      setFavLoading(null);
                    }}
                    className={`group flex items-center gap-x-2 px-3 py-1.5 rounded-lg justify-center flex-1 transition-colors duration-200 ${
                      favoriteIds.has(book.id)
                        ? "bg-red-400 text-white border border-red-400 hover:bg-red-500"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {/* Heart Icon - filled when favorited, outlined when not */}
                    <Heart
                      size={18}
                      className={`transition-all duration-200 ${
                        favoriteIds.has(book.id)
                          ? "fill-white text-white"
                          : "text-gray-600 group-hover:text-red-400"
                      }`}
                    />
                    {/* Button Text - changes based on favorite status */}
                    {favoriteIds.has(book.id)
                      ? "إزالة من المفضلة"
                      : "إضافة للمفضلة"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Books;
