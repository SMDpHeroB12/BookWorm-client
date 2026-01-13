export default function Card({ className = "", children }) {
  return (
    <div
      className={
        "rounded-sm border border-amber-200/70 bg-white/80 shadow-sm " +
        "hover:shadow-md transition-shadow " +
        className
      }
    >
      {children}
    </div>
  );
}
