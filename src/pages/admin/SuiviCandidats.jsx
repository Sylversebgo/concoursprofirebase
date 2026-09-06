import { useEffect, useState } from 'react';
import { LineChart as ChartIcon } from 'lucide-react';
import * as usersService from '../../services/usersService';
import * as resultsService from '../../services/resultsService';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

export default function SuiviCandidats() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    usersService.getCandidats().then(async (candidats) => {
      const withStats = await Promise.all(candidats.map(async (c) => {
        const results = await resultsService.getByCandidate(c.id);
        const avg = results.length ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length) : null;
        return { ...c, sessionCount: results.length, avgScore: avg };
      }));
      setRows(withStats);
    }).catch(() => setRows([]));
  }, []);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Suivi des candidats</h1>

      {rows === null ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : rows.length === 0 ? (
        <EmptyState icon={ChartIcon} title="Aucun candidat" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-bold uppercase text-gray-400">
              <tr>
                <th className="px-4 py-3">Candidat</th>
                <th className="px-4 py-3">Sessions réalisées</th>
                <th className="px-4 py-3">Score moyen</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-black/5">
                  <td className="px-4 py-3 font-semibold text-ink">{r.firstName} {r.lastName}</td>
                  <td className="px-4 py-3 text-gray-500">{r.sessionCount}</td>
                  <td className="px-4 py-3 font-bold text-brand">{r.avgScore !== null ? `${r.avgScore}%` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
