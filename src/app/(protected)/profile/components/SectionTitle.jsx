export default function SectionTitle({ children }) {
  return (
    <div className="mb-6">
      <h2 className="section-title text-xl font-bold inline-block text-primary">
        {children}
      </h2>
    </div>
  );
}
