"use client";

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />

        {/* Text */}
        <p className="text-sm text-gray-600">جارٍ التحقق من الجلسة...</p>
      </div>
    </div>
  );
}
