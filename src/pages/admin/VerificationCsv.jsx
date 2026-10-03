import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import * as questionsService from '../../services/questionsService';
import * as modulesService from '../../services/modulesService';
import Button from '../../components/ui/Button';

const CSV_DRAFT_KEY = 'concourspro_csv_draft';
const QUESTIONS_PER_MODULE = 50;

export default function VerificationCsv() {
  const navigate = useNavigate();
  const [rows] = useState(() => {
    const raw = sessionStorage.getItem(CSV_DRAFT_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });
  const [modules, setModules] = useState(null);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const [importError, setImportError] = useState('');

  useEffect(() => {
    if (!rows) {
      navigate('/import-csv');
      return;
    }
    modulesService.getAll().then(setModules).catch(() => setModules([]));
  }, [navigate, rows]);

  if (!rows || modules === null) return null;

  const moduleById = new Map(modules.map((module) => [module.id, module]));

  function getInvalidReason(row) {
    if (!row.moduleId) return 'moduleId manquant';
    if (!moduleById.has(row.moduleId)) return 'moduleId inconnu (vérifie l’ID Firestore)';
    if (!row.statement) return 'énoncé manquant';
    if (row.options.some((option) => !option.label)) return 'une ou plusieurs options sont manquantes';
    if (!['a', 'b', 'c', 'd'].includes(row.correctAnswer)) return 'correctAnswer doit être a, b, c ou d';
    return '';
  }

  const invalidRows = rows.filter((row) => getInvalidReason(row));
  const validRows = rows.filter((row) => !getInvalidReason(row));
  const rowsByModule = validRows.reduce((counts, row) => {
    counts.set(row.moduleId, (counts.get(row.moduleId) || 0) + 1);
    return counts;
  }, new Map());
  const modulesWithWrongCount = [...rowsByModule].filter(([, count]) => count !== QUESTIONS_PER_MODULE);

  async function handleConfirm() {
    setImporting(true);
    setImportError('');
    try {
      await questionsService.createMany(validRows);
      sessionStorage.removeItem(CSV_DRAFT_KEY);
      setDone(true);
    } catch (error) {
      setImportError(error.message || 'L’import a échoué. Aucune confirmation reçue de Firestore.');
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
        {' '}Chaque QCM sera enregistré sous le module indiqué sur sa ligne.
      </p>

      <section className="mb-6 border-y border-black/10 py-4">
        <h2 className="mb-1 font-semibold text-ink">Répartition des QCM valides</h2>
        <p className="mb-3 text-xs text-gray-500">50 QCM exactement sont attendus pour chaque module.</p>
        {rowsByModule.size === 0 ? (
          <p className="text-sm text-gray-500">Aucune ligne valide à importer.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-black/5">
            {[...rowsByModule].map(([moduleId, count]) => (
              <li key={moduleId} className={`flex flex-wrap items-center justify-between gap-2 py-2 text-sm ${count !== QUESTIONS_PER_MODULE ? 'text-red-600' : ''}`}>
                <span className="font-medium text-ink">{moduleById.get(moduleId)?.title}</span>
                <span className={count === QUESTIONS_PER_MODULE ? 'text-gray-500' : 'font-semibold'}>{count} / {QUESTIONS_PER_MODULE} QCM · <code className="text-xs">{moduleId}</code></span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {modulesWithWrongCount.length > 0 && (
        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800" role="status">
          Corrige la répartition : chaque module doit contenir exactement {QUESTIONS_PER_MODULE} QCM valides pour continuer.
        </p>
      )}

      {importError && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">{importError}</p>}

      <div className="mb-6 flex flex-col gap-2">
        {rows.slice(0, 20).map((r, i) => {
          const invalidReason = getInvalidReason(r);
          const invalid = Boolean(invalidReason);
          return (
            <div key={i} className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${invalid ? 'border-red-200 bg-red-50' : 'border-black/5 bg-white'}`}>
              {invalid ? <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-500" /> : <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-500" />}
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{r.statement || '(énoncé manquant)'}</p>
                <p className="text-xs text-gray-400">Module : {moduleById.get(r.moduleId)?.title || r.moduleId || '—'} ({r.moduleId || '—'})</p>
                {invalid && <p className="mt-1 text-xs font-semibold text-red-600">Erreur : {invalidReason}</p>}
              </div>
            </div>
          );
        })}
        {rows.length > 20 && <p className="text-xs text-gray-400">… et {rows.length - 20} autres lignes.</p>}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => navigate('/import-csv')}>Recommencer</Button>
        <Button onClick={handleConfirm} disabled={importing || validRows.length === 0 || modulesWithWrongCount.length > 0}>
          {importing ? 'Import en cours…' : `Importer ${validRows.length} questions`}
        </Button>
      </div>
    </div>
  );
}
