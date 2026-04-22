"use client";

/**
 * AICHAT Component - Premium AI Chat Interface with Book Recommendations
 *
 * @description Redesigned to match the app's premium UI language:
 * - Dark navy hero header with decorative orbs & Framer Motion entrance
 * - Glassmorphism chat area with styled user / assistant message bubbles
 * - Animated typing indicator
 * - Rich RTL input bar with file attachment, send/stop actions
 * - Horizontally scrollable book recommendations carousel
 * - Prompt suggestion chips for quick starts
 *
 * @uses Vercel AI SDK (@ai-sdk/react) for chat functionality
 */

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Bot,
  BookOpen,
  Paperclip,
  Send,
  Square,
  Sparkles,
  User,
  Wand2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/app/lib/motionVariants";

import { getBooks } from "../../../../lib/books/getBooks";
import LoadingSpinner from "@/app/UI/LoadingSpinner";
import { ChatMessage } from "@/app/components/chatMarkdown";



const msgVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.25, 0.8, 0.25, 1] },
  },
};

// ─── Typing Indicator ──────────────────────────────────────────────────────────

const TypingIndicator = () => (
  <motion.div
    variants={msgVariants}
    initial="hidden"
    animate="visible"
    className="flex items-end gap-3"
  >
    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
      <Bot size={16} className="text-white" />
    </div>
    <div className="glass-card rounded-2xl rounded-bl-sm px-5 py-3 flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-primary/50"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  </motion.div>
);

// ─── Quick Prompt Chips ────────────────────────────────────────────────────────

const QUICK_PROMPTS = [
  { icon: BookOpen, label: "اقترح لي كتاباً للقراءة هذا الأسبوع" },
  { icon: Wand2, label: "ما هي أفضل كتب الخيال العلمي؟" },
  { icon: Sparkles, label: "أريد كتاباً يحسّن مهاراتي في القيادة" },
  { icon: BookOpen, label: "قدّم لي ملخصاً لفلسفة سقراط" },
];

// ─── Main Component ────────────────────────────────────────────────────────────

const AICHAT = () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const [input, setInput] = useState("");
  const [files, setFiles] = useState(undefined);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booksError, setBooksError] = useState(null);

  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // ── AI Chat Hook ───────────────────────────────────────────────────────────
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isStreaming = status === "submitted" || status === "streaming";

  // ── Helpers ────────────────────────────────────────────────────────────────
  const scrollToBottom = () => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  const handleSubmit = (customMsg) => {
    const text = customMsg ?? input;
    if (!text.trim() && !files) return;
    sendMessage({ text, files });
    setInput("");
    setFiles(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooks();
      setBooks(data.results);
    } catch (err) {
      setBooksError(err.message || "فشل تحميل الكتب");
    } finally {
      setLoading(false);
    }
  };

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" dir="rtl">
      {/* ── Hero Header ──────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden mb-8"
        style={{
          background:
            "linear-gradient(135deg, #0F1B3C 0%, #1a2f5e 60%, #0f2251 100%)",
        }}
      >
        {/* Decorative orbs */}
        <div
          className="absolute -top-16 -left-16 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #D4930A, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-20 -right-10 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #f6c54e, transparent 70%)",
          }}
        />

        <div className="container py-12 relative z-10">
          {/* Badge */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5"
          >
            <Bot size={14} className="text-amber-400" />
            <span className="text-amber-300 text-sm font-medium">
              المساعد الذكي
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            custom={0.08}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl font-bold text-white mb-3"
          >
            تحدّث مع <span className="gradient-text">المكتبة الذكية</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={0.16}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-white/70 text-base max-w-md"
          >
            اسأل عن أي كتاب، احصل على توصيات مخصصة، أو اطلب ملخصاً فورياً
            بمساعدة الذكاء الاصطناعي.
          </motion.p>
        </div>
      </div>

      {/* ── Main Layout ──────────────────────────────────────────────────── */}
      <div className="container pb-16 flex flex-col gap-6">
        {/* ── Chat Area ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="p-6 min-h-[340px] max-h-[520px] overflow-y-auto flex flex-col gap-5"
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center gap-3">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2"
                  style={{ background: "rgba(15,27,60,0.07)" }}
                >
                  <Bot size={28} className="text-primary" />
                </div>
                <p className="font-semibold text-gray-700 text-lg">
                  كيف يمكنني مساعدتك اليوم؟
                </p>
                <p className="text-gray-400 text-sm max-w-xs">
                  اسأل عن كتاب، أو اطلب توصية أدبية، أو جرّب أحد الاقتراحات
                  أدناه.
                </p>

                {/* Quick prompts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 w-full max-w-lg">
                  {QUICK_PROMPTS.map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      onClick={() => handleSubmit(label)}
                      className="flex items-center gap-2.5 text-right px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/70 hover:border-primary/40 hover:bg-primary/5 text-sm text-gray-600 hover:text-primary transition-all duration-200 cursor-pointer"
                    >
                      <Icon size={15} className="text-primary flex-shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message list */}
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <motion.div
                    key={msg.id}
                    variants={msgVariants}
                    initial="hidden"
                    animate="visible"
                    className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : ""}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isUser ? "bg-accent" : "bg-primary"
                      }`}
                    >
                      {isUser ? (
                        <User size={15} className="text-white" />
                      ) : (
                        <Bot size={15} className="text-white" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                        isUser
                          ? "bg-primary text-white rounded-br-sm"
                          : "glass-card rounded-bl-sm text-gray-700"
                      }`}
                    >
                      <p
                        className={`text-xs font-semibold mb-1.5 ${
                          isUser ? "text-white/70" : "text-primary"
                        }`}
                      >
                        {isUser ? "أنت" : "المساعد الذكي"}
                      </p>

                      {msg.parts.map((part, index) =>
                        part.type === "text" ? (
                          <div key={index}>
                            <ChatMessage text={part.text} />
                          </div>
                        ) : part.type === "file" &&
                          part.mediaType?.startsWith("image/") ? (
                          <div
                            key={index}
                            className="relative mt-2 rounded-lg overflow-hidden w-48 h-32"
                          >
                            <Image
                              src={part.url}
                              alt={part.filename ?? `attachment-${index}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : null,
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Typing indicator */}
            {isStreaming && <TypingIndicator />}

            {/* Error */}
            {error && (
              <div className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                {error.message}
              </div>
            )}
          </div>

          {/* ── Input Bar ────────────────────────────────────────────── */}
          <div className="border-t border-gray-100 px-4 py-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="flex items-center gap-3"
            >
              {/* File attachment */}
              <div className="relative flex-shrink-0">
                <label
                  htmlFor="file-upload"
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer"
                >
                  <Paperclip size={16} />
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
                {files?.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent text-white text-[9px] flex items-center justify-center font-bold">
                    {files.length}
                  </span>
                )}
              </div>

              {/* Text input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="اكتب سؤالك هنا..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50/60 placeholder:text-gray-400"
                />
                {/* Clear attached files indicator */}
                {files?.length > 0 && (
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
                    <Paperclip size={11} />
                    <span>{files.length} ملفات مرفقة</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFiles(undefined);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="ml-1 text-red-400 hover:text-red-600 cursor-pointer"
                    >
                      <X size={11} />
                    </button>
                  </div>
                )}
              </div>

              {/* Send / Stop button */}
              {isStreaming ? (
                <button
                  type="button"
                  onClick={stop}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 cursor-pointer flex-shrink-0"
                  aria-label="إيقاف"
                >
                  <Square size={16} fill="white" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim() && !files}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white hover:bg-hover-dark transition-colors duration-200 cursor-pointer flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="إرسال"
                >
                  <Send size={16} />
                </button>
              )}
            </form>
          </div>
        </motion.div>

        {/* ── Books Recommendations Carousel ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {/* Section header */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(212,147,10,0.10)" }}
            >
              <BookOpen size={16} className="text-accent" />
            </div>
            <h2 className="font-semibold text-gray-800">توصيات الكتب</h2>
            <span className="text-xs text-gray-400 mr-auto">
              انقر على "تلخيص" لتوليد ملخص فوري بالذكاء الاصطناعي
            </span>
          </div>

          {loading && (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          )}

          {booksError && (
            <div className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {booksError}
            </div>
          )}

          {!loading && books.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-3 custom-scroll">
              {books.map((book, i) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                  className="book-card flex flex-col flex-shrink-0 w-[220px]"
                >
                  {/* Cover */}
                  <div className="relative w-full h-[240px] cover-wrap">
                    <Image
                      src={book.image || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="220px"
                    />
                    <div className="cover-overlay" />
                    {/* Category badge */}
                    <span className="absolute top-2 right-2 z-10 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/90 text-white">
                      {book.category?.name || "عام"}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-4">
                    <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-gray-500 text-xs mb-3 flex-1">
                      {book.author?.name || "مؤلف غير معروف"}
                    </p>

                    <button
                      onClick={() => {
                        const prompt = `لخصلي كتاب "${book.title}" المكتوب بقلم ${book.author?.name} الذي نُشر بتاريخ ${book.publication_year} بشكل مفهوم وجميل وشامل`;
                        handleSubmit(prompt);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-hover-dark text-white rounded-xl py-2 text-xs font-medium transition-colors duration-200 cursor-pointer"
                    >
                      <Sparkles size={12} />
                      تلخيص
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AICHAT;
