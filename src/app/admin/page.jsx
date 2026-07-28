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

import {
  Trophy,
  BarChart3,
  BookOpen,
  Users,
  RotateCcw,
  ShieldCheck,
  ChevronLeft,
  Layers,
  User,
  CalendarDays,
  Quote,
  BookmarkCheck,
} from "lucide-react";

import AdminStats from "../components/adminStats";
import AdminManageBooks from "../components/adminManageBooks";
import AdminManageUser from "../components/adminManageUsers";
import AdminManageBorrowing from "../components/adminManageBorrowing";
import AdminManageCategories from "../components/adminManageCategories";
import AdminManageAuthors from "../components/adminManageAuthors";
import AdminManageActivities from "../components/adminManageActivities";
import AdminManageQuotes from "../components/adminManageQuotes";
import AdminManageReservations from "../components/adminManageReservations";
import { NAVY, NAVY2, GOLD, GOLD2, PARCH } from "@/lib/constants/colors";

/* ─── Tab definitions ────────────────────────────────────────── */
const TABS = [
  { id: "statistics", label: "الإحصائيات", icon: BarChart3 },
  { id: "manageBooks", label: "إدارة الكتب", icon: BookOpen },
  { id: "manageUsers", label: "إدارة المستخدمين", icon: Users },
  { id: "manageBorrowing", label: "إدارة الاستعارات", icon: RotateCcw },
  { id: "manageReservations", label: "الحجوزات المسبقة", icon: BookmarkCheck },
  { id: "manageCategories", label: "إدارة الفئات", icon: Layers },
  { id: "manageAuthors", label: "إدارة المؤلفين", icon: User },
  { id: "manageActivities", label: "إدارة الأنشطة", icon: CalendarDays },
  { id: "manageQuotes", label: "إدارة الاقتباسات", icon: Quote },
];

/* ═══════════════════════════════════════════════════════════════
   Main Admin Dashboard
   ═══════════════════════════════════════════════════════════════ */
const Admin = () => {
  const [tabs, setTabs] = useState("statistics");
  //
  return (
    <div dir="rtl" className="overflow-x-hidden bg-background min-h-screen">
      {/* ══════════════════════════════════════════════════════════
          1. ADMIN HERO BANNER
          ══════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-12 px-4"
        style={{
          background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 60%, #0c1628 100%)`,
        }}
      >
        {/* Glow blobs */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 80% 50%, rgba(212,147,10,0.10) 0%, transparent 70%), " +
              "radial-gradient(ellipse 35% 30% at 15% 60%, rgba(79,172,254,0.07) 0%, transparent 65%)",
          }}
        />

        <div className="container relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Shield icon badge */}
          <div
            className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center text-primary shadow-[0_0_40px_rgba(212,147,10,0.40)]"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`,
            }}
          >
            <ShieldCheck className="w-10 h-10" />
          </div>

          {/* Title & description */}
          <div className="flex-1 text-center lg:text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-accent/15 text-accent-light border border-accent/30">
              <ShieldCheck className="w-3 h-3" />
              مشرف النظام
            </span>
            <h1 className="text-3xl font-black text-white leading-tight">
              لوحة التحكم الإدارية
            </h1>
            <p className="mt-1 text-sm text-white/60">
              إدارة الكتب والمستخدمين والاستعارات والإحصائيات بشكل مركزي
            </p>
          </div>
        </div>

        {/* Diagonal clip */}
        <div className="absolute bottom-0 left-0 right-0 leading-[0]">
          <svg
            viewBox="0 0 1440 60"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full block h-[60px]"
          >
            <path d="M0,60 L1440,0 L1440,60 Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. QUICK-NAV CARDS (visual shortcut buttons)
          ══════════════════════════════════════════════════════════ */}
      <section className="container py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tabs === id;
            return (
              <button
                key={id}
                onClick={() => setTabs(id)}
                className={`group relative flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer text-center ${active ? "border-accent/40 shadow-[0_8px_32px_rgba(15,27,60,0.18)]" : "bg-white border-[#e2e8f0] border-[1.5px]"}`}
                style={{
                  background: active
                    ? `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`
                    : "white",
                }}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${active ? "bg-accent/20" : "bg-primary/10"}`}
                >
                  <Icon
                    className={`w-5 h-5 ${active ? "text-accent-light" : "text-primary-light"}`}
                  />
                </div>
                <span
                  className={`text-sm font-bold ${active ? "text-white" : "text-primary"}`}
                >
                  {label}
                </span>
                {active && (
                  <span className="absolute top-3 left-3 w-2 h-2 rounded-full bg-accent-light" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. TABBED CONTENT AREA
          ══════════════════════════════════════════════════════════ */}
      <section className="container pb-6">
        {/* Tab content wrapper */}
        <div className="rounded-2xl p-6 bg-white border-[1.5px] border-[#e2e8f0] shadow-[0_2px_24px_rgba(15,27,60,0.05)]">
          {tabs === "statistics" && <AdminStats />}
          {tabs === "manageBooks" && <AdminManageBooks />}
          {tabs === "manageUsers" && <AdminManageUser />}
          {tabs === "manageBorrowing" && <AdminManageBorrowing />}
          {tabs === "manageReservations" && <AdminManageReservations />}
          {tabs === "manageCategories" && <AdminManageCategories />}
          {tabs === "manageAuthors" && <AdminManageAuthors />}
          {tabs === "manageActivities" && <AdminManageActivities />}
          {tabs === "manageQuotes" && <AdminManageQuotes />}
        </div>
      </section>
    </div>
  );
};

export default Admin;
