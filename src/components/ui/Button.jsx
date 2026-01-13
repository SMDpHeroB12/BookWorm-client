export default function Button({ className = "", ...props }) {
  return (
    <button
      className={
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm " +
        "bg-amber-700 text-white hover:bg-amber-800 active:scale-[0.99] transition " +
        className
      }
      {...props}
    />
  );
}
