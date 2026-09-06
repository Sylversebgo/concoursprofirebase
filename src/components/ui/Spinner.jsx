export default function Spinner({ className = 'h-6 w-6' }) {
  return <div className={`animate-spin rounded-full border-4 border-brand border-t-transparent ${className}`} />;
}
