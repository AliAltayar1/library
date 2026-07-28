// ─── QuotesHero ────────────────────────────────────────────────────────────────

import { Quote, Plus } from "lucide-react";
import { NAVY, NAVY2 } from "@/lib/constants/colors";

/**
 * @param {{ user: object, onAddClick: ()=>void }} props
 */
export default function QuotesHero({ user, onAddClick }) {
  return (
    <section
      className="relative overflow-hidden py-16"
      style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 60%, #0c1628 100%)`,
      }}
    >
      {/* Glow orbs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 10% 50%, rgba(212,147,10,0.10) 0%, transparent 70%), " +
            "radial-gradient(ellipse 40% 50% at 85% 40%, rgba(79,172,254,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="container relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 bg-accent/15">
          <Quote className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          اقتباسات المكتبة
        </h1>
        <p className="text-base text-text-muted max-w-md mx-auto">
          اقتباسات أدبية مختارة من أعضاء مجتمع القراء
        </p>

        {user?.isValid && (
          <button
            onClick={onAddClick}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm
              bg-accent text-primary hover:bg-accent-light transition-all duration-200 cursor-pointer
              shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            أضف اقتباسك
          </button>
        )}
      </div>

      {/* Diagonal clip */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 50"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full block h-[50px]"
        >
          <path d="M0,50 L1440,0 L1440,50 Z" fill="#FAF8F5" />
        </svg>
      </div>
    </section>
  );
}
