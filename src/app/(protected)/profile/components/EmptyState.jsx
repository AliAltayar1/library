import Link from "next/link";
import { GOLD, GOLD2 } from "@/lib/constants/colors";

export default function EmptyState({ icon: Icon, text, cta, ctaHref }) {
  return (
    <div className="flex flex-col items-center gap-5 py-14">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary/[7%]">
        <Icon className="w-8 h-8 text-primary opacity-40" />
      </div>
      <p className="text-sm text-text-muted">{text}</p>
      {cta && (
        <Link href={ctaHref}>
          <button
            className="px-6 py-2 rounded-xl font-bold text-sm text-primary cursor-pointer transition-all duration-300 hover:scale-105 bg-gradient-to-br from-accent to-accent-light"
          >
            {cta}
          </button>
        </Link>
      )}
    </div>
  );
}
