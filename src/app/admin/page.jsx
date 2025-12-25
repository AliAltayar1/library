"use client";

import React, { useState } from "react";

import AdminStats from "../components/adminStats";
import AdminManageBooks from "../components/adminManageBooks";
import AdminManageUser from "../components/adminManageUsers";
import AdminManageBorrowing from "../components/adminManageBorrowing";

const Admin = () => {
  const [tabs, setTabs] = useState("statistics");

  return (
    <section className="admin-dashboard px-10 my-10">
      <div className="heading flex justify-center sm:justify-between items-center gap-2 gap-x-5 flex-wrap ">
        <div className="text-center sm:text-start">
          <h1 className="text-4xl font-semibold text-blue-950 mb-1">
            لوحة التحكم الإدارية
          </h1>
          <h3 className="text-gray-400 font-medium">
            إدارة الكتب والمستخدمين والاستعارات والإحصائيات
          </h3>
        </div>
      </div>

      <section className="quick-tabs mt-12">
        <div className="tabs custom-scroll flex justify-between font-semibold text-blue-950 overflow-x-auto p-2">
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

        {/*statistics*/}
        {tabs === "statistics" && <AdminStats />}

        {/*Manage books*/}
        {tabs === "manageBooks" && <AdminManageBooks />}

        {/*Manage users*/}
        {tabs === "manageUsers" && <AdminManageUser />}

        {/*Manage borrowing*/}
        {tabs === "manageBorrowing" && <AdminManageBorrowing />}
      </section>
    </section>
  );
};

export default Admin;
