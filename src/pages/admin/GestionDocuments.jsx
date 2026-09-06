import { useEffect, useState } from 'react';
import { Plus, Trash2, FolderOpen } from 'lucide-react';
import * as documentsService from '../../services/documentsService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';

const EMPTY_FORM = { filename: '', category: '', published: true };

// Note : Cloud Storage nécessite le plan payant Blaze depuis 2026.
// Ici on référence des liens externes (Google Drive, etc.) plutôt que
// d'héberger le fichier lui-même, pour rester sur le plan gratuit Spark.
export default function GestionDocuments() {
  const [documents, setDocuments] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function load() {
    documentsService.getAll().then(setDocuments).catch(() => setDocuments([]));
  }
  useEffect(load, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await documentsService.create(form);
      setModalOpen(false);
      setForm(EMPTY_FORM);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(d) {
    if (!confirm(`Supprimer "${d.filename}" ?`)) return;
    await documentsService.remove(d.id);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Gestion des documents</h1>
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Ajouter</Button>
      </div>

      {documents === null ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : documents.length === 0 ? (
        <EmptyState icon={FolderOpen} title="Aucun document" />
      ) : (
        <div className="flex flex-col gap-2">
          {documents.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-xl border border-black/5 bg-white p-4 shadow-sm">
              <div>
                <p className="font-semibold text-ink">{d.filename}</p>
                <div className="mt-1 flex gap-2">
                  <Badge tone="blue">{d.category}</Badge>
                  <Badge tone={d.published ? 'green' : 'gray'}>{d.published ? 'Publié' : 'Brouillon'}</Badge>
                </div>
              </div>
              <button onClick={() => handleDelete(d)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Ajouter un document">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input label="Nom / lien du document" required placeholder="https://drive.google.com/..." value={form.filename} onChange={(e) => setForm({ ...form, filename: e.target.value })} />
          <Input label="Catégorie" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            <label htmlFor="published" className="text-sm font-semibold text-ink">Visible par les candidats</label>
          </div>
          <Button type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Ajouter'}</Button>
        </form>
      </Modal>
    </div>
  );
}
