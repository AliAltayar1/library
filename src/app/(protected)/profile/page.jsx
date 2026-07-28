"use client";

import {
  BookOpen,
  Calendar,
  Heart,
  Settings,
  TriangleAlert,
  TrendingUp,
  Sparkles,
  User,
  Activity,
  Stars,
} from "lucide-react";
import ProfileStatCard from "./components/ProfileStatCard";
import SectionTitle from "./components/SectionTitle";
import TabBtn from "./components/TabBtn";
import BorrowingTab from "./components/BorrowingTab";
import ReadingHistoryTab from "./components/ReadingHistoryTab";
import FavoritesTab from "./components/FavoritesTab";
import ActivityTab from "./components/ActivityTab";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { borrowBook } from "../../../../lib/user/borrow";
import LoadingSpinner from "@/app/UI/LoadingSpinner";
import { profileBorrowed } from "../../../../lib/user/profileBorrowed";
import { profile } from "../../../../lib/user/profile";
import { returnBookRequest } from "../../../../lib/user/returnBookRequest";
import { requestExtension } from "../../../../lib/user/requestExtension";
import { profileReturned } from "../../../../lib/user/profileReturend";
import { getFavoritesBooks } from "../../../../lib/favorite/getFavBook";
import { removeFromFav } from "../../../../lib/favorite/removeFromFav";
import { unregisterActivity } from "../../../../lib/activities/unregisterActivity";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  NAVY,
  NAVY2,
  GOLD,
  GOLD2,
  PARCH,
  PIE_COLORS,
} from "@/lib/constants/colors";
import RecommendedBooks from "@/app/components/RecommendedBooks";

/* ═══════════════════════════════════════════════════════════════
   Main Profile Page
   ═══════════════════════════════════════════════════════════════ */
const Profile = () => {
  /* ── State ─────────────────────────────────────────────────── */
  const [tabs, setTabs] = useState("borrowing");
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    date_joined: "",
    borrowed_books_count: 0,
    overdue_books_count: 0,
    favorites_count: 0,
    available_books: null, // null = loading / not fetched yet
    tier: undefined,
  });
  const [userInfoLoading, setUserInfoLoading] = useState(false);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [borrowedBooksLoading, setBorrowedBooksLoading] = useState(false);
  const [borrowedBooksError, setBorrowedBooksError] = useState(null);
  const [booksLog, setBooksLog] = useState([]);
  const [booksLogLoading, setBooksLogLoading] = useState(false);
  const [booksLogError, setBooksLogError] = useState(null);
  const [favoritesBooks, setFavoritesBooks] = useState([]);
  const [favoritesBooksloading, setFavoritesBooksLoading] = useState(false);
  const [favoritesBooksError, setFavoritesBooksError] = useState(null);
  const [favLoading, setFavLoading] = useState(false);
  const [returnBookLoading, setReturnBookLoading] = useState(null);
  const [borrowBookLoading, setBorrowBookLoading] = useState(null);
  const [extensionLoading, setExtensionLoading] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activityToggleLoading, setActivityToggleLoading] = useState(null);

  /* ── API Functions (unchanged logic) ───────────────────────── */
  const getUserProfileFn = async () => {
    setUserInfoLoading(true);
    try {
      const data = await profile();
      setUserInfo(data);

      //set the registered activity
      setActivities(data.activities);
    } catch (error) {
      toast.error(error.message || "Failed to fetch profile");
    } finally {
      setUserInfoLoading(false);
    }
  };

  const getBorrowedBooksFn = async () => {
    setBorrowedBooksLoading(true);
    try {
      const data = await profileBorrowed();
      setBorrowedBooks(data);
    } catch (error) {
      setBorrowedBooksError(error.message || "Failed to fetch books");
      toast.error(error.message);
    } finally {
      setBorrowedBooksLoading(false);
    }
  };

  const getBooksLogFn = async () => {
    setBooksLogLoading(true);
    try {
      const data = await profileReturned();
      setBooksLog(data);
    } catch (error) {
      setBooksLogError(error.message);
      toast.error(error.message);
    } finally {
      setBooksLogLoading(false);
    }
  };

  const returnBookRequestFn = async (bookId) => {
    try {
      await returnBookRequest(bookId);
      getBorrowedBooksFn();
      toast.success("تم طلب الإرجاع بنجاح");
    } catch (error) {
      toast.error("حدث خطأ اثناء الإرجاع " + error.message);
    }
  };

  const requestExtensionFn = async (borrowId) => {
    try {
      await requestExtension(borrowId);
      getBorrowedBooksFn();
      toast.success("تم طلب التمديد بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء طلب التمديد: " + error.message);
    }
  };

  const borrowBookFn = async (bookId) => {
    try {
      await borrowBook(bookId);
      getBorrowedBooksFn();
      toast.success("تمت الإستعارة بنجاح");
    } catch (error) {
      toast.error("حدث خطأ اثناء الإستعارة " + error.message);
    }
  };

  const getFavoritesBooksFn = async () => {
    setFavoritesBooksLoading(true);
    try {
      const data = await getFavoritesBooks();
      setFavoritesBooks(data);
    } catch (error) {
      setFavoritesBooksError(error.message);
      toast.error(error.message);
    } finally {
      setFavoritesBooksLoading(false);
    }
  };

  const removeFromFavFn = async (bookId) => {
    try {
      await removeFromFav(bookId);
      getFavoritesBooksFn();
      getUserProfileFn();
      toast.success("تمت الإزالة من المفضلة");
    } catch (error) {
      toast.error("حدث خطأ اثناء الإزالة من المفضلة: " + error.message);
    }
  };

  const unregisterActivityFn = async (id) => {
    setActivityToggleLoading(id);
    try {
      await unregisterActivity(id);
      getUserProfileFn();
      toast.success("تم إلغاء التسجيل بنجاح.");
      // Remove the activity from the list optimistically
      setActivities((prev) => prev.filter((a) => a.activity_id !== id));
    } catch (err) {
      toast.error("حدث خطأ: " + (err.message || ""));
    } finally {
      setActivityToggleLoading(null);
    }
  };

  useEffect(() => {
    getUserProfileFn();
    getBorrowedBooksFn();
    getBooksLogFn();
    getFavoritesBooksFn();
  }, []);

  // console.log(borrowedBooks);

  /* ── Derived chart data ─────────────────────────────────────── */
  // Set of book IDs currently borrowed — used to disable re-borrow button
  const borrowedBookIds = new Set(borrowedBooks.map((b) => b.book?.id));
  const chartData = [
    { name: "مُستعار حالياً", value: userInfo.borrowed_books_count || 0 },
    { name: "سجل القراءة", value: booksLog.length || 0 },
    { name: "المفضلة", value: userInfo.favorites_count || 0 },
    { name: "متأخرة", value: userInfo.overdue_books_count || 0 },
  ].filter((d) => d.value > 0);

  const totalActivity = chartData.reduce((s, d) => s + d.value, 0);

  const initials =
    (userInfo.first_name?.[0] || "").toUpperCase() +
    (userInfo.last_name?.[0] || "").toUpperCase();

  const joinDate = userInfo.date_joined?.split("T")[0] || "";

  /* ── Tier-based theme ───────────────────────────────────────── */
  const tier = userInfo.tier; // "gold" | "silver" | "black" | undefined
  const tierConfig = {
    gold: {
      heroBg: `linear-gradient(135deg, #1a1000 0%, #3b2500 40%, #0F1B3C 100%)`,
      glow:
        "radial-gradient(ellipse 55% 50% at 75% 50%, rgba(212,147,10,0.30) 0%, transparent 70%), " +
        "radial-gradient(ellipse 35% 40% at 15% 60%, rgba(246,197,78,0.12) 0%, transparent 65%)",
      badgeBg: "rgba(212,147,10,0.20)",
      badgeColor: "#f6c54e",
      badgeBorder: "1px solid rgba(212,147,10,0.45)",
      badgeLabel: "🏆 عضو ذهبي",
      nameStyle: { color: "#f6c54e" },
      avatarBg: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`,
      avatarColor: NAVY,
      avatarShadow: "0 0 40px rgba(212,147,10,0.50)",
    },
    silver: {
      heroBg: `linear-gradient(135deg, #0d1117 0%, #1c2333 40%, #0F1B3C 100%)`,
      glow:
        "radial-gradient(ellipse 55% 50% at 75% 50%, rgba(192,192,192,0.18) 0%, transparent 70%), " +
        "radial-gradient(ellipse 35% 40% at 15% 60%, rgba(148,163,184,0.12) 0%, transparent 65%)",
      badgeBg: "rgba(192,192,192,0.15)",
      badgeColor: "#CBD5E1",
      badgeBorder: "1px solid rgba(192,192,192,0.35)",
      badgeLabel: "🥈 عضو فضي",
      nameStyle: {
        background:
          "linear-gradient(90deg, #e2e8f0 0%, #94a3b8 50%, #fff 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      },
      avatarBg: "linear-gradient(135deg, #C0C0C0 0%, #a8a8a8 100%)",
      avatarColor: NAVY,
      avatarShadow: "0 0 40px rgba(192,192,192,0.45)",
    },
    black: {
      heroBg: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 60%, #0c1628 100%)`,
      glow:
        "radial-gradient(ellipse 50% 40% at 80% 50%, rgba(212,147,10,0.08) 0%, transparent 70%), " +
        "radial-gradient(ellipse 35% 30% at 15% 60%, rgba(79,172,254,0.06) 0%, transparent 65%)",
      badgeBg: "rgba(255,255,255,0.08)",
      badgeColor: "rgba(255,255,255,0.70)",
      badgeBorder: "1px solid rgba(255,255,255,0.12)",
      badgeLabel: "عضو",
      nameStyle: { color: "white" },
      avatarBg: "linear-gradient(135deg, #28292e 0%, #1a1a1f 100%)",
      avatarColor: "white",
      avatarShadow: "0 0 24px rgba(0,0,0,0.50)",
    },
  }[tier] ?? {
    // default (no tier)
    heroBg: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 60%, #0c1628 100%)`,
    glow:
      "radial-gradient(ellipse 50% 40% at 80% 50%, rgba(212,147,10,0.10) 0%, transparent 70%), " +
      "radial-gradient(ellipse 35% 30% at 15% 60%, rgba(79,172,254,0.07) 0%, transparent 65%)",
    badgeBg: "rgba(212,147,10,0.15)",
    badgeColor: GOLD2,
    badgeBorder: "1px solid rgba(212,147,10,0.30)",
    badgeLabel: "عضو نشط",
    nameStyle: { color: "white" },
    avatarBg: `linear-gradient(135deg, ${NAVY2} 0%, #0c1628 100%)`,
    avatarColor: "white",
    avatarShadow: "0 0 40px rgba(15,27,60,0.40)",
  };

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div dir="rtl" className="overflow-x-hidden min-h-screen bg-background">
      {/* ══════════════════════════════════════════════════════════
          1. PROFILE HERO BANNER
          ══════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-14 px-4"
        style={{ background: tierConfig.heroBg }}
      >
        {/* Glow blobs */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: tierConfig.glow }}
        />

        {userInfoLoading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="container relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Avatar circle */}
            <div
              className="w-24 h-24 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl font-black shadow-2xl"
              style={{
                background: tierConfig.avatarBg,
                color: tierConfig.avatarColor,
                boxShadow: tierConfig.avatarShadow,
              }}
            >
              {initials || <User className="w-10 h-10" />}
            </div>

            {/* User info */}
            <div className="flex-1 text-center lg:text-right">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                style={{
                  background: tierConfig.badgeBg,
                  color: tierConfig.badgeColor,
                  border: tierConfig.badgeBorder,
                }}
              >
                <Sparkles className="w-3 h-3" />
                {tierConfig.badgeLabel}
              </span>
              <h1
                className="text-3xl font-black capitalize leading-tight"
                style={tierConfig.nameStyle}
              >
                {userInfo.first_name} {userInfo.last_name}
              </h1>
              <p className="mt-1 text-sm text-white/60">{userInfo.email}</p>
              {joinDate && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs justify-center lg:justify-end text-white/45">
                  <Calendar className="w-3.5 h-3.5" />
                  عضو منذ {joinDate}
                </p>
              )}
            </div>

            {/* Settings */}
            <div className="flex-shrink-0">
              <Link href="/settings">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-300 hover:scale-105 bg-white/10 text-white border border-white/18">
                  <Settings className="w-4 h-4" />
                  الإعدادات
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Diagonal clip */}
        <div className="absolute bottom-0 left-0 right-0 leading-[0]">
          <svg
            viewBox="0 0 1440 60"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full block h-[60px]"
          >
            <path d="M0,60 L1440,0 L1440,60 Z" fill={PARCH} />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. STATS CARDS
          ══════════════════════════════════════════════════════════ */}
      <section className="container py-10">
        <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
          <ProfileStatCard
            icon={BookOpen}
            value={userInfo.borrowed_books_count}
            label="مُستعار حالياً"
            bgClass="bg-primary/[8%]"
            iconClass="text-primary-light"
          />
          <ProfileStatCard
            icon={TrendingUp}
            value={booksLog.length}
            label="سجل القراءة"
            bgClass="bg-purple-100"
            iconClass="text-purple-600"
          />
          <ProfileStatCard
            icon={Heart}
            value={userInfo.favorites_count}
            label="المفضلة"
            bgClass="bg-accent/[15%]"
            iconClass="text-accent"
          />
          <ProfileStatCard
            icon={TriangleAlert}
            value={userInfo.overdue_books_count}
            label="كتب متأخرة"
            bgClass="bg-rose-50"
            iconClass="text-rose-600"
          />
          {userInfo.available_books !== null && (
            <ProfileStatCard
              icon={Stars}
              value={userInfo.available_books}
              label="الكتب المتبقية للاستعارة "
              bgClass={
                userInfo.available_books === 0
                  ? "bg-rose-50"
                  : userInfo.available_books === 1
                    ? "bg-amber-50"
                    : "bg-emerald-50"
              }
              iconClass={
                userInfo.available_books === 0
                  ? "text-rose-500"
                  : userInfo.available_books === 1
                    ? "text-amber-500"
                    : "text-emerald-600"
              }
            />
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. READING ACTIVITY CHART (Recharts)
          ══════════════════════════════════════════════════════════ */}
      {totalActivity > 0 && (
        <section className="container pb-10">
          <div className="glass-card rounded-2xl p-6 flex flex-col lg:flex-row items-center gap-8">
            {/* Donut chart */}
            <div className="w-full lg:w-72 h-64 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={96}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: `1px solid ${GOLD}33`,
                      background: "#fff",
                      fontSize: 13,
                    }}
                    formatter={(value, name) => [`${value} كتاب`, name]}
                  />
                  <Legend iconType="circle" iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend + bar summary */}
            <div className="flex-1">
              <SectionTitle>نشاط القراءة</SectionTitle>
              <p className="text-sm mb-5 text-muted">
                توزيع نشاطك القرائي عبر المكتبة — إجمالي {totalActivity} كتاب
              </p>
              <div className="flex flex-col gap-4">
                {chartData.map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    <span className="text-sm font-medium w-28 flex-shrink-0 text-primary">
                      {d.name}
                    </span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.round((d.value / totalActivity) * 100)}%`,
                          background: PIE_COLORS[i % PIE_COLORS.length],
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold w-8 text-left text-primary">
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          4. OVERDUE ALERT
          ══════════════════════════════════════════════════════════ */}
      {userInfo.overdue_books_count > 0 && (
        <section className="container pb-6">
          <div className="rounded-2xl p-5 flex items-center gap-3 flex-wrap bg-rose-600/10 border border-rose-600/25">
            <TriangleAlert className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <p className="text-sm font-medium text-rose-700">
              لديك <strong>{userInfo.overdue_books_count}</strong> كتاب متأخر —
              يرجى إرجاعها في أقرب وقت ممكن لتجنب الرسوم.
            </p>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          4b. BORROWING QUOTA BANNER
          ══════════════════════════════════════════════════════════ */}
      {userInfo.available_books !== null && (
        <section className="container pb-6">
          <div
            className={`rounded-2xl p-5 flex items-center gap-3 flex-wrap border ${
              userInfo.available_books === 0
                ? "bg-rose-600/10 border-rose-600/25"
                : userInfo.available_books === 1
                  ? "bg-amber-500/10 border-amber-500/25"
                  : "bg-emerald-600/10 border-emerald-600/25"
            }`}
          >
            <Stars
              className={`w-5 h-5 flex-shrink-0 ${
                userInfo.available_books === 0
                  ? "text-rose-600"
                  : userInfo.available_books === 1
                    ? "text-amber-500"
                    : "text-emerald-600"
              }`}
            />
            <p
              className={`text-sm font-medium ${
                userInfo.available_books === 0
                  ? "text-rose-700"
                  : userInfo.available_books === 1
                    ? "text-amber-700"
                    : "text-emerald-700"
              }`}
            >
              {userInfo.available_books === 0 ? (
                <>
                  لقد وصلت إلى <strong>الحد الأقصى</strong> للاستعارة لعضويتك —
                  أرجع كتاباً لتتمكن من استعارة كتاب جديد.
                </>
              ) : (
                <>
                  لديك <strong>{userInfo.available_books}</strong>{" "}
                  {userInfo.available_books === 1
                    ? "حصة استعارة متبقية"
                    : "حصص استعارة متبقية"}{" "}
                  ضمن اشتراكك الحالي.
                </>
              )}
            </p>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          5. TABBED INTERFACE
          ══════════════════════════════════════════════════════════ */}
      <section className="container pb-16">
        {/* Tab navigation */}
        <div className="flex gap-2 p-2 rounded-2xl mb-6 overflow-x-auto custom-scroll flex-nowrap bg-primary/[0.06]">
          <TabBtn
            active={tabs === "recommended"}
            onClick={() => setTabs("recommended")}
            icon={Sparkles}
          >
            كتب مقترحة
          </TabBtn>

          <TabBtn
            active={tabs === "borrowing"}
            onClick={() => setTabs("borrowing")}
            icon={BookOpen}
          >
            الكتب المُستعارة
            {borrowedBooks.length > 0 && (
              <span
                className="mr-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: tabs === "borrowing" ? GOLD : NAVY + "18",
                  color: NAVY,
                }}
              >
                {borrowedBooks.length}
              </span>
            )}
          </TabBtn>

          <TabBtn
            active={tabs === "readingHistory"}
            onClick={() => setTabs("readingHistory")}
            icon={TrendingUp}
          >
            سجل القراءة
            {booksLog.length > 0 && (
              <span
                className="mr-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: tabs === "readingHistory" ? GOLD : NAVY + "18",
                  color: NAVY,
                }}
              >
                {booksLog.length}
              </span>
            )}
          </TabBtn>

          <TabBtn
            active={tabs === "favorites"}
            onClick={() => setTabs("favorites")}
            icon={Heart}
          >
            المفضلة
            {favoritesBooks.length > 0 && (
              <span
                className="mr-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: tabs === "favorites" ? GOLD : NAVY + "18",
                  color: NAVY,
                }}
              >
                {favoritesBooks.length}
              </span>
            )}
          </TabBtn>

          <TabBtn
            active={tabs === "activity"}
            onClick={() => setTabs("activity")}
            icon={Activity}
          >
            النشاطات
            {activities.length > 0 && (
              <span
                className="mr-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: tabs === "activity" ? GOLD : NAVY + "18",
                  color: NAVY,
                }}
              >
                {activities.length}
              </span>
            )}
          </TabBtn>
        </div>

        {/* ── Tab 1: Recommended Books ──────────────────────────── */}
        {tabs === "recommended" && (
          <div className="pt-2">
            <RecommendedBooks compact />
          </div>
        )}

        {/* ── Tab 2: Borrowed Books ─────────────────────────────── */}
        {tabs === "borrowing" && (
          <BorrowingTab
            borrowedBooks={borrowedBooks}
            borrowedBooksLoading={borrowedBooksLoading}
            borrowedBooksError={borrowedBooksError}
            returnBookLoading={returnBookLoading}
            setReturnBookLoading={setReturnBookLoading}
            returnBookRequestFn={returnBookRequestFn}
            extensionLoading={extensionLoading}
            setExtensionLoading={setExtensionLoading}
            requestExtensionFn={requestExtensionFn}
          />
        )}

        {/* ── Tab 3: Reading History ────────────────────────────── */}
        {tabs === "readingHistory" && (
          <ReadingHistoryTab
            booksLog={booksLog}
            booksLogLoading={booksLogLoading}
            booksLogError={booksLogError}
            borrowedBookIds={borrowedBookIds}
            borrowBookLoading={borrowBookLoading}
            setBorrowBookLoading={setBorrowBookLoading}
            borrowBookFn={borrowBookFn}
            availableBooks={userInfo.available_books}
          />
        )}

        {/* ── Tab 4: Favorites ──────────────────────────────────── */}
        {tabs === "favorites" && (
          <FavoritesTab
            favoritesBooks={favoritesBooks}
            favoritesBooksloading={favoritesBooksloading}
            favoritesBooksError={favoritesBooksError}
            favLoading={favLoading}
            setFavLoading={setFavLoading}
            removeFromFavFn={removeFromFavFn}
          />
        )}

        {/* ── Tab 5: Activities ──────────────────────────────────── */}
        {tabs === "activity" && (
          <ActivityTab
            activities={activities}
            activityToggleLoading={activityToggleLoading}
            unregisterActivityFn={unregisterActivityFn}
          />
        )}
      </section>
    </div>
  );
};

export default Profile;
