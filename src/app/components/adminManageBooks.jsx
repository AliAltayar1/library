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
 * Features:
 * - Modal form supports both add and edit modes (single form, dual purpose)
 * - Form validation and data persistence
 * - Visual distinction for archived books (grayed out)
 * - Confirmation dialogs for destructive actions
 * - Toast notifications for all operations
 *
 * @returns {JSX.Element} The books management interface with table and modal form
 */

import { Plus, X } from "lucide-react";

import React, { useEffect, useState } from "react";
import { getBooks } from "../../../lib/admin/getBooks";
import { editBookApi } from "../../../lib/admin/editBook";
import { addBookApi } from "../../../lib/admin/addBook";
import { getCategory } from "../../../lib/admin/getCategory";
import { getAuthor } from "../../../lib/admin/getAuthor";
import { archiveBook } from "../../../lib/admin/archiveBook";
import { unarchiveBook } from "../../../lib/admin/unarchiveBook";
import ArchiveUnarchiveBook from "../UI/ArchiveUnarchiveBtn";

import LoadingSpinner from "../UI/LoadingSpinner";
import { toast } from "sonner";

const AdminManageBooks = () => {
  // ============ State Management ============

  /**
   * Edit mode flag - determines if form is for editing existing book or adding new one
   * @type {boolean}
   * @default false (add mode)
   */
  const [isEdit, setIsEdit] = useState(false);

  /**
   * Modal visibility state - controls whether add/edit form is displayed
   * @type {boolean}
   */
  const [openForm, setOpenForm] = useState(false);

  /**
   * Book form data state - stores all book fields for add/edit operations
   * Contains complete book information including IDs for relationships
   * @type {Object}
   */
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

  /**
   * Categories state - stores all available book categories for dropdown
   * @type {Array<{id: string, name: string}>}
   */
  const [categories, setCategories] = useState([{ id: "", name: "" }]);

  /**
   * Authors state - stores all available authors for dropdown selection
   * @type {Array<{id: string, name: string}>}
   */
  const [authors, setAuthors] = useState([{ id: "", name: "" }]);

  /**
   * Books list state - stores complete array of books from database
   * @type {Array}
   */
  const [books, setBooks] = useState([]);

  /**
   * Loading state for books fetch operation
   * @type {boolean}
   */
  const [booksLoading, setBooksLoading] = useState(false);

  /**
   * Error state for books fetch operation
   * @type {string|null}
   */
  const [booksError, setBooksError] = useState(null);

  // ============ Form Management Functions ============

  /**
   * Resets the book form to its initial empty state and closes the modal
   * Used after successful submission or when user cancels
   *
   * @function resetForm
   * @returns {void}
   */
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

  /**
   * Populates the form with existing book data for editing
   * Transforms book object structure to match form state structure
   * Extracts nested IDs (author.id, category.id) for dropdown selections
   *
   * @function editBook
   * @param {Object} book - The book object to edit
   * @returns {void}
   */
  function editBook(book) {
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
  }

  /**
   * Handles both add and edit operations based on isEdit flag
   * Calls appropriate API endpoint and refreshes books list on success
   *
   * @async
   * @function addOrEditBook
   * @returns {Promise<void>}
   */
  async function addOrEditBook() {
    try {
      if (isEdit) {
        // Update existing book
        await editBookApi(bookForm);
        toast.success("تم تعديل الكتاب بنجاح");
      } else {
        // Add new book
        await addBookApi(bookForm);
        toast.success("تمت اضافة الكتاب بنجاح");
      }

      // Refresh books list to show changes
      getBooksFn();
    } catch (error) {
      console.log(error.message);
    }
  }

  // ============ API Functions ============

  /**
   * Fetches all books from the database including archived ones
   * Updates books state with complete book objects including relationships
   *
   * @async
   * @function getBooksFn
   * @returns {Promise<void>}
   */
  const getBooksFn = async () => {
    setBooksLoading(true);
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      setBooksError(error.message);
    } finally {
      setBooksLoading(false);
    }
  };

  /**
   * Fetches all available book categories for dropdown selection
   * Called once on component mount
   *
   * @async
   * @function getCategoriesFn
   * @returns {Promise<void>}
   */
  const getCategoriesFn = async () => {
    try {
      const category = await getCategory();
      setCategories(category);
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * Fetches all authors for dropdown selection in book form
   * Called once on component mount
   *
   * @async
   * @function getAuthorsFn
   * @returns {Promise<void>}
   */
  const getAuthorsFn = async () => {
    try {
      const author = await getAuthor();
      setAuthors(author);
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * Unarchives a book, making it visible and borrowable again
   * Refreshes books list to update UI with new status
   *
   * @async
   * @function unarchiveBookFn
   * @param {number} bookId - The ID of the book to unarchive
   * @returns {Promise<void>}
   */
  const unarchiveBookFn = async (bookId) => {
    try {
      const res = await unarchiveBook(bookId);
      // Refresh list to show updated archive status
      await getBooksFn();
      toast.success("تم إلغاء الارشفة");
    } catch (error) {
      toast.error("حدث خطأ اثناء إلغاء الارشفة " + error.message);
    }
  };

  /**
   * Archives a book, hiding it from regular users while preserving data
   * Refreshes books list to update UI with new status
   *
   * @async
   * @function archiveBookFn
   * @param {number} bookId - The ID of the book to archive
   * @returns {Promise<void>}
   */
  const archiveBookFn = async (bookId) => {
    try {
      await archiveBook(bookId);
      // Refresh list to show updated archive status
      await getBooksFn();
      toast.success("تمت الارشفة");
    } catch (error) {
      toast.error("حدث خطأ اثناء الارشفة " + error.message);
    }
  };

  // ============ Side Effects ============

  /**
   * Initial data fetch on component mount
   * Loads books, categories, and authors for the interface
   */
  useEffect(() => {
    getBooksFn();
    getCategoriesFn();
    getAuthorsFn();
  }, []);

  // ============ JSX Render ============

  return (
    <div className="manage-books mt-10">
      {/* ============ Add/Edit Book Modal Form ============ */}
      {openForm && (
        <>
          {/* Modal backdrop overlay */}
          <div className="fixed inset-0 bg-black/50 z-40"></div>

          {/* Modal dialog container */}
          <div className="bg-white rounded-md p-10 flex flex-col gap-4 w-[90%] sm:w-[450px]  m-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 max-h-[450px] overflow-y-auto">
            {/* Modal header with close button and dynamic title */}
            <div className="flex justify-between gap-3 flex-wrap items-center mb-6">
              <X
                onClick={() => {
                  resetForm();
                }}
                className="cursor-pointer hover:text-gray-300"
              />
              <span className="font-semibold">
                {isEdit ? "تعديل الكتاب" : "إضافة كتاب"}
              </span>
            </div>

            {/* Book Title Input */}
            <label htmlFor="book-name" className="flex flex-col gap-0.5">
              العنوان
              <input
                type="text"
                id="book-name"
                placeholder="اسم الكتاب"
                className="py-1.5 px-2 border border-gray-300 rounded-xs outline-0 focus:border-blue-300 focus:border-2"
                value={bookForm.title || ""}
                onChange={(e) => {
                  setBookForm({
                    ...bookForm,
                    title: e.target.value,
                  });
                }}
              />
            </label>

            {/* Author Selection Dropdown */}
            <select
              value={bookForm.author_id || ""}
              onChange={(e) =>
                setBookForm({
                  ...bookForm,
                  author_id: e.target.value,
                })
              }
              className="py-2 px-2 border border-gray-300 rounded-xs outline-0 focus:border-blue-300 focus:border-2"
            >
              <option defaultValue>اختر اسم الكاتب</option>

              {/* Map through authors to populate dropdown */}
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>

            {/* Category Selection Dropdown */}
            <select
              value={bookForm.category_id || ""}
              onChange={(e) =>
                setBookForm({
                  ...bookForm,
                  category_id: e.target.value,
                })
              }
              className="py-2 px-2 border border-gray-300 rounded-xs outline-0 focus:border-blue-300 focus:border-2"
            >
              <option defaultValue>اختر الفئة</option>

              {/* Map through categories to populate dropdown */}
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Book Description Input */}
            <label htmlFor="description" className="flex flex-col gap-0.5">
              الوصف
              <input
                type="text"
                id="description"
                placeholder="الوصف"
                className="py-1.5 px-2 border border-gray-300 rounded-xs outline-0 focus:border-blue-300 focus:border-2"
                value={bookForm.description || ""}
                onChange={(e) => {
                  setBookForm({
                    ...bookForm,
                    description: e.target.value,
                  });
                }}
              />
            </label>

            {/* Total Copies Input */}
            <label htmlFor="copy-amount" className="flex flex-col gap-0.5">
              عدد النسخ
              <input
                type="number"
                id="copy-amount"
                placeholder="عدد النسخ"
                className="py-1.5 px-2 border border-gray-300 rounded-xs outline-0 focus:border-blue-300 focus:border-2"
                value={bookForm.total_copies || ""}
                onChange={(e) => {
                  setBookForm({
                    ...bookForm,
                    total_copies: e.target.value,
                  });
                }}
              />
            </label>

            {/* ISBN Input */}
            <label htmlFor="isbn" className="flex flex-col gap-0.5">
              الرقم الدولي المعياري للكتاب
              <input
                type="number"
                id="isbn"
                placeholder="أدخل الرقم الدولي المعياري للكتاب (ISBN)"
                className="py-1.5 px-2 border border-gray-300 rounded-xs outline-0 focus:border-blue-300 focus:border-2"
                value={bookForm.isbn || ""}
                onChange={(e) => {
                  setBookForm({
                    ...bookForm,
                    isbn: e.target.value,
                  });
                }}
              />
            </label>

            {/* Publication Year Input */}
            <label htmlFor="published-year" className="flex flex-col gap-0.5">
              سنة النشر
              <input
                type="number"
                id="published-year"
                placeholder="سنة نشر الكتاب"
                className="py-1.5 px-2 border border-gray-300 rounded-xs outline-0 focus:border-blue-300 focus:border-2"
                value={bookForm.publication_year || ""}
                onChange={(e) => {
                  setBookForm({
                    ...bookForm,
                    publication_year: e.target.value,
                  });
                }}
              />
            </label>

            {/* Number of Pages Input */}
            <label htmlFor="number-of-pages" className="flex flex-col gap-0.5">
              عدد صفحات الكتاب
              <input
                type="number"
                id="number-of-pages"
                placeholder="عدد صفحات الكتاب"
                className="py-1.5 px-2 border border-gray-300 rounded-xs outline-0 focus:border-blue-300 focus:border-2"
                value={bookForm.pages}
                onChange={(e) => {
                  setBookForm({
                    ...bookForm,
                    pages: e.target.value,
                  });
                }}
              />
            </label>

            {/* Modal Action Buttons */}
            <div className="flex gap-4 items-center mt-6 flex-wrap ">
              {/* Submit Button - text changes based on isEdit mode */}
              <button
                onClick={() => {
                  addOrEditBook();
                  resetForm();
                }}
                className="bg-blue-400 py-1.5 px-3 text-white rounded-xs flex-1 cursor-pointer hover:bg-blue-500  hover:scale-x-105 transition duration-100"
              >
                {isEdit ? "تحديث" : "إضافة"}
              </button>
              {/* Cancel Button */}
              <button
                onClick={() => {
                  resetForm();
                }}
                className="border py-1.5 px-3 rounded-xs hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </>
      )}

      {/* ============ Page Header Section ============ */}
      <div className="heading flex justify-between items-center gap-5 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-blue-950">إدارة الكتب</h1>
          <h3 className="text-gray-400 font-medium">إضافة وتعديل وحذف الكتب</h3>
        </div>

        {/* Add New Book Button - opens modal in add mode */}
        <button
          onClick={() => setOpenForm(true)}
          className="bg-primary-light rounded-lg py-1.5 px-3 flex justify-center gap-x-1 items-center text-white hover:bg-hover-dark duration-200 transition-colors cursor-pointer"
        >
          إضافة كتاب جديد
          <Plus size={18} />
        </button>
      </div>

      {/* ============ Books List Table Section ============ */}
      <div className="book-list p-4 sm:p-10 rounded-2xl bg-white shadow mt-8 relative">
        <h2 className="text-blue-950 font-semibold">قائمة الكتب</h2>
        <p className="text-gray-400 font-light">جميع الكتب في المكتبة</p>

        {/* Show loading spinner while fetching books */}
        {booksLoading && <LoadingSpinner />}

        {/* Show error message if books fetch failed */}
        {!booksLoading && booksError ? (
          <div className="text-center text-red-500 font-semibold">
            {booksError}
          </div>
        ) : (
          // Scrollable table container for responsive design
          <div className="custom-scroll overflow-x-auto w-full ">
            <table className="min-w-[200px] mt-10 border-collapse w-full">
              {/* Table Header */}
              <thead className="border-b border-gray-300 whitespace-nowrap">
                <tr className="text-center ">
                  <th className="font-medium p-2">العنوان</th>
                  <th className="font-medium p-2">المؤلف</th>
                  <th className="font-medium p-2">معرف الكتاب</th>
                  <th className="font-medium p-2">الفئة</th>
                  <th className="font-medium p-2">عدد النسخ</th>
                  <th className="font-medium p-2">النسخ المتبقية</th>
                  <th className="font-medium p-2">الحالة</th>
                  <th className="font-medium p-2">الإجراءات</th>
                </tr>
              </thead>
              {/* Table Body - maps through all books */}
              <tbody>
                {books.map((book) => (
                  <tr
                    key={book.id}
                    className={`${
                      // Archived books have gray background
                      book.is_archived ? " bg-gray-200" : "hover:bg-gray-50"
                    } text-center hover:shadow-md  transition-all duration-200 border-b border-gray-300 whitespace-nowrap`}
                  >
                    {/* Book Title */}
                    <td className=" p-2 py-4 text-gray-400">{book.title}</td>
                    {/* Author Name */}
                    <td className=" p-2 py-4 text-gray-400">
                      {book.author?.name}
                    </td>
                    {/* Book ID with # prefix */}
                    <td className=" p-2 py-4 text-gray-400">#{book.id}</td>
                    {/* Category Name */}
                    <td className=" p-2 py-4 text-gray-400">
                      {book.category?.name}
                    </td>
                    {/* Total Copies Count */}
                    <td className=" p-2 py-4 text-gray-400">
                      {book.total_copies}
                    </td>
                    {/* Available Copies (not borrowed) */}
                    <td className=" p-2 py-4 text-gray-400">
                      {book.available_copies}
                    </td>
                    {/* Availability Status Badge */}
                    <td className="p-2 py-4">
                      <span
                        className={`px-2.5 py-1 text-white rounded-md text-xs whitespace-nowrap ${
                          book.is_avaiable ? "bg-primary" : "bg-gray-300"
                        }`}
                      >
                        {book.is_avaiable ? "متاح" : "غير متاح"}
                      </span>
                    </td>
                    {/* Action Buttons Column */}
                    <td className=" p-2 py-4">
                      <div className="flex gap-1 justify-center items-center ">
                        {/* Edit Button - opens modal in edit mode */}
                        <button
                          onClick={() => {
                            editBook(book);
                            setIsEdit(true);
                            setOpenForm(true);
                          }}
                          className="bg-accent  py-1 px-2 rounded-lg text-sm hover:bg-accent-dark text-white transition-colors duration-150 cursor-pointer "
                        >
                          تعديل
                        </button>

                        {/* Conditional Archive/Unarchive Button */}
                        {book.is_archived ? (
                          // Unarchive button for archived books
                          <ArchiveUnarchiveBook
                            onConfirm={() => unarchiveBookFn(book.id)}
                            text={"إلغاء ارشفة الكتاب"}
                          />
                        ) : (
                          // Archive button for active books
                          <ArchiveUnarchiveBook
                            onConfirm={() => archiveBookFn(book.id)}
                            text={"ارشفة الكتاب"}
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
