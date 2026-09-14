import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Brain, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as psychoService from '../../services/psychoService';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import MathText from '../../components/ui/MathText';

const QUESTION_SECONDS = 15;

export default function Psycho() {
  const [questions, setQuestions] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_SECONDS);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    psychoService.getActive().then(setQuestions).catch(() => setQuestions([]));
  }, []);

  useEffect(() => {
    if (!questions?.length || finished) return undefined;
    setSecondsLeft(QUESTION_SECONDS);
    const timer = setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          clearInterval(timer);
          setCurrent((index) => {
            if (index >= questions.length - 1) {
              setFinished(true);
              return index;
            }
            return index + 1;
          });
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [current, finished, questions]);

  if (questions === null) return <div className="flex min-h-[60vh] items-center justify-center"><Spinner /></div>;

  if (!questions.length) {
    return <div className="mx-auto max-w-xl px-5 py-24 text-center"><Brain className="mx-auto mb-4 text-brand" size={40} /><h1 className="font-display text-2xl font-bold text-ink">Test bientôt disponible</h1><p className="mt-2 text-gray-500">Les questions psychotechniques seront ajoutées prochainement.</p><Link to="/essai-gratuit" className="mt-6 inline-flex font-bold text-brand">Retour à l’essai gratuit</Link></div>;
  }

  if (finished) {
    const correct = questions.filter((question) => answers[question.id] === question.correctAnswer).length;
    return <div className="mx-auto max-w-xl px-5 py-20 text-center"><Brain className="mx-auto mb-4 text-brand" size={42} /><h1 className="font-display text-3xl font-bold text-ink">Test terminé</h1><p className="mt-5 text-6xl font-bold text-brand">{correct}/{questions.length}</p><p className="mt-3 text-gray-500">Chaque question était limitée à {QUESTION_SECONDS} secondes.</p><div className="mt-8 flex justify-center gap-3"><Button variant="secondary" onClick={() => { setCurrent(0); setAnswers({}); setFinished(false); }}><ArrowLeft size={16} /> Recommencer</Button><Link to="/essai-gratuit" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-blue-600 to-brand-deep px-5 py-2.5 text-sm font-bold text-white">Retour à l’essai</Link></div></div>;
  }

  const question = questions[current];
  const selected = answers[question.id];

  function selectAnswer(optionId) {
    if (selected) return;
    setAnswers((previous) => ({ ...previous, [question.id]: optionId }));
    setTimeout(() => {
      setCurrent((index) => {
        if (index >= questions.length - 1) {
          setFinished(true);
          return index;
        }
        return index + 1;
      });
    }, 250);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 md:px-10">
      <div className="mb-2 flex items-center justify-between"><p className="text-sm font-semibold text-brand">Question {current + 1} / {questions.length}</p><p className={`flex items-center gap-1 text-sm font-bold ${secondsLeft <= 5 ? 'text-red-600' : 'text-brand'}`}><Clock size={15} /> {secondsLeft}s</p></div>
      <div className="mb-6 h-2 w-full rounded-full bg-gray-200"><div className="h-2 rounded-full bg-brand transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
      <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm md:p-6">
        {question.imageUrl && <img src={question.imageUrl} alt="Illustration du problème psychotechnique" className="mx-auto mb-6 max-h-80 w-full rounded-xl object-contain" />}
        <h1 className="mb-6 text-xl font-bold text-ink"><MathText>{question.statement}</MathText></h1>
        <div className="grid gap-3 sm:grid-cols-2">{question.options.map((option) => <button key={option.id} type="button" onClick={() => selectAnswer(option.id)} className={`rounded-xl border-2 px-4 py-4 text-left font-semibold transition ${selected === option.id ? 'border-brand bg-blue-50 text-brand' : 'border-black/10 text-ink hover:border-brand/40'}`}><span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm font-bold">{option.id.toUpperCase()}</span><MathText>{option.label}</MathText></button>)}</div>
      </div>
      <div className="mt-6 flex items-center justify-between"><Link to="/essai-gratuit" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-ink"><ArrowLeft size={16} /> Retour</Link><span className="inline-flex items-center gap-2 text-sm text-gray-400">Réponse automatique <ArrowRight size={16} /></span></div>
    </div>
  );
}
