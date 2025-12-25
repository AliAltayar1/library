"use client";
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
  const [sortBy, setSortBy] = useState("title");
  const [displayMethod, setDisplayMethod] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favoritesBooks, setFavoritesBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favLoading, setFavLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const filteredBooks =
    favoritesBooks &&
    favoritesBooks.filter((b) => {
      const filteredBySearch =
        b.book.author?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.title.toLowerCase().includes(searchTerm.toLowerCase());

      const filteredByCategory =
        selectedCategory !== "all"
          ? b.category?.name === selectedCategory
          : true;

      return filteredBySearch && filteredByCategory;
    });

  console.log(filteredBooks);
  const sortedBooks = filteredBooks.sort((a, b) => {
    const getValue = (item) => {
      if (sortBy === "author") {
        return item.author?.name || "";
      }
      return item[sortBy] ?? "";
    };

    return getValue(a.book).localeCompare(getValue(b.book));
  });

  function clearFilters() {
    setSearchTerm("");
    setSelectedCategory("all");
  }

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

  const removeFromFavFn = async (bookId) => {
    console.log(bookId);
    try {
      const res = await removeFromFav(bookId);
      console.log(res);
      await getFavoritesBooksFn();
      toast.success("تمت الإزالة من المفضلة");
    } catch (error) {
      console.log(error.message);
      toast.error("حث خطأ اثناء الإزالة من المفضلة بسبب: " + error.message);
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

  console.log(favoritesBooks);

  useEffect(() => {
    getFavoritesBooksFn();
    getCategoriesFn();
  }, []);

  console.log(selectedCategory);
  return (
    <section className="favorites container min-w-full py-15">
      {/* Title */}
      <h1 className="text-4xl font-bold text-blue-950">مفضلتي</h1>
      <p className=" text-gray-500 font-medium mt-4 mb-8">كتاب في مفضلتك </p>

      {/* Search Bar */}
      <div className="search bg-white p-6 rounded-2xl border border-gray-300">
        <div className="flex gap-5 flex-1 flex-col sm:flex-row">
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
        {console.log(sortBy)}
        <p className="">{sortedBooks.length} من مفضلة معروضة</p>
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
              className={`-me-1 border-gray-300 border p-2 rounded-lg cursor-pointer flex items-center gap-x-2  ${
                displayMethod === "grid"
                  ? "bg-primary-light text-white hover:bg-hover-dark  "
                  : "text-black hover:bg-accent hover:text-white hover:border-gray-200"
              }`}
              onClick={() => setDisplayMethod("grid")}
            >
              <Grid3x3 size={18} />
            </button>
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

      {/* Books Cards */}
      <section className="books mt-10 text-center ">
        {loading && <LoadingSpinner />}

        {error && <div className="text-red-400">{error}</div>}

        {sortedBooks.length > 1 ? (
          <div
            className={`${
              displayMethod === "grid" ? "grid" : "flex"
            } flex-col items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10 `}
          >
            {sortedBooks.map((b) => (
              <div
                key={b.book.id}
                className="bg-white rounded-xl transition-shadow duration-200 shadow-xl flex flex-col items-start hover:shadow-2xl p-4 w-full max-w-[600px] h-full"
              >
                <div className="aspect-[3/4] relative mb-4 overflow-hidden rounded-lg w-full h-[300px]">
                  <Image
                    src={b.book.image || "/placeholder.svg"}
                    alt={b.book.title}
                    className="object-contain "
                    fill
                    sizes="200px"
                  />
                </div>

                <span className="font-medium mb-2">{b.book.title}</span>
                <span className="text-gray-500 text-start">
                  {b.book.author?.name}
                </span>

                <div className="flex justify-between w-full items-center my-5">
                  <span className="bg-accent text-gray-50 px-2 py-1 rounded ">
                    {b.book.category?.name || "لا يوجد فئة"}
                  </span>
                  <span className="text-gray-400">{b.book.pages} صفحة</span>
                </div>

                <p className="text-gray-500 mb-5 line-clamp-2 h-[45px]">
                  {b.book.description}
                </p>

                <Link
                  href={`/books/${b.book.id}`}
                  className="bg-primary-light hover:bg-hover-dark w-full text-white rounded-md py-2 px-4 cursor-pointer transform transition-all duration-300  whitespace-nowrap "
                >
                  عرض التفاصيل
                </Link>

                <div className="flex items-center gap-x-3 justify-between w-full mt-5 flex-wrap gap-y-2 ">
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <section className="flex flex-col items-center gap-y-3 mt-10">
            <Search size={60} color="gray" />
            <p className="text-xl font-semibold text-gray-600">
              لم يتم العثور على نتائج
            </p>
            <span className="text-gray-500">
              جرب تعديل معايير البحث أو التصفية.
            </span>

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

        <Link href={"#"}></Link>
      </section>
    </section>
  );
};

export default Favorites;
