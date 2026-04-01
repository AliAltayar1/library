import { AlertTriangle, Clock } from "lucide-react";

export default function DueDateBar({ borrowDate, dueDate }) {
  if (!borrowDate || !dueDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(borrowDate);
  const end = new Date(dueDate);
  const totalDays = Math.max(1, Math.round((end - start) / 86400000));
  const elapsed = Math.round((today - start) / 86400000);
  const pct = Math.min(Math.round((elapsed / totalDays) * 100), 100);
  const isOverdue = today > end;
  const daysLeft = Math.round((end - today) / 86400000);
  const overdueDays = isOverdue ? Math.abs(daysLeft) : 0;

  /* Tailwind dynamic class maps */
  const barTextColor = isOverdue ? "text-rose-600" : pct >= 75 ? "text-amber-500" : "text-emerald-600";
  const shadowColor = isOverdue ? "shadow-rose-500/50" : pct >= 75 ? "shadow-amber-500/50" : "shadow-emerald-500/50";
  const barGradient = isOverdue ? "bg-gradient-to-r from-rose-600 to-rose-400" : pct >= 75 ? "bg-gradient-to-r from-amber-500 to-amber-400" : "bg-gradient-to-r from-emerald-600 to-emerald-400";

  const bgColor = isOverdue
    ? "bg-rose-50"
    : pct >= 75
      ? "bg-amber-50"
      : "bg-emerald-50";

  const borderColor = isOverdue
    ? "border-rose-200"
    : pct >= 75
      ? "border-amber-200"
      : "border-emerald-200";

  return (
    <div
      className={`mt-3 rounded-xl p-3 border-2 ${bgColor} ${borderColor}`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          {isOverdue ? (
            <AlertTriangle
              className={`w-3.5 h-3.5 animate-pulse ${barTextColor}`}
            />
          ) : (
            <Clock className={`w-3.5 h-3.5 ${barTextColor}`} />
          )}
          <span className={`text-xs font-bold ${barTextColor}`}>
            {isOverdue
              ? `متأخر ${overdueDays} يوم!`
              : daysLeft === 0
                ? "ينتهي اليوم!"
                : `متبقي ${daysLeft} يوم`}
          </span>
        </div>
        <span className={`text-xs font-semibold ${barTextColor}`}>
          {pct}%
        </span>
      </div>

      <div className="w-full h-2.5 rounded-full overflow-hidden bg-black/5">
        <div
          className={`h-2.5 rounded-full transition-all duration-700 shadow-sm ${barGradient} ${shadowColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Date row */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-text-muted">
          استُعير: {borrowDate}
        </span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${bgColor} ${barTextColor} border border-black/5`}
        >
          الإرجاع: {dueDate}
        </span>
      </div>
    </div>
  );
}
