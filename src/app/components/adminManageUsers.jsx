"use client";

import React, { useEffect, useState } from "react";
import { getUsers } from "../../../lib/admin/getUsers";
import { getBooks } from "../../../lib/admin/getBooks";
import LoadingSpinner from "../UI/LoadingSpinner";

const AdminManageUser = () => {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

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

  useEffect(() => {
    getUsersFn();
  }, []);

  return (
    <div className="manage-books mt-10">
      <div>
        <h1 className="text-2xl font-semibold text-blue-950">
          إدارة المستخدمين
        </h1>
        <h3 className="text-gray-400 font-medium">
          عرض وإدارة جميع المستخدمين
        </h3>
      </div>

      <div className="book-list p-4 sm:p-10 rounded-2xl bg-white shadow mt-8 relative">
        <h2 className="text-blue-950 font-semibold">قائمة المستخدمين</h2>
        <p className="text-gray-400 font-light">
          جميع المستخدمين المسجلين في النظام
        </p>

        {usersLoading && <LoadingSpinner />}

        {!usersLoading && usersError ? (
          <div className="text-red-500 text-center font-semibold">
            {usersError}
          </div>
        ) : (
          <div className="custom-scroll overflow-x-auto w-full ">
            <table className="min-w-[200px] mt-10 border-collapse w-full">
              <thead className="border-b border-gray-300 whitespace-nowrap">
                <tr className="text-center ">
                  <th className="font-medium p-2">المعرف </th>
                  <th className="font-medium p-2">الاسم </th>
                  <th className="font-medium p-2">البريد الإلكتروني </th>
                  <th className="font-medium p-2">تاريخ الانضمام </th>
                  <th className="font-medium p-2">الكتب المستعارة </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={`text-center hover:shadow-md hover:bg-gray-50 transition-all duration-200 border-b border-gray-300 whitespace-nowrap`}
                  >
                    <td className=" p-2 py-4 text-gray-400">{user.id}#</td>
                    <td className=" p-2 py-4 text-gray-400">
                      {user.first_name} {user.last_name}
                    </td>

                    <td className=" p-2 py-4 text-gray-400">{user.email}</td>

                    <td className="p-2 py-4 text-gray-400">
                      {user.date_joined?.split("T")[0]}
                    </td>

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
