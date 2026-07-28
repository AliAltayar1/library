"use client";

/**
 * AdminManageBooks Component - Books Catalog Management Interface
 *
 * @description Administrative interface for complete books catalog management with:
 * - View all books in a sortable table with status indicators
 * - Add new books via modal form with validation
 * - Edit existing book details (title, author, category, copies, etc.)
 * - Archive/unarchive books to control visibility
 * - Real-time loading states and error handling
 * - Dynamic author and category selection from database
 *
 * @returns {JSX.Element} The books management interface with table and modal form
 */

import React, { useEffect, useState } from "react";
import {
  Plus,
  X,
  Pencil,
  BookOpen,
  ScrollText,
  Trash2,
  Search,
  FileDown,
} from "lucide-react";
import { getBooks } from "../../../lib/admin/getBooks";
import { editBookApi } from "../../../lib/admin/editBook";
import { addBookApi } from "../../../lib/admin/addBook";
import { getCategory } from "../../../lib/admin/getCategory";
import { getAuthor } from "../../../lib/admin/getAuthor";
import { archiveBook } from "../../../lib/admin/archiveBook";
import { unarchiveBook } from "../../../lib/admin/unarchiveBook";
import { getAdminBookSummaries } from "../../../lib/admin/getBookSummaries";
import { deleteBookSummary } from "../../../lib/admin/deleteBookSummary";
import { exportBooks } from "../../../lib/admin/exportBooks";
import ArchiveUnarchiveBook from "../UI/ArchiveUnarchiveBtn";
import LoadingSpinner from "../UI/LoadingSpinner";
import { toast } from "sonner";
import { NAVY, NAVY2, GOLD, GOLD2 } from "@/lib/constants/colors";

/* ─── Input shared className ────────────────────────────────── */
const inputCls =
  "mt-1 py-2.5 px-3 border border-gray-200 rounded-xl outline-none " +
  "focus:border-blue-400 focus:ring-2 focus:ring-blue-100 " +
  "transition-all duration-200 text-gray-800 text-sm w-full";

const AdminManageBooks = () => {
  // ============ State Management ============
  const [isEdit, setIsEdit] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const [bookForm, setBookForm] = useState({
    id: "",
    title: "",
    author_id: "",
    category_id: "",
    description: "",
    total_copies: "",
    isbn: "",
    publication_year: "",
    pages: "",
  });

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [booksError, setBooksError] = useState(null);

  // ─── Search / filter state
  const [searchAuthor, setSearchAuthor] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  // ─── Export state
  const [exportLoading, setExportLoading] = useState(false);

  // ─── Summaries modal state
  const [summariesModal, setSummariesModal] = useState(null); // { bookId, title }
  const [summaries, setSummaries] = useState([]);
  const [summariesLoading, setSummariesLoading] = useState(false);
  const [deletingSummaryId, setDeletingSummaryId] = useState(null);

  // ============ Form Helpers ============
  function resetForm() {
    setBookForm({
      id: "",
      title: "",
      author_id: "",
      category_id: "",
      description: "",
      total_copies: "",
      isbn: "",
      publication_year: "",
      pages: "",
    });
    setOpenForm(false);
    setIsEdit(false);
  }

  function openEdit(book) {
    setBookForm({
      id: book.id || null,
      title: book.title,
      author_id: book.author?.id,
      category_id: book.category?.id,
      description: book.description,
      total_copies: book.total_copies,
      isbn: book.isbn || "",
      publication_year: book.publication_year || "0000",
      pages: book.pages || 0,
    });
    setIsEdit(true);
    setOpenForm(true);
  }

  function openAdd() {
    resetForm();
    setOpenForm(true);
  }

  const patch = (key, val) => setBookForm((f) => ({ ...f, [key]: val }));

  // ============ API Functions ============
  const getBooksFn = async (filters = {}) => {
    setBooksLoading(true);
    setBooksError(null);
    try {
      const data = await getBooks(filters);
      setBooks(data.results);
    } catch (error) {
      setBooksError(error.message);
    } finally {
      setBooksLoading(false);
    }
  };

  const getCategoriesFn = async () => {
    try {
      setCategories(await getCategory());
    } catch (e) {
      console.log(e.message);
    }
  };

  const getAuthorsFn = async () => {
    try {
      setAuthors(await getAuthor());
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await editBookApi(bookForm);
        toast.success("تم تعديل الكتاب بنجاح");
      } else {
        await addBookApi(bookForm);
        toast.success("تمت إضافة الكتاب بنجاح");
      }
      resetForm();
      getBooksFn();
    } catch (error) {
      toast.error("حدث خطأ: " + error.message);
    }
  };

  const unarchiveBookFn = async (bookId) => {
    try {
      await unarchiveBook(bookId);
      await getBooksFn();
      toast.success("تم إلغاء الأرشفة");
    } catch (error) {
      toast.error("حدث خطأ أثناء إلغاء الأرشفة: " + error.message);
    }
  };

  const archiveBookFn = async (bookId) => {
    try {
      await archiveBook(bookId);
      await getBooksFn();
      toast.success("تمت الأرشفة");
    } catch (error) {
      toast.error("حدث خطأ أثناء الأرشفة: " + error.message);
    }
  };

  const openSummariesModal = async (book) => {
    console.log(book);
    setSummariesModal({ bookId: book.id, title: book.title });
    setSummaries([]);
    setSummariesLoading(true);
    try {
      const data = await getAdminBookSummaries(book.id);
      console.log(data);
      setSummaries(Array.isArray(data) ? data : (data.results ?? []));
    } catch (err) {
      toast.error("تعذّر جلب التعليقات: " + err.message);
    } finally {
      setSummariesLoading(false);
    }
  };

  const handleDeleteSummary = async (summaryId) => {
    setDeletingSummaryId(summaryId);
    try {
      await deleteBookSummary(summariesModal.bookId, summaryId);
      toast.success("تم حذف الملخص بنجاح");
      setSummaries((prev) => prev.filter((s) => s.id !== summaryId));
    } catch (err) {
      toast.error("حدث خطأ: " + err.message);
    } finally {
      setDeletingSummaryId(null);
    }
  };

  // ============ Side Effects ============
  const handleSearch = (e) => {
    e.preventDefault();
    const filters = {};
    if (searchAuthor.trim()) filters.author = searchAuthor.trim();
    if (searchCategory.trim()) filters.category = searchCategory.trim();
    getBooksFn(filters);
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const filters = {};
      if (searchAuthor.trim()) filters.author = searchAuthor.trim();
      if (searchCategory.trim()) filters.category = searchCategory.trim();
      await exportBooks(filters);
      toast.success("تم تصدير الكتب بنجاح ✅");
    } catch (err) {
      toast.error("فشل التصدير: " + err.message);
    } finally {
      setExportLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchAuthor("");
    setSearchCategory("");
    getBooksFn();
  };

  useEffect(() => {
    getBooksFn();
    getCategoriesFn();
    getAuthorsFn();
  }, []);

  // ============ JSX Render ============
  return (
    <div className="manage-books mt-10">
      {/* ============ Summaries Modal ============ */}
      {summariesModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSummariesModal(null)}
          />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                          bg-white rounded-2xl p-8 w-[90%] sm:w-[560px] shadow-2xl
                          max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-primary">
                  تعليقات الكتاب
                </h2>
                <p className="text-sm text-gray-400 mt-0.5 truncate max-w-[340px]">
                  {summariesModal.title}
                </p>
              </div>
              <button
                onClick={() => setSummariesModal(null)}
                className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {summariesLoading && <LoadingSpinner />}

            {!summariesLoading && summaries.length === 0 && (
              <div className="text-center text-gray-400 py-10">
                <ScrollText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="font-medium">لا توجد تعليقات بعد</p>
              </div>
            )}

            {!summariesLoading && summaries.length > 0 && (
              <div className="flex flex-col gap-3">
                {summaries.map((s, i) => (
                  <div
                    key={s.id ?? i}
                    className="rounded-xl p-4 flex flex-col gap-2 overflow-hidden bg-primary/[0.04] border border-[#f1f5f9]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-primary/[8%] text-primary">
                          {s.username[0].toUpperCase()}
                        </div>
                        <span className="text-xs font-semibold text-primary-light">
                          {`القارئ ${s.first_name} ${s.last_name}`}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteSummary(s.id)}
                        disabled={deletingSummaryId === s.id}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold
                                   transition-all cursor-pointer hover:-translate-y-0.5
                                   disabled:opacity-60 disabled:cursor-not-allowed bg-red-50 text-red-500 border border-red-200"
                      >
                        <Trash2 className="w-3 h-3" />
                        {deletingSummaryId === s.id ? "حذف..." : "حذف"}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed break-words whitespace-pre-wrap">
                      {s.summary}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      {/* ============ Add / Edit Modal ============ */}
      {openForm && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 z-40" onClick={resetForm} />

          {/* Modal dialog */}
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                        bg-white rounded-2xl p-8 w-[90%] sm:w-[480px] shadow-2xl
                        max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-primary">
                {isEdit ? "تعديل الكتاب" : "إضافة كتاب جديد"}
              </h2>
              <button
                onClick={resetForm}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-4">
              {/* Title */}
              <label className="flex flex-col text-sm font-medium text-gray-700">
                العنوان
                <input
                  type="text"
                  placeholder="اسم الكتاب"
                  className={inputCls}
                  value={bookForm.title || ""}
                  onChange={(e) => patch("title", e.target.value)}
                />
              </label>

              {/* Author dropdown */}
              <label className="flex flex-col text-sm font-medium text-gray-700">
                المؤلف
                <select
                  className={inputCls}
                  value={bookForm.author_id || ""}
                  onChange={(e) => patch("author_id", e.target.value)}
                >
                  <option value="">اختر اسم الكاتب</option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>

              {/* Category dropdown */}
              <label className="flex flex-col text-sm font-medium text-gray-700">
                الفئة
                <select
                  className={inputCls}
                  value={bookForm.category_id || ""}
                  onChange={(e) => patch("category_id", e.target.value)}
                >
                  <option value="">اختر الفئة</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              {/* Description */}
              <label className="flex flex-col text-sm font-medium text-gray-700">
                الوصف
                <input
                  type="text"
                  placeholder="وصف الكتاب"
                  className={inputCls}
                  value={bookForm.description || ""}
                  onChange={(e) => patch("description", e.target.value)}
                />
              </label>

              {/* Copies + Pages row */}
              <div className="flex gap-3">
                <label className="flex flex-col text-sm font-medium text-gray-700 flex-1">
                  عدد النسخ
                  <input
                    type="number"
                    placeholder="عدد النسخ"
                    className={inputCls}
                    value={bookForm.total_copies || ""}
                    onChange={(e) => patch("total_copies", e.target.value)}
                  />
                </label>
                <label className="flex flex-col text-sm font-medium text-gray-700 flex-1">
                  عدد الصفحات
                  <input
                    type="number"
                    placeholder="عدد الصفحات"
                    className={inputCls}
                    value={bookForm.pages || ""}
                    onChange={(e) => patch("pages", e.target.value)}
                  />
                </label>
              </div>

              {/* ISBN + Year row */}
              <div className="flex gap-3">
                <label className="flex flex-col text-sm font-medium text-gray-700 flex-1">
                  ISBN
                  <input
                    type="number"
                    placeholder="الرقم الدولي للكتاب"
                    className={inputCls}
                    value={bookForm.isbn || ""}
                    onChange={(e) => patch("isbn", e.target.value)}
                  />
                </label>
                <label className="flex flex-col text-sm font-medium text-gray-700 flex-1">
                  سنة النشر
                  <input
                    type="number"
                    placeholder="سنة النشر"
                    className={inputCls}
                    value={bookForm.publication_year || ""}
                    onChange={(e) => patch("publication_year", e.target.value)}
                  />
                </label>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white
                           transition-all duration-200 hover:opacity-90 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
                }}
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

      {/* ============ Page Header ============ */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-primary">إدارة الكتب</h1>
          <p className="text-gray-400 font-medium text-sm mt-0.5">
            إضافة وتعديل وأرشفة الكتب
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Export Excel */}
          <button
            onClick={handleExport}
            disabled={exportLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold
                       text-sm cursor-pointer transition-all duration-200
                       hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
                       border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
          >
            <FileDown className="w-4 h-4" />
            {exportLoading ? "جارٍ التصدير..." : "تصدير Excel"}
          </button>

          {/* Add book */}
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold
                       text-sm text-white cursor-pointer transition-all duration-200
                       hover:opacity-90 hover:-translate-y-0.5 active:scale-95 shadow-[0_4px_16px_rgba(15,27,60,0.20)]"
            style={{
              background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
            }}
          >
            <Plus className="w-4 h-4" />
            إضافة كتاب جديد
          </button>
        </div>
      </div>

      {/* ============ Search / Filter Bar ============ */}
      <form
        onSubmit={handleSearch}
        className="mt-8 flex flex-wrap items-end gap-3"
      >
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            المؤلف
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="بحث بالمؤلف..."
              value={searchAuthor}
              onChange={(e) => setSearchAuthor(e.target.value)}
              className="w-full py-2.5 pr-10 pl-3 border border-gray-200 rounded-xl outline-none
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                         transition-all duration-200 text-gray-800 text-sm"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            الفئة
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="بحث بالفئة..."
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
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
                     hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
          }}
        >
          <Search className="w-4 h-4" />
          بحث
        </button>
        {(searchAuthor || searchCategory) && (
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

      {/* ============ Books Table Card ============ */}
      <div className="mt-6 rounded-2xl p-6 relative bg-white border-[1.5px] border-[#e2e8f0] shadow-[0_2px_24px_rgba(15,27,60,0.05)]">
        <h2 className="font-semibold text-gray-800">قائمة الكتب</h2>
        <p className="text-gray-400 text-sm font-light">
          جميع الكتب في المكتبة
        </p>

        {/* Loading */}
        {booksLoading && <LoadingSpinner />}

        {/* Error */}
        {!booksLoading && booksError && (
          <div className="text-center text-red-500 font-semibold mt-8">
            {booksError}
          </div>
        )}

        {/* Empty state */}
        {!booksLoading && !booksError && books.length === 0 && (
          <div className="text-center text-gray-400 mt-12 pb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-primary/[10%]">
              <BookOpen className="w-8 h-8 text-primary-light" />
            </div>
            <p className="font-medium">لا توجد كتب بعد</p>
            <p className="text-sm mt-1">ابدأ بإضافة كتاب جديد</p>
          </div>
        )}

        {/* Table */}
        {!booksLoading && !booksError && books.length > 0 && (
          <div className="custom-scroll overflow-x-auto w-full mt-6">
            <table className="min-w-[700px] border-collapse w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  {[
                    "المعرف",
                    "العنوان",
                    "المؤلف",
                    "الفئة",
                    "النسخ الكلية",
                    "النسخ المتاحة",
                    "الحالة",
                    "الإجراءات",
                  ].map((col) => (
                    <th
                      key={col}
                      className="font-semibold p-3 text-right text-sm whitespace-nowrap text-primary"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr
                    key={book.id}
                    className={`transition-all duration-200 border-b border-slate-100 ${
                      book.is_archived
                        ? "bg-slate-50 opacity-75"
                        : "hover:bg-blue-50"
                    }`}
                  >
                    {/* ID badge */}
                    <td className="p-3 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/[8%] text-primary-light">
                        #{book.id}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="p-3 py-4 text-gray-700 font-medium whitespace-nowrap">
                      {book.title}
                    </td>

                    {/* Author */}
                    <td className="p-3 py-4 text-gray-500 text-sm whitespace-nowrap">
                      {book.author?.name}
                    </td>

                    {/* Category pill */}
                    <td className="p-3 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-accent/[10%] text-accent">
                        {book.category?.name}
                      </span>
                    </td>

                    {/* Total copies */}
                    <td className="p-3 py-4 text-gray-500 text-sm text-center">
                      {book.total_copies}
                    </td>

                    {/* Available copies */}
                    <td className="p-3 py-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center min-w-[28px] px-2.5 py-1 rounded-full text-xs font-bold ${
                          book.available_copies > 0
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {book.available_copies}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="p-3 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          book.is_avaiable
                            ? "bg-green-500/10 text-green-600"
                            : "bg-slate-500/15 text-slate-400"
                        }`}
                      >
                        {book.is_avaiable ? "متاح" : "غير متاح"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3 py-4">
                      <div className="flex gap-2 items-center justify-start">
                        {/* Edit */}
                        <button
                          onClick={() => openEdit(book)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                                     font-semibold transition-all duration-200 cursor-pointer
                                     hover:-translate-y-0.5 whitespace-nowrap bg-accent/[10%] text-accent border border-accent/30"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          تعديل
                        </button>

                        {/* Summaries */}
                        <button
                          onClick={() => openSummariesModal(book)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                                     font-semibold transition-all duration-200 cursor-pointer
                                     hover:-translate-y-0.5 whitespace-nowrap bg-primary/[8%] text-primary-light border border-primary/[12%]"
                        >
                          <ScrollText className="w-3.5 h-3.5" />
                          تعليقات
                        </button>

                        {/* Archive / Unarchive */}
                        {book.is_archived ? (
                          <ArchiveUnarchiveBook
                            onConfirm={() => unarchiveBookFn(book.id)}
                            text="إلغاء الأرشفة"
                          />
                        ) : (
                          <ArchiveUnarchiveBook
                            onConfirm={() => archiveBookFn(book.id)}
                            text="أرشفة"
                          />
                        )}
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

export default AdminManageBooks;
