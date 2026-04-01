"use client";

import { useEffect, useState } from "react";
import { CalendarDays, UserCheck, UserMinus, Users } from "lucide-react";
import { getActivitiesForUser } from "../../../lib/activities/getActivities";
import { registerActivity } from "../../../lib/activities/registerActivity";
import { unregisterActivity } from "../../../lib/activities/unregisterActivity";
import { profile } from "../../../lib/user/profile";
import { useAuth } from "../components/AuthContext";
import LoadingSpinner from "../UI/LoadingSpinner";
import { toast } from "sonner";
import { NAVY, NAVY2 } from "@/lib/constants/colors";

export default function ActivitiesPage() {
  const { user } = useAuth();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingActId, setTogglingActId] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggleExpand = (id) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch activities and profile in parallel
      const [activitiesData, profileData] = await Promise.allSettled([
        getActivitiesForUser(),
        user ? profile() : Promise.resolve(null),
      ]);

      const list =
        activitiesData.status === "fulfilled"
          ? Array.isArray(activitiesData.value)
            ? activitiesData.value
            : (activitiesData.value?.results ?? [])
          : [];

      // Build a Set of registered activity IDs from profile
      let registeredIds = new Set();
      if (profileData.status === "fulfilled" && profileData.value) {
        const acts = profileData.value.activities ?? [];
        registeredIds = new Set(acts.map((a) => a.activity_id ?? a.id ?? a));
      }

      // Stamp each activity with is_registered
      setActivities(
        list.map((a) => ({ ...a, is_registered: registeredIds.has(a.id) })),
      );
    } catch (_) {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (activityId) => {
    if (!user) {
      toast.error("يرجى تسجيل الدخول أولاً للتسجيل في الأنشطة");
      return;
    }
    setTogglingActId(activityId);
    try {
      await registerActivity(activityId);
      toast.success("تم تسجيلك في النشاط بنجاح!");
      setActivities((prev) =>
        prev.map((a) =>
          a.id === activityId
            ? {
                ...a,
                is_registered: true,
                participants_count: (a.participants_count ?? 0) + 1,
              }
            : a,
        ),
      );
    } catch (err) {
      toast.error("حدث خطأ: " + err.message);
    } finally {
      setTogglingActId(null);
    }
  };

  const handleUnregister = async (activityId) => {
    setTogglingActId(activityId);
    try {
      await unregisterActivity(activityId);
      toast.success("تم إلغاء التسجيل بنجاح.");
      setActivities((prev) =>
        prev.map((a) =>
          a.id === activityId
            ? {
                ...a,
                is_registered: false,
                participants_count: Math.max(
                  0,
                  (a.participants_count ?? 1) - 1,
                ),
              }
            : a,
        ),
      );
    } catch (err) {
      toast.error("حدث خطأ: " + err.message);
    } finally {
      setTogglingActId(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div dir="rtl" className="bg-background min-h-screen">
      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-16"
        style={{
          background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 60%, #0c1628 100%)`,
        }}
      >
        {/* Glow orbs */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 10% 50%, rgba(212,147,10,0.10) 0%, transparent 70%), " +
              "radial-gradient(ellipse 40% 50% at 85% 40%, rgba(79,172,254,0.07) 0%, transparent 70%)",
          }}
        />
        <div className="container relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 bg-accent/15">
            <CalendarDays className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            أنشطة المكتبة
          </h1>
          <p className="text-base text-text-muted">
            انضم إلى فعاليات وأنشطة مكتبتنا المتنوعة
          </p>
        </div>
        {/* Diagonal clip */}
        <div className="absolute bottom-0 left-0 right-0 ">
          <svg
            viewBox="0 0 1440 50"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full block h-[50px]"
          >
            <path d="M0,50 L1440,0 L1440,50 Z" fill="#FAF8F5" />
          </svg>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="container py-12 pb-20">
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        )}

        {!loading && activities.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="font-semibold text-lg">لا توجد أنشطة متاحة حالياً</p>
            <p className="text-sm mt-2">تابعنا لمعرفة الأنشطة القادمة</p>
          </div>
        )}

        {!loading && activities.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => {
              const isToggling = togglingActId === activity.id;
              const count =
                activity.participants_count ?? activity.participants ?? null;
              const isRegistered = activity.is_registered;

              return (
                <div
                  key={activity.id}
                  className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white border-[1.5px] border-gray-200"
                >
                  {/* Image / placeholder */}
                  {activity.image ? (
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-44 object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-44 flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
                      }}
                    >
                      <CalendarDays className="w-14 h-14 text-accent/70" />
                    </div>
                  )}

                  <div className="p-5">
                    {/* Status + count row */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          activity.is_active
                            ? "bg-green-600/10 text-green-600"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            activity.is_active ? "bg-green-600" : "bg-red-500"
                          }`}
                        />
                        {activity.is_active ? "مفتوح التسجيل" : "مغلق التسجيل"}
                      </span>

                      {count !== null && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/[8%] text-primary-light">
                          <Users className="w-3 h-3" />
                          {count} مشارك
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-lg mb-1 text-primary">
                      {activity.title}
                    </h3>

                    {activity.description && (
                      <div className="mb-4">
                        <p
                          className={`text-sm text-gray-500 transition-all duration-300 ${
                            expandedIds.has(activity.id) ? "" : "line-clamp-2"
                          }`}
                        >
                          {activity.description}
                        </p>
                        <button
                          onClick={() => toggleExpand(activity.id)}
                          className="mt-1 text-xs font-semibold cursor-pointer transition-colors duration-200 text-primary-light"
                        >
                          {expandedIds.has(activity.id)
                            ? "▲ أقل"
                            : "▼ اقرأ المزيد"}
                        </button>
                      </div>
                    )}

                    {/* Register / Unregister / Closed */}
                    {isRegistered ? (
                      <button
                        onClick={() => handleUnregister(activity.id)}
                        disabled={isToggling}
                        className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed bg-rose-600/10 text-rose-600 border border-rose-600/25"
                      >
                        {isToggling ? (
                          "جارٍ..."
                        ) : (
                          <>
                            <UserMinus className="w-4 h-4" />
                            إلغاء التسجيل
                          </>
                        )}
                      </button>
                    ) : activity.is_active ? (
                      <button
                        onClick={() => handleRegister(activity.id)}
                        disabled={isToggling}
                        className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 cursor-pointer hover:opacity-90 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
                        }}
                      >
                        {isToggling ? (
                          "جارٍ..."
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4" />
                            سجّل الآن
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="mt-2 w-full py-2.5 rounded-xl text-center text-sm font-semibold text-gray-400 bg-slate-100">
                        التسجيل مغلق
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
