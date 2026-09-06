import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import * as resultsService from '../../services/resultsService';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Card from '../../components/ui/Card';

export default function Progression() {
  const { profile } = useAuth();
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!profile?.id) return;
    resultsService.getByCandidate(profile.id).then(setResults).catch(() => setResults([]));
  }, [profile?.id]);

  if (results === null) return <div className="flex justify-center py-16"><Spinner /></div>;

  if (results.length === 0) {
    return <EmptyState icon={TrendingUp} title="Pas encore de données" description="Réalisez un entraînement pour voir apparaître votre progression ici." />;
  }

  const chartData = [...results].reverse().map((r, i) => ({ session: `#${i + 1}`, score: r.score }));
  const avg = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);
  const best = Math.max(...results.map((r) => r.score));

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Ma progression</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card><p className="text-xs font-bold uppercase text-gray-400">Score moyen</p><p className="mt-2 text-3xl font-bold text-brand">{avg}%</p></Card>
        <Card><p className="text-xs font-bold uppercase text-gray-400">Meilleur score</p><p className="mt-2 text-3xl font-bold text-green-600">{best}%</p></Card>
        <Card><p className="text-xs font-bold uppercase text-gray-400">Sessions</p><p className="mt-2 text-3xl font-bold text-ink">{results.length}</p></Card>
      </div>

      <Card>
        <p className="mb-4 font-bold text-ink">Évolution de vos scores</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" />
            <XAxis dataKey="session" stroke="#9aa5bd" fontSize={12} />
            <YAxis stroke="#9aa5bd" fontSize={12} domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#1f5fe8" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
