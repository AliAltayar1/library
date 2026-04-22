"use client";

/**
 * AdminManageUser Component - User Management Interface
 *
 * @description Administrative interface for viewing all registered users with:
 * - View all users in a comprehensive table
 * - Display user basic information (ID, full name, email)
 * - Track user registration date (join date)
 * - Monitor active borrowings count per user
 * - Real-time loading states and error handling
 *
 * @returns {JSX.Element} The user management interface with users table
 */

import React, { useEffect, useState } from "react";
import { Users, Search, X } from "lucide-react";
import { getUsers } from "../../../lib/admin/getUsers";
import LoadingSpinner from "../UI/LoadingSpinner";
import { NAVY, NAVY2 } from "@/lib/constants/colors";

const AdminManageUser = () => {
  // ============ State Management ============
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  // ─── Search / filter state
  const [searchName, setSearchName] = useState("");

  // ============ API Functions ============
  const getUsersFn = async (filters = {}) => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const data = await getUsers(filters);
      setUsers(data);
    } catch (error) {
      setUsersError(error.message);
    } finally {
      setUsersLoading(false);
    }
  };

  // ============ Side Effects ============
  const handleSearch = (e) => {
    e.preventDefault();
    const filters = {};
    if (searchName.trim()) filters.name = searchName.trim();
    getUsersFn(filters);
  };

  const handleClearFilters = () => {
    setSearchName("");
    getUsersFn();
  };

  useEffect(() => {
    getUsersFn();
  }, []);

  // ============ JSX Render ============
  return (
    <div className="manage-users mt-10">
      {/* ============ Page Header ============ */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            إدارة المستخدمين
          </h1>
          <p className="text-gray-400 font-medium text-sm mt-0.5">
            عرض وإدارة جميع المستخدمين المسجلين
          </p>
        </div>

        {/* Total count badge */}
        {!usersLoading && users.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary/[8%] text-primary border border-primary/[12%]">
            <Users className="w-4 h-4" />
            {users.length} مستخدم
          </div>
        )}
      </div>

      {/* ============ Search / Filter Bar ============ */}
      <form onSubmit={handleSearch} className="mt-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">اسم المستخدم</label>
          <div className="relative">
            <input
              type="text"
              placeholder="بحث بالاسم..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
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
                     hover:opacity-90 hover:-translate-y-0.5 active:scale-95
                     bg-gradient-to-br from-primary to-primary-light shadow-[0_4px_16px_rgba(15,27,60,0.20)]"
        >
          <Search className="w-4 h-4" />
          بحث
        </button>
        {searchName && (
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

      {/* ============ Users Table Card ============ */}
      <div
        className="mt-6 rounded-2xl p-6 relative bg-white border-[1.5px] border-[#e2e8f0] shadow-[0_2px_24px_rgba(15,27,60,0.05)]"
      >
        <h2 className="font-semibold text-gray-800">قائمة المستخدمين</h2>
        <p className="text-gray-400 text-sm font-light">
          جميع المستخدمين المسجلين في النظام
        </p>

        {/* Loading state */}
        {usersLoading && <LoadingSpinner />}

        {/* Error state */}
        {!usersLoading && usersError && (
          <div className="text-center text-red-500 font-semibold mt-8">
            {usersError}
          </div>
        )}

        {/* Empty state */}
        {!usersLoading && !usersError && users.length === 0 && (
          <div className="text-center text-gray-400 mt-12 pb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-primary/[10%]"
            >
              <Users className="w-8 h-8 text-primary-light" />
            </div>
            <p className="font-medium">لا توجد مستخدمون بعد</p>
          </div>
        )}

        {/* Table */}
        {!usersLoading && !usersError && users.length > 0 && (
          <div className="custom-scroll overflow-x-auto w-full mt-6">
            <table className="min-w-[500px] border-collapse w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  {[
                    "المعرف",
                    "الاسم الكامل",
                    "البريد الإلكتروني",
                    "تاريخ الانضمام",
                    "الكتب المستعارة",
                  ].map((col) => (
                    <th
                      key={col}
                      className="font-semibold p-3 text-right text-sm whitespace-nowrap text-primary"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-all duration-200 hover:bg-gray-50 border-b border-slate-100"
                  >
                    {/* User ID badge */}
                    <td className="p-3 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/[8%] text-primary-light">
                        #{user.id}
                      </span>
                    </td>

                    {/* Full name */}
                    <td className="p-3 py-4 text-gray-700 font-medium whitespace-nowrap">
                      {user.first_name} {user.last_name}
                    </td>

                    {/* Email */}
                    <td className="p-3 py-4 text-gray-500 text-sm whitespace-nowrap">
                      {user.email}
                    </td>

                    {/* Join date */}
                    <td className="p-3 py-4 text-gray-400 text-sm whitespace-nowrap">
                      {user.date_joined?.split("T")[0]}
                    </td>

                    {/* Borrowed count badge */}
                    <td className="p-3 py-4">
                      <span
                        className={`inline-flex items-center justify-center min-w-[28px] px-2.5 py-1 rounded-full text-xs font-bold ${
                          user.borrowed_books_count > 0 ? "bg-accent/[12%] text-accent" : "bg-primary/[6%] text-slate-400"
                        }`}
                      >
                        {user.borrowed_books_count}
                      </span>
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
