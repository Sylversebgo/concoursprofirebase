import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import * as modulesService from '../../services/modulesService';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

export default function MesModules() {
  const [modules, setModules] = useState(null);

  useEffect(() => {
    const unsub = modulesService.subscribeActive(setModules);
    return unsub;
  }, []);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Mes modules</h1>

      {modules === null ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : modules.length === 0 ? (
        <EmptyState icon={BookOpen} title="Aucun module disponible pour le moment" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {modules.map((m) => (
            <Link
              key={m.id}
              to={`/module-detail?id=${m.id}`}
              className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-brand">
                <BookOpen size={20} />
              </div>
              <p className="font-bold text-ink">{m.title}</p>
              <p className="mt-1 text-sm text-gray-500">{m.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
