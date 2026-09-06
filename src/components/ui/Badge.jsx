export default function Badge({ tone = 'blue', children }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    gold: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
    gray: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${tones[tone]}`}>
      {children}
    </span>
  );
}
