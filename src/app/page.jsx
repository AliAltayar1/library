"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChartColumnStacked,
  Clock,
  Star,
  Users,
} from "lucide-react";
import Button from "./components/button";
// import { categories } from "../../lib/data";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBack, Category } from "@mui/icons-material";
import { getBooks } from "../../lib/books/getBooks";
import LoadingSpinner from "./UI/LoadingSpinner";
import { getCategories } from "../../lib/categories/categories";
import Lottie from "lottie-react";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cateLoading, setCateLoading] = useState(false);
  const [cateError, setCateError] = useState(null);
  const [animationData, setAnimationData] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooks();
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
    setCateLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching books:", error.message);
      setCateError(error.message);
    } finally {
      setCateLoading(false);
    }
  };

  console.log(categories);

  useEffect(() => {
    fetchBooks();
    getCategoriesFn();

    fetch("/Book.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  return (
    <div className="home-page">
      <div className="hero-section">
        <section
          className="hero-section bg-[linear-gradient(90deg,rgba(29,93,236,1)_0%,rgba(4,61,156,1)_100%)]
        w-full text-white text-center flex 
        justify-center flex-wrap py-28 px-5"
        >
          {animationData && (
            <div className="w-44 h-44 md:w-64 md:h-64">
              <Lottie animationData={animationData} loop={true} />
            </div>
          )}
          <div
            className="text-center flex 
      flex-col justify-center gap-y-5 "
          >
            <h1 className="text-5xl font-semibold leading-tight">
              مرحباً بك في مكتبتك الرقمية
            </h1>
            <p className="font-medium text-xl">
              اكتشف آلاف الكتب، وأدر رحلتك في القراءة، واستكشف عوالم جديدة من
              المعرفة في متناول يديك.
            </p>
            <div className="flex gap-x-3 justify-center ">
              <Button
                text="تصفح الكتب"
                cn="bg-accent hover:bg-accent-dark font-semibold hover:text-whitse"
              />
              <Button
                text="انضم اليوم"
                cn="border border-white hover:text-blue-950 hover:bg-white font-semibold "
              />
            </div>
          </div>
        </section>

        <div className="md:-translate-y-12 ">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <defs>
              <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(29,93,236,1)" />
                <stop offset="100%" stopColor="rgba(4,61,156,1)" />
              </linearGradient>
            </defs>
            <path
              fill="url(#myGradient)"
              fillOpacity="1"
              d="M0,224L60,202.7C120,181,240,139,360,133.3C480,128,600,160,720,192C840,224,960,256,1080,250.7C1200,245,1320,203,1380,181.3L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="container min-w-full py-12">
        <section className="statistics flex flex-col sm:flex-row gap-x-5 gap-y-8 justify-between  text-black">
          {[
            {
              icon: BookOpen,
              label: "الكتب المتاحة",
              value: `${books.length || 0}+`,
            },
            {
              icon: ChartColumnStacked,
              label: "الفئات المتاحة",
              value: `${categories.length || 0}+`,
            },
            { icon: Clock, label: "الساعات المحفوظة", value: "50,000+" },
            { icon: Star, label: "متوسط التقييم", value: "4.8/5" },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center ">
                <Icon className="h-12 w-12 text-accent mx-auto mb-4" />
                <div className="text-3xl text-gray-700 font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            );
          })}
        </section>

        <section className="categories mt-30 text-center">
          <h1 className="text-3xl font-bold mb-5">استكشف الفئات</h1>
          <p className="text-gray-500 text-xl font-medium">
            اعثر على قراءتك الرائعة التالية من مجموعتنا المتنوعة من الأنواع
            والمواضيع.
          </p>

          <div className="flex gap-5 flex-wrap mt-10 justify-center">
            {cateLoading && <LoadingSpinner />}
            {cateError && <div className="text-red-500">{cateError}</div>}
            {categories &&
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={{
                    pathname: "/books",
                    query: { category: category.name },
                  }}
                  className="w-52 hover:bg-blue-50 h-28 bg-white rounded-xl shadow-lg flex justify-center items-center hover:shadow-2xl transition-shadow duration-300"
                >
                  <span className="text-xl font-medium text-gray-700">
                    {category.name}
                  </span>
                </Link>
              ))}
          </div>
        </section>

        <section className="best-books my-30 text-center ">
          <h1 className="text-3xl font-bold mb-5">الكتب المميزة</h1>
          <p className="text-gray-500 text-xl font-medium">
            اعثر على قراءتك الرائعة التالية من مجموعتنا المتنوعة من الأنواع
            والمواضيع.
          </p>

          <div
            className={`${
              books.length > 0 ? "grid" : ""
            } grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10`}
          >
            {loading && <LoadingSpinner />}

            {error && <div className="text-red-500">{error}</div>}

            {books.length > 0
              ? books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-xl transition-shadow duration-200 shadow-xl flex flex-col items-start hover:shadow-2xl p-4 w-full"
                  >
                    <div className="aspect-[3/4]  relative mb-4 overflow-hidden rounded-lg w-full h-[300px]">
                      <Image
                        src={book.image || "/placeholder.svg"}
                        alt={book.title}
                        className="object-contain w-full h-full"
                        fill
                      />
                    </div>

                    <span className="font-medium mb-2">{book.title}</span>
                    <span className="text-gray-500 text-start">
                      {book.author?.name}
                    </span>

                    <div className="flex justify-between w-full items-center my-5">
                      <span className="bg-primary text-gray-50 px-2 py-1 rounded">
                        {book.category?.name}
                      </span>
                      <span
                        className={`${
                          book.is_avaiable
                            ? "bg-green-300 text-green-700"
                            : "bg-red-300 text-red-700"
                        } px-2 py-1 rounded`}
                      >
                        {book.is_avaiable ? "متاح" : "مُستعار"}
                      </span>
                    </div>

                    <Link href={`/books/${book.id}`} className="w-full">
                      <Button
                        text="عرض التفاصيل"
                        cn="bg-primary-light w-full hover:bg-hover"
                      />
                    </Link>
                  </div>
                ))
              : ""}
          </div>

          <Link href={"/books"}>
            <button
              className={
                "flex justify-center gap-1.5 m-auto rounded-xl px-4 py-2 cursor-pointer transform transition-all duration-300  whitespace-nowrap  border border-gray-400 mt-10  hover:bg-primary bg-primary-light text-white"
              }
            >
              <ArrowRight />
              عرض جميع الكتب
            </button>
          </Link>
        </section>
      </div>

      <section className="bg-[linear-gradient(270deg,rgba(29,93,236,1)_0%,rgba(4,61,156,1)_100%)] text-white text-center py-24 px-4">
        <h1 className="text-4xl font-bold mb-8 leading-tight">
          هل أنت مستعد لبدء رحلتك في القراءة؟
        </h1>
        <p className="text-xl font-medium mb-8">
          انضم إلى آلاف القراء الذين اكتشفوا كتابهم المفضل التالي من خلال
          منصتنا.
        </p>
        <Button
          text="ابدأ اليوم"
          cn="bg-accent text-xl font-medium hover:bg-accent-dark px-8"
        />
      </section>
    </div>
  );
}
