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
  const [statistics, setStatistics] = useState([]);
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [booksError, setBooksError] = useState(null);

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

  const verifyTokenFn = async () => {
    try {
      const res = await verifyToken();
      console.log(res);
    } catch (error) {
      console.log(error.message);
    }
  };

  const topFiveBooks = books.slice(0, 5).map((book) => ({
    title: book.title,
    count: book.count_borrowed,
  }));

  const categoriesData =
    statistics?.category_stats &&
    statistics?.category_stats.map((category) => ({
      name: category.name,
      value: category.books_count,
    }));

  console.log(categoriesData);

  const borrowStats =
    statistics?.borrowed_last_7_days &&
    statistics?.borrowed_last_7_days.map((borrow) => {
      const dateStr = borrow.date;
      const [, month, day] = dateStr.split(" ").map(Number);

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

      const formattedDate = `${monthNames[month - 1]} ${day}`;

      return {
        date: formattedDate,
        count: borrow.count,
      };
    });

  useEffect(() => {
    getStatsFn();
    getBooksFn();
    verifyTokenFn();
  }, []);

  return (
    <>
      {statisticsLoading && <LoadingSpinner />}
      {!statisticsLoading && (
        <div className="statistics">
          <section className="information mt-10 flex gap-8 flex-wrap justify-center flex-col sm:flex-row">
            <div className="total-books min-h-44 bg-white rounded-2xl shadow border border-gray-300 p-8 flex gap-x-10 justify-between items-center flex-col sm:flex-row flex-1 ">
              <div className="text-primary-light font-semibold flex flex-col items-center gap-1 whitespace-nowrap">
                إجمالي الكتب
                <span className="text-2xl text-primary-light font-bold ">
                  {statistics.total_books || 0}
                </span>
              </div>
              <BookOpen size={40} className="text-primary-light" />
            </div>

            <div className=" total-users min-h-44 bg-white rounded-2xl shadow border border-gray-300 p-8 flex gap-x-10 justify-between items-center flex-col sm:flex-row flex-1">
              <div className="text-primary-light font-semibold flex flex-col items-center gap-1">
                إجمالي المستخدمين
                <span className="text-2xl text-primary-light font-bold ">
                  {statistics.total_users || 0}
                </span>
              </div>
              <Users size={40} className="text-primary-light" />
            </div>

            <div className="curr-borrowing-books min-h-44 bg-white rounded-2xl shadow border border-gray-300 p-8 flex gap-x-10 justify-between items-center flex-col sm:flex-row flex-1">
              <div className="text-accent-dark font-semibold flex flex-col items-center gap-1">
                الكتب المستعارة حالياً
                <span className="text-2xl text-accent-dark font-bold ">
                  {statistics.borrowed_books || 0}
                </span>
              </div>
              <TicketCheck size={40} className="text-accent-dark" />
            </div>

            <div className="availabe-book min-h-44 bg-white rounded-2xl shadow border border-gray-300 p-8 flex gap-x-10 justify-between items-center flex-col sm:flex-row flex-1">
              <div className="text-accent-dark font-semibold flex flex-col items-center gap-1">
                الكتب المتاحة
                <span className="text-2xl text-accent-dark font-bold ">
                  {statistics.available_books || 0}
                </span>
              </div>
              <BookOpen size={40} className="text-accent-dark" />
            </div>

            <div className="availabe-book min-h-44 bg-white rounded-2xl shadow border border-gray-300 p-8 flex gap-x-10 justify-between items-center flex-col sm:flex-row flex-1">
              <div className="text-gray-600 font-semibold flex flex-col items-center gap-1">
                الكتب المؤرشفة
                <span className="text-2xl text-gray-600 font-bold ">
                  {statistics.archived_books || 0}
                </span>
              </div>
              <Archive size={40} className="text-gray-600" />
            </div>

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

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {categoriesData && <CategoriesPieChart data={categoriesData} />}
            <TopBooksBarChart data={topFiveBooks} />
          </div>

          <div className="mt-5">
            <BorrowLineChart data={borrowStats} />
          </div>

          <div className="statistics-tab bg-white rounded-2xl p-6 mt-6 shadow">
            <h2 className="font-semibold">الكتب الأكثر استعارة</h2>
            <h3 className="text-gray-500">
              الكتب التي تم استعارتها بشكل متكرر
            </h3>
            {booksLoading && <LoadingSpinner />}
            {booksError ? (
              <div className="mt-3 text-red-500 font-semibold">
                {booksError}
              </div>
            ) : books.length !== 0 ? (
              books.slice(0, 5).map((book, idx) => (
                <div
                  key={book.id}
                  className="mt-5 border border-gray-300 p-5 rounded-2xl flex justify-between flex-col-reverse lg:flex-row items-center gap-y-3"
                >
                  <div className="flex flex-col-reverse lg:flex-row gap-3 items-center lg:items-start">
                    <span className="py-1 px-2 text-sm bg-accent-dark w-f'it rounded-md text-white">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="text-gray-500 flex flex-col-reverse lg:flex-row gap-3 items-center lg:items-end">
                    <div className="text-center lg:text-start">
                      <p className="font-semibold text-blue-950">
                        {book.title}
                      </p>
                      <p className="text-gray-500">بقلم {book.author?.name}</p>
                      <p className="text-gray-500 text-xs">
                        تمت الاستعارة{" "}
                        <span className="text-gray-600 font-semibold ">
                          {book.count_borrowed}
                        </span>{" "}
                        من المرات
                      </p>
                    </div>

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
              <div className="flex flex-col gap-6 items-center my-6">
                <BookOpen size={50} color="gray" />
                <p className="text-gray-400">
                  لم تتم استعارة أيِّ كتابٍ حتى الآن
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
