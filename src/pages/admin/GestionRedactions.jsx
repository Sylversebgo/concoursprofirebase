import { useEffect, useState } from 'react';
import { FilePenLine, Plus, Trash2 } from 'lucide-react';
import * as writingService from '../../services/writingService';
import * as notificationsService from '../../services/notificationsService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';

const EMPTY = { kind: 'dissertation', title: '', prompt: '', active: true };
const PARTS = [['introduction', 'Introduction'], ['developpement', 'Développement'], ['conclusion', 'Conclusion']];

export default function GestionRedactions() {
  const [subjects, setSubjects] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    const stopSubjects = writingService.subscribeSubjects(setSubjects, () => setSubjects([]));
    const stopSubmissions = writingService.subscribeSubmissions(setSubmissions, () => setSubmissions([]));
    return () => { stopSubjects(); stopSubmissions(); };
  }, []);

  async function addSubject(event) {
    event.preventDefault();
    setSaving(true);
    await writingService.createSubject(form);
    setForm(EMPTY);
    setSaving(false);
  }

  async function saveFeedback(submission, part) {
    const text = feedback[`${submission.id}-${part}`] || '';
    await writingService.updateSubmission(submission.id, { [`parts.${part}.feedback`]: text, status: 'corrige' });
    await notificationsService.create({
      userId: submission.candidateId,
      title: 'Votre rédaction a été corrigée',
      message: `Un commentaire est disponible pour la partie « ${part} » de « ${submission.subjectTitle} »`,
      read: false,
      type: 'redaction',
    });
  }

  if (subjects === null) return <div className="flex justify-center py-16"><Spinner /></div>;
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Sujets et copies de rédaction</h1>
      <form onSubmit={addSubject} className="mb-8 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-ink">Ajouter un sujet</h2>
        <div className="grid gap-4 md:grid-cols-2"><Input label="Titre" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /><label className="block"><span className="mb-1.5 block text-sm font-semibold text-ink">Type</span><select value={form.kind} onChange={(event) => setForm({ ...form, kind: event.target.value })} className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm"><option value="dissertation">Dissertation</option><option value="commentaire">Commentaire composé</option><option value="resume">Résumé de texte</option></select></label></div>
        <label className="mt-4 block"><span className="mb-1.5 block text-sm font-semibold text-ink">Consigne et texte du sujet</span><textarea required rows={5} value={form.prompt} onChange={(event) => setForm({ ...form, prompt: event.target.value })} className="w-full rounded-xl border border-black/10 p-3 text-sm outline-none focus:border-brand" /></label>
        <Button type="submit" disabled={saving} className="mt-4"><Plus size={16} />{saving ? 'Ajout…' : 'Ajouter le sujet'}</Button>
      </form>
      <div className="mb-10 grid gap-3">{subjects.map((subject) => <div key={subject.id} className="flex items-center justify-between rounded-xl border border-black/5 bg-white p-4"><div><p className="text-xs font-bold uppercase text-brand">{subject.kind}</p><p className="font-bold text-ink">{subject.title}</p></div><button type="button" onClick={() => writingService.removeSubject(subject.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600" aria-label="Supprimer le sujet"><Trash2 size={16} /></button></div>)}</div>
      <h2 className="mb-4 text-xl font-bold text-ink">Copies reçues</h2>
      <div className="flex flex-col gap-5">{submissions.length === 0 ? <p className="text-sm text-gray-500">Aucune copie reçue.</p> : submissions.map((submission) => <article key={submission.id} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"><h3 className="mb-4 font-bold text-ink">{submission.subjectTitle} <span className="ml-2 text-xs font-normal text-gray-500">{submission.status}</span></h3>{(submission.kind === 'resume' ? [['resume', 'Résumé']] : PARTS).map(([part, label]) => submission.parts?.[part] && <div key={part} className="mb-5"><p className="mb-2 text-sm font-bold text-brand">{label}</p><p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-ink">{submission.parts[part].text}</p><textarea rows={2} value={feedback[`${submission.id}-${part}`] ?? submission.parts[part].feedback ?? ''} onChange={(event) => setFeedback({ ...feedback, [`${submission.id}-${part}`]: event.target.value })} placeholder="Votre commentaire de correction" className="mt-2 w-full rounded-xl border border-black/10 p-3 text-sm" /><Button onClick={() => saveFeedback(submission, part)} variant="secondary" className="mt-2">Enregistrer le commentaire</Button></div>)}</article>)}</div>
    </div>
  );
}