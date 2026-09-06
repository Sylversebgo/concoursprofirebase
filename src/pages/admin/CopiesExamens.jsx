import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck } from 'lucide-react';
import * as submissionsService from '../../services/submissionsService';
import * as usersService from '../../services/usersService';
import * as examsService from '../../services/examsService';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';

export default function CopiesExamens() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    Promise.all([submissionsService.getAll(), usersService.getCandidats(), examsService.getAll()])
      .then(([submissions, candidats, exams]) => {
        const candidatMap = Object.fromEntries(candidats.map((c) => [c.id, c]));
        const examMap = Object.fromEntries(exams.map((e) => [e.id, e]));
        setRows(submissions.map((s) => ({
          ...s,
          candidat: candidatMap[s.candidateId],
          exam: examMap[s.examId],
        })));
      })
      .catch(() => setRows([]));
  }, []);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Copies d'examen</h1>

      {rows === null ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : rows.length === 0 ? (
        <EmptyState icon={FileCheck} title="Aucune copie soumise" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-bold uppercase text-gray-400">
              <tr>
                <th className="px-4 py-3">Candidat</th>
                <th className="px-4 py-3">Examen</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-black/5">
                  <td className="px-4 py-3 font-semibold text-ink">{r.candidat ? `${r.candidat.firstName} ${r.candidat.lastName}` : '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{r.exam?.title || '—'}</td>
                  <td className="px-4 py-3 font-bold text-brand">{r.percentage}%</td>
                  <td className="px-4 py-3"><Badge tone={r.status === 'corrige' ? 'green' : 'gold'}>{r.status}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/correction-copie/${r.id}`} className="text-xs font-bold text-brand">Corriger →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
