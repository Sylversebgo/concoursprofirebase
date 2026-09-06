import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

export default function AccesRefuse() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4 px-5 text-center">
      <ShieldOff size={44} className="text-red-500" />
      <h1 className="font-display text-2xl font-bold text-ink">Accès refusé</h1>
      <p className="max-w-sm text-gray-500">Vous n'avez pas les droits nécessaires pour accéder à cette page.</p>
      <Link to="/" className="rounded-xl bg-gradient-to-br from-blue-600 to-brand-deep px-6 py-3 font-bold text-white">
        Retour à l'accueil
      </Link>
    </div>
  );
}
