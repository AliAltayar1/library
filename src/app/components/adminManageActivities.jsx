"use client";

/**
 * AdminManageActivities Component - Library Activities Management Interface
 *
 * Activity body: { activity_name, title, image, description, is_active, is_visible }
 */

import React, { useEffect, useState } from "react";
import {
  Plus,
  X,
  Pencil,
  Trash2,
  CalendarDays,
  Users,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from "lucide-react";
import { getActivities } from "../../../lib/admin/getActivities";
import { addActivity } from "../../../lib/admin/addActivity";
import { updateActivity } from "../../../lib/admin/updateActivity";
import { deleteActivity } from "../../../lib/admin/deleteActivity";
import { activateActivity } from "../../../lib/admin/activateActivity";
import { deactivateActivity } from "../../../lib/admin/deactivateActivity";
import { getActivityParticipants } from "../../../lib/admin/getActivityParticipants";
import LoadingSpinner from "../UI/LoadingSpinner";
import { toast } from "sonner";
import { NAVY, NAVY2, GOLD } from "@/lib/constants/colors";

/* ─── Local semantic tokens ─────────────────────────────────── */
const GREEN = "#16a34a";
const RED = "#ef4444";

const EMPTY_FORM = {
  id: "",
  activity_name: "",
  title: "",
  image: null,
  description: "",
  is_active: true,
  is_visible: true,
};

const AdminManageActivities = () => {
  /* ──────── State ──────── */
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [openForm, setOpenForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [togglingId, setTogglingId] = useState(null);

  const [participantsModal, setParticipantsModal] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [pLoading, setPLoading] = useState(false);

  /* ──────── Helpers ──────── */
  const resetForm = () => {
    setForm(EMPTY_FORM);
    setOpenForm(false);
    setIsEdit(false);
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setIsEdit(false);
    setOpenForm(true);
  };

  const openEdit = (a) => {
    setForm({
      id: a.id,
      activity_name: a.activity_name || "",
      title: a.title || "",
      image: null,
      description: a.description || "",
      is_active: a.is_active ?? true,
      is_visible: a.is_visible ?? true,
    });
    setIsEdit(true);
    setOpenForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") setForm((p) => ({ ...p, [name]: files[0] || null }));
    else if (type === "checkbox") setForm((p) => ({ ...p, [name]: checked }));
    else setForm((p) => ({ ...p, [name]: value }));
  };

  /* ──────── API ──────── */
  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getActivities();
      setActivities(Array.isArray(data) ? data : (data.results ?? []));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.activity_name.trim() || !form.title.trim()) {
      toast.error("يرجى إدخال اسم النشاط والعنوان");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        activity_name: form.activity_name.trim(),
        title: form.title.trim(),
        image: form.image ?? null,
        description: form.description.trim(),
        is_active: form.is_active,
        is_visible: form.is_visible,
      };
      if (isEdit) {
        await updateActivity(form.id, payload);
        toast.success("تم تعديل النشاط بنجاح");
      } else {
        await addActivity(payload);
        toast.success("تمت إضافة النشاط بنجاح");
      }
      resetForm();
      fetchActivities();
    } catch (err) {
      toast.error("حدث خطأ: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteActivity(deleteId);
      toast.success("تم حذف النشاط بنجاح");
      setDeleteId(null);
      fetchActivities();
    } catch (err) {
      toast.error("حدث خطأ أثناء الحذف: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async (activity) => {
    setTogglingId(activity.id);
    try {
      if (activity.is_active) {
        await deactivateActivity(activity.id);
        toast.success("تم إغلاق التسجيل");
      } else {
        await activateActivity(activity.id);
        toast.success("تم فتح التسجيل");
      }
      fetchActivities();
    } catch (err) {
      toast.error("حدث خطأ: " + err.message);
    } finally {
      setTogglingId(null);
    }
  };

  const handleParticipants = async (activity) => {
    setParticipantsModal({ id: activity.id, title: activity.title });
    setParticipants([]);
    setPLoading(true);
    try {
      const data = await getActivityParticipants(activity.id);
      setParticipants(Array.isArray(data) ? data : (data.results ?? []));
    } catch (err) {
      toast.error("تعذّر جلب المشاركين: " + err.message);
    } finally {
      setPLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  /* ──────── JSX ──────── */
  return (
    <div className="manage-activities mt-10">
      {/* ─── Add / Edit Modal ─── */}
      {openForm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={resetForm} />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                          bg-white rounded-2xl p-8 w-[90%] sm:w-[520px] shadow-2xl
                          max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-primary">
                {isEdit ? "تعديل النشاط" : "إضافة نشاط جديد"}
              </h2>
              <button
                onClick={resetForm}
                className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* activity_name */}
              <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
                اسم النشاط (slug) <span className="text-red-400">*</span>
                <input
                  type="text"
                  name="activity_name"
                  placeholder="مثال: reading_club"
                  value={form.activity_name}
                  onChange={handleChange}
                  className="mt-1 py-2.5 px-3 border border-gray-200 rounded-xl outline-none
                             focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
                />
              </label>

              {/* title */}
              <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
                العنوان <span className="text-red-400">*</span>
                <input
                  type="text"
                  name="title"
                  placeholder="مثال: نادي القراءة"
                  value={form.title}
                  onChange={handleChange}
                  className="mt-1 py-2.5 px-3 border border-gray-200 rounded-xl outline-none
                             focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
                />
              </label>

              {/* description */}
              <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
                الوصف
                <textarea
                  name="description"
                  placeholder="وصف مختصر عن النشاط"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 py-2.5 px-3 border border-gray-200 rounded-xl outline-none
                             focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800 resize-none"
                />
              </label>

              {/* image */}
              <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
                صورة النشاط
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="mt-1 py-2 px-3 border border-gray-200 rounded-xl text-sm text-gray-600
                             file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0
                             file:text-xs file:font-semibold file:bg-navy file:text-white
                             cursor-pointer"
                />
                {isEdit && (
                  <p className="text-xs text-gray-400">
                    اتركها فارغة للإبقاء على الصورة الحالية
                  </p>
                )}
              </label>

              {/* Toggles */}
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 rounded accent-blue-600"
                  />
                  مفتوح التسجيل
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    name="is_visible"
                    checked={form.is_visible}
                    onChange={handleChange}
                    className="w-4 h-4 rounded accent-blue-600"
                  />
                  مرئي للمستخدمين
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-br from-primary to-primary-light"
              >
                {submitting ? "جارٍ الحفظ..." : isEdit ? "تحديث" : "إضافة"}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl font-semibold text-sm text-gray-600
                           border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Delete Confirm Modal ─── */}
      {deleteId !== null && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setDeleteId(null)}
          />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                          bg-white rounded-2xl p-8 w-[90%] sm:w-[380px] shadow-2xl text-center"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-500/10"
            >
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              تأكيد الحذف
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              هل أنت متأكد من حذف هذا النشاط؟ لا يمكن التراجع.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white
                           bg-red-500 hover:bg-red-600 transition-colors cursor-pointer
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleting ? "جارٍ الحذف..." : "حذف"}
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-gray-600
                           border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Participants Modal ─── */}
      {participantsModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setParticipantsModal(null)}
          />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                          bg-white rounded-2xl p-8 w-[90%] sm:w-[480px] shadow-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-primary">
                  المشاركون
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  {participantsModal.title}
                </p>
              </div>
              <button
                onClick={() => setParticipantsModal(null)}
                className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {pLoading && <LoadingSpinner />}
            {!pLoading && participants.length === 0 && (
              <div className="text-center text-gray-400 py-10">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">لا يوجد مشاركون بعد</p>
              </div>
            )}
            {!pLoading && participants.length > 0 && (
              <div className="flex flex-col gap-2">
                {participants.map((p, i) => (
                  <div
                    key={p.id ?? i}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-primary/[5%]"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-primary/[8%] text-primary"
                    >
                      {(p.username || p.name || "#")[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800 truncate">
                        {p.username || p.name || `مستخدم ${i + 1}`}
                      </p>
                      {p.email && (
                        <p className="text-xs text-gray-400 truncate">
                          {p.email}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">#{i + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ─── Page Header ─── */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            إدارة الأنشطة
          </h1>
          <p className="text-gray-400 font-medium text-sm mt-0.5">
            إضافة وتعديل وحذف أنشطة المكتبة وإدارة التسجيل
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:scale-95 bg-gradient-to-br from-primary to-primary-light shadow-[0_4px_16px_rgba(15,27,60,0.20)]"
        >
          <Plus className="w-4 h-4" />
          إضافة نشاط
        </button>
      </div>

      {/* ─── Table Card ─── */}
      <div
        className="mt-8 rounded-2xl p-6 bg-white border-[1.5px] border-slate-200 shadow-[0_2px_24px_rgba(15,27,60,0.05)]"
      >
        <h2 className="font-semibold text-gray-800">قائمة الأنشطة</h2>
        <p className="text-gray-400 text-sm font-light">
          جميع الأنشطة المسجلة في المكتبة
        </p>

        {loading && <LoadingSpinner />}

        {!loading && error && (
          <div className="text-center text-red-500 font-semibold mt-8">
            {error}
          </div>
        )}

        {!loading && !error && activities.length === 0 && (
          <div className="text-center text-gray-400 mt-12 pb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-primary/[10%]"
            >
              <CalendarDays className="w-8 h-8 text-primary-light" />
            </div>
            <p className="font-medium">لا توجد أنشطة بعد</p>
            <p className="text-sm mt-1">ابدأ بإضافة نشاط جديد</p>
          </div>
        )}

        {!loading && !error && activities.length > 0 && (
          <div className="custom-scroll overflow-x-auto w-full mt-6">
            <table className="min-w-[700px] border-collapse w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  {[
                    "#",
                    "النشاط",
                    "الاسم (slug)",
                    "المشاركون",
                    "التسجيل",
                    "الظهور",
                    "الإجراءات",
                  ].map((col) => (
                    <th
                      key={col}
                      className="font-semibold p-3 text-right text-sm text-primary"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => (
                  <tr
                    key={activity.id}
                    className="transition-all duration-200 hover:bg-gray-50 border-b border-slate-100"
                  >
                    {/* Index */}
                    <td className="p-3 py-4 text-gray-400 text-sm">
                      {index + 1}
                    </td>

                    {/* Title + Image + desc */}
                    <td className="p-3 py-4">
                      <div className="flex items-center gap-3">
                        {activity.image ? (
                          <img
                            src={activity.image}
                            alt={activity.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-accent/[10%]"
                          >
                            <ImageIcon
                              className="w-5 h-5 text-accent"
                            />
                          </div>
                        )}
                        <div>
                          <p
                            className="font-semibold text-sm text-primary"
                          >
                            {activity.title}
                          </p>
                          {activity.description && (
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-[160px]">
                              {activity.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* activity_name slug */}
                    <td className="p-3 py-4">
                      <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                        {activity.activity_name}
                      </code>
                    </td>

                    {/* participants count */}
                    <td className="p-3 py-4 text-center">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/[8%] text-primary-light"
                      >
                        <Users className="w-3 h-3" />
                        {activity.participants_count ?? activity.participants ?? 0}
                      </span>
                    </td>

                    {/* is_active */}
                    <td className="p-3 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          activity.is_active ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${activity.is_active ? "bg-green-600" : "bg-red-500"}`}
                        />
                        {activity.is_active ? "مفتوح" : "مغلق"}
                      </span>
                    </td>

                    {/* is_visible */}
                    <td className="p-3 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          activity.is_visible
                            ? "bg-primary/[5%] text-primary-light"
                            : "bg-gray-400/15 text-gray-400"
                        }`}
                      >
                        {activity.is_visible ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        {activity.is_visible ? "ظاهر" : "مخفي"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3 py-4">
                      <div className="flex gap-2 items-center flex-wrap">
                        {/* Edit */}
                        <button
                          onClick={() => openEdit(activity)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                                     transition-all duration-200 cursor-pointer hover:-translate-y-0.5 bg-accent/[10%] text-accent border border-accent/30"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          تعديل
                        </button>

                        {/* Toggle activate */}
                        <button
                          onClick={() => handleToggle(activity)}
                          disabled={togglingId === activity.id}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                                     transition-all duration-200 cursor-pointer hover:-translate-y-0.5
                                     disabled:opacity-60 disabled:cursor-not-allowed ${
                                       activity.is_active
                                         ? "bg-red-50 text-red-600 border border-red-200"
                                         : "bg-green-50 text-green-600 border border-green-200"
                                     }`}
                        >
                          {activity.is_active ? (
                            <>
                              <ToggleLeft className="w-3.5 h-3.5" />
                              إغلاق
                            </>
                          ) : (
                            <>
                              <ToggleRight className="w-3.5 h-3.5" />
                              تفعيل
                            </>
                          )}
                        </button>

                        {/* Participants */}
                        <button
                          onClick={() => handleParticipants(activity)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                                     transition-all duration-200 cursor-pointer hover:-translate-y-0.5 bg-primary/[8%] text-primary-light border border-primary/[12%]"
                        >
                          <Users className="w-3.5 h-3.5" />
                          المشاركون
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteId(activity.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                                     transition-all duration-200 cursor-pointer hover:-translate-y-0.5 bg-red-50 text-red-500 border border-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageActivities;
