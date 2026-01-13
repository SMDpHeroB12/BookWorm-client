export default function Input({ className = "", ...props }) {
  return (
    <input
      className={
        "w-full rounded-xl border border-amber-200 bg-white/90 px-3 py-2 text-sm " +
        "focus:outline-none focus:ring-2 focus:ring-amber-300 " +
        className
      }
      {...props}
    />
  );
}
