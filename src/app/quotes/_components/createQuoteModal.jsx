"use client";

import { useEffect, useState, useRef } from "react";
import { X, Send, Feather } from "lucide-react";
import { createQuote } from "../../../../lib/quotes/createQuote";
import { toast } from "sonner";
import { NAVY, NAVY2 } from "@/lib/constants/colors";

export default function CreateQuoteModal({ onClose, onCreated }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    textRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await createQuote(content.trim());
      toast.success("تم إرسال الاقتباس للمراجعة ✨");
      onCreated();
      onClose();
    } catch (err) {
      toast.error("حدث خطأ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,27,60,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-scalePop">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
          style={{
            background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
          }}
        >
          <div className="flex items-center gap-2">
            <Feather className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-white text-base">
              أضف اقتباساً جديداً
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/15 transition-all duration-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              نص الاقتباس
            </label>
            <textarea
              ref={textRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              maxLength={500}
              placeholder="اكتب اقتباسك هنا..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm leading-relaxed text-right resize-none
                focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200"
            />
            <p className="text-xs text-gray-400 mt-1 text-left">
              {content.length}/500
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 leading-relaxed">
            <strong>ملاحظة:</strong> سيتم إرسال اقتباسك للمراجعة من قِبل الإدارة
            قبل نشره.
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white
                transition-all duration-200 cursor-pointer hover:opacity-90 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
              }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {loading ? "جارٍ الإرسال..." : "إرسال للمراجعة"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
