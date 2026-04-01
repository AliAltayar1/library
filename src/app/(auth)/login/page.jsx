"use client";

/**
 * Login Page — Premium redesign
 *
 * Split-screen layout:
 * - Left panel: dark-navy brand panel with decorative elements
 * - Right panel: clean white form with glassmorphism card
 * - Framer Motion entrance animations
 * - Eye-toggle password visibility
 */

import {
  BookOpen,
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { login } from "../../../../lib/user/login";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoadingSpinner from "@/app/UI/LoadingSpinner";
import { useAuth } from "@/app/components/AuthContext";
import { setToken } from "../../../../lib/getToken";
import { motion } from "framer-motion";

// ─── Feature list shown on the brand panel ───────────────────────────────────
const features = [
  "استعر من آلاف الكتب في شتى المجالات",
  "احفظ مفضلتك وتابع قراءاتك",
  "اكتشف توصيات مخصصة لك",
  "تواصل مع مجتمع القراء",
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
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: 0.25 + i * 0.07, ease: "easeOut" },
  }),
};

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [userData, setUserData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const router = useRouter();
  const { checkAuth } = useAuth();

  const loginFn = async () => {
    setLoading(true);
    try {
      const data = await login(userData);
      setToken(data.status.token, isRememberMe);
      await checkAuth();
      toast.success("تم تسجيل الدخول بنجاح");
      router.push("/");
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الدخول: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* ── Brand Panel (desktop only) ────────────────────────────────── */}
      <motion.div
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden p-12"
        style={{
          background:
            "linear-gradient(160deg, #0F1B3C 0%, #1a2f5e 55%, #0f2251 100%)",
        }}
      >
        {/* Decorative orbs */}
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
            <Sparkles size={13} className="text-amber-400" />
            <span className="text-amber-300 text-xs font-medium">
              مرحبًا بعودتك إلى خير جليس
            </span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            عالم من
            <br />
            <span className="gradient-text">الكتب ينتظرك</span>
          </h2>
          <p className="text-white/60 text-base mb-8 leading-relaxed max-w-sm">
            سجّل دخولك للوصول إلى مكتبتك الشخصية وملايين الكتب.
          </p>

          {/* Feature list */}
          <ul className="flex flex-col gap-3">
            {features.map((f, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-white/75 text-sm"
              >
                <span className="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom */}
        <p className="text-white/30 text-xs relative z-10">
          © 2025 خير جليس. جميع الحقوق محفوظة.
        </p>
      </motion.div>

      {/* ── Form Panel ───────────────────────────────────────────────── */}
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-background"
      >
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
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

        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              مرحبًا بعودتك 👋
            </h1>
            <p className="text-gray-500 text-sm">
              أدخل بياناتك للوصول إلى حسابك
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginFn();
            }}
            className="flex flex-col gap-5"
          >
            {/* Identifier */}
            <motion.div
              custom={0}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              <label
                htmlFor="identifier"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                اسم المستخدم أو البريد الإلكتروني
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
                />
                <input
                  id="identifier"
                  type="text"
                  placeholder="demo أو demo@mail.com"
                  value={userData.identifier}
                  onChange={(e) =>
                    setUserData({ ...userData, identifier: e.target.value })
                  }
                  required
                  className="w-full border border-gray-200 rounded-xl py-3 px-4 pr-9 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all duration-200 shadow-sm"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              custom={1}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                كلمة المرور
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
                />
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={userData.password}
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                  required
                  className="w-full border border-gray-200 rounded-xl py-3 px-4 pr-9 pl-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all duration-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            {/* Remember me */}
            <motion.div
              custom={2}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-2 cursor-pointer w-fit"
              onClick={() => setIsRememberMe(!isRememberMe)}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  isRememberMe
                    ? "bg-primary border-primary"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isRememberMe && (
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
              <label className="text-sm text-gray-600 cursor-pointer select-none">
                تذكرني
              </label>
            </motion.div>

            {/* Submit */}
            <motion.div
              custom={3}
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
                  className="w-full bg-primary hover:bg-hover-dark text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  تسجيل الدخول
                  <ArrowLeft size={16} />
                </motion.button>
              )}
            </motion.div>
          </form>

          {/* Redirect */}
          <p className="text-center text-sm text-gray-500 mt-6">
            ليس لديك حساب؟{" "}
            <Link
              href="/register"
              className="text-primary font-semibold hover:text-accent transition-colors"
            >
              سجّل هنا
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
