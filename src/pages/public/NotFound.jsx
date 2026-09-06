import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="font-display text-6xl font-bold text-brand">404</p>
      <h1 className="text-xl font-bold text-ink">Page introuvable</h1>
      <Link to="/" className="rounded-xl bg-gradient-to-br from-blue-600 to-brand-deep px-6 py-3 font-bold text-white">
        Retour à l'accueil
      </Link>
    </div>
  );
}
