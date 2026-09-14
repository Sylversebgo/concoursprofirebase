import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { Upload } from 'lucide-react';

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
        Colonnes attendues : <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">moduleId, statement, optionA, optionB, optionC, optionD, correctAnswer, explanation, difficulty</code>
      </p>

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
