import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as resultsService from '../../services/resultsService';
import * as modulesService from '../../services/modulesService';
import * as usersService from '../../services/usersService';
import * as fs from '../../firebase/firestoreService';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

export default function StatistiquesAdmin() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      fs.getAll('results'),
      modulesService.getAll(),
      usersService.getCandidats(),
    ]).then(([results, modules, candidats]) => {
      const byModule = modules.map((m) => {
        const moduleResults = results.filter((r) => r.moduleId === m.id);
        const avg = moduleResults.length
          ? Math.round(moduleResults.reduce((s, r) => s + r.score, 0) / moduleResults.length)
          : 0;
        return { module: m.title, score: avg, sessions: moduleResults.length };
      });
      const globalAvg = results.length
        ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
        : 0;
      setData({ byModule, globalAvg, totalSessions: results.length, totalCandidats: candidats.length });
    }).catch(() => setData({ byModule: [], globalAvg: 0, totalSessions: 0, totalCandidats: 0 }));
  }, []);

  if (!data) return <div className="flex justify-center py-16"><Spinner /></div>;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Statistiques</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card><p className="text-xs font-bold uppercase text-gray-400">Score moyen global</p><p className="mt-2 text-3xl font-bold text-brand">{data.globalAvg}%</p></Card>
        <Card><p className="text-xs font-bold uppercase text-gray-400">Sessions totales</p><p className="mt-2 text-3xl font-bold text-ink">{data.totalSessions}</p></Card>
        <Card><p className="text-xs font-bold uppercase text-gray-400">Candidats actifs</p><p className="mt-2 text-3xl font-bold text-ink">{data.totalCandidats}</p></Card>
      </div>

      <Card>
        <p className="mb-4 font-bold text-ink">Score moyen par module</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.byModule}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" />
            <XAxis dataKey="module" stroke="#9aa5bd" fontSize={12} />
            <YAxis stroke="#9aa5bd" fontSize={12} domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="score" fill="#1f5fe8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
