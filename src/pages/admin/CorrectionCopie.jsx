import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import * as submissionsService from '../../services/submissionsService';
import * as questionsService from '../../services/questionsService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';

export default function CorrectionCopie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [adjustedScore, setAdjustedScore] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    submissionsService.getById(id).then(async (s) => {
      setSubmission(s);
      setAdjustedScore(s.score);
      const qs = await Promise.all(s.questionIds.map((qId) => questionsService.getById(qId)));
      setQuestions(qs.filter(Boolean));
    });
  }, [id]);

  async function handleValidate() {
    setSaving(true);
    try {
      await submissionsService.update(id, {
        status: 'corrige',
        score: adjustedScore,
        percentage: Math.round((adjustedScore / questions.length) * 100),
      });
      navigate('/copies-examens');
    } finally {
      setSaving(false);
    }
  }

  if (!submission) return <div className="flex justify-center py-16"><Spinner /></div>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">Correction de copie</h1>
      <p className="mb-6 text-gray-500">Score initial calculé automatiquement : {submission.percentage}%</p>

      <div className="mb-6 flex flex-col gap-2">
        {questions.map((q) => {
          const isCorrect = submission.answers[q.id] === q.correctAnswer;
          return (
            <div key={q.id} className="flex items-start gap-3 rounded-xl border border-black/5 bg-white p-4 text-sm">
              {isCorrect ? <CheckCircle2 className="mt-0.5 shrink-0 text-green-500" size={18} /> : <XCircle className="mt-0.5 shrink-0 text-red-500" size={18} />}
              <p className="text-ink">{q.statement}</p>
            </div>
          );
        })}
      </div>

      <div className="mb-6 max-w-xs">
        <Input
          label={`Score ajusté (sur ${questions.length})`}
          type="number"
          min={0}
          max={questions.length}
          value={adjustedScore}
          onChange={(e) => setAdjustedScore(Number(e.target.value))}
        />
      </div>

      <Button onClick={handleValidate} disabled={saving}>{saving ? 'Enregistrement…' : 'Valider la correction'}</Button>
    </div>
  );
}
