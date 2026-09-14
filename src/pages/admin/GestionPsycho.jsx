import { useEffect, useState } from 'react';
import { Brain, Pencil, Plus, Trash2 } from 'lucide-react';
import * as psychoService from '../../services/psychoService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

const EMPTY_FORM = {
  statement: '', imageUrl: '', explanation: '', active: true, correctAnswer: 'a',
  options: [{ id: 'a', label: '' }, { id: 'b', label: '' }, { id: 'c', label: '' }, { id: 'd', label: '' }],
};

export default function GestionPsycho() {
  const [questions, setQuestions] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    psychoService.getAll().then(setQuestions).catch(() => setQuestions([]));
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  }

  function openEdit(question) {
    setEditing(question);
    setForm({ ...EMPTY_FORM, ...question });
    setError('');
    setModalOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await psychoService.update(editing.id, form);
        setQuestions(questions.map((q) => (q.id === editing.id ? { ...q, ...form } : q)));
      } else {
        const id = await psychoService.create(form);
        setQuestions([{ id, ...form }, ...questions]);
      }
      setModalOpen(false);
    } catch (submitError) {
      setError(submitError.message || 'Impossible d’enregistrer la question.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(question) {
    if (!window.confirm(`Supprimer cette question psychotechnique ?`)) return;
    try {
      await psychoService.remove(question.id);
      setQuestions((current) => current.filter((q) => q.id !== question.id));
    } catch (deleteError) {
      setError(deleteError.message || 'Impossible de supprimer la question.');
    }
  }

  function updateOption(index, label) {
    const options = [...form.options];
    options[index] = { ...options[index], label };
    setForm({ ...form, options });
  }

  if (questions === null) return <div className="flex justify-center py-16"><Spinner /></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Test psychotechnique</h1>
          <p className="mt-1 text-sm text-gray-500">Chaque question est limitée à 15 secondes.</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> Nouvelle question</Button>
      </div>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {questions.length === 0 ? (
        <EmptyState icon={Brain} title="Aucune question psychotechnique" description="Ajoute une image et quatre propositions pour commencer." />
      ) : (
        <div className="flex flex-col gap-3">
          {questions.map((question) => (
            <div key={question.id} className="flex items-center gap-4 rounded-xl border border-black/5 bg-white p-4 shadow-sm">
              {question.imageUrl && <img src={question.imageUrl} alt="" className="h-16 w-24 rounded-lg object-cover" />}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{question.statement || 'Question avec image'}</p>
                <p className="mt-1 text-xs text-gray-500">Bonne réponse : {question.correctAnswer.toUpperCase()} · 15 secondes</p>
              </div>
              <button type="button" onClick={() => openEdit(question)} className="rounded-lg p-2 text-gray-400 hover:bg-black/5 hover:text-brand" title="Modifier"><Pencil size={16} /></button>
              <button type="button" onClick={() => handleDelete(question)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Supprimer"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier la question' : 'Nouvelle question psychotechnique'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="URL de l’image" type="url" placeholder="https://.../image.png" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
          <p className="-mt-2 text-xs text-gray-400">Pour l’instant, héberge l’image puis colle son URL. Le stockage Firebase pourra être ajouté ensuite.</p>
          <label className="block"><span className="mb-1.5 block text-sm font-semibold text-ink">Énoncé ou consigne</span><textarea required rows={2} value={form.statement} onChange={(event) => setForm({ ...form, statement: event.target.value })} className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-brand" /></label>
          {form.options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-2">
              <input type="radio" name="psychoCorrectAnswer" checked={form.correctAnswer === option.id} onChange={() => setForm({ ...form, correctAnswer: option.id })} />
              <Input required placeholder={`Option ${option.id.toUpperCase()}`} value={option.label} onChange={(event) => updateOption(index, event.target.value)} className="flex-1" />
            </div>
          ))}
          <label className="block"><span className="mb-1.5 block text-sm font-semibold text-ink">Explication (optionnel)</span><textarea rows={2} value={form.explanation} onChange={(event) => setForm({ ...form, explanation: event.target.value })} className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-brand" /></label>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /> Question active</label>
          <Button type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
        </form>
      </Modal>
    </div>
  );
}
