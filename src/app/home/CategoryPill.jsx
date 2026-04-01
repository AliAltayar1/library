import Link from "next/link";
import { BookOpen } from "lucide-react";

const CATEGORY_GRADIENTS = [
  "linear-gradient(135deg,#667eea,#764ba2)",
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#4facfe,#00f2fe)",
  "linear-gradient(135deg,#43e97b,#38f9d7)",
  "linear-gradient(135deg,#fa709a,#fee140)",
  "linear-gradient(135deg,#a18cd1,#fbc2eb)",
  "linear-gradient(135deg,#fccb90,#d57eeb)",
  "linear-gradient(135deg,#a1c4fd,#c2e9fb)",
];

/**
 * CategoryPill — Gradient pill link for a book category
 */
export default function CategoryPill({ category, index }) {
  const gradient = CATEGORY_GRADIENTS[index % CATEGORY_GRADIENTS.length];

  return (
    <Link
      href={{ pathname: "/books", query: { category: category.name } }}
      className="category-pill flex-shrink-0 rounded-2xl px-6 py-4 flex flex-col items-center gap-2 min-w-[140px] text-white cursor-pointer"
      style={{ background: gradient }}
    >
      <BookOpen className="w-6 h-6 opacity-90" />
      <span className="font-semibold text-sm text-center leading-tight whitespace-nowrap">
        {category.name}
      </span>
    </Link>
  );
}
