import { NAVY, NAVY2 } from "@/lib/constants/colors";

export default function TabBtn({ active, onClick, icon: Icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-300 whitespace-nowrap ${
        active
          ? "text-white shadow-[0_4px_16px_rgba(15,27,60,0.18)] bg-gradient-to-br from-primary to-primary-light"
          : "text-text-muted bg-transparent"
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
