"use client";

import { useEffect, useState } from "react";
import {
  Quote,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Heart,
  Filter,
  Trash2,
} from "lucide-react";
import { adminGetQuotes } from "../../../lib/admin/quotes/getAdminQuotes";
import { approveQuote } from "../../../lib/admin/quotes/approveQuote";
import { rejectQuote } from "../../../lib/admin/quotes/rejectQuote";
import { deleteQuote } from "../../../lib/admin/quotes/deleteQuote";
import { toast } from "sonner";
import { NAVY, NAVY2 } from "@/lib/constants/colors";

const TEXT_LIMIT = 120;

/* ─────── Status badge ─────── */
const StatusBadge = ({ status }) => {
  const map = {
    approved: {
      label: "معتمد",
      cls: "bg-green-50 text-green-700 border-green-200",
    },
    approve: {
      label: "معتمد",
      cls: "bg-green-50 text-green-700 border-green-200",
    },
    pending: {
      label: "بانتظار المراجعة",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
    rejected: {
      label: "مرفوض",
      cls: "bg-rose-50 text-rose-700 border-rose-200",
    },
  };
  const { label, cls } = map[status] ?? {
    label: status,
    cls: "bg-gray-50 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}
    >
      {label}
    </span>
  );
};

/* ─────── Status filter tabs ─────── */
const STATUS_TABS = [
  { value: "", label: "الكل" },
  { value: "pending", label: "بانتظار المراجعة" },
  { value: "approved", label: "معتمد" },
  { value: "rejected", label: "مرفوض" },
];

export default function AdminManageQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Separate loading states per button type to avoid both spinners showing
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggleExpand = (id) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  /* ─── Stats counts (always fetched unfiltered) ─── */
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });

  const loadCounts = async () => {
    try {
      const data = await adminGetQuotes();
      const all = Array.isArray(data) ? data : (data?.results ?? []);
      setCounts({
        pending: all.filter((q) => q.status === "pending").length,
        approved: all.filter(
          (q) => q.status === "approved" || q.status === "approve",
        ).length,
        rejected: all.filter((q) => q.status === "rejected").length,
      });
    } catch {
      /* stats are non-critical — silently ignore */
    }
  };

  /* ─── Fetch filtered list ─── */
  const load = async (status = statusFilter, name = search) => {
    setLoading(true);
    try {
      const data = await adminGetQuotes({
        status: status || undefined,
        name: name || undefined,
      });
      const list = Array.isArray(data) ? data : (data?.results ?? []);
      setQuotes(list);
    } catch (err) {
      toast.error("فشل تحميل الاقتباسات: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    loadCounts();
  }, []);

  /* ─── Status tab change ─── */
  const handleStatusChange = (val) => {
    setStatusFilter(val);
    load(val, search);
  };

  /* ─── Name search ─── */
  const handleSearch = (e) => {
    e?.preventDefault();
    setSearch(searchInput);
    load(statusFilter, searchInput);
  };

  /* ─── Approve ─── */
  const handleApprove = async (id) => {
    setApprovingId(id);
    try {
      await approveQuote(id);
      toast.success("تم اعتماد الاقتباس ✓");
      await Promise.all([load(statusFilter, search), loadCounts()]);
    } catch (err) {
      toast.error("فشل الاعتماد: " + err.message);
    } finally {
      setApprovingId(null);
    }
  };

  /* ─── Reject ─── */
  const handleReject = async (id) => {
    setRejectingId(id);
    try {
      await rejectQuote(id);
      toast.success("تم رفض الاقتباس");
      await Promise.all([load(statusFilter, search), loadCounts()]);
    } catch (err) {
      toast.error("فشل الرفض: " + err.message);
    } finally {
      setRejectingId(null);
    }
  };

  /* ─── Delete ─── */
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteQuote(id);
      toast.success("تم حذف الاقتباس");
      await Promise.all([load(statusFilter, search), loadCounts()]);
    } catch (err) {
      toast.error("فشل الحذف: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div dir="rtl" className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-black text-primary">إدارة الاقتباسات</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          مراجعة واعتماد أو رفض اقتباسات الأعضاء
        </p>
      </div>

      {/* ── Stats strip ────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "بانتظار المراجعة", value: counts.pending, color: "amber" },
          { label: "معتمد", value: counts.approved, color: "green" },
          { label: "مرفوض", value: counts.rejected, color: "rose" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className={`bg-${color}-50 border border-${color}-100 rounded-xl px-4 py-3 text-center`}
          >
            <p className={`text-2xl font-black text-${color}-600`}>{value}</p>
            <p className={`text-xs font-medium text-${color}-500 mt-0.5`}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Status filter tabs ────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleStatusChange(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border
              ${
                statusFilter === tab.value
                  ? "text-white border-transparent shadow-md"
                  : "bg-white border-gray-200 text-primary hover:bg-gray-50"
              }`}
            style={
              statusFilter === tab.value
                ? {
                    background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
                  }
                : {}
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Search bar ───────────────────────────────────────────── */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div
          className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5
          focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all duration-200"
        >
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="ابحث باسم المستخدم..."
            className="flex-1 bg-transparent text-sm outline-none text-right"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-200 hover:opacity-90"
          style={{
            background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
          }}
        >
          <Filter className="w-4 h-4" />
          بحث
        </button>
      </form>

      {/* ── List ─────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && quotes.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Quote className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-semibold">لا توجد اقتباسات مطابقة</p>
        </div>
      )}

      {!loading && quotes.length > 0 && (
        <div className="space-y-3">
          {console.log(quotes)}
          {quotes.map((q) => {
            const authorName = q.writer_full_name || "مجهول";

            const isPending = q.status === "pending";

            // Per-button loading — only the clicked button shows its spinner
            const isApproving = approvingId === q.id;
            const isRejecting = rejectingId === q.id;
            const isDeleting = deletingId === q.id;

            return (
              <div
                key={q.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-primary font-medium text-sm leading-relaxed break-words whitespace-pre-wrap ${
                        !expandedIds.has(q.id) && q.content?.length > TEXT_LIMIT
                          ? "line-clamp-3"
                          : ""
                      }`}
                    >
                      {q.content}
                    </p>
                    {q.content?.length > TEXT_LIMIT && (
                      <button
                        onClick={() => toggleExpand(q.id)}
                        className="text-xs font-bold text-accent hover:text-accent-light mt-1 cursor-pointer transition-colors"
                      >
                        {expandedIds.has(q.id) ? "أقل" : "اقرأ المزيد"}
                      </button>
                    )}

                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Author */}
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
                          }}
                        >
                          {authorName.charAt(0)}
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                          {authorName}
                        </span>
                      </div>

                      {/* Status */}
                      <StatusBadge status={q.status} />

                      {/* Likes */}
                      {(q.likes_count ?? 0) > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                          <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
                          {q.likes_count}
                        </span>
                      )}

                      {/* Date */}
                      {q.created_at && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {new Date(q.approved_at).toLocaleDateString("ar-SA")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Approve / Reject — only for pending quotes */}
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleApprove(q.id)}
                          disabled={isApproving || isRejecting || isDeleting}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200
                            text-xs font-semibold hover:bg-green-100 transition-all duration-200 cursor-pointer disabled:opacity-60"
                        >
                          {isApproving ? (
                            <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5" />
                          )}
                          اعتماد
                        </button>

                        <button
                          onClick={() => handleReject(q.id)}
                          disabled={isApproving || isRejecting || isDeleting}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200
                            text-xs font-semibold hover:bg-rose-100 transition-all duration-200 cursor-pointer disabled:opacity-60"
                        >
                          {isRejecting ? (
                            <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          رفض
                        </button>
                      </>
                    )}

                    {/* Delete — shown for all quotes */}
                    <button
                      onClick={() => handleDelete(q.id)}
                      disabled={isApproving || isRejecting || isDeleting}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 border border-gray-200
                        text-xs font-semibold hover:bg-red-50 hover:text-red-700 hover:border-red-200
                        transition-all duration-200 cursor-pointer disabled:opacity-60"
                    >
                      {isDeleting ? (
                        <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
