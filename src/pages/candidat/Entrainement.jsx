import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import * as questionsService from '../../services/questionsService';
import * as modulesService from '../../services/modulesService';
import { startSession } from '../../lib/quizSession';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';

export default function Entrainement() {
  const [params] = useSearchParams();
  const moduleId = params.get('moduleId');
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!moduleId) return;
    modulesService.getById(moduleId)
      .then(setModule)
      .catch(() => setError('Impossible de charger ce module.'));
    questionsService.getByModule(moduleId)
      .then(setQuestions)
      .catch(() => setError('Impossible de charger les questions de ce module.'));
  }, [moduleId]);

  function handleStart() {
    startSession({ questions, moduleId, mode: 'entrainement' });
    navigate('/entrainement-questions');
  }

  if (error) return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>;
  if (!module || questions === null) {
    return <div className="flex justify-center py-16"><Spinner /></div>;
  }

  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-brand">
        <Dumbbell size={28} />
      </div>
      <h1 className="mb-2 font-display text-2xl font-bold text-ink">{module.title}</h1>
      <p className="mb-8 text-gray-500">
        {questions.length} questions vous attendent. Répondez à votre rythme, la
        correction s'affiche après chaque question.
      </p>
      <Button onClick={handleStart} disabled={questions.length === 0}>
        Commencer
      </Button>
    </div>
  );
}
