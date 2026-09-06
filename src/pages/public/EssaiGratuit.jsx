import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MessageCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import * as freeTrialService from '../../services/freeTrialService';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';

const WHATSAPP_NUMBER = '57861564';

export default function EssaiGratuit() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showCorrection, setShowCorrection] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    freeTrialService.getFreeTrialQuestions().then(setQuestions).catch(() => setQuestions([]));
  }, []);

  if (questions === null) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Spinner /></div>;
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="text-gray-500">Aucune question disponible pour l'instant, revenez bientôt.</p>
      </div>
    );
  }

  if (finished) {
    const correctCount = questions.filter((q) => answers[q.id] === q.correctAnswer).length;

    return (
      <div className="mx-auto max-w-xl px-5 py-16 text-center md:px-10">
        <h1 className="mb-2 font-display text-2xl font-bold text-ink">Essai terminé !</h1>
        <p className="mb-8 text-5xl font-bold text-brand">{correctCount}/{questions.length}</p>

        {/* Petite session de contact WhatsApp */}
        <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
            <MessageCircle size={22} />
          </div>
          <p className="mb-1 font-bold text-ink">Envie de continuer votre préparation ?</p>
          <p className="mb-4 text-sm text-gray-600">
            Contactez-nous pour vous inscrire et accéder à tous les modules.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-bold text-white"
          >
            <MessageCircle size={17} /> Contactez-nous sur WhatsApp
          </a>
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="secondary" onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> Retour à l'accueil
          </Button>
          <Button onClick={() => navigate('/tarifs')}>
            Continuer <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const selected = answers[q.id];

  function selectAnswer(optionId) {
    if (showCorrection) return;
    setAnswers((a) => ({ ...a, [q.id]: optionId }));
  }

  function handleNext() {
    if (!showCorrection) {
      setShowCorrection(true);
      return;
    }
    setShowCorrection(false);
    if (current < questions.length - 1) setCurrent((c) => c + 1);
    else setFinished(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 md:px-10">
      <p className="mb-2 text-sm font-semibold text-brand">Question {current + 1} / {questions.length}</p>
      <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
        <div className="h-2 rounded-full bg-brand transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>

      <h1 className="mb-6 text-xl font-bold text-ink">{q.statement}</h1>

      <div className="flex flex-col gap-3">
        {(q.options || []).map((opt) => {
          const isCorrect = opt.id === q.correctAnswer;
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

      {showCorrection && q.explanation && (
        <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-brand-deep">
          <p className="mb-1 font-bold">Explication</p>
          {q.explanation}
        </div>
      )}

      <Button onClick={handleNext} disabled={!selected} className="mt-8 w-full">
        {!showCorrection ? 'Valider ma réponse' : current < questions.length - 1 ? 'Question suivante' : 'Voir mon résultat'}
      </Button>
    </div>
  );
}
