"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChatMessage } from "../components/chatMarkdown";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { getBooks } from "../../../lib/books/getBooks";
import LoadingSpinner from "../UI/LoadingSpinner";

const AICHAT = () => {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState(undefined);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booksError, setBooksError] = useState(null);

  const fileInputRef = useRef(null);

  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);

      console.error("Error fetching books:", error.message);

      setBooksError(error.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (customMsg) => {
    sendMessage({ text: customMsg ? customMsg : input, files });
    setInput("");
    setFiles(undefined);

    if (fileInputRef) fileInputRef.current.value = "";
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="px-10">
      <div className={`bg-gray-50 w-full min-h-36 mb-5 p-5 `}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-5 mb-2 ${
              msg.role === "user" ? "bg-gray-100 rounded-2xl " : ""
            }`}
          >
            <div className="font-semibold mb-1">
              {msg.role === "user" ? "أنا:" : "المساعد الذكي:"}
            </div>

            {msg.parts.map((part, index) => {
              return part.type === "text" ? (
                <div key={index} className="text-gray-600">
                  {<ChatMessage text={part.text} />}
                </div>
              ) : part.type === "file" ? (
                part.mediaType?.startsWith("image/") ? (
                  <span className="inline-block min-w-[50px] min-h-[50px] relative ms-0.5">
                    <Image
                      key={`${msg.id} - ${index}`}
                      src={part.url}
                      alt={part.filename ?? `attachment number ${index}`}
                      fill
                      className="object-contain"
                    />
                  </span>
                ) : null
              ) : null;
            })}
          </div>
        ))}

        {error && <div className="text-red-500">{error.message}</div>}

        {(status === "submitted" || status === "streaming") && (
          <div className="w-5 h-5 border-4 m-5 border-blue-500 border-dashed rounded-full animate-spin"></div>
        )}
      </div>

      <form
        className="w-full max-w-md m-auto mb-10"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <div>
            <label
              htmlFor="file-upload"
              className="flex gap-1 cursor-pointer mb-1"
            >
              <Image
                src="/attachment-svgrepo-com.svg"
                alt="attachment-svg"
                width={20}
                height={20}
              />
              {files?.length ? `${files.length} ملفات مرفقة` : "أرفق الملفات"}
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                if (e.target.files) setFiles(e.target.files);
              }}
            />
          </div>
          <div className="bg-white w-full flex justify-center sm:justify-between items-center gap-x-2 gap-y-1 py-3 px-3 rounded-md flex-wrap">
            <input
              type="text"
              placeholder="كيف يمكنني مساعدتك"
              className="outline-0 h-full px-3 flex-1 border border-gray-200 rounded-sm py-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            {status === "submitted" || status === "streaming" ? (
              <button
                onClick={stop}
                className="bg-red-500 py-1.5 px-5 rounded-sm text-white cursor-pointer hover:bg-red-600"
              >
                إيقاف
              </button>
            ) : (
              <button
                type="submit"
                className="bg-blue-500 py-1.5 px-5 rounded-sm text-white cursor-pointer hover:bg-blue-600"
              >
                إرسال
              </button>
            )}
          </div>
        </div>
      </form>
      {console.log(books)}
      <div className="flex gap-x-3 overflow-auto p-2">
        {loading && <LoadingSpinner />}
        {booksError && <div className="text-red-500">{booksError}</div>}
        {books.length > 1
          ? books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl transition-shadow duration-200 shadow-xl flex flex-col items-start hover:shadow-2xl p-4 min-w-full sm:min-w-[300px] relative"
              >
                <span className="bg-gray-300 text-gray-600 px-2 py-1 rounded absolute top-2 left-2 z-10">
                  {book.category?.name}
                </span>
                <div className="aspect-[3/4] relative mb-4 overflow-hidden rounded-lg w-full h-full">
                  <Image
                    src={book.image || "/placeholder.svg"}
                    alt={book.title}
                    className="object-cover w-full h-full"
                    fill
                  />
                </div>

                <span className="font-medium mb-2">{book.title}</span>
                <span className="text-gray-500 text-start">
                  {book.author?.name}
                </span>

                <button
                  onClick={() => {
                    const prompt = `لخصلي كتاب ${book.title} المكتوب بقلم ${book.author?.name} الذي نشر بتاريخ ${book.publication_year} بشكل مفهوم وجميل وشامل`;
                    handleSubmit(prompt);
                  }}
                  className="bg-blue-950 rounded-md py-1.5 px-4 w-full text-white cursor-pointer hover:bg-blue-900 transition-colors duration-200 mt-3"
                >
                  تلخيص
                </button>
              </div>
            ))
          : ""}
      </div>
    </div>
  );
};

export default AICHAT;
