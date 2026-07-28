"use client";

/**
 * AdminManageBorrowing Component - Borrowing Operations Management Interface
 *
 * @description Administrative interface for managing all book borrowing operations with:
 * - View all active borrowings in a comprehensive table
 * - Track borrowing dates, due dates, and return dates
 * - Monitor borrowing status (borrowed, return requested, overdue)
 * - Approve return requests from users
 * - Visual status indicators with color coding
 * - Real-time loading states for operations
 *
 * Features:
 * - Three-state status system: borrowed (blue), return requested (teal), overdue (red)
 * - Approve return button only enabled when user has requested return
 * - Automatic refresh after approval to update table
 * - Toast notifications for success/error feedback
 * - Date tracking for borrow date, due date, and actual return date
 *
 * @returns {JSX.Element} The borrowing management interface with status table
 */

import React, { useEffect, useState } from "react";
import { getBorrowedManagement } from "../../../lib/admin/borrowManagement";
import { approveReturn } from "../../../lib/admin/approveReturn";
import { returnBook } from "../../../lib/admin/returnBook";
import { approveExtension } from "../../../lib/admin/approveExtension";
import { rejectExtension } from "../../../lib/admin/rejectExtension";
import LoadingSpinner from "../UI/LoadingSpinner";
import { toast } from "sonner";
import { Search, X } from "lucide-react";
import { NAVY, NAVY2 } from "@/lib/constants/colors";

const AdminManageBorrowing = () => {
  // ============ State Management ============

  /**
   * Borrowing management state - stores array of all borrowing records
   * Each record includes: book info, borrower, dates, status, and return request flag
   * @type {Array}
   */
  const [borrowingManagement, setBorrowingManagement] = useState([]);

  /**
   * Loading state for borrowing list fetch operation
   * @type {boolean}
   */
  const [borrowingManagementLoading, setBorrowingManagementLoading] =
    useState(false);

  /**
   * Error state for borrowing list fetch operation
   * @type {string|null}
   */
  const [borrowingManagementError, setBorrowingManagementError] =
    useState(null);

  /**
   * Loading state for approve return operation
   * Stores the borrowing record ID currently being processed
   * Allows specific button to show loading spinner while processing
   * @type {number|null}
   */
  /** Loading state for approve-return operation — stores the borrow ID being processed */
  const [loading, setLoading] = useState(null);

  /** Loading state for direct admin return — stores the borrow ID being processed */
  const [returnLoading, setReturnLoading] = useState(null);

  /** Loading state for approve extension */
  const [approveExtLoading, setApproveExtLoading] = useState(null);

  /** Loading state for reject extension */
  const [rejectExtLoading, setRejectExtLoading] = useState(null);

  // ─── Search / filter state
  const [searchUsername, setSearchUsername] = useState("");
  const [searchBookName, setSearchBookName] = useState("");

  // ============ API Functions ============

  /**
   * Fetches all active borrowing records from the database
   * Includes book details, borrower information, dates, and status flags
   *
   * @async
   * @function getBorrowedMgmtFn
   * @returns {Promise<void>}
   */
  const getBorrowedMgmtFn = async (filters = {}) => {
    setBorrowingManagementLoading(true);
    setBorrowingManagementError(null);
    try {
      const data = await getBorrowedManagement(filters);
      console.log(data);
      setBorrowingManagement(data);
    } catch (error) {
      setBorrowingManagementError(error.message);
    } finally {
      setBorrowingManagementLoading(false);
    }
  };

  /**
   * Approves a user's return request and marks the book as returned
   * Updates borrowing record status and refreshes the list
   *
   * @async
   * @function approveReturnFn
   * @param {number} approveId - The ID of the borrowing record to approve return for
   * @returns {Promise<void>}
   */
  const approveReturnFn = async (approveId) => {
    try {
      await approveReturn(approveId);
      getBorrowedMgmtFn();
      toast.success("تمت الموافقة على الإرجاع");
    } catch (error) {
      toast.error("حدث خطأ اثناء الموافقة على الإرجاع " + error.message);
    }
  };

  /**
   * Forces a book return without requiring a user return request.
   * @param {number} borrowId - The borrow record ID
   */
  const returnBookFn = async (borrowId) => {
    try {
      await returnBook(borrowId);
      getBorrowedMgmtFn();
      toast.success("تم إرجاع الكتاب بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء الإرجاع: " + error.message);
    }
  };

  const approveExtensionFn = async (borrowId) => {
    try {
      await approveExtension(borrowId);
      getBorrowedMgmtFn();
      toast.success("تمت الموافقة على طلب التمديد");
    } catch (error) {
      toast.error("حدث خطأ أثناء قبول التمديد: " + error.message);
    }
  };

  const rejectExtensionFn = async (borrowId) => {
    try {
      await rejectExtension(borrowId);
      getBorrowedMgmtFn();
      toast.success("تم رفض طلب التمديد");
    } catch (error) {
      toast.error("حدث خطأ أثناء رفض التمديد: " + error.message);
    }
  };

  // ============ Side Effects ============

  /**
   * Initial data fetch on component mount
   * Loads all active borrowing records
   */
  const handleSearch = (e) => {
    e.preventDefault();
    const filters = {};
    if (searchUsername.trim()) filters.username = searchUsername.trim();
    if (searchBookName.trim()) filters.book_name = searchBookName.trim();
    getBorrowedMgmtFn(filters);
  };

  const handleClearFilters = () => {
    setSearchUsername("");
    setSearchBookName("");
    getBorrowedMgmtFn();
  };

  useEffect(() => {
    getBorrowedMgmtFn();
  }, []);

  // ============ JSX Render ============

  return (
    <div className="manage-borrowing mt-10">
      {/* ============ Page Header Section ============ */}
      <div>
        <h1 className="text-2xl font-semibold text-blue-950">
          إدارة الاستعارات
        </h1>
        <h3 className="text-gray-400 font-medium">
          عرض وإدارة جميع الاستعارات الحالية
        </h3>
      </div>

      {/* ============ Search / Filter Bar ============ */}
      <form
        onSubmit={handleSearch}
        className="mt-6 flex flex-wrap items-end gap-3"
      >
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            اسم المستخدم
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="بحث باسم المستخدم..."
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              className="w-full py-2.5 pr-10 pl-3 border border-gray-200 rounded-xl outline-none
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                         transition-all duration-200 text-gray-800 text-sm"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            اسم الكتاب
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="بحث باسم الكتاب..."
              value={searchBookName}
              onChange={(e) => setSearchBookName(e.target.value)}
              className="w-full py-2.5 pr-10 pl-3 border border-gray-200 rounded-xl outline-none
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                         transition-all duration-200 text-gray-800 text-sm"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold
                     text-sm text-white cursor-pointer transition-all duration-200
                     hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
          }}
        >
          <Search className="w-4 h-4" />
          بحث
        </button>
        {(searchUsername || searchBookName) && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm
                       text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            مسح
          </button>
        )}
      </form>

      {/* ============ Borrowing Records Table Section ============ */}
      <div className="book-list p-4 sm:p-10 rounded-2xl bg-white shadow mt-6 relative">
        <h2 className="text-blue-950 font-semibold">الاستعارات الحالية</h2>
        <p className="text-gray-400 font-light">جميع الكتب المستعارة حالياً</p>

        {/* Show loading spinner while fetching borrowing records */}
        {borrowingManagementLoading && <LoadingSpinner />}

        {/* Show error message if fetch failed */}
        {!borrowingManagementLoading && borrowingManagementError ? (
          <div className="text-center text-red-500 font-semibold">
            {borrowingManagementError}
          </div>
        ) : borrowingManagement.length > 0 ? (
          // Scrollable table container for responsive design
          <div className="custom-scroll overflow-x-auto w-full ">
            <table className="min-w-[200px] mt-10 border-collapse w-full">
              {/* Table Header */}
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
              {/* Table Body - maps through all borrowing records */}
              <tbody>
                {borrowingManagement.map((borrow) => (
                  <tr
                    key={borrow.id}
                    className={`text-center hover:shadow-md hover:bg-gray-50 transition-all duration-200 border-b border-gray-300 whitespace-nowrap`}
                  >
                    {/* Book Title */}
                    <td className=" p-2 py-4 text-gray-400">
                      {borrow.book.title}
                    </td>

                    {/* Borrower Username */}
                    <td className=" p-2 py-4 text-gray-400">
                      {borrow.borrower}
                    </td>

                    {/* Borrow Date - when the book was initially borrowed */}
                    <td className="p-2 py-4 text-gray-400">
                      {borrow.borrow_date}
                    </td>

                    {/* Due Date - when the book should be returned by */}
                    <td className=" p-2 py-4 text-gray-400">
                      {borrow.due_date}
                    </td>

                    {/* Actual Return Date - shows when book was returned or fallback text */}
                    <td className=" p-2 py-4 text-gray-400">
                      {borrow.return_date || "لم يتم الإرجاع حتى الان"}
                    </td>

                    {/* Status Badge - color coded based on borrowing status */}
                    <td className="p-2 py-4">
                      <span
                        className={`py-0.5 px-2 rounded-md text-xs text-white ${
                          // Status determination logic:
                          // 1. No return request + not late = borrowed (blue)
                          // 2. Return requested + not late = return requested (teal)
                          // 3. Late (regardless of return request) = overdue (red)
                          borrow.return_request === false &&
                          borrow.late_day == 0
                            ? "bg-primary-light"
                            : borrow.return_request === true &&
                                borrow.late_day == 0
                              ? "bg-primary"
                              : "bg-red-500"
                        }`}
                      >
                        {/* Status text based on same conditions */}
                        {borrow.return_request === false && borrow.late_day == 0
                          ? "مستعار"
                          : borrow.return_request === true &&
                              borrow.late_day == 0
                            ? "تم طلب الإرجاع"
                            : "متأخر"}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="p-2 py-4">
                      <div className="flex flex-col items-center gap-2">
                        {/* Row 1: Approve Return + Direct Return */}
                        <div className="flex items-center gap-2">
                          {/* Approve Return — only when user has requested */}
                          {loading === borrow.id ? (
                            <LoadingSpinner />
                          ) : (
                            <button
                              className={`font-medium border py-1.5 px-3 text-sm rounded-md transition-colors duration-150 ${
                                !borrow.return_request
                                  ? "bg-gray-100 border-gray-300 text-gray-300 cursor-not-allowed"
                                  : "bg-gray-100 border-gray-300 text-blue-950 hover:bg-accent hover:text-white cursor-pointer"
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

                          {/* Direct Return */}
                          {returnLoading === borrow.id ? (
                            <LoadingSpinner />
                          ) : (
                            <button
                              className="font-medium border border-rose-300 bg-rose-50 text-rose-600 py-1.5 px-3 text-sm rounded-md hover:bg-rose-600 hover:text-white transition-colors duration-150 cursor-pointer"
                              onClick={async () => {
                                setReturnLoading(borrow.id);
                                await returnBookFn(borrow.id);
                                setReturnLoading(null);
                              }}
                            >
                              إرجاع مباشر
                            </button>
                          )}
                        </div>

                        {/* Row 2: Extension approve/reject — only when extension requested */}
                        {borrow.extension_request && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-amber-600 font-semibold whitespace-nowrap">
                              طلب تمديد:
                            </span>
                            {approveExtLoading === borrow.id ? (
                              <LoadingSpinner />
                            ) : (
                              <button
                                className="font-medium border border-emerald-400 bg-emerald-50 text-emerald-700 py-1 px-2.5 text-xs rounded-md hover:bg-emerald-600 hover:text-white transition-colors duration-150 cursor-pointer"
                                onClick={async () => {
                                  setApproveExtLoading(borrow.id);
                                  await approveExtensionFn(borrow.id);
                                  setApproveExtLoading(null);
                                }}
                              >
                                قبول
                              </button>
                            )}
                            {rejectExtLoading === borrow.id ? (
                              <LoadingSpinner />
                            ) : (
                              <button
                                className="font-medium border border-rose-300 bg-rose-50 text-rose-600 py-1 px-2.5 text-xs rounded-md hover:bg-rose-600 hover:text-white transition-colors duration-150 cursor-pointer"
                                onClick={async () => {
                                  setRejectExtLoading(borrow.id);
                                  await rejectExtensionFn(borrow.id);
                                  setRejectExtLoading(null);
                                }}
                              >
                                رفض
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-2xl font-semibold text-gray-400 mt-10">
            لا يوجد طلبات استعارة حالياً
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageBorrowing;
