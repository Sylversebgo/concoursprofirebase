import { useEffect, useState } from 'react';
import { FilePenLine, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import * as writingService from '../../services/writingService';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

const PARTS = [
  ['introduction', 'Introduction'],
  ['developpement', 'Développement'],
  ['conclusion', 'Conclusion'],
];

export default function Redactions() {
  const { profile } = useAuth();
  const [subjects, setSubjects] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [sending, setSending] = useState('');

  useEffect(() => {
    const unsubscribe = writingService.subscribeSubjects(setSubjects, () => setSubjects([]));
    if (profile?.id) writingService.getByCandidate(profile.id).then(setSubmissions).catch(() => setSubmissions([]));
    return unsubscribe;
  }, [profile?.id]);

  function valueFor(subjectId, part) {
    return drafts[subjectId]?.[part] || '';
  }

  function updateDraft(subjectId, part, value) {
    setDrafts((current) => ({ ...current, [subjectId]: { ...current[subjectId], [part]: value } }));
  }

  async function submitPart(subject, part) {
    const text = valueFor(subject.id, part).trim();
    if (!text) return;
    setSending(`${subject.id}-${part}`);
    const previous = submissions.find((item) => item.subjectId === subject.id);
    const parts = { ...(previous?.parts || {}), [part]: { text, submittedAt: new Date().toISOString() } };
    if (previous) await writingService.updateSubmission(previous.id, { parts, status: 'envoye' });
    else await writingService.createSubmission({ subjectId: subject.id, subjectTitle: subject.title, candidateId: profile.id, kind: subject.kind, parts, status: 'envoye' });
    const refreshed = await writingService.getByCandidate(profile.id);
    setSubmissions(refreshed);
    setSending('');
  }

  if (subjects === null) return <div className="flex justify-center py-16"><Spinner /></div>;
  if (!subjects.length) return <EmptyState icon={FilePenLine} title="Aucun sujet disponible" description="Les sujets ajoutés par votre équipe apparaîtront ici." />;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 font-display text-2xl font-bold text-ink">Sujets de rédaction</h1>
      <p className="mb-8 text-gray-500">Rédigez chaque partie à votre rythme. Chaque envoi est transmis séparément à la correction.</p>
      <div className="flex flex-col gap-6">
        {subjects.filter((subject) => subject.active !== false).map((subject) => {
          const isSummary = subject.kind === 'resume';
          const parts = isSummary ? [['resume', 'Votre résumé']] : PARTS;
          const submission = submissions.find((item) => item.subjectId === subject.id);
          return (
            <article key={subject.id} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div><p className="text-xs font-bold uppercase tracking-wide text-brand">{isSummary ? 'Résumé de texte' : subject.kind === 'commentaire' ? 'Commentaire composé' : 'Dissertation'}</p><h2 className="mt-1 text-xl font-bold text-ink">{subject.title}</h2></div>
              </div>
              <div className="mb-6 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-7 text-ink">{subject.prompt}</div>
              <div className="flex flex-col gap-5">
                {parts.map(([part, label]) => (
                  <div key={part}>
                    <label className="mb-2 block text-sm font-bold text-ink" htmlFor={`${subject.id}-${part}`}>{label}</label>
                    <textarea id={`${subject.id}-${part}`} rows={isSummary ? 10 : 6} value={valueFor(subject.id, part)} onChange={(event) => updateDraft(subject.id, part, event.target.value)} placeholder={`Écrivez votre ${label.toLowerCase()} ici...`} className="w-full rounded-xl border border-black/10 p-3 text-sm leading-6 outline-none focus:border-brand focus:ring-2 focus:ring-brand/10" />
                    <Button onClick={() => submitPart(subject, part)} disabled={!valueFor(subject.id, part).trim() || sending === `${subject.id}-${part}`} className="mt-2"><Send size={15} />{sending === `${subject.id}-${part}` ? 'Envoi…' : 'Soumettre cette partie'}</Button>
                    {submission?.parts?.[part]?.feedback && <p className="mt-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">Commentaire : {submission.parts[part].feedback}</p>}
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}