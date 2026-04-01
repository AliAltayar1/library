export default function ProfileStatCard({ icon: Icon, value, label, bgClass, iconClass }) {
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col items-center gap-2 text-center flex-1 min-w-[130px] group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${bgClass}`}
      >
        <Icon className={`w-6 h-6 ${iconClass}`} />
      </div>
      <p className="text-2xl font-bold text-primary">{value ?? "—"}</p>
      <p className="text-xs font-medium text-text-muted">{label}</p>
    </div>
  );
}
