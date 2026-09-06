import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import * as questionsService from '../../services/questionsService';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const CSV_DRAFT_KEY = 'concourspro_csv_draft';

export default function VerificationCsv() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(null);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(CSV_DRAFT_KEY);
    if (!raw) {
      navigate('/import-csv');
      return;
    }
    setRows(JSON.parse(raw));
  }, [navigate]);

  if (!rows) return null;

  const invalidRows = rows.filter((r) => !r.moduleId || !r.statement || r.options.some((o) => !o.label));
  const validRows = rows.filter((r) => r.moduleId && r.statement && r.options.every((o) => o.label));

  async function handleConfirm() {
    setImporting(true);
    try {
      await questionsService.createMany(validRows);
      sessionStorage.removeItem(CSV_DRAFT_KEY);
      setDone(true);
    } finally {
      setImporting(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <CheckCircle2 className="mx-auto mb-4 text-green-500" size={40} />
        <h1 className="mb-2 font-display text-2xl font-bold text-ink">Import terminé</h1>
        <p className="mb-8 text-gray-500">{validRows.length} questions ont été ajoutées.</p>
        <Button onClick={() => navigate('/gestion-questions')}>Voir les questions</Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold text-ink">Vérification avant import</h1>
      <p className="mb-6 text-gray-500">
        {validRows.length} lignes valides{invalidRows.length > 0 && `, ${invalidRows.length} invalides (ignorées)`}.
      </p>

      <div className="mb-6 flex flex-col gap-2">
        {rows.slice(0, 20).map((r, i) => {
          const invalid = !r.moduleId || !r.statement || r.options.some((o) => !o.label);
          return (
            <div key={i} className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${invalid ? 'border-red-200 bg-red-50' : 'border-black/5 bg-white'}`}>
              {invalid ? <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-500" /> : <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-500" />}
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{r.statement || '(énoncé manquant)'}</p>
                <p className="text-xs text-gray-400">Module : {r.moduleId || '—'}</p>
              </div>
            </div>
          );
        })}
        {rows.length > 20 && <p className="text-xs text-gray-400">… et {rows.length - 20} autres lignes.</p>}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => navigate('/import-csv')}>Recommencer</Button>
        <Button onClick={handleConfirm} disabled={importing || validRows.length === 0}>
          {importing ? 'Import en cours…' : `Importer ${validRows.length} questions`}
        </Button>
      </div>
    </div>
  );
}
