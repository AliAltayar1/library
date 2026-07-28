"use client";

import { useEffect, useState } from "react";
import { Quote, Plus } from "lucide-react";
import { toast } from "sonner";

import { getQuotes } from "../../../lib/quotes/getQuotes";
import { likeQuote, unlikeQuote } from "../../../lib/quotes/likeQuote";
import { useAuth } from "../components/AuthContext";
import LoadingSpinner from "../UI/LoadingSpinner";
import { NAVY, NAVY2 } from "@/lib/constants/colors";

import QuotesHero from "./_components/QuotesHero";
import QuotesSearchBar from "./_components/QuotesSearchBar";
import QuoteCard from "./_components/QuoteCard";
import CreateQuoteModal from "./_components/createQuoteModal";

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function QuotesPage() {
  const { user } = useAuth();

  // ── State ───────────────────────────────────────────────────────────────────
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchName, setSearchName] = useState("");

  // ── API ─────────────────────────────────────────────────────────────────────
  const fetchQuotes = async (name = "") => {
    setLoading(true);
    try {
      const data = await getQuotes(name ? { name } : {});
      setQuotes(data);
    } catch (err) {
      toast.error("فشل تحميل الاقتباسات: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSearch = (e) => {
    e?.preventDefault();
    fetchQuotes(searchName.trim());
  };

  const handleClearSearch = () => {
    setSearchName("");
    fetchQuotes();
  };

  const handleLikeToggle = async (quote) => {
    console.log(quote);
    if (!user?.isValid) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }
    setLoadingId(quote.id);
    try {
      if (quote.is_liked) {
        await unlikeQuote(quote.id);

        setQuotes((prev) =>
          prev.map((q) =>
            q.id === quote.id
              ? {
                  ...q,
                  is_liked: false,
                  likes_count: Math.max(0, (q.likes_count ?? 1) - 1),
                }
              : q,
          ),
        );
      } else {
        await likeQuote(quote.id);
        setQuotes((prev) =>
          prev.map((q) =>
            q.id === quote.id
              ? { ...q, is_liked: true, likes_count: (q.likes_count ?? 0) + 1 }
              : q,
          ),
        );
      }
    } catch (err) {
      toast.error("حدث خطأ: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div dir="rtl" className="bg-background min-h-screen">
      {/* Hero */}
      <QuotesHero user={user} onAddClick={() => setShowModal(true)} />

      <div className="container py-10 pb-20">
        {/* Search */}
        <QuotesSearchBar
          searchName={searchName}
          onSearchChange={setSearchName}
          onSearchSubmit={handleSearch}
          onClearSearch={handleClearSearch}
          user={user}
          onAddClick={() => setShowModal(true)}
        />

        {/* Stats row */}
        {!loading && quotes.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-gray-400">
              {quotes.length} اقتباس
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-24">
            <LoadingSpinner />
          </div>
        )}

        {/* Empty state */}
        {!loading && quotes.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <Quote className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="font-semibold text-lg">لا توجد اقتباسات حتى الآن</p>
            <p className="text-sm mt-2">
              {user?.isValid
                ? "كن أول من يضيف اقتباساً!"
                : "سجّل الدخول وأضف اقتباسك الأول"}
            </p>
            {user?.isValid && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white cursor-pointer transition-all duration-200 hover:opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
                }}
              >
                <Plus className="w-4 h-4" />
                أضف أول اقتباس
              </button>
            )}
          </div>
        )}

        {/* Quotes grid */}
        {!loading && quotes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quotes.map((quote) => {
              return (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  onLikeToggle={handleLikeToggle}
                  loadingId={loadingId}
                  user={user}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Create quote modal */}
      {showModal && (
        <CreateQuoteModal
          onClose={() => setShowModal(false)}
          onCreated={() => fetchQuotes()}
        />
      )}
    </div>
  );
}
