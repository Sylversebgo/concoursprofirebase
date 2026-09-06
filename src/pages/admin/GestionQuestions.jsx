import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, HelpCircle } from 'lucide-react';
import * as questionsService from '../../services/questionsService';
import * as modulesService from '../../services/modulesService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';

const EMPTY_FORM = {
  moduleId: '', statement: '', explanation: '', difficulty: 'moyen', active: true,
  options: [{ id: 'a', label: '' }, { id: 'b', label: '' }, { id: 'c', label: '' }, { id: 'd', label: '' }],
  correctAnswer: 'a',
};

export default function GestionQuestions() {
  const [questions, setQuestions] = useState(null);
  const [modules, setModules] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Temps réel : les questions apparaissent/disparaissent/se mettent à
    // jour instantanément pour tous (admins et candidats).
    const unsub = questionsService.subscribeAll(setQuestions);
    modulesService.getAll().then(setModules);
    return unsub;
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(q) {
    setEditing(q);
    setForm({ ...EMPTY_FORM, ...q });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await questionsService.update(editing.id, form);
      else await questionsService.create(form);
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(q) {
    if (!confirm(`Supprimer la question "${q.statement.slice(0, 40)}..." ?`)) return;
    await questionsService.remove(q.id);
  }

  function updateOption(index, label) {
    const options = [...form.options];
    options[index] = { ...options[index], label };
    setForm({ ...form, options });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Gestion des questions</h1>
        <Button onClick={openCreate}><Plus size={16} /> Nouvelle question</Button>
      </div>

      {questions === null ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : questions.length === 0 ? (
        <EmptyState icon={HelpCircle} title="Aucune question" description="Créez votre première question ou importez un CSV." />
      ) : (
        <div className="flex flex-col gap-2">
          {questions.map((q) => (
            <div key={q.id} className="flex items-center justify-between rounded-xl border border-black/5 bg-white p-4 shadow-sm">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{q.statement}</p>
                <div className="mt-1 flex gap-2">
                  <Badge tone={q.active ? 'green' : 'gray'}>{q.active ? 'Active' : 'Inactive'}</Badge>
                  <Badge tone="gold">{q.difficulty}</Badge>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => openEdit(q)} className="rounded-lg p-2 text-gray-400 hover:bg-black/5 hover:text-brand"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(q)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier la question' : 'Nouvelle question'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Module</span>
            <select
              required
              value={form.moduleId}
              onChange={(e) => setForm({ ...form, moduleId: e.target.value })}
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-brand"
            >
              <option value="">Sélectionner…</option>
              {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Énoncé</span>
            <textarea
              required
              rows={2}
              value={form.statement}
              onChange={(e) => setForm({ ...form, statement: e.target.value })}
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-brand"
            />
          </label>

          {form.options.map((opt, i) => (
            <div key={opt.id} className="flex items-center gap-2">
              <input
                type="radio"
                name="correctAnswer"
                checked={form.correctAnswer === opt.id}
                onChange={() => setForm({ ...form, correctAnswer: opt.id })}
              />
              <Input
                placeholder={`Option ${opt.id.toUpperCase()}`}
                required
                value={opt.label}
                onChange={(e) => updateOption(i, e.target.value)}
                className="flex-1"
              />
            </div>
          ))}
          <p className="-mt-2 text-xs text-gray-400">Cochez la bonne réponse à gauche.</p>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Explication (optionnel)</span>
            <textarea
              rows={2}
              value={form.explanation}
              onChange={(e) => setForm({ ...form, explanation: e.target.value })}
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-brand"
            />
          </label>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="active" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            <label htmlFor="active" className="text-sm font-semibold text-ink">Question active</label>
          </div>

          <Button type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
        </form>
      </Modal>
    </div>
  );
}
