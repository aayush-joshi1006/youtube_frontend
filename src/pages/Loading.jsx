export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center gap-4 bg-white/80 backdrop-blur-sm z-50">
      <span className="w-12 h-12 border-4 border-dotted border-t-transparent rounded-full animate-spin"></span>
      <span className="text-xl font-bold text-black animate-pulse">
        Loading...
      </span>
    </div>
  );
}
