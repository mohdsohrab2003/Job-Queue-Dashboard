function Badge({ children, variant = "default" }) {
  const variants = {
    pending: "bg-amber-100 text-amber-700",
    running: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    default: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full
        px-2.5 py-1 text-xs font-semibold
        ${variants[variant] || variants.default}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;
