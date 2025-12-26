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
import LoadingSpinner from "../UI/LoadingSpinner";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(null);

  // ============ API Functions ============

  /**
   * Fetches all active borrowing records from the database
   * Includes book details, borrower information, dates, and status flags
   *
   * @async
   * @function getBorrowedMgmtFn
   * @returns {Promise<void>}
   */
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
      // Refresh borrowing list to update status and dates
      getBorrowedMgmtFn();
      toast.success("تمت الموافقة على الإرجاع");
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ اثناء الموافقة على الإرجاع " + error.message);
    }
  };

  // ============ Side Effects ============

  /**
   * Initial data fetch on component mount
   * Loads all active borrowing records
   */
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

      {/* ============ Borrowing Records Table Section ============ */}
      <div className="book-list p-4 sm:p-10 rounded-2xl bg-white shadow mt-8 relative">
        <h2 className="text-blue-950 font-semibold">الاستعارات الحالية</h2>
        <p className="text-gray-400 font-light">جميع الكتب المستعارة حالياً</p>

        {/* Show loading spinner while fetching borrowing records */}
        {borrowingManagementLoading && <LoadingSpinner />}

        {/* Show error message if fetch failed */}
        {!borrowingManagementLoading && borrowingManagementError ? (
          <div className="text-center text-red-500 font-semibold">
            {borrowingManagementError}
          </div>
        ) : (
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

                    {/* Actions Column - Approve Return Button */}
                    <td className=" p-2 py-4">
                      {/* Show loading spinner if this specific record is being processed */}
                      {loading === borrow.id ? (
                        <LoadingSpinner />
                      ) : (
                        // Approve Return Button
                        // Only enabled when return_request is true
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
