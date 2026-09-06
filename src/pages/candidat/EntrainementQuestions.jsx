import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, saveSession, clearSession } from '../../lib/quizSession';
import { useAuth } from '../../contexts/AuthContext';
import * as resultsService from '../../services/resultsService';
import Button from '../../components/ui/Button';

export default function EntrainementQuestions() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [session, setSession] = useState(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      navigate('/mes-modules');
      return;
    }
    setSession(s);
  }, [navigate]);

  if (!session) return null;

  const question = session.questions[session.current];
  const selected = session.answers[question.id];

  function selectAnswer(optionId) {
    if (showCorrection) return;
    const updated = { ...session, answers: { ...session.answers, [question.id]: optionId } };
    setSession(updated);
    saveSession(updated);
  }

  async function handleNext() {
    if (!showCorrection) {
      setShowCorrection(true);
      return;
    }
    setShowCorrection(false);

    if (session.current < session.questions.length - 1) {
      const updated = { ...session, current: session.current + 1 };
      setSession(updated);
      saveSession(updated);
      return;
    }

    // Dernière question -> calcul du score et sauvegarde du résultat.
    setSubmitting(true);
    const correctCount = session.questions.filter(
      (q) => session.answers[q.id] === q.correctAnswer
    ).length;
    const score = Math.round((correctCount / session.questions.length) * 100);

    const resultId = await resultsService.create({
      candidateId: profile.id,
      moduleId: session.moduleId,
      type: 'entrainement',
      score,
      correctAnswers: correctCount,
      totalQuestions: session.questions.length,
      answers: session.answers,
      durationSeconds: Math.round((Date.now() - session.startedAt) / 1000),
    });

    saveSession({ ...session, resultId, score, correctCount });
    navigate('/resultat');
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-2 text-sm font-semibold text-brand">
        Question {session.current + 1} / {session.questions.length}
      </p>
      <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-brand transition-all"
          style={{ width: `${((session.current + 1) / session.questions.length) * 100}%` }}
        />
      </div>

      <h1 className="mb-6 text-xl font-bold text-ink">{question.statement}</h1>

      <div className="flex flex-col gap-3">
        {(question.options || []).map((opt) => {
          const isCorrect = opt.id === question.correctAnswer;
          const isSelected = selected === opt.id;
          let style = 'border-black/10 text-ink hover:border-brand/40';
          if (showCorrection && isCorrect) style = 'border-green-500 bg-green-50 text-green-700';
          else if (showCorrection && isSelected && !isCorrect) style = 'border-red-500 bg-red-50 text-red-700';
          else if (!showCorrection && isSelected) style = 'border-brand bg-blue-50 text-brand';

          return (
            <button
              key={opt.id}
              onClick={() => selectAnswer(opt.id)}
              className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition ${style}`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {showCorrection && question.explanation && (
        <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-brand-deep">
          <p className="mb-1 font-bold">Explication</p>
          {question.explanation}
        </div>
      )}

      <Button onClick={handleNext} disabled={!selected || submitting} className="mt-8 w-full">
        {submitting
          ? 'Calcul du résultat…'
          : !showCorrection
            ? 'Valider ma réponse'
            : session.current < session.questions.length - 1
              ? 'Question suivante'
              : 'Voir mon résultat'}
      </Button>
    </div>
  );
}
