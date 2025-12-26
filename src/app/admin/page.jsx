"use client";

/**
 * Admin Component - Administrative Dashboard Page
 *
 * @description Main admin dashboard providing centralized management interface for:
 * - System statistics and analytics overview
 * - Books catalog management (CRUD operations)
 * - User accounts management
 * - Borrowing operations and requests management
 *
 * Uses a tabbed interface pattern to organize different administrative functions,
 * with each tab rendering a specialized component for its domain.
 *
 * @returns {JSX.Element} The Admin dashboard page with tabbed navigation
 */

import React, { useState } from "react";

import AdminStats from "../components/adminStats";
import AdminManageBooks from "../components/adminManageBooks";
import AdminManageUser from "../components/adminManageUsers";
import AdminManageBorrowing from "../components/adminManageBorrowing";

const Admin = () => {
  // ============ State Management ============

  /**
   * Active tab state - controls which admin panel is currently displayed
   * @type {string}
   * @values "statistics" | "manageBooks" | "manageUsers" | "manageBorrowing"
   * @default "statistics"
   */
  const [tabs, setTabs] = useState("statistics");

  // ============ JSX Render ============

  return (
    <section className="admin-dashboard px-10 my-10">
      {/* ============ Dashboard Header ============ */}
      <div className="heading flex justify-center sm:justify-between items-center gap-2 gap-x-5 flex-wrap ">
        <div className="text-center sm:text-start">
          {/* Main dashboard title */}
          <h1 className="text-4xl font-semibold text-blue-950 mb-1">
            لوحة التحكم الإدارية
          </h1>
          {/* Dashboard description */}
          <h3 className="text-gray-400 font-medium">
            إدارة الكتب والمستخدمين والاستعارات والإحصائيات
          </h3>
        </div>
      </div>

      {/* ============ Tabbed Interface Section ============ */}
      <section className="quick-tabs mt-12">
        {/* Tab Navigation Buttons */}
        <div className="tabs custom-scroll flex justify-between font-semibold text-blue-950 overflow-x-auto p-2">
          {/* Statistics Tab Button */}
          <button
            onClick={() => {
              setTabs("statistics");
            }}
            className={`${
              tabs === "statistics"
                ? "transition-all duration-100  rounded-xl shadow-[0px_2px_3px_0px_rgba(0,0,0,0.09)]"
                : ""
            } cursor-pointer px-4 py-1.5 whitespace-nowrap flex-1`}
          >
            الإحصائيات
          </button>

          {/* Manage Books Tab Button */}
          <button
            onClick={() => {
              setTabs("manageBooks");
            }}
            className={`${
              tabs === "manageBooks"
                ? "transition-all duration-100  rounded-xl shadow-[0px_2px_3px_0px_rgba(0,0,0,0.09)]"
                : ""
            } cursor-pointer px-4 py-1.5 whitespace-nowrap flex-1`}
          >
            إدارة الكتب
          </button>

          {/* Manage Users Tab Button */}
          <button
            onClick={() => {
              setTabs("manageUsers");
            }}
            className={`${
              tabs === "manageUsers"
                ? " transition-all duration-100  rounded-xl  shadow-[0px_2px_3px_0px_rgba(0,0,0,0.09)]"
                : ""
            } cursor-pointer px-4 py-1.5 flex-1 whitespace-nowrap`}
          >
            إدارة المستخدمين
          </button>

          {/* Manage Borrowing Tab Button */}
          <button
            onClick={() => {
              setTabs("manageBorrowing");
            }}
            className={`${
              tabs === "manageBorrowing"
                ? " transition-all duration-100  rounded-xl  shadow-[0px_2px_3px_0px_rgba(0,0,0,0.09)]"
                : ""
            } cursor-pointer px-4 py-1.5 flex-1 whitespace-nowrap`}
          >
            إدارة الاستعارات
          </button>
        </div>

        {/* ============ Tab Content - Conditional Rendering ============ */}

        {/* Statistics Tab Content - Dashboard overview with charts and metrics */}
        {tabs === "statistics" && <AdminStats />}

        {/* Manage Books Tab Content - CRUD operations for books catalog */}
        {tabs === "manageBooks" && <AdminManageBooks />}

        {/* Manage Users Tab Content - User accounts administration */}
        {tabs === "manageUsers" && <AdminManageUser />}

        {/* Manage Borrowing Tab Content - Borrowing requests and returns management */}
        {tabs === "manageBorrowing" && <AdminManageBorrowing />}
      </section>
    </section>
  );
};

export default Admin;
