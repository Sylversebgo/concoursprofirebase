import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Search } from 'lucide-react';
import { getSession, saveSession } from '../../lib/quizSession';
import { useAuth } from '../../contexts/AuthContext';
import * as resultsService from '../../services/resultsService';
import Button from '../../components/ui/Button';
import MathText from '../../components/ui/MathText';

export default function EntrainementQuestions() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [session, setSession] = useState(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [questionSearch, setQuestionSearch] = useState('');
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
    const score = Math.round((correctCount / finalSession.questions.length) * 50);

    setSubmitting(true);
    resultsService.create({
      candidateId: profile.id,
      moduleId: finalSession.moduleId,
      type: isEvaluation ? 'evaluation' : 'entrainement',
      score,
      correctAnswers: correctCount,
      totalQuestions: finalSession.questions.length,
      scoreMax: 50,
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
  const normalizedSearch = questionSearch.trim().toLowerCase();
  const matchingQuestions = normalizedSearch
    ? session.questions
      .map((candidate, index) => ({ candidate, index }))
      .filter(({ candidate, index }) => (
        String(index + 1).includes(normalizedSearch)
        || String(candidate.statement || '').toLowerCase().includes(normalizedSearch)
      ))
    : [];

  function goToQuestion(index) {
    const nextSession = { ...session, current: index };
    setSession(nextSession);
    saveSession(nextSession);
    setShowCorrection(false);
    setQuestionSearch('');
  }

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

      {!isEvaluation && (
        <div className="relative mb-4">
          <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={questionSearch}
            onChange={(event) => setQuestionSearch(event.target.value)}
            placeholder="Rechercher par numéro ou dans l'énoncé"
            aria-label="Rechercher une question"
            className="w-full rounded-xl border border-black/10 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
          />
          {normalizedSearch && (
            <div className="absolute z-10 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-black/10 bg-white p-1 shadow-lg">
              {matchingQuestions.length > 0 ? matchingQuestions.map(({ candidate, index }) => (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => goToQuestion(index)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-blue-50 ${index === session.current ? 'bg-blue-50 text-brand' : 'text-ink'}`}
                >
                  <span className="mr-2 font-bold">{index + 1}.</span>
                  <MathText>{candidate.statement}</MathText>
                </button>
              )) : (
                <p className="px-3 py-2 text-sm text-gray-500">Aucune question trouvée.</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-brand transition-all"
          style={{ width: `${((session.current + 1) / session.questions.length) * 100}%` }}
        />
      </div>

      <h1 className="mb-6 text-xl font-bold text-ink"><MathText>{question.statement}</MathText></h1>

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
              <MathText>{option.label}</MathText>
            </button>
          );
        })}
      </div>

      {!isEvaluation && showCorrection && question.explanation && (
        <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-brand-deep">
          <p className="mb-1 font-bold">Explication</p>
          <MathText>{question.explanation}</MathText>
        </div>
      )}

      {!isEvaluation && (
        <>
          <div className="mt-8 flex gap-3">
            <Button
              variant="secondary"
              onClick={() => goToQuestion(session.current - 1)}
              disabled={session.current === 0 || submitting}
              className="flex-1"
            >
              Question précédente
            </Button>
            <Button onClick={handleNext} disabled={!selected || submitting} className="flex-1">
              {submitting
                ? 'Calcul du résultat…'
                : !showCorrection
                  ? 'Valider ma réponse'
                  : session.current < session.questions.length - 1
                    ? 'Question suivante'
                    : 'Voir mon résultat'}
            </Button>
          </div>
          {showCorrection && session.current < session.questions.length - 1 && (
            <button
              type="button"
              onClick={() => goToQuestion(session.current + 1)}
              className="mt-3 w-full text-sm font-semibold text-brand hover:underline"
            >
              Question suivante
            </button>
          )}
        </>
      )}
    </div>
  );
}
