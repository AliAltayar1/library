import Link from "next/link";
import { BookOpen, Sparkles, ChevronLeft } from "lucide-react";

export default function CTASection() {
  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0F1B3C 0%, #1a2f5e 50%, #0c1628 100%)",
      }}
    >
      {/* Background decorative blobs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 80% 50%, rgba(212,147,10,0.12) 0%, transparent 70%), " +
            "radial-gradient(ellipse 35% 30% at 15% 55%, rgba(79,172,254,0.08) 0%, transparent 65%)",
        }}
      />

      <div className="container relative z-10 text-center flex flex-col items-center gap-7">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-accent-light bg-accent/15 border border-accent/30">
          <Sparkles className="w-3.5 h-3.5" />
          ابدأ رحلتك الآن
        </span>

        {/* Headline */}
        <h2 className="animate-fadeSlideUp text-3xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
          هل أنت مستعد لبدء{" "}
          <span className="gradient-text">رحلتك في القراءة؟</span>
        </h2>

        {/* Supporting text */}
        <p className="animate-fadeSlideUp delay-100 text-base sm:text-lg max-w-lg leading-relaxed text-white/[65%]">
          انضم إلى آلاف القراء الذين اكتشفوا كتابهم المفضل من خلال منصتنا
          الرقمية.
        </p>

        {/* CTA buttons */}
        <div className="animate-fadeSlideUp delay-200 flex gap-4 flex-wrap justify-center py-10">
          <Link href="/books">
            <button className="animate-glowPulse flex items-center gap-2 px-9 py-3.5 rounded-xl font-bold text-base cursor-pointer transition-all duration-300 hover:scale-105 bg-gradient-to-br from-accent to-accent-light text-primary hover:brightness-110">
              <BookOpen className="w-4 h-4" />
              ابدأ اليوم
            </button>
          </Link>
          <Link href="/register">
            <button className="flex items-center gap-2 px-9 py-3.5 rounded-xl font-bold text-base cursor-pointer transition-all duration-300 text-white hover:bg-white hover:text-slate-900 border-2 border-white/25 bg-transparent">
              إنشاء حساب مجاني
              <ChevronLeft className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
