import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ClipboardList, Send } from 'lucide-react';
import * as examsService from '../../services/examsService';
import * as modulesService from '../../services/modulesService';
import * as questionsService from '../../services/questionsService';
import * as notificationsService from '../../services/notificationsService';
import * as usersService from '../../services/usersService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';

const EMPTY_FORM = { title: '', description: '', moduleId: '', durationMinutes: 60, published: false, questionIds: [] };

export default function GestionExamens() {
  const [exams, setExams] = useState(null);
  const [modules, setModules] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Temps réel : les examens (création, modification, suppression,
    // publication) se répercutent instantanément partout.
    const unsub = examsService.subscribeAll(setExams);
    modulesService.getAll().then(setModules);
    return unsub;
  }, []);

  useEffect(() => {
    if (form.moduleId) questionsService.getByModule(form.moduleId).then(setQuestions);
    else setQuestions([]);
  }, [form.moduleId]);

  function openCreate() { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); }
  function openEdit(exam) { setEditing(exam); setForm({ ...EMPTY_FORM, ...exam }); setModalOpen(true); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await examsService.update(editing.id, form);
      else await examsService.create(form);
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(exam) {
    if (!confirm(`Supprimer l'examen "${exam.title}" ?`)) return;
    await examsService.remove(exam.id);
  }

  async function handlePublish(exam) {
    await examsService.update(exam.id, { published: true, status: 'PUBLISHED' });
    const candidats = await usersService.getCandidats();
    await Promise.all(candidats.map((c) => notificationsService.create({
      userId: c.id,
      type: 'exam_published',
      title: 'Nouvel examen disponible',
      message: `L'examen "${exam.title}" est maintenant disponible.`,
      link: '/examens',
      read: false,
    })));
  }

  function toggleQuestion(qId) {
    const ids = form.questionIds.includes(qId) ? form.questionIds.filter((id) => id !== qId) : [...form.questionIds, qId];
    setForm({ ...form, questionIds: ids });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Gestion des examens</h1>
        <Button onClick={openCreate}><Plus size={16} /> Nouvel examen</Button>
      </div>

      {exams === null ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : exams.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Aucun examen" />
      ) : (
        <div className="flex flex-col gap-2">
          {exams.map((exam) => (
            <div key={exam.id} className="flex items-center justify-between rounded-xl border border-black/5 bg-white p-4 shadow-sm">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{exam.title}</p>
                <div className="mt-1 flex gap-2">
                  <Badge tone={exam.published ? 'green' : 'gray'}>{exam.published ? 'Publié' : 'Brouillon'}</Badge>
                  <Badge tone="blue">{exam.durationMinutes} min</Badge>
                  <Badge tone="gold">{(exam.questionIds || []).length} questions</Badge>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                {!exam.published && (
                  <button onClick={() => handlePublish(exam)} className="rounded-lg p-2 text-gray-400 hover:bg-green-50 hover:text-green-600" title="Publier">
                    <Send size={16} />
                  </button>
                )}
                <button onClick={() => openEdit(exam)} className="rounded-lg p-2 text-gray-400 hover:bg-black/5 hover:text-brand"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(exam)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier l'examen" : 'Nouvel examen'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input label="Titre" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Description</span>
            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-brand" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Module</span>
            <select required value={form.moduleId} onChange={(e) => setForm({ ...form, moduleId: e.target.value, questionIds: [] })} className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-brand">
              <option value="">Sélectionner…</option>
              {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </label>
          <Input label="Durée (minutes)" type="number" min={5} required value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} />

          {questions.length > 0 && (
            <div>
              <span className="mb-1.5 block text-sm font-semibold text-ink">Questions incluses ({form.questionIds.length})</span>
              <div className="max-h-40 overflow-y-auto rounded-xl border border-black/10 p-2">
                {questions.map((q) => (
                  <label key={q.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-black/5">
                    <input type="checkbox" checked={form.questionIds.includes(q.id)} onChange={() => toggleQuestion(q.id)} />
                    <span className="truncate">{q.statement}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <Button type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
        </form>
      </Modal>
    </div>
  );
}
