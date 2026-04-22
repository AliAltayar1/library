"use client";

/**
 * Navbar — Premium redesign
 *
 * - Frosted glass / dark-navy background (scrolled) with smooth transition
 * - Active link indicator with animated underline
 * - Framer Motion mobile menu (slide-down + stagger)
 * - Auth-aware: shows login/register or profile avatar + logout
 */

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  BookOpen,
  BotMessageSquare,
  CalendarDays,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Quote,
  Settings,
  User,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import { logout } from "../../../lib/user/logout";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// ─── Nav links ────────────────────────────────────────────────────────────────

const navLinks = [
  { href: "/", label: "الرئيسية", icon: BookOpen },
  { href: "/books", label: "الكتب", icon: BookOpen },
  { href: "/activities", label: "الأنشطة", icon: CalendarDays },
  { href: "/quotes", label: "الاقتباسات", icon: Quote },
  { href: "/favorites", label: "المفضلة", icon: Heart },
  { href: "/profile", label: "الملف الشخصي", icon: User },
  { href: "/chat", label: "النموذج الذكي", icon: BotMessageSquare },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -16, height: 0 },
  visible: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { duration: 0.3, ease: [0.25, 0.8, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    y: -12,
    height: 0,
    transition: { duration: 0.22, ease: "easeIn" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: i * 0.05, ease: "easeOut" },
  }),
};

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logoutchk } = useAuth();
  const router = useRouter();

  // Detect scroll to apply frosted glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const logoutFn = async () => {
    try {
      await logout();
      await logoutchk();
      router.push("/login");
      toast.success("تم تسجيل الخروج بنجاح");
    } catch (err) {
      toast.error("حدث خطأ أثناء تسجيل الخروج: " + err.message);
    }
  };

  const isActive = (href) => pathname === href;

  // All links including admin
  const allLinks = [
    ...navLinks,
    ...(user?.isAdmin
      ? [{ href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard }]
      : []),
  ];

  return (
    <nav
      dir="rtl"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-primary/95 backdrop-blur-md shadow-lg shadow-primary/20"
          : "bg-primary"
      }`}
    >
      <div className="container p-0">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ──────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/library-logo.jpeg"
                alt="خير جليس"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap">
              خير جليس
            </span>
          </Link>

          {/* ── Desktop Links ──────────────────────────────────────── */}
          <div className="hidden  xl:flex items-center gap-1">
            {allLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(href)
                    ? "text-white bg-white/15"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={15} />
                {label}
                {/* Active dot */}
                {isActive(href) && (
                  <motion.span
                    layoutId="nav-active-dot"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* ── Desktop Auth ───────────────────────────────────────── */}
          <div className="hidden xl:flex items-center gap-2">
            {!user?.isValid ? (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-white/80 hover:text-white px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-amber-400 hover:bg-amber-500 text-primary px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  إنشاء حساب
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/settings"
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                  aria-label="الإعدادات"
                >
                  <Settings size={18} />
                </Link>
                <button
                  onClick={logoutFn}
                  className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white border border-white/20 hover:border-white/40 hover:bg-white/10 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  <LogOut size={15} />
                  خروج
                </button>
              </div>
            )}
          </div>

          {/* ── Mobile Toggle ──────────────────────────────────────── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden flex items-center justify-center w-9 h-9 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
            aria-label="القائمة"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="xl:hidden overflow-hidden border-t border-white/10"
          >
            <div className="container pb-5 pt-3 flex flex-col gap-1">
              {allLinks.map(({ href, label, icon: Icon }, i) => (
                <motion.div
                  key={href}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(href)
                        ? "bg-white/15 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon size={17} />
                    {label}
                    {isActive(href) && (
                      <span className="mr-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile auth */}
              <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
                {!user?.isValid ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="text-center text-sm font-medium text-white border border-white/20 px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200"
                    >
                      تسجيل الدخول
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="text-center text-sm font-medium bg-amber-400 hover:bg-amber-500 text-primary px-4 py-2.5 rounded-xl transition-all duration-200"
                    >
                      إنشاء حساب
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      logoutFn();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 text-sm tex-white/70 text-white/70 hover:text-white border border-white/20 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer"
                  >
                    <LogOut size={16} />
                    تسجيل الخروج
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
