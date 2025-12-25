"use client";
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
import { removeFromFav } from "../../../../lib/favorite/removeFromFav";
import { getCategories } from "../../../../lib/categories/categories";
import { getBooks } from "../../../../lib/books/getBooks";
import { toast } from "sonner";

const Books = ({ searchParams }) => {
  const params = use(searchParams);
  const categoryQry = params.category;

  const [sortBy, setSortBy] = useState("title");
  const [displayMethod, setDisplayMethod] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [favLoading, setFavLoading] = useState(false);

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

  const getCategoriesFn = async () => {
    // setCateLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching books:", error.message);
    }
  };

  const addToFavFn = async (bookId) => {
    console.log(bookId);
    try {
      const res = await addToFav(bookId);
      console.log(res);
      toast.success("تمت الإضافة إلى المفضلة");
    } catch (error) {
      console.log(error.message);
      toast.error("حث خطأ اثناء الإضافة إلى المفضلة بسبب: " + error.message);
    }
  };

  const filteredBooks = books.filter((b) => {
    const filteredBySearch =
      b.author?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.title.toLowerCase().includes(searchTerm.toLowerCase());

    const filteredByCategory =
      selectedCategory !== "all" ? b.category?.name === selectedCategory : true;

    return filteredBySearch && filteredByCategory;
  });

  const sortedBooks = filteredBooks.sort((a, b) => {
    const getValue = (item) => {
      if (sortBy === "author") {
        return item.author?.name || "";
      }
      return item[sortBy] ?? "";
    };

    return getValue(a).localeCompare(getValue(b));
  });

  useEffect(() => {
    fetchBooks();
    getCategoriesFn();
  }, []);

  return (
    <div className="books container min-w-full my-10 ">
      {/* Title */}
      <h1 className="text-4xl font-bold text-blue-950">تصفح الكتب</h1>
      <p className="text-xl text-gray-500 font-medium my-8">
        اكتشف قراءتك الرائعة التالية من مجموعتنا الواسعة.
      </p>

      {/* Search Bar */}
      <div className="search bg-white p-6 rounded-2xl border border-gray-300">
        <div className="flex gap-5 flex-1 flex-col sm:flex-row">
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

      {/* Sort and Display mrthod */}
      <div className="sort-display px-1 flex justify-between items-center mt-10 text-gray-500 flex-wrap gap-x-10 gap-y-5">
        <p className="">تم العثور على {books.length} كتاب</p>
        <div className="flex gap-x-4 flex-wrap gap-y-2">
          <div className="sortBy flex items-center gap-x-3">
            <span className="">ترتيب حسب: </span>
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
          <div className="displayBooks flex items-center gap-2.5">
            <span className="">طريقة العرض: </span>
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

      {/* Books Cards */}
      <section className="books mt-10 text-center ">
        {loading && <LoadingSpinner />}

        {error && <div className="text-red-400">{error}</div>}

        <div
          className={`${
            displayMethod === "grid" ? "grid" : "flex"
          } flex-col items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10 `}
        >
          {sortedBooks.map((book, idx) => (
            <div
              key={book.id}
              className="bg-white rounded-xl transition-shadow duration-200 shadow-xl flex flex-col items-start hover:shadow-2xl p-4 w-full max-w-[600px] h-full"
            >
              <div className="aspect-[3/4] relative mb-4 overflow-hidden rounded-lg w-full h-[300px]">
                <Image
                  src={book.image || "/placeholder.svg"}
                  alt={book.title}
                  className="object-contain w-full h-full"
                  fill
                  sizes="200px"
                />
              </div>

              <span className="font-medium mb-2">{book.title}</span>
              <span className="text-gray-500 text-start">
                {book.author?.name}
              </span>

              <div className="flex justify-between w-full items-center my-5">
                <span className="bg-accent text-gray-50 px-2 py-1 rounded ">
                  {book.category?.name}
                </span>
                <span className="text-gray-400">{book.pages} صفحة</span>
              </div>

              <p className="text-gray-500 mb-5 line-clamp-2 h-[45px]">
                {book.description}
              </p>

              <Link
                href={`/books/${book.id}`}
                className="bg-primary-light hover:bg-hover-dark w-full text-white rounded-md py-2 px-4 cursor-pointer transform transition-all duration-300  whitespace-nowrap "
              >
                عرض التفاصيل
              </Link>

              <div className="flex items-center gap-x-3 justify-between w-full mt-5 flex-wrap gap-y-2 ">
                {favLoading === book.id ? (
                  <LoadingSpinner />
                ) : (
                  <button
                    onClick={async () => {
                      setFavLoading(book.id);
                      await addToFavFn(book.id);
                      setFavLoading(null);
                    }}
                    disabled={favLoading === book.id}
                    className="group flex items-center gap-x-2 border border-gray-300 px-3 py-1.5 rounded-lg justify-center flex-1 cursor-pointer hover:bg-red-300 hover:text-white transition-colors duration-200"
                  >
                    <Heart
                      size={18}
                      className="text-red-500 group-hover:text-white transition-colors duration-200"
                    />
                    مفضلة
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <Link href={"#"}></Link>
      </section>
    </div>
  );
};

export default Books;
