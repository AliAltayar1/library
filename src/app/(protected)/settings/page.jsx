"use client";

/**
 * Settings Component - Premium redesigned account settings page
 *
 * Sections:
 * 1. Hero header with navy gradient
 * 2. Account Information (8 fields, view + edit modal)
 * 3. Security (2FA toggle + change password modal)
 * 4. Danger Zone (delete account)
 *
 * Animations: Framer Motion section entrance, animated modals (scale + fade)
 */

import {
  AlertTriangle,
  Lock,
  Mail,
  MapPin,
  Phone,
  Settings2,
  Shield,
  Trash2,
  User,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { resetPassword } from "../../../../lib/user/resetPassword";
import { profile } from "../../../../lib/user/profile";
import { updateProfile } from "../../../../lib/user/updateProfile";
import { toast } from "sonner";
import LoadingSpinner from "@/app/UI/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

// ─── Animation helpers ─────────────────────────────────────────────────────────

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" },
  }),
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.93, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 0.8, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.93,
    y: 20,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// ─── Info Field Card ───────────────────────────────────────────────────────────

function InfoCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-3 border border-gray-100 rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
          accent ? "bg-accent/10" : "bg-primary/[0.06]"
        }`}
      >
        <Icon
          size={16}
          className={accent ? "text-amber-600" : "text-primary"}
        />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="font-semibold text-gray-800 text-sm truncate">
          {value || (
            <span className="text-gray-300 font-normal">غير متوفر</span>
          )}
        </p>
      </div>
    </div>
  );
}

// ─── Styled Input ──────────────────────────────────────────────────────────────

function StyledInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  id,
  rightSlot,
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all duration-200 bg-gray-50/60 pr-10"
        />
        {rightSlot && (
          <div className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400">
            {rightSlot}
          </div>
        )}
      </div>
    </label>
  );
}

// ─── Section Wrapper ───────────────────────────────────────────────────────────

function Section({
  title,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "rgba(15,27,60,0.07)",
  children,
  delay = 0,
}) {
  return (
    <motion.div
      custom={delay}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Section header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: iconBg }}
        >
          <Icon size={16} className={iconColor} />
        </div>
        <h2 className="font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

// ─── Modal Backdrop + Box ──────────────────────────────────────────────────────

function Modal({ isOpen, onClose, title, icon: Icon, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92%] sm:w-[460px] bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {Icon && <Icon size={18} className="text-primary" />}
                <span className="font-semibold text-gray-800">{title}</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

const Settings = () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const [userCred, setUserCred] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [error, setError] = useState(null);

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    gender: "",
    age: "",
    phone_number: "",
    address: "",
  });
  const [editInfo, setEditInfo] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    gender: "",
    age: "",
    phone_number: "",
    address: "",
  });

  const [userInfoLoading, setUserInfoLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [twoFa, setTwoFa] = useState(false);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const resetForm = () =>
    setUserCred({ old_password: "", new_password: "", confirm_password: "" });

  const changePassword = async () => {
    try {
      await resetPassword(userCred);
      setIsOpen(false);
      resetForm();
      toast.success("تم تغيير كلمة المرور بنجاح");
    } catch (err) {
      setError(err?.message || "حدث خطأ");
    }
  };

  const getUserProfileFn = async () => {
    setUserInfoLoading(true);
    try {
      const data = await profile();
      setUserInfo(data);
      console.log(data);
      setEditInfo({
        username: data.username || "",
        email: data.email || "",
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        gender: data.profile?.gender || "",
        age: data.profile?.age || "",
        phone_number: data.profile?.phone || "",
        address: data.profile?.address || "",
      });
    } catch (err) {
      toast.error(err.message || "Failed to fetch profile");
    } finally {
      setUserInfoLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    const payload = {
      username: editInfo.username,
      email: editInfo.email,
      first_name: editInfo.first_name,
      last_name: editInfo.last_name,
      profile: {
        phone: editInfo.phone_number,
        address: editInfo.address,
        gender: editInfo.gender,
        age: editInfo.age,
      },
    };
    try {
      await updateProfile(payload);
      toast.success("تم تحديث المعلومات بنجاح");
      setIsInfoOpen(false);
      getUserProfileFn();
    } catch (err) {
      toast.error(err.message || "حدث خطأ أثناء التحديث");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    getUserProfileFn();
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" dir="rtl">
      {/* ── Hero Header ───────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden mb-10"
        style={{
          background:
            "linear-gradient(135deg, #0F1B3C 0%, #1a2f5e 60%, #0f2251 100%)",
        }}
      >
        <div
          className="absolute -top-16 -left-16 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #D4930A, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-20 -right-10 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #f6c54e, transparent 70%)",
          }}
        />

        <div className="container py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5"
          >
            <Settings2 size={14} className="text-amber-400" />
            <span className="text-amber-300 text-sm font-medium">
              إعدادات الحساب
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-4xl md:text-5xl font-bold text-white mb-3"
          >
            الإعدادات <span className="gradient-text">والأمان</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-white/70 text-base max-w-md"
          >
            أدِر بياناتك الشخصية وكلمة المرور وإعدادات الأمان من مكان واحد.
          </motion.p>
        </div>
      </div>

      {/* ── Sections ──────────────────────────────────────────────────── */}
      <div className="container pb-16 flex flex-col gap-6">
        {/* ── 1. Account Information ──────────────────────────────────── */}
        <Section
          title="معلومات الحساب"
          icon={User}
          iconColor="text-primary"
          delay={0}
        >
          {userInfoLoading ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <InfoCard
                  icon={User}
                  label="الاسم الأول"
                  value={userInfo.first_name}
                />
                <InfoCard
                  icon={User}
                  label="الاسم الأخير"
                  value={userInfo.last_name}
                />
                <InfoCard
                  icon={User}
                  label="اسم المستخدم"
                  value={userInfo.username}
                  accent
                />
                <InfoCard
                  icon={Mail}
                  label="البريد الإلكتروني"
                  value={userInfo.email}
                />
                <InfoCard
                  icon={User}
                  label="الجنس"
                  value={userInfo.profile?.gender}
                />
                <InfoCard
                  icon={User}
                  label="العمر"
                  value={userInfo.profile?.age}
                />
                <InfoCard
                  icon={Phone}
                  label="رقم الهاتف"
                  value={userInfo.profile?.phone}
                />
                <InfoCard
                  icon={MapPin}
                  label="العنوان"
                  value={userInfo.profile?.address}
                />
              </div>

              <button
                onClick={() => setIsInfoOpen(true)}
                className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 cursor-pointer"
              >
                <User size={16} />
                تعديل البيانات الشخصية
              </button>
            </>
          )}
        </Section>

        {/* ── 2. Security ─────────────────────────────────────────────── */}
        <Section
          title="الأمان"
          icon={Shield}
          iconColor="text-emerald-600"
          iconBg="rgba(16,185,129,0.08)"
          delay={0.08}
        >
          {/* 2FA Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-4">
            <div>
              <p className="font-medium text-gray-800 text-sm">
                المصادقة الثنائية
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                تفعيل المصادقة الثنائية لحماية حسابك
              </p>
            </div>
            {/* Toggle switch */}
            <button
              onClick={() => setTwoFa(!twoFa)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer focus:outline-none ${
                twoFa ? "bg-emerald-500" : "bg-gray-300"
              }`}
              aria-checked={twoFa}
              role="switch"
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                style={{
                  right: twoFa ? "2px" : "auto",
                  left: twoFa ? "auto" : "2px",
                }}
              />
            </button>
          </div>

          {/* Change Password */}
          <p className="text-xs text-gray-400 mb-2">
            هل تريد تغيير كلمة مرورك؟
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 cursor-pointer"
          >
            <Lock size={16} />
            تغيير كلمة المرور
          </button>
        </Section>

        {/* ── 3. Danger Zone ──────────────────────────────────────────── */}
        <Section
          title="منطقة الخطر"
          icon={AlertTriangle}
          iconColor="text-red-500"
          iconBg="rgba(239,68,68,0.08)"
          delay={0.16}
        >
          <p className="text-sm text-gray-500 mb-4">
            حذف الحساب نهائي ولا يمكن التراجع عنه. ستُفقد جميع بياناتك.
          </p>
          <button className="w-full flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl py-2.5 px-4 text-sm font-medium hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 cursor-pointer">
            <Trash2 size={16} />
            حذف الحساب نهائياً
          </button>
        </Section>
      </div>

      {/* ── Edit Info Modal ──────────────────────────────────────────── */}
      <Modal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        title="تعديل البيانات الشخصية"
        icon={User}
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StyledInput
              label="اسم المستخدم"
              value={editInfo.username}
              onChange={(e) =>
                setEditInfo({ ...editInfo, username: e.target.value })
              }
            />
            <StyledInput
              label="البريد الإلكتروني"
              type="email"
              value={editInfo.email}
              onChange={(e) =>
                setEditInfo({ ...editInfo, email: e.target.value })
              }
            />
            <StyledInput
              label="الاسم الأول"
              value={editInfo.first_name}
              onChange={(e) =>
                setEditInfo({ ...editInfo, first_name: e.target.value })
              }
            />
            <StyledInput
              label="الاسم الأخير"
              value={editInfo.last_name}
              onChange={(e) =>
                setEditInfo({ ...editInfo, last_name: e.target.value })
              }
            />
            <StyledInput
              label="العمر"
              type="number"
              value={editInfo.age}
              onChange={(e) =>
                setEditInfo({ ...editInfo, age: e.target.value })
              }
            />
            <StyledInput
              label="رقم الهاتف"
              value={editInfo.phone_number}
              onChange={(e) =>
                setEditInfo({ ...editInfo, phone_number: e.target.value })
              }
            />
            <StyledInput
              label="العنوان"
              value={editInfo.address}
              onChange={(e) =>
                setEditInfo({ ...editInfo, address: e.target.value })
              }
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={handleUpdateProfile}
              disabled={isUpdating}
              className="flex-1 bg-primary text-white rounded-xl py-2.5 text-sm font-medium hover:bg-hover-dark transition-all duration-200 cursor-pointer disabled:bg-gray-300 flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <>
                  <LoadingSpinner /> جاري الحفظ...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} /> حفظ التغييرات
                </>
              )}
            </button>
            <button
              onClick={() => setIsInfoOpen(false)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Change Password Modal ────────────────────────────────────── */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          resetForm();
          setError(null);
        }}
        title="تغيير كلمة المرور"
        icon={Lock}
      >
        <div className="flex flex-col gap-4">
          {/* Old password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="old_pass"
              className="text-sm font-medium text-gray-700"
            >
              كلمة المرور الحالية
            </label>
            <div className="relative">
              <input
                id="old_pass"
                type={showOld ? "text" : "password"}
                placeholder="أدخل كلمة المرور الحالية"
                value={userCred.old_password}
                onChange={(e) =>
                  setUserCred({ ...userCred, old_password: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl py-2.5 px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all duration-200 bg-gray-50/60"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="new_pass"
              className="text-sm font-medium text-gray-700"
            >
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                id="new_pass"
                type={showNew ? "text" : "password"}
                placeholder="أدخل كلمة المرور الجديدة"
                value={userCred.new_password}
                onChange={(e) =>
                  setUserCred({ ...userCred, new_password: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl py-2.5 px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all duration-200 bg-gray-50/60"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirm_pass"
              className="text-sm font-medium text-gray-700"
            >
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <input
                id="confirm_pass"
                type={showConfirm ? "text" : "password"}
                placeholder="أعد إدخال كلمة المرور الجديدة"
                value={userCred.confirm_password}
                onChange={(e) =>
                  setUserCred({ ...userCred, confirm_password: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl py-2.5 px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all duration-200 bg-gray-50/60"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={changePassword}
              className="flex-1 bg-primary text-white rounded-xl py-2.5 text-sm font-medium hover:bg-hover-dark transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} />
              تأكيد التغيير
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                resetForm();
                setError(null);
              }}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
