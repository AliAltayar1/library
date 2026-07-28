// ─── BooksFilterBar ────────────────────────────────────────────────────────────

import {
  ArrowUpNarrowWide,
  Grid3x3,
  List,
  Search,
  SlidersHorizontal,
  User,
} from "lucide-react";
import { motion } from "framer-motion";

/**
 * @param {{
 *   searchTerm: string,
 *   onSearchChange: (v:string) => void,
 *   categories: Array<{id:number, name:string}>,
 *   onCategoryChange: (v:string) => void,
 *   sortBy: string,
 *   onSortChange: (v:string) => void,
 *   displayMethod: "grid"|"list",
 *   onDisplayChange: (v:string) => void,
 *   resultCount: number,
 * }} props
 */
const BooksFilterBar = ({
  searchTerm,
  onSearchChange,
  categories,
  onCategoryChange,
  sortBy,
  onSortChange,
  displayMethod,
  onDisplayChange,
  resultCount,
}) => {
  return (
    <>
      {/* Search & Category */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="glass-card rounded-2xl p-5 mb-8 border border-white/60"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="البحث بالعنوان أو المؤلف..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200 bg-white/80 text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <SlidersHorizontal
              size={16}
              className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
            />
            <select
              onChange={(e) => onCategoryChange(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-gray-600 bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200 text-sm min-w-[160px] appearance-none cursor-pointer"
            >
              <option value="all">جميع الفئات</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Toolbar: count + sort + display toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="flex flex-wrap justify-between items-center gap-4 mb-8"
      >
        {/* Result count */}
        <p className="text-sm text-gray-500">
          عُثر على{" "}
          <span className="font-semibold text-primary">{resultCount}</span>{" "}
          كتاب
          {searchTerm && (
            <span className="text-amber-600"> · نتائج &quot;{searchTerm}&quot;</span>
          )}
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Sort Controls */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <span className="text-xs text-gray-400 px-2">ترتيب:</span>
            {[
              { value: "title", label: "العنوان", icon: ArrowUpNarrowWide },
              { value: "author", label: "المؤلف", icon: User },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => onSortChange(value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  sortBy === value
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Display Toggle */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            {[
              { value: "grid", icon: Grid3x3 },
              { value: "list", icon: List },
            ].map(({ value, icon: Icon }) => (
              <button
                key={value}
                onClick={() => onDisplayChange(value)}
                className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                  displayMethod === value
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Icon size={17} />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default BooksFilterBar;
