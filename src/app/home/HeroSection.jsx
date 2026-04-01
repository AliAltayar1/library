"use client";

import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  TrendingUp,
  Star,
  ChevronLeft,
} from "lucide-react";

/* ── Decorative particles data ── */
const PARTICLES = [
  {
    w: 10,
    h: 10,
    top: "12%",
    right: "18%",
    color: "#D4930A",
    dur: "6s",
    delay: "0s",
  },
  {
    w: 6,
    h: 6,
    top: "65%",
    right: "8%",
    color: "#f6c54e",
    dur: "8s",
    delay: "1s",
  },
  {
    w: 14,
    h: 14,
    top: "30%",
    left: "12%",
    color: "#4facfe",
    dur: "7s",
    delay: "2s",
  },
  {
    w: 8,
    h: 8,
    top: "75%",
    left: "25%",
    color: "#a18cd1",
    dur: "5s",
    delay: "0.5s",
  },
  {
    w: 5,
    h: 5,
    top: "20%",
    left: "40%",
    color: "#43e97b",
    dur: "9s",
    delay: "3s",
  },
];

/* ── Stacked back-book layers ── */
const BOOK_LAYERS = [
  { rotate: "-12deg", translate: "8px, 20px", bg: "#1e3a7a", zIndex: 1 },
  { rotate: "6deg", translate: "-6px, 12px", bg: "#2a4a8e", zIndex: 2 },
];

/**
 * HeroSection — Full-viewport dark navy hero with text column + floating book visual
 */
export default function HeroSection() {
  return (
    <section
      className="relative min-h-[88vh] flex items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0F1B3C 0%, #1a2f5e 50%, #0c1628 100%)",
      }}
    >
      {/* Decorative floating particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="particle opacity-[0.55]"
          style={{
            width: p.w,
            height: p.h,
            top: p.top,
            right: p.right,
            left: p.left,
            background: p.color,
            animationDuration: p.dur,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* Radial glow blobs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 70% 50%, rgba(212,147,10,0.08) 0%, transparent 70%), " +
            "radial-gradient(ellipse 40% 35% at 20% 60%, rgba(79,172,254,0.07) 0%, transparent 65%)",
        }}
      />

      {/* ── Main content row ── */}
      <div className="container relative z-10 py-24 w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
        {/* ── Text column ── */}
        <div className="flex-1 flex flex-col gap-6 text-center lg:text-right">
          {/* Badge */}
          <div className="animate-fadeIn flex justify-center lg:justify-end">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-accent-light bg-accent/15 border border-accent/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              مكتبتك الرقمية الجديدة
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-fadeSlideUp delay-100 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
            اكتشف عوالم <span className="gradient-text">لا نهاية لها</span>
            <br />
            من المعرفة
          </h1>

          {/* Sub-headline */}
          <p className="animate-fadeSlideUp delay-200 text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 text-white/70">
            آلاف الكتب في متناول يديك — تصفح، اقرأ، وأدر رحلتك في القراءة بكل
            سهولة ومتعة.
          </p>

          {/* CTA buttons */}
          <div className="animate-fadeSlideUp delay-300 flex gap-3 flex-wrap justify-center lg:justify-end">
            <Link href="/books">
              <button className="animate-glowPulse flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-base cursor-pointer transition-all duration-300 hover:scale-105 bg-gradient-to-br from-accent to-accent-light text-primary hover:brightness-110">
                <BookOpen className="w-4 h-4" />
                تصفح الكتب
              </button>
            </Link>
            <Link href="/register">
              <button className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-base cursor-pointer transition-all duration-300 text-white hover:bg-white hover:text-slate-900 border-2 border-white/30 bg-transparent">
                انضم اليوم
                <ChevronLeft className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="animate-fadeSlideUp delay-400 flex gap-6 flex-wrap justify-center lg:justify-end mt-2 text-[0.8rem] text-white/50">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              آلاف القراء النشطين
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              تقييم 4.8 من أصل 5
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              مئات الكتب المتاحة
            </span>
          </div>
        </div>

        {/* ── Floating book stack visual ── */}
        <div className="flex-1 flex justify-center lg:justify-start">
          <div className="animate-floatY relative w-64 h-72 sm:w-80 sm:h-96">
            {/* Back book layers */}
            {BOOK_LAYERS.map((b, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                style={{
                  background: `linear-gradient(135deg, ${b.bg}, #0f2050)`,
                  transform: `rotate(${b.rotate}) translate(${b.translate})`,
                  zIndex: b.zIndex,
                }}
              />
            ))}

            {/* Front book face */}
            <div
              className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-4 z-10 shadow-[0_30px_80px_rgba(212,147,10,0.35)]"
              style={{
                background: "linear-gradient(135deg, #D4930A 0%, #f6c54e 85%)",
              }}
            >
              <BookOpen className="w-20 h-20 sm:w-24 sm:h-24 opacity-[0.85] text-primary" />
              <div className="text-center px-6">
                <p className="font-bold text-xl sm:text-2xl text-primary">
                  مكتبتك
                </p>
                <p className="font-medium text-sm text-primary/70">الرقمية</p>
              </div>
              {/* Decorative lines */}
              <div className="flex flex-col gap-1.5 w-24 opacity-30">
                {[1, 2, 3].map((l) => (
                  <div key={l} className="h-0.5 rounded bg-slate-800" />
                ))}
              </div>
            </div>

            {/* Floating sparkle badge */}
            <div
              className="animate-floatY absolute -top-4 -left-4 w-8 h-8 rounded-full flex items-center justify-center z-20 bg-accent-light/20"
              style={{
                animationDelay: "1.2s",
              }}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom diagonal clip */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full block h-[80px]"
        >
          <path d="M0,80 L1440,0 L1440,80 Z" className="fill-background" />
        </svg>
      </div>
    </section>
  );
}
