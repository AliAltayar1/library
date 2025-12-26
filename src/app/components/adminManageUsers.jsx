"use client";

/**
 * AdminManageUser Component - User Management Interface
 *
 * @description Administrative interface for viewing and monitoring all registered users with:
 * - View all users in a comprehensive table
 * - Display user basic information (ID, full name, email)
 * - Track user registration date (join date)
 * - Monitor active borrowings count per user
 * - Real-time loading states and error handling
 *
 * Features:
 * - Read-only view of user data (no add/edit/delete operations currently)
 * - Clean table layout with hover effects
 * - Date formatting for join date display
 * - Borrowed books count for quick activity overview
 * - Responsive design with horizontal scroll on small screens
 *
 * Note: This component currently provides view-only functionality.
 * Future enhancements could include user editing, role management, and user suspension.
 *
 * @returns {JSX.Element} The user management interface with users table
 */

import React, { useEffect, useState } from "react";
import { getUsers } from "../../../lib/admin/getUsers";
import { getBooks } from "../../../lib/admin/getBooks";
import LoadingSpinner from "../UI/LoadingSpinner";

const AdminManageUser = () => {
  // ============ State Management ============

  /**
   * Users state - stores array of all registered user objects
   * Each user includes: id, name, email, join date, and borrowed books count
   * @type {Array}
   */
  const [users, setUsers] = useState([]);

  /**
   * Loading state for users fetch operation
   * @type {boolean}
   */
  const [usersLoading, setUsersLoading] = useState(false);

  /**
   * Error state for users fetch operation
   * @type {string|null}
   */
  const [usersError, setUsersError] = useState(null);

  // ============ API Functions ============

  /**
   * Fetches all registered users from the database
   * Includes user profile information and borrowing statistics
   *
   * @async
   * @function getUsersFn
   * @returns {Promise<void>}
   */
  const getUsersFn = async () => {
    setUsersLoading(true);

    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      setUsersError(error.message);
    } finally {
      setUsersLoading(false);
    }
  };

  // ============ Side Effects ============

  /**
   * Initial data fetch on component mount
   * Loads all registered users for the table
   */
  useEffect(() => {
    getUsersFn();
  }, []);

  // ============ JSX Render ============

  return (
    <div className="manage-books mt-10">
      {/* ============ Page Header Section ============ */}
      <div>
        <h1 className="text-2xl font-semibold text-blue-950">
          إدارة المستخدمين
        </h1>
        <h3 className="text-gray-400 font-medium">
          عرض وإدارة جميع المستخدمين
        </h3>
      </div>

      {/* ============ Users List Table Section ============ */}
      <div className="book-list p-4 sm:p-10 rounded-2xl bg-white shadow mt-8 relative">
        <h2 className="text-blue-950 font-semibold">قائمة المستخدمين</h2>
        <p className="text-gray-400 font-light">
          جميع المستخدمين المسجلين في النظام
        </p>

        {/* Show loading spinner while fetching users */}
        {usersLoading && <LoadingSpinner />}

        {/* Show error message if fetch failed */}
        {!usersLoading && usersError ? (
          <div className="text-red-500 text-center font-semibold">
            {usersError}
          </div>
        ) : (
          // Scrollable table container for responsive design
          <div className="custom-scroll overflow-x-auto w-full ">
            <table className="min-w-[200px] mt-10 border-collapse w-full">
              {/* Table Header */}
              <thead className="border-b border-gray-300 whitespace-nowrap">
                <tr className="text-center ">
                  <th className="font-medium p-2">المعرف </th>
                  <th className="font-medium p-2">الاسم </th>
                  <th className="font-medium p-2">البريد الإلكتروني </th>
                  <th className="font-medium p-2">تاريخ الانضمام </th>
                  <th className="font-medium p-2">الكتب المستعارة </th>
                </tr>
              </thead>
              {/* Table Body - maps through all users */}
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={`text-center hover:shadow-md hover:bg-gray-50 transition-all duration-200 border-b border-gray-300 whitespace-nowrap`}
                  >
                    {/* User ID with # suffix */}
                    <td className=" p-2 py-4 text-gray-400">{user.id}#</td>

                    {/* Full Name - concatenates first and last name */}
                    <td className=" p-2 py-4 text-gray-400">
                      {user.first_name} {user.last_name}
                    </td>

                    {/* User Email Address */}
                    <td className=" p-2 py-4 text-gray-400">{user.email}</td>

                    {/* Join Date - formatted by splitting ISO datetime string to show only date part */}
                    <td className="p-2 py-4 text-gray-400">
                      {user.date_joined?.split("T")[0]}
                    </td>

                    {/* Borrowed Books Count - shows number of currently borrowed books */}
                    <td className=" p-2 py-4 text-gray-400">
                      {user.borrowed_books_count}
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

export default AdminManageUser;
