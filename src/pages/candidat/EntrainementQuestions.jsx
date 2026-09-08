import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { getSession, saveSession } from '../../lib/quizSession';
import { useAuth } from '../../contexts/AuthContext';
import * as resultsService from '../../services/resultsService';
import Button from '../../components/ui/Button';

export default function EntrainementQuestions() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [session, setSession] = useState(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const advanceTimerRef = useRef(null);

  useEffect(() => {
    const storedSession = getSession();
    if (!storedSession) {
      navigate('/mes-modules');
      return;
    }
    setSession(storedSession);
  }, [navigate]);

  const isEvaluation = session?.mode === 'evaluation';

  function finishSession(finalSession) {
    const correctCount = finalSession.questions.filter(
      (question) => finalSession.answers[question.id] === question.correctAnswer
    ).length;
    const score = isEvaluation
      ? Math.round((correctCount / finalSession.questions.length) * 200) / 10
      : Math.round((correctCount / finalSession.questions.length) * 100);

    setSubmitting(true);
    resultsService.create({
      candidateId: profile.id,
      moduleId: finalSession.moduleId,
      type: isEvaluation ? 'evaluation' : 'entrainement',
      score,
      correctAnswers: correctCount,
      totalQuestions: finalSession.questions.length,
      answers: finalSession.answers,
      durationSeconds: Math.round((Date.now() - finalSession.startedAt) / 1000),
    }).then((resultId) => {
      saveSession({ ...finalSession, resultId, score, correctCount });
      navigate('/resultat');
    });
  }

  function goToNext(currentSession) {
    if (currentSession.current < currentSession.questions.length - 1) {
      const nextSession = { ...currentSession, current: currentSession.current + 1 };
      setSession(nextSession);
      saveSession(nextSession);
      setShowCorrection(false);
      setSecondsLeft(30);
      return;
    }
    finishSession(currentSession);
  }

  useEffect(() => {
    if (!session || !isEvaluation || submitting) return undefined;

    setSecondsLeft(30);
    const interval = setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          clearInterval(interval);
          goToNext(session);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.current, isEvaluation, submitting]);

  useEffect(() => () => clearTimeout(advanceTimerRef.current), []);

  if (!session) return null;

  const question = session.questions[session.current];
  const selected = session.answers[question.id];

  function selectAnswer(optionId) {
    if (showCorrection || submitting) return;

    const updatedSession = {
      ...session,
      answers: { ...session.answers, [question.id]: optionId },
    };
    setSession(updatedSession);
    saveSession(updatedSession);

    if (isEvaluation) {
      advanceTimerRef.current = setTimeout(() => goToNext(updatedSession), 500);
    }
  }

  function handleNext() {
    if (isEvaluation) return;
    if (!showCorrection) {
      setShowCorrection(true);
      return;
    }

    if (session.current < session.questions.length - 1) {
      goToNext(session);
      return;
    }

    finishSession(session);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-brand">
          Question {session.current + 1} / {session.questions.length}
        </p>
        {isEvaluation && (
          <p className={`flex items-center gap-1 text-sm font-bold ${secondsLeft <= 5 ? 'text-red-600' : 'text-brand'}`}>
            <Clock size={15} /> {secondsLeft}s
          </p>
        )}
      </div>

      <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-brand transition-all"
          style={{ width: `${((session.current + 1) / session.questions.length) * 100}%` }}
        />
      </div>

      <h1 className="mb-6 text-xl font-bold text-ink">{question.statement}</h1>

      <div className="flex flex-col gap-3">
        {(question.options || []).map((option) => {
          const isCorrect = option.id === question.correctAnswer;
          const isSelected = selected === option.id;
          let style = 'border-black/10 text-ink hover:border-brand/40';
          if (showCorrection && isCorrect) style = 'border-green-500 bg-green-50 text-green-700';
          else if (showCorrection && isSelected && !isCorrect) style = 'border-red-500 bg-red-50 text-red-700';
          else if (!showCorrection && !isEvaluation && isSelected) style = 'border-brand bg-blue-50 text-brand';

          return (
            <button
              key={option.id}
              onClick={() => selectAnswer(option.id)}
              className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition ${style}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {!isEvaluation && showCorrection && question.explanation && (
        <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-brand-deep">
          <p className="mb-1 font-bold">Explication</p>
          {question.explanation}
        </div>
      )}

      {!isEvaluation && (
        <Button onClick={handleNext} disabled={!selected || submitting} className="mt-8 w-full">
          {submitting
            ? 'Calcul du résultat…'
            : !showCorrection
              ? 'Valider ma réponse'
              : session.current < session.questions.length - 1
                ? 'Question suivante'
                : 'Voir mon résultat'}
        </Button>
      )}
    </div>
  );
}
