"use client";
import { Bell, Eye, Lock, Mail, X } from "lucide-react";
import React, { useState } from "react";
import { resetPassword } from "../../../../../lib/user/resetPassword";

const Settings = () => {
  const [userCred, setUserCred] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  const [error, setError] = useState(null);

  const resetForm = () => {
    setUserCred({
      old_password: "",
      new_password: "",
      confirm_password: "",
    });
  };

  const changePassword = async () => {
    console.log(userCred);
    try {
      const message = await resetPassword(userCred);
      console.log(message);
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  console.log(userCred);

  return (
    <section className="settings bg-white p-10 mx-3 sm:mx-10 rounded-2xl shadow-xl my-10">
      <h1 className="text-2xl font-semibold">إعدادات الحساب</h1>
      <h3 className="text-xl text-gray-500">إدارة تفضيلات حسابك والإشعارات</h3>

      {/* <div className="notifications mt-10 border-b border-gray-300 pb-7">
        <span className="font-semibold flex items-center gap-1 mb-5 text-gray-700">
          الإشعارات
          <Bell size={20} />
        </span>
        <div className="border border-gray-300 rounded-xl p-5 flex justify-evenly sm:justify-between gap-2 flex-wrap">
          <div>
            <p className="font-medium">إشعارات البريد الإلكتروني</p>
            <span className="text-gray-500 text-sm">
              تلقي تنبيهات حول الكتب المستعارة والمواعيد النهائية
            </span>
          </div>
          <input className="min-w-5 min-h-5 self-center" type="checkbox" />
        </div>
        <div className="border border-gray-300 rounded-xl p-5 flex justify-evenly sm:justify-between gap-2 flex-wrap mt-3">
          <div>
            <p className="font-medium">إشعارات الرسائل النصية</p>
            <span className="text-gray-500 text-sm">
              تلقي رسائل نصية قصيرة للتنبيهات المهمة
            </span>
          </div>
          <input className="min-w-5 min-h-5 self-center" type="checkbox" />
        </div>
      </div>

      <div className="privacy mt-10 border-b border-gray-300 pb-7 ">
        <span className="font-semibold flex items-center gap-1 mb-5 text-gray-700">
          الخصوصية
          <Eye size={20} />
        </span>
        <div className="border border-gray-300 rounded-xl p-5 flex justify-evenly sm:justify-between gap-2 flex-wrap mt-3">
          <div>
            <p className="font-medium">ملف شخصي خاص</p>
            <span className="text-gray-500 text-sm">
              إخفاء ملفك الشخصي عن المستخدمين الآخرين
            </span>
          </div>
          <input className="min-w-5 min-h-5 self-center" type="checkbox" />
        </div>
      </div> */}

      <div className="security mt-10 border-b border-gray-300 pb-7 ">
        <span className="font-semibold flex items-center gap-1 mb-5 text-gray-700">
          الأمان
          <Lock size={20} />
        </span>
        <div className="border border-gray-300 rounded-xl p-5 flex justify-evenly sm:justify-between gap-2 flex-wrap mt-3">
          <div>
            <p className="font-medium">المصادقة الثنائية</p>
            <span className="text-gray-500 text-sm">
              تفعيل المصادقة الثنائية لحماية حسابك
            </span>
          </div>
          <input className="min-w-5 min-h-5 self-center" type="checkbox" />
        </div>
        <p className="text-gray-500 mt-3">هل نسيت كلمة السر؟</p>
        <button
          className="flex justify-center items-center gap-x-3 border border-gray-300 w-full rounded-lg hover:border-gray-100 hover:bg-accent hover:text-white transition-colors duration-150 py-1.5 px-4  cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          تغيير كلمة المرور
          <Lock size={18} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40"></div>

            <div className="bg-white rounded-md p-10 flex flex-col gap-4 w-[90%] sm:w-[450px]  m-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 max-h-[450px] overflow-y-auto">
              <div className="flex justify-between gap-3 flex-wrap items-center mb-6">
                <X
                  onClick={() => {
                    setIsOpen(false);
                    resetForm();
                  }}
                  className="cursor-pointer hover:text-gray-300"
                />
                <span className="font-semibold">إعادة تعين كلمة المرور</span>
              </div>

              <label htmlFor="old_pass" className="flex flex-col gap-0.5">
                كلمة المرور القديمة
                <input
                  type="password"
                  id="old_pass"
                  placeholder="أدخل كلمة المرور القديمة"
                  className="py-1.5 px-2 border border-gray-300 rounded-xs outline-0 focus:border-blue-300 focus:border-2"
                  onChange={(e) =>
                    setUserCred({ ...userCred, old_password: e.target.value })
                  }
                  value={userCred.old_password}
                />
              </label>
              <label htmlFor="new_pass" className="flex flex-col gap-0.5">
                كلمة المرور الجديدة
                <input
                  type="password"
                  id="new_pass"
                  placeholder="أدخل كلمة المرور الجديدة"
                  className="py-1.5 px-2 border border-gray-300 rounded-xs outline-0 focus:border-blue-300 focus:border-2"
                  onChange={(e) =>
                    setUserCred({ ...userCred, new_password: e.target.value })
                  }
                  value={userCred.new_password}
                />
              </label>
              <label htmlFor="confirm_pass" className="flex flex-col gap-0.5">
                تأكيد كلمة المرور
                <input
                  type="password"
                  id="confirm_pass"
                  placeholder="تأكيد كلمة المرور"
                  className="py-1.5 px-2 border border-gray-300 rounded-xs outline-0 focus:border-blue-300 focus:border-2"
                  onChange={(e) =>
                    setUserCred({
                      ...userCred,
                      confirm_password: e.target.value,
                    })
                  }
                  value={userCred.confirm_password}
                />
              </label>

              {error && <p className="text-red-500 text-xs my-3">{error}</p>}

              <div className="flex gap-4 items-center mt-6 flex-wrap ">
                <button
                  onClick={() => changePassword()}
                  className="bg-primary-light py-1.5 px-3 text-white rounded-xs flex-1 cursor-pointer hover:bg-hover-dark  hover:scale-x-102 transition duration-100"
                >
                  تأكيد
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    resetForm();
                  }}
                  className="border py-1.5 px-3 rounded-xs hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="email mt-10 border-b border-gray-300 pb-7 ">
        <span className="font-semibold flex items-center gap-1 mb-5 text-gray-700">
          معلومات الحساب
          <Mail size={20} />
        </span>
        <div className="border border-gray-300 rounded-xl p-5 flex justify-evenly sm:justify-between gap-2 flex-wrap mt-3">
          <div className="flex items-center gap-1">
            <p className="font-medium">البريد الإلكتروني:</p>
            <span className="text-sm">demo@library.com</span>
          </div>
        </div>
        <p className="text-gray-500 mt-3">هل تريد تغيير الايميل؟</p>
        <button className="flex justify-center items-center gap-x-3 border border-gray-300 w-full rounded-lg hover:bg-accent hover:border-gray-100 hover:text-white transition-colors duration-150  py-1.5 px-4 cursor-pointer">
          تغيير الايميل
          <Mail size={18} />
        </button>
      </div>

      <div className="danger-zone mt-10">
        <h2 className="font-semibold text-red-500 mb-3">منطقة الخطر</h2>
        <button className="py-1.5 px-3 w-full rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer">
          حذف الحساب
        </button>
      </div>
    </section>
  );
};

export default Settings;
