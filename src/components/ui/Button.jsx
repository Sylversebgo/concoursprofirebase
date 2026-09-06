export default function Button({ variant = 'primary', className = '', children, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gradient-to-br from-blue-600 to-brand-deep text-white shadow-lg shadow-brand/20 hover:-translate-y-0.5',
    secondary: 'bg-white text-brand border border-brand/40 hover:bg-brand/5',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-ink hover:bg-black/5',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
