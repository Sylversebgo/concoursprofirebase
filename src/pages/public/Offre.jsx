import { Link, useParams } from 'react-router-dom';

export default function Offre() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 text-center md:px-10">
      <h1 className="mb-4 font-display text-3xl font-bold text-ink">Détail de l'offre</h1>
      <p className="mb-8 text-gray-500">
        Retrouvez le détail complet de nos formules sur la page tarifs, et créez votre
        compte gratuitement pour commencer dès maintenant.
      </p>
      <div className="flex justify-center gap-3">
        <Link to="/tarifs" className="rounded-xl border border-brand/40 px-6 py-3 font-bold text-brand">Voir les tarifs</Link>
        <Link to="/inscription" className="rounded-xl bg-gradient-to-br from-blue-600 to-brand-deep px-6 py-3 font-bold text-white">S'inscrire</Link>
      </div>
    </div>
  );
}
