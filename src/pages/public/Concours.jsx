import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import * as modulesService from '../../services/modulesService';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

export default function Concours() {
  const [modules, setModules] = useState(null);

  useEffect(() => {
    modulesService.getActive().then(setModules).catch(() => setModules([]));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-10">
      <h1 className="mb-2 font-display text-3xl font-bold text-ink">Formations & modules disponibles</h1>
      <p className="mb-10 text-gray-500">Choisissez le module que vous souhaitez préparer.</p>

      {modules === null ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : modules.length === 0 ? (
        <EmptyState icon={Landmark} title="Aucun module publié pour l'instant" />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {modules.map((m) => (
            <div key={m.id} className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-white">
                <Landmark size={22} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-ink">{m.title}</h3>
              <p className="mb-4 text-sm text-gray-500">{m.description}</p>
              <Link to="/inscription" className="text-sm font-bold text-brand">S'inscrire pour commencer →</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
