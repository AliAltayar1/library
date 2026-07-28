// ─── QuotesSearchBar ───────────────────────────────────────────────────────────

import { Feather, Search, X } from "lucide-react";

/**
 * @param {{
 *   searchName: string,
 *   onSearchChange: (v:string) => void,
 *   onSearchSubmit: (e:Event) => void,
 *   onClearSearch: () => void,
 *   user: object,
 *   onAddClick: () => void,
 * }} props
 */
export default function QuotesSearchBar({
  searchName,
  onSearchChange,
  onSearchSubmit,
  onClearSearch,
  user,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      {/* Search form */}
      <form
        onSubmit={onSearchSubmit}
        className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm
          focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all duration-200"
      >
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={searchName}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث باسم المستخدم..."
          className="flex-1 bg-transparent text-sm outline-none text-right placeholder:text-gray-400"
          style={{ direction: "rtl" }}
        />
        {searchName && (
          <button
            type="button"
            onClick={onClearSearch}
            className="text-gray-300 hover:text-gray-500 cursor-pointer transition-colors duration-150"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Login hint OR mobile add button */}
      {!user?.isValid && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-semibold">
          <Feather className="w-3.5 h-3.5" />
          سجّل الدخول لإضافة اقتباس
        </div>
      )}
    </div>
  );
}
