import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import * as examsService from '../../services/examsService';
import * as questionsService from '../../services/questionsService';
import * as submissionsService from '../../services/submissionsService';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';

export default function PasserExamen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const startedAtRef = useRef(null);

  useEffect(() => {
    examsService.getById(id).then(async (e) => {
      setExam(e);
      setSecondsLeft((e.durationMinutes || 60) * 60);
      const all = await Promise.all((e.questionIds || []).map((qId) => questionsService.getById(qId)));
      setQuestions(all.filter(Boolean));
    });
  }, [id]);

  useEffect(() => {
    if (!started) return undefined;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  function handleStart() {
    startedAtRef.current = Date.now();
    setStarted(true);
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    const correctCount = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
    const percentage = Math.round((correctCount / questions.length) * 100);

    await submissionsService.create({
      examId: id,
      candidateId: profile.id,
      questionIds: questions.map((q) => q.id),
      answers,
      startedAt: startedAtRef.current,
      timeSpentSeconds: Math.round((Date.now() - startedAtRef.current) / 1000),
      score: correctCount,
      percentage,
      status: 'soumis',
    });

    navigate('/dashboard-candidat');
  }

  if (!exam || questions === null) {
    return <div className="flex justify-center py-16"><Spinner /></div>;
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <h1 className="mb-2 font-display text-2xl font-bold text-ink">{exam.title}</h1>
        <p className="mb-2 text-gray-500">{exam.description}</p>
        <p className="mb-8 flex items-center justify-center gap-1 text-sm font-bold text-brand">
          <Clock size={16} /> Durée : {exam.durationMinutes} minutes — {questions.length} questions
        </p>
        <p className="mb-8 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Une fois lancé, le chronomètre ne s'arrête pas. Assurez-vous d'être prêt(e).
        </p>
        <Button onClick={handleStart} disabled={questions.length === 0}>Démarrer l'examen</Button>
      </div>
    );
  }

  const q = questions[current];
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm font-semibold text-brand">Question {current + 1} / {questions.length}</p>
        <p className={`flex items-center gap-1 rounded-lg px-3 py-1 text-sm font-bold ${secondsLeft < 60 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-brand'}`}>
          <Clock size={14} /> {minutes}:{String(seconds).padStart(2, '0')}
        </p>
      </div>

      <h1 className="mb-6 text-xl font-bold text-ink">{q.statement}</h1>

      <div className="flex flex-col gap-3">
        {(q.options || []).map((opt) => (
          <button
            key={opt.id}
            onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt.id }))}
            className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition ${
              answers[q.id] === opt.id ? 'border-brand bg-blue-50 text-brand' : 'border-black/10 text-ink hover:border-brand/40'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="secondary" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
          Précédent
        </Button>
        {current < questions.length - 1 ? (
          <Button onClick={() => setCurrent((c) => c + 1)}>Suivant</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Envoi…' : "Terminer l'examen"}
          </Button>
        )}
      </div>
    </div>
  );
}
