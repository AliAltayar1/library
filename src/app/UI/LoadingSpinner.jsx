export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center m-auto">
      <div
        className={`animate-spin rounded-full border-4 w-[30px] h-[30px] border-t-transparent border-primary`}
      ></div>
    </div>
  );
}
