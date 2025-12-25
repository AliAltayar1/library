"use client";
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
  const [categories, setCategories] = useState([{ id: "", name: "" }]);
  const [authors, setAuthors] = useState([{ id: "", name: "" }]);

  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [booksError, setBooksError] = useState(null);

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

  async function addOrEditBook() {
    try {
      if (isEdit) {
        await editBookApi(bookForm);
        toast.success("تم تعديل الكتاب بنجاح");
      } else {
        await addBookApi(bookForm);
        toast.success("تمت اضافة الكتاب بنجاح");
      }

      getBooksFn();
    } catch (error) {
      console.log(error.message);
    }
  }

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

  const getCategoriesFn = async () => {
    try {
      const category = await getCategory();
      setCategories(category);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAuthorsFn = async () => {
    try {
      const author = await getAuthor();
      setAuthors(author);
    } catch (error) {
      console.log(error.message);
    }
  };

  const unarchiveBookFn = async (bookId) => {
    try {
      const res = await unarchiveBook(bookId);
      await getBooksFn();
      toast.success("تم إلغاء الارشفة");
    } catch (error) {
      toast.error("حدث خطأ اثناء إلغاء الارشفة " + error.message);
    }
  };

  const archiveBookFn = async (bookId) => {
    try {
      await archiveBook(bookId);
      await getBooksFn();
      toast.success("تمت الارشفة");
    } catch (error) {
      toast.error("حدث خطأ اثناء الارشفة " + error.message);
    }
  };

  useEffect(() => {
    getBooksFn();
    getCategoriesFn();
    getAuthorsFn();
  }, []);

  return (
    <div className="manage-books mt-10">
      {/*Add book Form*/}

      {openForm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40"></div>

          <div className="bg-white rounded-md p-10 flex flex-col gap-4 w-[90%] sm:w-[450px]  m-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 max-h-[450px] overflow-y-auto">
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

              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>

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

              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

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

            <div className="flex gap-4 items-center mt-6 flex-wrap ">
              <button
                onClick={() => {
                  addOrEditBook();
                  resetForm();
                }}
                className="bg-blue-400 py-1.5 px-3 text-white rounded-xs flex-1 cursor-pointer hover:bg-blue-500  hover:scale-x-105 transition duration-100"
              >
                {isEdit ? "تحديث" : "إضافة"}
              </button>
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

      <div className="heading flex justify-between items-center gap-5 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-blue-950">إدارة الكتب</h1>
          <h3 className="text-gray-400 font-medium">إضافة وتعديل وحذف الكتب</h3>
        </div>

        <button
          onClick={() => setOpenForm(true)}
          className="bg-primary-light rounded-lg py-1.5 px-3 flex justify-center gap-x-1 items-center text-white hover:bg-hover-dark duration-200 transition-colors cursor-pointer"
        >
          إضافة كتاب جديد
          <Plus size={18} />
        </button>
      </div>

      <div className="book-list p-4 sm:p-10 rounded-2xl bg-white shadow mt-8 relative">
        <h2 className="text-blue-950 font-semibold">قائمة الكتب</h2>
        <p className="text-gray-400 font-light">جميع الكتب في المكتبة</p>

        {booksLoading && <LoadingSpinner />}
        {!booksLoading && booksError ? (
          <div className="text-center text-red-500 font-semibold">
            {booksError}
          </div>
        ) : (
          <div className="custom-scroll overflow-x-auto w-full ">
            <table className="min-w-[200px] mt-10 border-collapse w-full">
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
              <tbody>
                {books.map((book) => (
                  <tr
                    key={book.id}
                    className={`${
                      book.is_archived ? " bg-gray-200" : "hover:bg-gray-50"
                    } text-center hover:shadow-md  transition-all duration-200 border-b border-gray-300 whitespace-nowrap`}
                  >
                    <td className=" p-2 py-4 text-gray-400">{book.title}</td>
                    <td className=" p-2 py-4 text-gray-400">
                      {book.author?.name}
                    </td>
                    <td className=" p-2 py-4 text-gray-400">#{book.id}</td>
                    <td className=" p-2 py-4 text-gray-400">
                      {book.category?.name}
                    </td>
                    <td className=" p-2 py-4 text-gray-400">
                      {book.total_copies}
                    </td>
                    <td className=" p-2 py-4 text-gray-400">
                      {book.available_copies}
                    </td>
                    <td className="p-2 py-4">
                      <span
                        className={`px-2.5 py-1 text-white rounded-md text-xs whitespace-nowrap ${
                          book.is_avaiable ? "bg-primary" : "bg-gray-300"
                        }`}
                      >
                        {book.is_avaiable ? "متاح" : "غير متاح"}
                      </span>
                    </td>
                    <td className=" p-2 py-4">
                      <div className="flex gap-1 justify-center items-center ">
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

                        {book.is_archived ? (
                          <ArchiveUnarchiveBook
                            onConfirm={() => unarchiveBookFn(book.id)}
                            text={"إلغاء ارشفة الكتاب"}
                          />
                        ) : (
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
