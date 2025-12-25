export default function LoadingSpinner({ size = 30, color = "text-blue-600" }) {
  return (
    <div className="flex items-center justify-center m-auto">
      <div
        className={`animate-spin rounded-full border-4  border-t-transparent border-primary  `}
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
}
