import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Clock } from 'lucide-react';
import * as examsService from '../../services/examsService';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';

export default function ExamensCandidat() {
  const [exams, setExams] = useState(null);

  useEffect(() => {
    const unsub = examsService.subscribePublished(setExams);
    return unsub;
  }, []);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Examens blancs</h1>

      {exams === null ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : exams.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Aucun examen publié pour l'instant" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {exams.map((exam) => (
            <div key={exam.id} className={`rounded-2xl border border-black/5 p-6 shadow-sm ${exam.status === 'CLOSED' ? 'bg-gray-100 opacity-60' : 'bg-white'}`}>
              <Badge tone="blue">{exam.durationMinutes} min</Badge>
              {exam.status === 'CLOSED' && <Badge tone="gray">Examen fermé</Badge>}
              <h3 className="mt-3 mb-1 font-bold text-ink">{exam.title}</h3>
              <p className="mb-4 text-sm text-gray-500">{exam.description}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={13} /> {(exam.questionIds || []).length} questions
                </span>
                {exam.status === 'CLOSED' ? (
                  <span className="text-sm font-bold text-gray-500">Accès fermé</span>
                ) : (
                  <Link to={`/passer-examen/${exam.id}`} className="text-sm font-bold text-brand">Commencer →</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
