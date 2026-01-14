export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-600">
      <span className="inline-block h-5 w-5 rounded-full border-2 border-amber-200 border-t-amber-700 animate-spin" />
      <span>{label}</span>
    </div>
  );
}
