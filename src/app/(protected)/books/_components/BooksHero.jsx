// ─── BooksHero ─────────────────────────────────────────────────────────────────

import { BookOpen, Heart, Library, Search } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp } from "@/app/lib/motionVariants";

/**
 * @param {{ totalBooks: number, filteredCount: number, favCount: number }} props
 */
const BooksHero = ({ totalBooks, filteredCount, favCount }) => {
  const stats = [
    { icon: BookOpen, label: "إجمالي الكتب", value: totalBooks },
    { icon: Search, label: "نتائج البحث", value: filteredCount },
    { icon: Heart, label: "المفضلة", value: favCount },
  ];

  return (
    <div
      className="relative overflow-hidden mb-10"
      style={{
        background:
          "linear-gradient(135deg, #0F1B3C 0%, #1a2f5e 60%, #0f2251 100%)",
      }}
    >
      {/* Decorative orbs */}
      <div
        className="absolute -top-16 -left-16 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #D4930A, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-20 -right-10 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #f6c54e, transparent 70%)" }}
      />

      <div className="container py-14 relative z-10">
        {/* Badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6"
        >
          <Library size={15} className="text-amber-400" />
          <span className="text-amber-300 text-sm font-medium">خير جليس</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          custom={0.1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
        >
          تصفح <span className="gradient-text">الكتب</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          custom={0.2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-white/70 text-lg max-w-lg"
        >
          اكتشف قراءتك الرائعة التالية من مجموعتنا الواسعة من آلاف الكتب في
          شتى المجالات.
        </motion.p>

        {/* Stats */}
        <motion.div
          custom={0.3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-8 flex flex-wrap gap-6"
        >
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-2.5"
            >
              <Icon size={18} className="text-amber-400" />
              <div>
                <p className="text-white/60 text-xs">{label}</p>
                <p className="text-white font-bold text-lg leading-none">{value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BooksHero;
