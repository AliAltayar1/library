"use client";

/**
 * Settings Component - Account Settings and Security Page
 *
 * @description Provides account-related settings for the user, including:
 * - Security section with a change password flow
 * - Two-factor authentication toggle (UI only, no backend wiring yet)
 * - Account information section (email)
 * - Placeholder actions for changing email and deleting account
 *
 * The change password flow uses a modal dialog with:
 * - Old password, new password, and confirm password fields
 * - Client-side state reset on close
 * - API call to resetPassword on confirm
 *
 * @returns {JSX.Element} The Settings page component
 */

import { Lock, Mail, X } from "lucide-react";
import React, { useState } from "react";
import { resetPassword } from "../../../../lib/user/resetPassword";

const Settings = () => {
  // ============ State Management ============

  // User credentials form state for password change modal
  const [userCred, setUserCred] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Controls visibility of the change password modal
  const [isOpen, setIsOpen] = useState(false);

  // Stores error returned from resetPassword API or validation
  const [error, setError] = useState(null);

  // ============ Helpers / Handlers ============

  /**
   * Resets the password form fields to their initial empty values.
   *
   * @function resetForm
   * @returns {void}
   */
  const resetForm = () => {
    setUserCred({
      old_password: "",
      new_password: "",
      confirm_password: "",
    });
  };

  /**
   * Calls the resetPassword API with current credentials.
   * On success: closes modal and resets form.
   * On failure: logs and stores error in local state.
   *
   * @async
   * @function changePassword
   * @returns {Promise<void>}
   */
  const changePassword = async () => {
    console.log(userCred);
    try {
      await resetPassword(userCred);
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  // ============ JSX Render ============

  return (
    <section className="settings bg-white p-10 mx-3 sm:mx-10 rounded-2xl shadow-xl my-10">
      {/* Page Heading */}
      <h1 className="text-2xl font-semibold">إعدادات الحساب</h1>
      <h3 className="text-xl text-gray-500">إدارة تفضيلات حسابك والإشعارات</h3>

      {/* ============ Security Section ============ */}
      <div className="security mt-10 border-b border-gray-300 pb-7 ">
        <span className="font-semibold flex items-center gap-1 mb-5 text-gray-700">
          الأمان
          <Lock size={20} />
        </span>

        {/* Two-factor authentication toggle (UI only) */}
        <div className="border border-gray-300 rounded-xl p-5 flex justify-evenly sm:justify-between gap-2 flex-wrap mt-3">
          <div>
            <p className="font-medium">المصادقة الثنائية</p>
            <span className="text-gray-500 text-sm">
              تفعيل المصادقة الثنائية لحماية حسابك
            </span>
          </div>
          <input className="min-w-5 min-h-5 self-center" type="checkbox" />
        </div>

        {/* Change password trigger button */}
        <p className="text-gray-500 mt-3">هل نسيت كلمة السر؟</p>
        <button
          className="flex justify-center items-center gap-x-3 border border-gray-300 w-full rounded-lg hover:border-gray-100 hover:bg-accent hover:text-white transition-colors duration-150 py-1.5 px-4  cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          تغيير كلمة المرور
          <Lock size={18} />
        </button>

        {/* ============ Change Password Modal ============ */}
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <div className="fixed inset-0 bg-black/50 z-40"></div>

            {/* Modal dialog */}
            <div className="bg-white rounded-md p-10 flex flex-col gap-4 w-[90%] sm:w-[450px]  m-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 max-h-[450px] overflow-y-auto">
              {/* Modal header: close icon + title */}
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

              {/* Old password field */}
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

              {/* New password field */}
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

              {/* Confirm password field */}
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

              {/* Error message from password change operation */}
              {error && <p className="text-red-500 text-xs my-3">{error}</p>}

              {/* Modal actions: confirm + cancel */}
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

      {/* ============ Account Information Section ============ */}
      <div className="email mt-10 border-b border-gray-300 pb-7 ">
        <span className="font-semibold flex items-center gap-1 mb-5 text-gray-700">
          معلومات الحساب
          <Mail size={20} />
        </span>

        {/* Email display (currently static demo value) */}
        <div className="border border-gray-300 rounded-xl p-5 flex justify-evenly sm:justify-between gap-2 flex-wrap mt-3">
          <div className="flex items-center gap-1">
            <p className="font-medium">البريد الإلكتروني:</p>
            <span className="text-sm">demo@library.com</span>
          </div>
        </div>

        {/* Change email trigger button (UI only, no handler implemented yet) */}
        <p className="text-gray-500 mt-3">هل تريد تغيير الايميل؟</p>
        <button className="flex justify-center items-center gap-x-3 border border-gray-300 w-full rounded-lg hover:bg-accent hover:border-gray-100 hover:text-white transition-colors duration-150  py-1.5 px-4 cursor-pointer">
          تغيير الايميل
          <Mail size={18} />
        </button>
      </div>

      {/* ============ Danger Zone Section ============ */}
      <div className="danger-zone mt-10">
        <h2 className="font-semibold text-red-500 mb-3">منطقة الخطر</h2>
        {/* Delete account action (UI only, no handler implemented yet) */}
        <button className="py-1.5 px-3 w-full rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer">
          حذف الحساب
        </button>
      </div>
    </section>
  );
};

export default Settings;
