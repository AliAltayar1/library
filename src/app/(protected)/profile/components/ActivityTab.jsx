"use client";

import { Activity, CalendarDays, UserCheck, UserMinus } from "lucide-react";
import SectionTitle from "./SectionTitle";
import EmptyState from "./EmptyState";

const ActivityTab = ({
  activities,
  activityToggleLoading,
  unregisterActivityFn,
}) => {
  return (
    <div className="glass-card rounded-2xl p-6 max-h-[600px] overflow-y-auto">
      <SectionTitle>النشاطات المسجّل فيها</SectionTitle>
      {activities.length > 0 ? (
        <div className="flex flex-col gap-4">
          {activities.map((act) => {
            const isToggling = activityToggleLoading === act.activity_id;
            return (
              <div
                key={act.activity_id}
                className="rounded-xl border border-slate-100 bg-white overflow-hidden hover:border-slate-200 hover:shadow-md transition-all duration-200"
              >
                {/* Image / placeholder */}
                {act.image ? (
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-full h-36 object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-20 flex items-center justify-center bg-gradient-to-br from-primary to-primary-light"
                  >
                    <CalendarDays
                      className="w-9 h-9 text-accent/70"
                    />
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    {/* Registered badge */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                      <UserCheck className="w-3 h-3" />
                      مسجّل
                    </span>
                  </div>

                  <h3 className="font-bold text-sm mb-1 text-primary">
                    {act.title || act.activity_type || "نشاط"}
                  </h3>
                  {act.description && (
                    <p
                      className="text-xs mb-3 line-clamp-2 text-text-muted"
                    >
                      {act.description}
                    </p>
                  )}

                  {/* Unregister button */}
                  <button
                    onClick={() => unregisterActivityFn(act.activity_id)}
                    disabled={isToggling}
                    className="mt-1 w-full flex items-center justify-center gap-2 py-2 rounded-xl font-semibold text-xs transition-all duration-200 cursor-pointer hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed bg-rose-50 text-rose-600 border border-rose-200"
                  >
                    {isToggling ? (
                      "جارٍ..."
                    ) : (
                      <>
                        <UserMinus className="w-3.5 h-3.5" />
                        إلغاء التسجيل
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Activity}
          text="لم تسجّل في أي نشاط حتى الآن"
          cta="تصفح النشاطات"
          ctaHref="/activities"
        />
      )}
    </div>
  );
};

export default ActivityTab;
