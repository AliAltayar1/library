"use client";

/**
 * AdminManageCategories Component - Category Management Interface
 *
 * @description Administrative interface for complete category management with:
 * - View all categories in a clean table
 * - Add new categories via modal form
 * - Edit existing category names
 * - Delete categories with confirmation
 * - Real-time loading states and error handling
 *
 * @returns {JSX.Element} The category management interface with table and modal form
 */

import React, { useEffect, useState } from "react";
import { Plus, X, Pencil, Trash2 } from "lucide-react";
import { getCategory } from "../../../lib/admin/getCategory";
import { addCategory } from "../../../lib/admin/addCategory";
import { updateCategory } from "../../../lib/admin/updateCategory";
import { deleteCategory } from "../../../lib/admin/deleteCategory";
import LoadingSpinner from "../UI/LoadingSpinner";
import { toast } from "sonner";
import { NAVY, NAVY2, GOLD, GOLD2 } from "@/lib/constants/colors";

const AdminManageCategories = () => {
  // ============ State Management ============
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** Modal open/close */
  const [openForm, setOpenForm] = useState(false);
  /** true = edit mode, false = add mode */
  const [isEdit, setIsEdit] = useState(false);
  /** Form data: { id, name } */
  const [catForm, setCatForm] = useState({ id: "", name: "" });

  /** Delete confirmation state */
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ============ Helpers ============

  function resetForm() {
    setCatForm({ id: "", name: "" });
    setOpenForm(false);
    setIsEdit(false);
  }

  function openEdit(cat) {
    setCatForm({ id: cat.id, name: cat.name });
    setIsEdit(true);
    setOpenForm(true);
  }

  function openAdd() {
    setCatForm({ id: "", name: "" });
    setIsEdit(false);
    setOpenForm(true);
  }

  // ============ API Functions ============

  const getCategoriesFn = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategory();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!catForm.name.trim()) {
      toast.error("يرجى إدخال اسم الفئة");
      return;
    }
    try {
      if (isEdit) {
        await updateCategory(catForm.id, catForm.name.trim());
        toast.success("تم تعديل الفئة بنجاح");
      } else {
        await addCategory(catForm.name.trim());
        toast.success("تمت إضافة الفئة بنجاح");
      }
      resetForm();
      getCategoriesFn();
    } catch (err) {
      toast.error("حدث خطأ: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteCategory(id);
      toast.success("تم حذف الفئة بنجاح");
      setDeleteId(null);
      getCategoriesFn();
    } catch (err) {
      toast.error("حدث خطأ أثناء الحذف: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  // ============ Side Effects ============
  useEffect(() => {
    getCategoriesFn();
  }, []);

  // ============ JSX Render ============
  return (
    <div className="manage-categories mt-10">
      {/* ============ Add / Edit Modal ============ */}
      {openForm && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 z-40" onClick={resetForm} />

          {/* Modal dialog */}
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                        bg-white rounded-2xl p-8 w-[90%] sm:w-[420px] shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-primary">
                {isEdit ? "تعديل الفئة" : "إضافة فئة جديدة"}
              </h2>
              <button
                onClick={resetForm}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Category name input */}
            <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
              اسم الفئة
              <input
                type="text"
                placeholder="أدخل اسم الفئة"
                value={catForm.name}
                onChange={(e) =>
                  setCatForm({ ...catForm, name: e.target.value })
                }
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="mt-1 py-2.5 px-3 border border-gray-200 rounded-xl outline-none
                           focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                           transition-all duration-200 text-gray-800"
              />
            </label>

            {/* Action buttons */}
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

      {/* ============ Delete Confirmation Modal ============ */}
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
            {/* Warning icon */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-500/10"
            >
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              تأكيد الحذف
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              هل أنت متأكد من حذف هذه الفئة؟ لا يمكن التراجع عن هذا الإجراء.
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

      {/* ============ Page Header ============ */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            إدارة الفئات
          </h1>
          <p className="text-gray-400 font-medium text-sm mt-0.5">
            إضافة وتعديل وحذف فئات الكتب
          </p>
        </div>

        {/* Add Category Button */}
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:scale-95 bg-gradient-to-br from-primary to-primary-light shadow-[0_4px_16px_rgba(15,27,60,0.20)]"
        >
          <Plus className="w-4 h-4" />
          إضافة فئة جديدة
        </button>
      </div>

      {/* ============ Categories Table Card ============ */}
      <div
        className="mt-8 rounded-2xl p-6 relative bg-white border-[1.5px] border-slate-200 shadow-[0_2px_24px_rgba(15,27,60,0.05)]"
      >
        <h2 className="font-semibold text-gray-800">قائمة الفئات</h2>
        <p className="text-gray-400 text-sm font-light">
          جميع فئات الكتب في المكتبة
        </p>

        {/* Loading state */}
        {loading && <LoadingSpinner />}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center text-red-500 font-semibold mt-8">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && categories.length === 0 && (
          <div className="text-center text-gray-400 mt-12 pb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-primary/[10%]"
            >
              <Plus className="w-8 h-8 text-primary-light" />
            </div>
            <p className="font-medium">لا توجد فئات بعد</p>
            <p className="text-sm mt-1">ابدأ بإضافة فئة جديدة</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && categories.length > 0 && (
          <div className="custom-scroll overflow-x-auto w-full mt-6">
            <table className="min-w-[300px] border-collapse w-full">
              <thead>
                <tr className="text-sm border-b-2 border-slate-200">
                  <th
                    className="font-semibold p-3 text-right text-primary"
                  >
                    #
                  </th>
                  <th
                    className="font-semibold p-3 text-right text-primary"
                  >
                    اسم الفئة
                  </th>
                  <th
                    className="font-semibold p-3 text-center text-primary"
                  >
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr
                    key={cat.id}
                    className="transition-all duration-200 hover:bg-gray-50 border-b border-slate-100"
                  >
                    {/* Index */}
                    <td className="p-3 py-4 text-gray-400 text-sm">
                      {index + 1}
                    </td>

                    {/* Category name with pill badge */}
                    <td className="p-3 py-4">
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/[8%] text-primary"
                      >
                        {cat.name}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3 py-4">
                      <div className="flex gap-2 justify-center items-center">
                        {/* Edit button */}
                        <button
                          onClick={() => openEdit(cat)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                                     font-semibold transition-all duration-200 cursor-pointer
                                     hover:-translate-y-0.5 bg-accent/[10%] text-accent border border-accent/30"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          تعديل
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => setDeleteId(cat.id)}
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

export default AdminManageCategories;
