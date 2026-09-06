import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDocs, collection, query, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';

const FREE_TRIAL_KEY = 'concourspro_free_trial_result';

export default function TesterGratuitement() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const q = query(collection(db, 'questions'), limit(5));
    getDocs(q).then((snap) => {
      setQuestions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }).catch(() => setQuestions([]));
  }, []);

  function selectAnswer(optionId) {
    setAnswers((a) => ({ ...a, [questions[current].id]: optionId }));
  }

  function next() {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      const correct = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
      sessionStorage.setItem(FREE_TRIAL_KEY, JSON.stringify({
        total: questions.length,
        correct,
        percentage: Math.round((correct / questions.length) * 100),
      }));
      navigate('/resultat-essai-gratuit');
    }
  }

  if (questions === null) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Spinner /></div>;
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="text-gray-500">Aucune question disponible pour l'essai gratuit pour l'instant.</p>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 md:px-10">
      <p className="mb-2 text-sm font-semibold text-brand">Question {current + 1} / {questions.length}</p>
      <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
        <div className="h-2 rounded-full bg-brand transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>

      <h1 className="mb-6 text-xl font-bold text-ink">{q.statement}</h1>

      <div className="flex flex-col gap-3">
        {(q.options || []).map((opt) => (
          <button
            key={opt.id}
            onClick={() => selectAnswer(opt.id)}
            className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition ${
              answers[q.id] === opt.id ? 'border-brand bg-blue-50 text-brand' : 'border-black/10 text-ink hover:border-brand/40'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <Button onClick={next} disabled={!answers[q.id]} className="mt-8 w-full">
        {current < questions.length - 1 ? 'Question suivante' : 'Voir mon résultat'}
      </Button>
    </div>
  );
}
