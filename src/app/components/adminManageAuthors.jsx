"use client";

/**
 * AdminManageAuthors Component - Author Management Interface
 *
 * @description Administrative interface for complete author management with:
 * - View all authors in a clean table
 * - Add new authors via modal form
 * - Edit existing author names
 * - Delete authors with confirmation
 * - Real-time loading states and error handling
 *
 * @returns {JSX.Element} The author management interface
 */

import React, { useEffect, useState } from "react";
import { Plus, X, Pencil, Trash2, User, Search } from "lucide-react";
import { getAuthor } from "../../../lib/admin/getAuthor";
import { addAuthor } from "../../../lib/admin/addAuthor";
import { updateAuthor } from "../../../lib/admin/updateAuthor";
import { deleteAuthor } from "../../../lib/admin/deleteAuthor";
import LoadingSpinner from "../UI/LoadingSpinner";
import { toast } from "sonner";
import { NAVY, NAVY2, GOLD } from "@/lib/constants/colors";

const AdminManageAuthors = () => {
  // ============ State ============
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [openForm, setOpenForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({ id: "", name: "" });

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ─── Search / filter state
  const [searchAuthor, setSearchAuthor] = useState("");

  // ============ Helpers ============
  function resetForm() {
    setForm({ id: "", name: "" });
    setOpenForm(false);
    setIsEdit(false);
  }

  function openEdit(author) {
    setForm({ id: author.id, name: author.name });
    setIsEdit(true);
    setOpenForm(true);
  }

  function openAdd() {
    setForm({ id: "", name: "" });
    setIsEdit(false);
    setOpenForm(true);
  }

  // ============ API ============
  const getAuthorsFn = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAuthor(filters);
      setAuthors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("يرجى إدخال اسم المؤلف");
      return;
    }
    try {
      if (isEdit) {
        await updateAuthor(form.id, form.name.trim());
        toast.success("تم تعديل المؤلف بنجاح");
      } else {
        await addAuthor(form.name.trim());
        toast.success("تمت إضافة المؤلف بنجاح");
      }
      resetForm();
      getAuthorsFn();
    } catch (err) {
      toast.error("حدث خطأ: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteAuthor(id);
      toast.success("تم حذف المؤلف بنجاح");
      setDeleteId(null);
      getAuthorsFn();
    } catch (err) {
      toast.error("حدث خطأ أثناء الحذف: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filters = {};
    if (searchAuthor.trim()) filters.author = searchAuthor.trim();
    getAuthorsFn(filters);
  };

  const handleClearFilters = () => {
    setSearchAuthor("");
    getAuthorsFn();
  };

  useEffect(() => {
    getAuthorsFn();
  }, []);

  // ============ JSX ============
  return (
    <div className="manage-authors mt-10">
      {/* ── Add / Edit Modal ── */}
      {openForm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={resetForm} />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                        bg-white rounded-2xl p-8 w-[90%] sm:w-[420px] shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-primary">
                {isEdit ? "تعديل المؤلف" : "إضافة مؤلف جديد"}
              </h2>
              <button
                onClick={resetForm}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Input */}
            <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
              اسم المؤلف
              <input
                type="text"
                placeholder="أدخل اسم المؤلف"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="mt-1 py-2.5 px-3 border border-gray-200 rounded-xl outline-none
                           focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                           transition-all duration-200 text-gray-800"
              />
            </label>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 cursor-pointer bg-gradient-to-br from-primary to-primary-light"
              >
                {isEdit ? "تحديث" : "إضافة"}
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

      {/* ── Delete Confirmation Modal ── */}
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
              هل أنت متأكد من حذف هذا المؤلف؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleDelete(deleteId)}
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

      {/* ── Page Header ── */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            إدارة المؤلفين
          </h1>
          <p className="text-gray-400 font-medium text-sm mt-0.5">
            إضافة وتعديل وحذف المؤلفين
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:scale-95 bg-gradient-to-br from-primary to-primary-light shadow-[0_4px_16px_rgba(15,27,60,0.20)]"
        >
          <Plus className="w-4 h-4" />
          إضافة مؤلف جديد
        </button>
      </div>

      {/* ============ Search / Filter Bar ============ */}
      <form onSubmit={handleSearch} className="mt-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">اسم المؤلف</label>
          <div className="relative">
            <input
              type="text"
              placeholder="بحث باسم المؤلف..."
              value={searchAuthor}
              onChange={(e) => setSearchAuthor(e.target.value)}
              className="w-full py-2.5 pr-10 pl-3 border border-gray-200 rounded-xl outline-none
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                         transition-all duration-200 text-gray-800 text-sm"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold
                     text-sm text-white cursor-pointer transition-all duration-200
                     hover:opacity-90 hover:-translate-y-0.5 active:scale-95
                     bg-gradient-to-br from-primary to-primary-light shadow-[0_4px_16px_rgba(15,27,60,0.20)]"
        >
          <Search className="w-4 h-4" />
          بحث
        </button>
        {searchAuthor && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm
                       text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            مسح
          </button>
        )}
      </form>

      {/* ── Authors Table Card ── */}
      <div
        className="mt-6 rounded-2xl p-6 relative bg-white border-[1.5px] border-slate-200 shadow-[0_2px_24px_rgba(15,27,60,0.05)]"
      >
        <h2 className="font-semibold text-gray-800">قائمة المؤلفين</h2>
        <p className="text-gray-400 text-sm font-light">
          جميع المؤلفين المسجلين في المكتبة
        </p>

        {loading && <LoadingSpinner />}

        {!loading && error && (
          <div className="text-center text-red-500 font-semibold mt-8">
            {error}
          </div>
        )}

        {!loading && !error && authors.length === 0 && (
          <div className="text-center text-gray-400 mt-12 pb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-primary/[10%]"
            >
              <User className="w-8 h-8 text-primary-light" />
            </div>
            <p className="font-medium">لا يوجد مؤلفون بعد</p>
            <p className="text-sm mt-1">ابدأ بإضافة مؤلف جديد</p>
          </div>
        )}

        {!loading && !error && authors.length > 0 && (
          <div className="custom-scroll overflow-x-auto w-full mt-6">
            <table className="min-w-[300px] border-collapse w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  {["#", "اسم المؤلف", "الإجراءات"].map((col) => (
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
                {authors.map((author, index) => (
                  <tr
                    key={author.id}
                    className="transition-all duration-200 hover:bg-gray-50 border-b border-slate-100"
                  >
                    {/* Index */}
                    <td className="p-3 py-4 text-gray-400 text-sm">
                      {index + 1}
                    </td>

                    {/* Author name pill */}
                    <td className="p-3 py-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-primary/[8%] text-primary">
                        <User className="w-3.5 h-3.5" />
                        {author.name}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3 py-4">
                      <div className="flex gap-2 items-center">
                        {/* Edit */}
                        <button
                          onClick={() => openEdit(author)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                                     font-semibold transition-all duration-200 cursor-pointer
                                     hover:-translate-y-0.5 bg-accent/[10%] text-accent border border-accent/30"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          تعديل
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteId(author.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                                     font-semibold transition-all duration-200 cursor-pointer
                                     hover:-translate-y-0.5 bg-red-50 text-red-500 border border-red-200"
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

export default AdminManageAuthors;
