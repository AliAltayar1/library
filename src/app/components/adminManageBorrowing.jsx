"use client";

import React, { useEffect, useState } from "react";
import { getBorrowedManagement } from "../../../lib/admin/borrowManagement";
import { approveReturn } from "../../../lib/admin/approveReturn";
import LoadingSpinner from "../UI/LoadingSpinner";
import { toast } from "sonner";

const AdminManageBorrowing = () => {
  const [borrowingManagement, setBorrowingManagement] = useState([]);
  const [borrowingManagementLoading, setBorrowingManagementLoading] =
    useState(false);
  const [borrowingManagementError, setBorrowingManagementError] =
    useState(null);
  const [loading, setLoading] = useState(null);

  const getBorrowedMgmtFn = async () => {
    setBorrowingManagementLoading(true);
    try {
      const data = await getBorrowedManagement();
      setBorrowingManagement(data);
    } catch (error) {
      setBorrowingManagementError(error.message);
    } finally {
      setBorrowingManagementLoading(false);
    }
  };

  const approveReturnFn = async (approveId) => {
    try {
      await approveReturn(approveId);
      getBorrowedMgmtFn();
      toast.success("تمت الموافقة على الإرجاع");
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ اثناء الموافقة على الإرجاع " + error.message);
    }
  };

  useEffect(() => {
    getBorrowedMgmtFn();
  }, []);

  return (
    <div className="manage-borrowing mt-10">
      <div>
        <h1 className="text-2xl font-semibold text-blue-950">
          إدارة الاستعارات
        </h1>
        <h3 className="text-gray-400 font-medium">
          عرض وإدارة جميع الاستعارات الحالية
        </h3>
      </div>

      <div className="book-list p-4 sm:p-10 rounded-2xl bg-white shadow mt-8 relative">
        <h2 className="text-blue-950 font-semibold">الاستعارات الحالية</h2>
        <p className="text-gray-400 font-light">جميع الكتب المستعارة حالياً</p>

        {borrowingManagementLoading && <LoadingSpinner />}
        {!borrowingManagementLoading && borrowingManagementError ? (
          <div className="text-center text-red-500 font-semibold">
            {borrowingManagementError}
          </div>
        ) : (
          <div className="custom-scroll overflow-x-auto w-full ">
            <table className="min-w-[200px] mt-10 border-collapse w-full">
              <thead className="border-b border-gray-300 whitespace-nowrap">
                <tr className="text-center ">
                  <th className="font-medium p-2">اسم الكتاب</th>
                  <th className="font-medium p-2">اسم المستخدم</th>
                  <th className="font-medium p-2">تاريخ الاستعارة</th>
                  <th className="font-medium p-2">تاريخ استحقاق الإرجاع</th>
                  <th className="font-medium p-2">تم الإرجاع بتاريخ</th>
                  <th className="font-medium p-2">الحالة</th>
                  <th className="font-medium p-2">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {borrowingManagement.map((borrow) => (
                  <tr
                    key={borrow.id}
                    className={`text-center hover:shadow-md hover:bg-gray-50 transition-all duration-200 border-b border-gray-300 whitespace-nowrap`}
                  >
                    <td className=" p-2 py-4 text-gray-400">
                      {borrow.book.title}
                    </td>
                    <td className=" p-2 py-4 text-gray-400">
                      {borrow.borrower}
                    </td>

                    <td className="p-2 py-4 text-gray-400">
                      {borrow.borrow_date}
                    </td>

                    <td className=" p-2 py-4 text-gray-400">
                      {borrow.due_date}
                    </td>

                    <td className=" p-2 py-4 text-gray-400">
                      {borrow.return_date || "لم يتم الإرجاع حتى الان"}
                    </td>

                    <td className="p-2 py-4">
                      <span
                        className={`py-0.5 px-2 rounded-md text-xs text-white ${
                          borrow.return_request === false &&
                          borrow.late_day == 0
                            ? "bg-primary-light"
                            : borrow.return_request === true &&
                              borrow.late_day == 0
                            ? "bg-primary"
                            : "bg-red-500"
                        }`}
                      >
                        {borrow.return_request === false && borrow.late_day == 0
                          ? "مستعار"
                          : borrow.return_request === true &&
                            borrow.late_day == 0
                          ? "تم طلب الإرجاع"
                          : "متأخر"}
                      </span>
                    </td>

                    <td className=" p-2 py-4">
                      {loading === borrow.id ? (
                        <LoadingSpinner />
                      ) : (
                        <button
                          className={`bg-gray-100 font-medium border border-gray-300 py-1.5 px-3 text-sm rounded-md text-blue-950 transition-colors duration-150  ${
                            !borrow.return_request
                              ? "text-gray-300 cursor-not-allowed"
                              : "hover:bg-accent hover:text-white cursor-pointer"
                          }`}
                          disabled={!borrow.return_request}
                          onClick={async () => {
                            setLoading(borrow.id);
                            await approveReturnFn(borrow.id);
                            setLoading(null);
                          }}
                        >
                          تأكيد الإرجاع
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageBorrowing;
