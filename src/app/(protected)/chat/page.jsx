"use client";

/**
 * AICHAT Component - AI-Powered Chat Interface with Book Recommendations
 *
 * @description This component provides an interactive AI chat interface with the following features:
 * - Real-time message streaming with AI assistant
 * - File upload capability (especially images)
 * - Book recommendations display in horizontal scrollable carousel
 * - One-click book summary generation through AI
 * - Message history with user/assistant distinction
 * - Loading states and error handling
 *
 * @uses Vercel AI SDK (@ai-sdk/react) for chat functionality
 * @returns {JSX.Element} The AI Chat page component
 */

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

import { getBooks } from "../../../../lib/books/getBooks";
import LoadingSpinner from "@/app/UI/LoadingSpinner";
import { ChatMessage } from "@/app/components/chatMarkdown";

const AICHAT = () => {
  // ============ State Management ============

  // User input state - stores the current message being typed
  const [input, setInput] = useState("");

  // File attachments state - stores FileList object of uploaded files
  const [files, setFiles] = useState(undefined);

  // Books data state - stores array of book objects for recommendations
  const [books, setBooks] = useState([]);

  // Loading state for books fetch operation
  const [loading, setLoading] = useState(false);

  // Error state for books fetch operation
  const [booksError, setBooksError] = useState(null);

  // File input reference - used to reset file input after submission
  const fileInputRef = useRef(null);

  // ============ AI Chat Hook ============

  /**
   * useChat hook from Vercel AI SDK
   * Manages chat state, message streaming, and API communication
   *
   * @property {Array} messages - Array of all chat messages (user and assistant)
   * @property {Function} sendMessage - Function to send a new message to the AI
   * @property {string} status - Current chat status: 'idle' | 'submitted' | 'streaming' | 'success' | 'error'
   * @property {Error} error - Error object if an error occurred during chat
   * @property {Function} stop - Function to stop the current streaming response
   */
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat", // API endpoint for chat processing
    }),
  });

  // ============ API Functions ============

  /**
   * Fetches all books from the API to display as recommendations
   *
   * @async
   * @function fetchBooks
   * @returns {Promise<void>}
   */
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

  // ============ Event Handlers ============

  /**
   * Handles message submission to the AI chat
   * Sends either a custom message (for book summaries) or user input
   * Clears input and file attachments after sending
   *
   * @function handleSubmit
   * @param {string} [customMsg] - Optional custom message to send (used for book summaries)
   * @returns {void}
   */
  const handleSubmit = (customMsg) => {
    // Send message with text and optional file attachments
    sendMessage({ text: customMsg ? customMsg : input, files });

    // Clear input field after sending
    setInput("");

    // Clear file attachments
    setFiles(undefined);

    // Reset file input element to clear selected files from UI
    if (fileInputRef) fileInputRef.current.value = "";
  };

  // ============ Side Effects ============

  /**
   * Fetch books on component mount to display recommendations
   */
  useEffect(() => {
    fetchBooks();
  }, []);

  // ============ JSX Render ============

  return (
    <div className="px-10 my-10">
      {/* ============ Chat Messages Display Area ============ */}
      <div className={`bg-gray-50 w-full min-h-36 mb-5 p-5 `}>
        {/* Map through all messages and display them */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-5 mb-2 ${
              msg.role === "user" ? "bg-gray-100 rounded-2xl " : ""
            }`}
          >
            {/* Message sender label - distinguishes between user and assistant */}
            <div className="font-semibold mb-1">
              {msg.role === "user" ? "أنا:" : "المساعد الذكي:"}
            </div>

            {/* Render message parts - can be text or file attachments */}
            {msg.parts.map((part, index) => {
              // Render text content with markdown formatting
              return part.type === "text" ? (
                <div key={index} className="text-gray-600">
                  {<ChatMessage text={part.text} />}
                </div>
              ) : part.type === "file" ? (
                // Render image attachments if mediaType starts with "image/"
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

        {/* Display error message if chat error occurs */}
        {error && <div className="text-red-500">{error.message}</div>}

        {/* Display loading spinner while AI is generating response */}
        {(status === "submitted" || status === "streaming") && (
          <div className="w-5 h-5 border-4 m-5 border-blue-500 border-dashed rounded-full animate-spin"></div>
        )}
      </div>

      {/* ============ Chat Input Form ============ */}
      <form
        className="w-full max-w-md m-auto mb-10"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          {/* File Upload Section */}
          <div>
            {/* Custom file upload label with attachment icon */}
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
              {/* Display number of attached files or prompt to attach */}
              {files?.length ? `${files.length} ملفات مرفقة` : "أرفق الملفات"}
            </label>

            {/* Hidden file input - triggered by label click */}
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

          {/* Message Input and Submit Section */}
          <div className="bg-white w-full flex justify-center sm:justify-between items-center gap-x-2 gap-y-1 py-3 px-3 rounded-md flex-wrap">
            {/* Text input for user message */}
            <input
              type="text"
              placeholder="كيف يمكنني مساعدتك"
              className="outline-0 h-full px-3 flex-1 border border-gray-200 rounded-sm py-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            {/* Conditional button - Stop or Send based on chat status */}
            {status === "submitted" || status === "streaming" ? (
              // Stop button - appears while AI is generating response
              <button
                onClick={stop}
                className="bg-red-500 py-1.5 px-5 rounded-sm text-white cursor-pointer hover:bg-red-600"
              >
                إيقاف
              </button>
            ) : (
              // Send button - appears when chat is idle
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

      {/* ============ Books Recommendations Carousel ============ */}
      <div className="flex gap-x-3 overflow-auto p-2">
        {/* Show loading spinner while fetching books */}
        {loading && <LoadingSpinner />}

        {/* Show error message if books fetch failed */}
        {booksError && <div className="text-red-500">{booksError}</div>}

        {/* Display books as cards in horizontal scrollable list */}
        {books.length > 0
          ? books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl transition-shadow duration-200 shadow-xl flex flex-col items-start hover:shadow-2xl p-4 min-w-full sm:min-w-[300px] relative"
              >
                {/* Category badge positioned absolutely in top-left corner */}
                <span className="bg-accent text-white px-2 py-1 rounded absolute top-2 left-2 z-10">
                  {book.category?.name || "لا يوجد فئة"}
                </span>

                {/* Book cover image */}
                <div className="aspect-[3/4] relative mb-4 overflow-hidden rounded-lg w-full h-full">
                  <Image
                    src={book.image || "/placeholder.svg"}
                    alt={book.title}
                    className="object-cover w-full h-full"
                    fill
                  />
                </div>

                {/* Book title */}
                <span className="font-medium mb-2">{book.title}</span>

                {/* Book author with fallback text */}
                <span className="text-gray-500 text-start">
                  {book.author?.name || "لا يوجد مؤلف"}
                </span>

                {/* Book summary button - generates AI summary when clicked */}
                <button
                  onClick={() => {
                    // Create Arabic prompt asking AI to summarize the book
                    const prompt = `لخصلي كتاب ${book.title} المكتوب بقلم ${book.author?.name} الذي نشر بتاريخ ${book.publication_year} بشكل مفهوم وجميل وشامل`;

                    // Submit the prompt as a custom message to the AI
                    handleSubmit(prompt);
                  }}
                  className="bg-primary-light rounded-md py-1.5 px-4 w-full text-white cursor-pointer hover:bg-hover-dark transition-colors duration-200 mt-3"
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
