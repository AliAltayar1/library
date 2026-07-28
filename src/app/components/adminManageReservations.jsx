"use client";

import React, { useEffect, useState } from "react";
import { getReservations } from "../../../lib/admin/getReservations";
import LoadingSpinner from "../UI/LoadingSpinner";
import { Search, X, BookmarkCheck } from "lucide-react";
import { NAVY, NAVY2 } from "@/lib/constants/colors";

const AdminManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(reservations);
  // Search state
  const [searchUsername, setSearchUsername] = useState("");
  const [searchBookName, setSearchBookName] = useState("");

  const fetchReservationsFn = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (err) {
      setError(err.message || "فشل تحميل الحجوزات المسبقة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservationsFn();
  }, []);

  return (
    <div className="manage-reservations mt-10" dir="rtl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-blue-950">
          الحجوزات المسبقة (قائمة الانتظار)
        </h1>
        <h3 className="text-gray-400 font-medium">
          عرض المستخدمين الذين قاموا بحجز الكتب غير المتوفرة مسبقاً
        </h3>
      </div>

      {/* Reservations Table */}
      <div className="book-list p-4 sm:p-10 rounded-2xl bg-white shadow mt-6 relative">
        <h2 className="text-blue-950 font-semibold mb-2">
          قائمة الحجوزات المسبقة
        </h2>
        <p className="text-gray-400 font-light mb-6">
          قائمة بجميع طلبات الانتظار المسجلة للكتب
        </p>

        {loading && <LoadingSpinner />}

        {!loading && error ? (
          <div className="text-center text-red-500 font-semibold py-8">
            {error}
          </div>
        ) : reservations.length > 0 ? (
          <div className="custom-scroll overflow-x-auto w-full">
            <table className="min-w-[600px] mt-4 border-collapse w-full text-center">
              <thead className="border-b border-gray-300 whitespace-nowrap bg-slate-50/50">
                <tr>
                  <th className="font-medium p-3 text-primary">#</th>
                  <th className="font-medium p-3 text-primary">اسم الكتاب</th>
                  <th className="font-medium p-3 text-primary">اسم المستخدم</th>
                  <th className="font-medium p-3 text-primary">تاريخ الحجز</th>
                  <th className="font-medium p-3 text-primary">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res, index) => (
                  <tr
                    key={res.id || index}
                    className="hover:shadow-md hover:bg-gray-50 transition-all duration-200 border-b border-gray-200 whitespace-nowrap"
                  >
                    <td className="p-3 py-4 text-gray-500 font-medium">
                      {res.id || 1}
                    </td>
                    <td className="p-3 py-4 text-blue-950 font-semibold">
                      {res.book_title || "كتاب غير محدد"}
                    </td>
                    <td className="p-3 py-4 text-gray-600">
                      {res.username || "مستخدم غير محدد"}
                    </td>
                    <td className="p-3 py-4 text-gray-500 text-sm">
                      {res.reserved_at
                        ? new Date(res.reserved_at).toLocaleDateString("ar-SA")
                        : "—"}
                    </td>
                    <td className="p-3 py-4">
                      <span className="py-1 px-3 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20 inline-flex items-center gap-1">
                        <BookmarkCheck className="w-3.5 h-3.5" />
                        في قائمة الانتظار
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-xl font-semibold text-gray-400 py-12">
            لا يوجد حجوزات مسبقة تطابق البحث
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageReservations;
