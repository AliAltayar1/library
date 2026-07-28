"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Quote,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Heart,
} from "lucide-react";
import { getQuotes } from "../../../lib/quotes/getQuotes";
import { NAVY, NAVY2 } from "@/lib/constants/colors";

export default function QuotesSlider() {
  const [quotes, setQuotes] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getQuotes();
        const list = Array.isArray(data) ? data : (data?.results ?? []);
        setQuotes(list.slice(0, 10)); // show up to 10 on home
      } catch {
        // silent fail on home page
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* Auto-advance every 5 s */
  useEffect(() => {
    if (quotes.length < 2) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [quotes.length]);

  const goTo = (idx) => {
    clearInterval(timerRef.current);
    setCurrent(idx);
    setExpanded(false);
  };
  const prev = () => goTo((current - 1 + quotes.length) % quotes.length);
  const next = () => goTo((current + 1) % quotes.length);

  if (loading || quotes.length === 0) return null;

  const q = quotes[current];
  const authorName = q.writer_full_name || "مجهول";

  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY2} 55%, #0c1628 100%)`,
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 15% 50%, rgba(212,147,10,0.09) 0%, transparent 70%), " +
            "radial-gradient(ellipse 45% 60% at 80% 40%, rgba(79,172,254,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Giant decorative quote mark */}
      <div className="absolute top-6 right-10 opacity-[0.04] pointer-events-none select-none">
        <Quote className="w-48 h-48 text-white" />
      </div>

      <div className="container relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full mb-4">
            <Quote className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400 tracking-wide">
              اقتباسات مختارة
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            كلمات من القراء
          </h2>
          <p className="text-white/50 text-sm">
            اقتباسات أدبية يشاركها أعضاء مجتمعنا
          </p>
        </div>

        {/* Slider card */}
        <div className="max-w-2xl mx-auto">
          <div
            key={current}
            className="relative bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-10
              animate-fadeIn text-center"
          >
            {/* Quote icon */}
            <Quote className="w-8 h-8 text-amber-400 mx-auto mb-5 opacity-70" />

            {/* Content */}
            <div className="mb-6">
              <p
                className={`text-white text-lg sm:text-xl font-semibold leading-relaxed break-words whitespace-pre-wrap ${
                  !expanded && q.content?.length > 120 ? "line-clamp-3" : ""
                }`}
              >
                {q.content}
              </p>
              {q.content?.length > 120 && (
                <button
                  onClick={() => setExpanded((prev) => !prev)}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 mt-2 cursor-pointer transition-colors"
                >
                  {expanded ? "أقل" : "اقرأ المزيد"}
                </button>
              )}
            </div>

            {/* Author + likes */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Author */}
              <div className="flex items-center gap-3 mx-auto sm:mx-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{
                    background: "rgba(212,147,10,0.3)",
                    border: "2px solid rgba(212,147,10,0.5)",
                  }}
                >
                  {authorName.charAt(0)}
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold text-sm">
                    {authorName}
                  </p>
                  {(q.username || q.user?.username) && (
                    <p className="text-white/40 text-xs">
                      @{q.username || q.user?.username}
                    </p>
                  )}
                </div>
              </div>

              {/* Likes */}
              {(q.likes_count ?? 0) > 0 && (
                <div className="flex items-center gap-1.5 text-white/50 text-xs mx-auto sm:mx-0">
                  <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                  <span>{q.likes_count}</span>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {/* Prev */}
            <button
              onClick={prev}
              disabled={quotes.length < 2}
              className="w-10 h-10 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === current
                      ? "w-5 h-2 bg-amber-400"
                      : "w-2 h-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={next}
              disabled={quotes.length < 2}
              className="w-10 h-10 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* View all link */}
          <div className="text-center mt-8">
            <Link
              href="/quotes"
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              عرض جميع الاقتباسات
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
