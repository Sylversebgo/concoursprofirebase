import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { BookOpen, Upload } from 'lucide-react';
import * as modulesService from '../../services/modulesService';
import * as questionsService from '../../services/questionsService';
import Spinner from '../../components/ui/Spinner';

const CSV_DRAFT_KEY = 'concourspro_csv_draft';

function normalizeHeader(header) {
  return header
    .replace(/^\uFEFF/, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, '');
}

function getField(row, ...names) {
  for (const name of names) {
    const value = row[normalizeHeader(name)];
    if (value !== undefined && value !== null && String(value).trim() !== '') return String(value).trim();
  }
  return '';
}

export default function ImportCsv() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [emptyModules, setEmptyModules] = useState(null);
  const [modulesError, setModulesError] = useState('');

  useEffect(() => {
    Promise.all([modulesService.getAll(), questionsService.getAll()])
      .then(([modules, questions]) => {
        const moduleIdsWithQuestions = new Set(questions.map((question) => question.moduleId));
        setEmptyModules(modules.filter((module) => !moduleIdsWithQuestions.has(module.id)));
      })
      .catch(() => {
        setModulesError('Impossible de charger les modules et les questions depuis Firestore.');
        setEmptyModules([]);
      });
  }, []);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setError('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data.map((rawRow) => {
          const row = Object.fromEntries(Object.entries(rawRow).map(([key, value]) => [normalizeHeader(key), value]));
          const answer = getField(row, 'correctAnswer', 'correct_answer', 'bonneReponse', 'reponseCorrecte').toLowerCase();
          return {
          moduleId: getField(row, 'moduleId', 'module', 'idModule'),
          statement: getField(row, 'statement', 'question', 'enonce'),
          options: [
            { id: 'a', label: getField(row, 'optionA', 'option1', 'reponseA', 'a') },
            { id: 'b', label: getField(row, 'optionB', 'option2', 'reponseB', 'b') },
            { id: 'c', label: getField(row, 'optionC', 'option3', 'reponseC', 'c') },
            { id: 'd', label: getField(row, 'optionD', 'option4', 'reponseD', 'd') },
          ],
          correctAnswer: answer || 'a',
          explanation: getField(row, 'explanation', 'explication'),
          difficulty: getField(row, 'difficulty', 'difficulte') || 'moyen',
          active: true,
          };
        });

        if (rows.length === 0) {
          setError('Le fichier ne contient aucune ligne exploitable.');
          return;
        }

        sessionStorage.setItem(CSV_DRAFT_KEY, JSON.stringify(rows));
        navigate('/verification-csv');
      },
      error: () => setError('Impossible de lire ce fichier CSV.'),
    });
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-2 font-display text-2xl font-bold text-ink">Import CSV de questions</h1>
      <p className="mb-8 text-gray-500">
        Une ligne = un QCM. Indique l’ID Firestore du module dans chaque ligne, même si le fichier contient plusieurs modules. Colonnes : <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">moduleId, statement, optionA, optionB, optionC, optionD, correctAnswer, explanation, difficulty</code>
      </p>

      <section className="mb-6 border-y border-black/10 py-4">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen size={18} className="text-brand" />
          <h2 className="font-semibold text-ink">Modules sans question</h2>
        </div>
        {emptyModules === null ? (
          <div className="flex justify-center py-4"><Spinner /></div>
        ) : modulesError ? (
          <p className="text-sm text-red-600" role="alert">{modulesError}</p>
        ) : emptyModules.length === 0 ? (
          <p className="text-sm text-gray-500">Tous les modules ont au moins une question.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-black/5">
            {emptyModules.map((module) => (
              <li key={module.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <span className="font-medium text-ink">{module.title}</span>
                <code className="break-all text-xs text-gray-500">{module.id}</code>
              </li>
            ))}
          </ul>
        )}
      </section>

      <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-black/15 bg-white py-16 text-center transition hover:border-brand/40">
        <Upload size={32} className="text-brand" />
        <span className="font-semibold text-ink">{fileName || 'Cliquez pour choisir un fichier .csv'}</span>
        <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
      </label>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export { CSV_DRAFT_KEY };
