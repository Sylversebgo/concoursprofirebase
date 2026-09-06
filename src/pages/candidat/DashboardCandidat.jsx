import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ClipboardList, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import * as resultsService from '../../services/resultsService';
import * as examsService from '../../services/examsService';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

export default function DashboardCandidat() {
  const { profile } = useAuth();
  const [results, setResults] = useState(null);
  const [exams, setExams] = useState(null);

  useEffect(() => {
    if (!profile?.id) return;
    resultsService.getByCandidate(profile.id).then(setResults).catch(() => setResults([]));
    examsService.getPublished().then(setExams).catch(() => setExams([]));
  }, [profile?.id]);

  const avgScore = results?.length
    ? Math.round(results.reduce((s, r) => s + (r.score || 0), 0) / results.length)
    : 0;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">
        Bonjour {profile?.firstName} 👋
      </h1>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs font-bold uppercase text-gray-400">Score moyen</p>
          <p className="mt-2 text-3xl font-bold text-brand">{avgScore}%</p>
        </Card>
        <Card>
          <p className="text-xs font-bold uppercase text-gray-400">Sessions réalisées</p>
          <p className="mt-2 text-3xl font-bold text-ink">{results?.length ?? '—'}</p>
        </Card>
        <Card>
          <p className="text-xs font-bold uppercase text-gray-400">Examens disponibles</p>
          <p className="mt-2 text-3xl font-bold text-ink">{exams?.length ?? '—'}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link to="/mes-modules" className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1">
          <BookOpen className="mb-3 text-brand" size={24} />
          <p className="font-bold text-ink">Mes modules</p>
          <p className="text-sm text-gray-500">Continuer votre préparation</p>
        </Link>
        <Link to="/examens" className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1">
          <ClipboardList className="mb-3 text-brand" size={24} />
          <p className="font-bold text-ink">Examens</p>
          <p className="text-sm text-gray-500">Passer un examen blanc</p>
        </Link>
        <Link to="/progression" className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1">
          <TrendingUp className="mb-3 text-brand" size={24} />
          <p className="font-bold text-ink">Progression</p>
          <p className="text-sm text-gray-500">Voir vos statistiques détaillées</p>
        </Link>
      </div>

      {results === null ? (
        <div className="mt-10 flex justify-center"><Spinner /></div>
      ) : null}
    </div>
  );
}
