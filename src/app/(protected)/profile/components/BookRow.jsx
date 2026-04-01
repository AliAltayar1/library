import Image from "next/image";

export default function BookRow({
  book,
  image,
  status,
  statusClass,
  actions,
  extra,
}) {
  return (
    <div className="flex flex-col gap-0 mb-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200 bg-white overflow-hidden">
      <div className="flex flex-row items-center gap-4 p-4">
        {/* Thumbnail */}
        <div className="relative flex-shrink-0 w-14 h-20 rounded-lg overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={book.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm leading-snug line-clamp-2 text-primary">
            {book.title}
          </p>
          <p className="text-xs italic mt-0.5 text-text-muted">
            {book.author?.name || "غير معروف"}
          </p>
          {status && (
            <span
              className={`inline-flex items-center gap-1 mt-1.5 text-xs font-bold px-2 py-0.5 rounded-full text-white ${statusClass}`}
            >
              {status}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 flex-shrink-0">{actions}</div>
      </div>

      {/* Extra slot (e.g. DueDateBar) */}
      {extra && <div className="px-4 pb-4">{extra}</div>}
    </div>
  );
}
