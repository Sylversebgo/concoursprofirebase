import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import * as questionsService from '../../services/questionsService';
import Spinner from '../../components/ui/Spinner';
import MathText from '../../components/ui/MathText';

export default function CorrectionQuestion() {
  const [params] = useSearchParams();
  const id = params.get('id');
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    if (id) questionsService.getById(id).then(setQuestion);
  }, [id]);

  if (!question) return <div className="flex justify-center py-16"><Spinner /></div>;

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/resultat" className="mb-6 inline-block text-sm font-semibold text-gray-500">← Retour au résultat</Link>
      <h1 className="mb-6 text-xl font-bold text-ink"><MathText>{question.statement}</MathText></h1>
      <div className="flex flex-col gap-3">
        {(question.options || []).map((opt) => (
          <div
            key={opt.id}
            className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold ${
              opt.id === question.correctAnswer ? 'border-green-500 bg-green-50 text-green-700' : 'border-black/10 text-ink'
            }`}
          >
            <MathText>{opt.label}</MathText>
          </div>
        ))}
      </div>
      {question.explanation && (
        <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-brand-deep">
          <p className="mb-1 font-bold">Explication</p>
          <MathText>{question.explanation}</MathText>
        </div>
      )}
    </div>
  );
}
