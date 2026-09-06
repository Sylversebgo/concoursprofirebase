import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import * as modulesService from '../../services/modulesService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';

const EMPTY_FORM = { title: '', description: '', category: 'fonction_publique', active: true };

export default function GestionModules() {
  const [modules, setModules] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Temps réel : la liste se met à jour automatiquement dès qu'un module
  // est créé/modifié/supprimé, par n'importe quel admin ou superadmin.
  useEffect(() => {
    const unsub = modulesService.subscribeAll(setModules);
    return unsub;
  }, []);

  function openCreate() { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); }
  function openEdit(m) { setEditing(m); setForm({ ...EMPTY_FORM, ...m }); setModalOpen(true); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await modulesService.update(editing.id, form);
      else await modulesService.create(form);
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(m) {
    if (!confirm(`Supprimer le module "${m.title}" ?`)) return;
    await modulesService.remove(m.id);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Gestion des modules</h1>
        <Button onClick={openCreate}><Plus size={16} /> Nouveau module</Button>
      </div>

      {modules === null ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : modules.length === 0 ? (
        <EmptyState icon={BookOpen} title="Aucun module" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {modules.map((m) => (
            <div key={m.id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <Badge tone={m.active ? 'green' : 'gray'}>{m.active ? 'Actif' : 'Inactif'}</Badge>
              <h3 className="mt-3 mb-1 font-bold text-ink">{m.title}</h3>
              <p className="mb-4 text-sm text-gray-500">{m.description}</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(m)} className="rounded-lg p-2 text-gray-400 hover:bg-black/5 hover:text-brand"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(m)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le module' : 'Nouveau module'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input label="Titre" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Description</span>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-brand" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Catégorie</span>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-brand">
              <option value="fonction_publique">Fonction publique</option>
              <option value="enseignement">Enseignement</option>
              <option value="banque">Banque</option>
            </select>
          </label>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="active" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            <label htmlFor="active" className="text-sm font-semibold text-ink">Module actif</label>
          </div>
          <Button type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
        </form>
      </Modal>
    </div>
  );
}
