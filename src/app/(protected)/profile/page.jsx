"use client";
import {
  BookOpen,
  Calendar,
  CircleCheckBig,
  Heart,
  LogOut,
  Redo2,
  RotateCcw,
  Settings,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { books } from "../../../../lib/data";
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
  const [tabs, setTabs] = useState("borrowing");
  const [userInfo, setUserInfo] = useState({
    username: "Demo User",
    email: "demo@mail.com",
    first_name: "Demo",
    last_name: "User",
    date_joined: "2000-01-01",
    borrowed_books_count: 0,
  });
  const [userInfoError, setUserInfoError] = useState(null);
  const [userInfoLoading, setUserInfoLoading] = useState(false);

  const [userBorrowed, setUserBorrowed] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [borrowedBooksLoading, setBorrowedBooksLoading] = useState(false);
  const [borrowedBooksError, setBorrowedBooksError] = useState(null);

  const [booksLog, setBooksLog] = useState([]);
  const [booksLogLoading, setBooksLogLoading] = useState(false);
  const [booksLogError, setBooksLogError] = useState(null);
  let numberOfFavoriteBook = 0;

  const [favoritesBooks, setFavoritesBooks] = useState([]);
  const [favoritesBooksloading, setFavoritesBooksLoading] = useState(false);
  const [favoritesBookserror, setFavoritesBooksError] = useState(null);
  const [favLoading, setFavLoading] = useState(false);

  const [returnBookLoading, setReturnBookLoading] = useState(null);
  const [borrowBookLoading, setBorrowBookLoading] = useState(null);

  const getUserProfileFn = async () => {
    setUserInfoLoading(true);
    try {
      const data = await profile();
      setUserInfo(data);
    } catch (error) {
      setUserInfoError(error.message || "Failed to fetch books");
      toast.error(error.message || "Failed to fetch books");
    } finally {
      setUserInfoLoading(false);
    }
  };

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

  const returnBookRequestFn = async (bookId) => {
    try {
      await returnBookRequest(bookId);
      getBorrowedBooksFn();
      toast.success("تم طلب الإرجاع بنجاح");
    } catch (error) {
      toast.error("حدث خطأ اثناء الإرجاع " + error.message);
    }
  };

  const borrowBookFn = async (bookId) => {
    try {
      await borrowBook(bookId);
      getBorrowedBooksFn();
      toast.success("تم طلب الإستعارة بنجاح");
    } catch (error) {
      toast.error("حدث خطأ اثناء الإستعارة " + error.message);
    }
  };

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

  const removeFromFavFn = async (bookId) => {
    console.log(bookId);
    try {
      const res = await removeFromFav(bookId);
      console.log(res);
      getFavoritesBooksFn();
      getUserProfileFn();
      toast.success("تمت الإزالة من المفضلة");
    } catch (error) {
      console.log(error.message);
      toast.error("حث خطأ اثناء الإزالة من المفضلة بسبب: " + error.message);
    }
  };
  useEffect(() => {
    getUserProfileFn();
    getBorrowedBooksFn();
    getBooksLogFn();
    getFavoritesBooksFn();
  }, []);

  console.log(favoritesBooks);

  return (
    <section className="profile container min-w-full my-10">
      {userInfoLoading && <LoadingSpinner />}
      {!userInfoLoading && (
        <>
          <section className="profile-heading flex justify-center md:justify-between gap-x-16 gap-y-10 flex-wrap">
            <div className="flex items-center gap-10 flex-wrap justify-center">
              <div className="logo bg-white min-w-14 min-h-14 rounded-full w-fit flex items-center justify-center text-xl">
                {userInfo.first_name?.[0]?.toUpperCase() +
                  " " +
                  userInfo.last_name?.[0]?.toUpperCase()}
              </div>
              <div className="text-center sm:text-start">
                <div className="font-bold text-3xl mb-1 text-blue-950 capitalize">
                  {userInfo.first_name + " " + userInfo.last_name}
                </div>
                <div className="text-gray-500 ">{userInfo.email}</div>
                <div className="text-gray-500">
                  عضو منذ <span>{userInfo.date_joined?.split("T")[0]}</span>
                </div>
              </div>
            </div>

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

          <section className="information mt-10 flex gap-8 flex-wrap justify-center flex-col sm:flex-row">
            <div className="borrowing min-h-44 bg-white rounded-2xl shadow border border-gray-300 p-8 flex gap-x-10 justify-between items-center flex-col sm:flex-row ">
              <div className="text-primary-light  font-semibold flex flex-col items-center gap-1 whitespace-nowrap">
                مُستعارة حالياً
                <span className="text-2xl text-primary-light font-bold">
                  {userInfo.borrowed_books_count}
                </span>
              </div>
              <BookOpen size={40} className="text-primary-light " />
            </div>
            {console.log(userInfo)}
            <div className="late-books min-h-44 bg-white rounded-2xl shadow border border-gray-300 p-8 flex gap-x-10 justify-between items-center flex-col sm:flex-row">
              <div className="text-red-500 font-semibold flex flex-col items-center gap-1">
                كتب متأخرة
                <span className="text-2xl text-red-500 font-bold ">
                  {userInfo.overdue_books_count}
                  {console.log(userInfo)}
                </span>
              </div>
              <TriangleAlert size={40} color="red" />
            </div>

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

          {userInfo.overdue_books_count > 0 && (
            <div className="late-book-alert border border-red-500 bg-white rounded-2xl p-8 flex items-center sm:flex-row flex-col gap-2 text-gray-500 mt-10">
              <TriangleAlert color="red" size={24} />
              لديك {userInfo.overdue_books_count} كتاب متأخر. يرجى إرجاعها في
              أقرب وقت ممكن لتجنب الرسوم المتأخرة.
            </div>
          )}
        </>
      )}

      <section className="quick-tabs mt-12">
        <div className="tabs custom-scroll flex justify-between font-semibold text-blue-950 overflow-x-auto p-2">
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

        {/*borrowing */}
        {borrowedBooksLoading && <LoadingSpinner />}
        {!borrowedBooksLoading && tabs === "borrowing" && (
          <div className="borrowing-tab bg-white rounded-2xl p-6 mt-6 shadow">
            <h2 className="font-semibold">الكتب المُستعارة حالياً</h2>
            <h3 className="text-gray-500">الكتب التي استعرتها حالياً</h3>
            {borrowedBooksError ? (
              <div className="text-red-500 text-center font-semibold">
                {borrowedBooksError}
              </div>
            ) : borrowedBooks.length !== 0 ? (
              borrowedBooks.map((borrowed) => (
                <div
                  key={borrowed.id}
                  className="mt-5 border border-gray-300 p-5 rounded-2xl flex justify-between flex-col-reverse lg:flex-row items-center gap-y-3"
                >
                  <div className="flex flex-col-reverse lg:flex-row gap-3 items-center ">
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/books/${borrowed.book.id}`}
                        className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 text-blue-950 font-medium hover:bg-accent hover:text-white transition-colors duration-200 cursor-pointer text-xs sm:text-base text-center"
                      >
                        عرض التفاصيل
                      </Link>
                      {returnBookLoading == borrowed.id ? (
                        <LoadingSpinner />
                      ) : (
                        <button
                          onClick={async () => {
                            setReturnBookLoading(borrowed.id);
                            await returnBookRequestFn(borrowed.id);
                            setReturnBookLoading(null);
                          }}
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

                    <div className="text-center lg:text-start">
                      <p className="font-semibold text-blue-950">
                        {borrowed.book.title}
                      </p>
                      <p className="text-gray-500">
                        بقلم {borrowed.book.author?.name}
                      </p>
                    </div>
                  </div>

                  <div className="text-gray-500 flex flex-col-reverse lg:flex-row gap-3 items-center">
                    <span
                      className={`flex items-center gap-1 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs text-white ${
                        borrowed.late_day == 0 && !borrowed.return_request
                          ? "bg-primary-light"
                          : borrowed.late_day > 0 && !borrowed.return_request
                          ? "bg-red-500"
                          : "bg-primary"
                      }`}
                    >
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
              <div className="flex flex-col gap-6 items-center my-6">
                <BookOpen size={50} color="gray" />
                <p className="text-gray-400">
                  لم تتم استعارة أيِّ كتابٍ حتى الآن
                </p>
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

        {/*Reading history */}
        {booksLogLoading && <LoadingSpinner />}
        {!booksLogLoading && tabs === "readingHistory" && (
          <div className="reading-history-tab bg-white rounded-2xl p-6 mt-6 shadow">
            <h2 className="font-semibold">سجل القراءة</h2>
            <h3 className="text-gray-500">
              الكتب التي استعرتها وأرجعتها سابقاً
            </h3>
            {booksLogError ? (
              <div className="text-red-500 font-semibold text-center">
                {booksLogError}
              </div>
            ) : booksLog.length !== 0 ? (
              booksLog.map((log) => (
                <div
                  key={log.id}
                  className="mt-5 border border-gray-300 p-5 rounded-2xl flex justify-between flex-col-reverse lg:flex-row items-center gap-y-3"
                >
                  <div className="flex flex-col-reverse lg:flex-row gap-3 items-center ">
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/books/${log.book.id}`}
                        className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 text-blue-950 font-medium hover:bg-accent hover:text-white transition-colors duration-200 cursor-pointer text-xs sm:text-base"
                      >
                        عرض التفاصيل
                      </Link>
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
                    <div className="text-center lg:text-start">
                      <p className="font-semibold text-blue-950">
                        {log.book.title}
                      </p>
                      <p className="text-gray-500">
                        بقلم {log.book.author?.name}
                      </p>
                    </div>
                  </div>

                  <div className="text-gray-500 flex flex-col-reverse lg:flex-row gap-3 items-center ">
                    <span
                      className={`flex items-center gap-1 rounded-sm px-3 py-1.5 text-xs text-white bg-primary-light
                          `}
                    >
                      مرجع <BookOpen size={14} />
                    </span>

                    <span className="return-time whitespace-nowrap flex text-xs items-center gap-0.5">
                      تاريخ الإرجاع: {log.return_date || "لم يتم الإرجاع بعد"}
                      <Calendar size={14} />
                    </span>

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
              <div className="flex flex-col gap-6 items-center my-6">
                <BookOpen size={50} color="gray" />
                <p className="text-gray-400">لا توجد كتب مقروءة حتى الآن</p>
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

        {/*Favorites */}
        {favoritesBooksloading && <LoadingSpinner />}
        {!favoritesBooksloading && tabs === "favorites" && (
          <div className="reading-history-tab bg-white rounded-2xl p-6 mt-6 shadow">
            <div className="flex justify-between gap-2 items-start flex-wrap ">
              <div>
                <h2 className="font-semibold">مفضلتي</h2>
                <h3 className="text-gray-500">الكتب التي حفظتها لوقت لاحق</h3>
              </div>
              <Link
                href={"/favorites"}
                className=" rounded-md font-medium text-sm text-white border border-accent-dark  py-1.5 px-3  transition-colors duration-300 bg-accent hover:bg-accent-dark"
              >
                عرض الكل
              </Link>
            </div>
            {favoritesBooks.length !== 0 ? (
              favoritesBooks.slice(0, 3).map((b) => {
                return (
                  <div
                    key={b.book.id}
                    className="mt-5 border border-gray-300 p-5 rounded-2xl flex justify-between flex-col-reverse lg:flex-row items-center gap-y-3"
                  >
                    <div className="flex flex-col-reverse lg:flex-row gap-3 items-center lg:items-start">
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/books/${b.book.id}`}
                          className="bg-primary-light px-3 py-1.5 rounded-lg border border-gray-200 text-white font-medium hover:bg-hover hover:text-white transition-colors duration-200 cursor-pointer text-xs sm:text-base"
                        >
                          عرض التفاصيل
                        </Link>
                      </div>
                      <div className="text-center lg:text-start">
                        <p className="font-semibold text-blue-950">
                          {b.book.title}
                        </p>
                        <p className="text-gray-500">
                          بقلم {b.book.author.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-gray-500 flex flex-col-reverse lg:flex-row gap-3 items-center ">
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
              <div className="flex flex-col gap-6 items-center my-6">
                <Heart size={50} color="gray" />
                <p className="text-gray-400">لا توجد مفضلة بعد</p>
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
