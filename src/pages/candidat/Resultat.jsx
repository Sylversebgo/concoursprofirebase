import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, CheckCircle2, XCircle } from 'lucide-react';
import { getSession, clearSession } from '../../lib/quizSession';
import Button from '../../components/ui/Button';

export default function Resultat() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const s = getSession();
    if (!s || s.score === undefined) {
      navigate('/mes-modules');
      return;
    }
    setSession(s);
  }, [navigate]);

  if (!session) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-ink to-brand-deep p-8 text-center text-white">
        <Trophy className="mx-auto mb-3" size={32} />
        <p className="text-5xl font-bold">{session.mode === 'evaluation' ? `${session.score}/20` : `${session.score}%`}</p>
        <p className="mt-2 text-white/70">
          {session.correctCount} bonnes réponses sur {session.questions.length}
        </p>
      </div>

      <h2 className="mb-4 font-bold text-ink">Détail des réponses</h2>
      <div className="flex flex-col gap-2">
        {session.questions.map((q, i) => {
          const isCorrect = session.answers[q.id] === q.correctAnswer;
          return (
            <Link
              key={q.id}
              to={`/correction-question?id=${q.id}`}
              className="flex items-center justify-between rounded-xl border border-black/5 bg-white px-4 py-3 text-sm hover:border-brand/30"
            >
              <span className="line-clamp-1 font-semibold text-ink">{i + 1}. {q.statement}</span>
              {isCorrect ? <CheckCircle2 className="text-green-500 shrink-0" size={18} /> : <XCircle className="text-red-500 shrink-0" size={18} />}
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Button variant="secondary" onClick={() => { clearSession(); navigate('/mes-modules'); }}>
          Retour aux modules
        </Button>
      </div>
    </div>
  );
}
