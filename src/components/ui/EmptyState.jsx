export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-gray-400">
      {Icon && <Icon size={38} strokeWidth={1.5} />}
      <p className="font-bold text-gray-500">{title}</p>
      {description && <p className="max-w-sm text-sm">{description}</p>}
    </div>
  );
}
