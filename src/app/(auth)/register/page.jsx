"use client";

/**
 * Register Page — Premium redesign
 *
 * Split-screen layout:
 * - Left panel: dark-navy brand panel (same as login for consistency)
 * - Right panel: scrollable form with 6 fields + privacy checkbox
 * - Field-level error display preserved
 * - Framer Motion staggered field entrance
 */

import { Eye, EyeOff, Lock, Mail, User, ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { register } from "../../../../lib/user/register";
import LoadingSpinner from "@/app/UI/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthContext";
import { setToken } from "../../../../lib/getToken";
import { motion } from "framer-motion";

// ─── Stat cards shown on brand panel ─────────────────────────────────────────
const stats = [
  { value: "10K+", label: "كتاب متاح" },
  { value: "5K+", label: "قارئ نشط" },
  { value: "50+", label: "تصنيف" },
];

// ─── Animation variants ───────────────────────────────────────────────────────
const panelVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const formVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.1 },
  },
};
const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: 0.2 + i * 0.06, ease: "easeOut" },
  }),
};

// ─── Reusable styled field ───────────────────────────────────────────────────
function Field({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  delay,
  error,
  rightSlot,
}) {
  return (
    <motion.div
      custom={delay}
      variants={fieldVariants}
      initial="hidden"
      animate="visible"
    >
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          size={15}
          className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
        />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full border rounded-xl py-2.5 px-4 pr-9 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all duration-200 shadow-sm ${
            error ? "border-red-300 bg-red-50/30" : "border-gray-200"
          } ${rightSlot ? "pl-10" : ""}`}
        />
        {rightSlot && (
          <div className="absolute top-1/2 -translate-y-1/2 left-3">
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
          {error}
        </p>
      )}
    </motion.div>
  );
}

const Register = () => {
  const [isVisable, setIsVisable] = useState({ pass: false, conPass: false });
  const router = useRouter();
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    password2: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { checkAuth } = useAuth();
  const password = useRef(null);
  const confPassword = useRef(null);

  function checkPassSimilarity() {
    if (password.current?.value !== confPassword.current?.value) {
      toast.error("الرجاء التأكد من تطابق كلمتي المرور");
      return false;
    }
    return true;
  }

  const registerFn = async () => {
    if (!checkPassSimilarity()) return;
    setLoading(true);
    try {
      const data = await register(userData);
      await checkAuth();
      toast.success("تم إنشاء الحساب بنجاح");
      setToken(data.token);
      router.push("/");
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data) {
        setFieldErrors(error.response.data);
      } else {
        toast.error(error.message || "حدث خطأ غير متوقع");
      }
    } finally {
      setLoading(false);
    }
  };

  const u = (field) => (e) =>
    setUserData({ ...userData, [field]: e.target.value });

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* ── Brand Panel ────────────────────────────────────────────── */}
      <motion.div
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        className="hidden lg:flex flex-col justify-between w-[40%] relative overflow-hidden p-12"
        style={{
          background:
            "linear-gradient(160deg, #0F1B3C 0%, #1a2f5e 55%, #0f2251 100%)",
        }}
      >
        {/* Orbs */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #D4930A, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-24 -left-16 w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #f6c54e, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
            <Image
              src="/library-logo.jpeg"
              alt="خير جليس"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white font-bold text-xl">خير جليس</span>
        </div>

        {/* Mid content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 mb-6">
            <Users size={13} className="text-amber-400" />
            <span className="text-amber-300 text-xs font-medium">
              انضم إلى مجتمع القراء
            </span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            ابدأ رحلتك
            <br />
            <span className="gradient-text">مع الكتب اليوم</span>
          </h2>
          <p className="text-white/60 text-base mb-8 leading-relaxed max-w-sm">
            أنشئ حسابك المجاني والوصول الفوري إلى آلاف الكتب في شتى المجالات.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="bg-white/8 border border-white/12 rounded-xl p-3 text-center"
              >
                <p className="text-amber-400 font-bold text-xl leading-none mb-1">
                  {value}
                </p>
                <p className="text-white/50 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/30 text-xs relative z-10">
          © 2025 خير جليس. جميع الحقوق محفوظة.
        </p>
      </motion.div>

      {/* ── Form Panel ───────────────────────────────────────────────── */}
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-background overflow-y-auto"
      >
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-6 lg:hidden">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src="/library-logo.jpeg"
              alt="خير جليس"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-primary text-lg">خير جليس</span>
        </div>

        <div className="w-full max-w-lg py-6">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              إنشاء حساب جديد ✨
            </h1>
            <p className="text-gray-500 text-sm">
              انضم إلى مجتمع قرائنا اليوم — مجانًا تمامًا
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              registerFn();
            }}
            className="flex flex-col gap-4"
          >
            {/* Row: email + username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="email"
                label="البريد الإلكتروني"
                type="email"
                placeholder="demo@mail.com"
                value={userData.email}
                onChange={u("email")}
                icon={Mail}
                delay={0}
                error={fieldErrors.email?.[0]}
              />
              <Field
                id="username"
                label="اسم المستخدم"
                placeholder="demo_1"
                value={userData.username}
                onChange={u("username")}
                icon={User}
                delay={1}
                error={fieldErrors.username?.[0]}
              />
            </div>

            {/* Row: first + last name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="fname"
                label="الاسم الأول"
                placeholder="أحمد"
                value={userData.first_name}
                onChange={u("first_name")}
                icon={User}
                delay={2}
              />
              <Field
                id="lname"
                label="الاسم الأخير"
                placeholder="محمد"
                value={userData.last_name}
                onChange={u("last_name")}
                icon={User}
                delay={3}
              />
            </div>

            {/* Password */}
            <Field
              id="password"
              label="كلمة المرور"
              type={isVisable.pass ? "text" : "password"}
              placeholder="إنشاء كلمة مرور قوية"
              value={userData.password}
              onChange={u("password")}
              icon={Lock}
              delay={4}
              error={fieldErrors.password?.[0]}
              rightSlot={
                <button
                  type="button"
                  onClick={() =>
                    setIsVisable({ ...isVisable, pass: !isVisable.pass })
                  }
                  className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                >
                  {isVisable.pass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />

            {/* Confirm password */}
            <Field
              id="confpassword"
              label="تأكيد كلمة المرور"
              type={isVisable.conPass ? "text" : "password"}
              placeholder="أعد إدخال كلمة المرور"
              value={userData.password2}
              onChange={u("password2")}
              icon={Lock}
              delay={5}
              error={fieldErrors.password2?.[0]}
              rightSlot={
                <button
                  type="button"
                  onClick={() =>
                    setIsVisable({ ...isVisable, conPass: !isVisable.conPass })
                  }
                  className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                >
                  {isVisable.conPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />

            {/* Terms */}
            <motion.div
              custom={6}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              className="flex items-start gap-2.5 mt-1 cursor-pointer"
              onClick={() => setAgreedToTerms(!agreedToTerms)}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                  agreedToTerms
                    ? "bg-primary border-primary"
                    : "border-gray-300 bg-white"
                }`}
              >
                {agreedToTerms && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <label className="text-sm text-gray-600 cursor-pointer select-none leading-snug">
                أوافق على{" "}
                <Link
                  href="/privacy"
                  onClick={(e) => e.stopPropagation()}
                  className="text-primary font-semibold hover:text-accent transition-colors"
                >
                  سياسة الخصوصية
                </Link>{" "}
                وشروط الخدمة
              </label>
            </motion.div>

            {/* Submit */}
            <motion.div
              custom={7}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              {loading ? (
                <div className="flex justify-center py-2">
                  <LoadingSpinner />
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-primary hover:bg-hover-dark text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  إنشاء الحساب
                  <ArrowLeft size={16} />
                </motion.button>
              )}
            </motion.div>
          </form>

          {/* Redirect */}
          <p className="text-center text-sm text-gray-500 mt-5">
            هل لديك حساب بالفعل؟{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:text-accent transition-colors"
            >
              سجّل دخولك هنا
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
