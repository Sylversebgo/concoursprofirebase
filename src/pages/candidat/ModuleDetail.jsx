import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Dumbbell, ArrowLeft } from 'lucide-react';
import * as modulesService from '../../services/modulesService';
import * as questionsService from '../../services/questionsService';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';

export default function ModuleDetail() {
  const [params] = useSearchParams();
  const moduleId = params.get('id');
  const [module, setModule] = useState(null);
  const [questionCount, setQuestionCount] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!moduleId) return;
    modulesService.getById(moduleId)
      .then(setModule)
      .catch(() => setError('Impossible de charger ce module.'));
    questionsService.getByModule(moduleId)
      .then((qs) => setQuestionCount(qs.length))
      .catch(() => setError('Impossible de charger les questions de ce module.'));
  }, [moduleId]);

  if (error) return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>;
  if (!module) {
    return <div className="flex justify-center py-16"><Spinner /></div>;
  }

  return (
    <div>
      <Link to="/mes-modules" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-gray-500">
        <ArrowLeft size={15} /> Retour aux modules
      </Link>

      <h1 className="mb-2 font-display text-2xl font-bold text-ink">{module.title}</h1>
      <p className="mb-8 max-w-xl text-gray-500">{module.description}</p>

      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-brand">
          <Dumbbell size={20} />
        </div>
        <p className="font-bold text-ink">Entraînement libre</p>
        <p className="mb-4 text-sm text-gray-500">
          {questionCount === null ? '…' : `${questionCount} questions disponibles`}
        </p>
        <Link to={`/entrainement?moduleId=${moduleId}`}>
          <Button disabled={questionCount === 0}>Commencer l'entraînement</Button>
        </Link>
      </div>
    </div>
  );
}
