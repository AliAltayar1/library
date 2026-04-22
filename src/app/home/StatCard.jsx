/**
 * StatCard — Glassmorphism statistics card
 * @param {{ icon: React.ComponentType, value: string, label: string, color: string, delay: string }} props
 */
export default function StatCard({ icon: Icon, value, label, color, delay }) {
  return (
    <div
      className={`glass-card animate-scalePop ${delay} rounded-2xl p-6 flex flex-col items-center gap-3 text-center flex-1 min-w-[140px] group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
        style={{ background: color + "18" }}
      >
        <Icon className="w-7 h-7" style={{ color }} />
      </div>
      <p className="text-3xl font-bold text-primary">{value}</p>
      <p className="text-sm font-medium text-text-muted">{label}</p>
    </div>
  );
}
