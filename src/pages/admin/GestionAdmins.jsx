import { useEffect, useState } from 'react';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Plus, Pencil, Trash2, ShieldCheck } from 'lucide-react';
import { db, app as primaryApp } from '../../firebase/config';
import * as usersService from '../../services/usersService';
import { sendCredentialsEmail } from '../../lib/emailService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';

const EMPTY_FORM = { firstName: '', lastName: '', email: '', password: '', role: 'admin' };

export default function GestionAdmins() {
  const [admins, setAdmins] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = création, sinon objet admin en cours d'édition
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [emailStatus, setEmailStatus] = useState('');

  function load() {
    usersService.getAdmins().then(setAdmins).catch(() => setAdmins([]));
  }
  useEffect(load, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  }

  function openEdit(a) {
    setEditing(a);
    setForm({ firstName: a.firstName, lastName: a.lastName, email: a.email, password: '', role: a.role });
    setError('');
    setModalOpen(true);
  }

  // Astuce : on crée le compte admin via une INSTANCE FIREBASE SECONDAIRE
  // temporaire, pour ne pas déconnecter le superadmin actuellement connecté
  // (createUserWithEmailAndPassword connecte automatiquement le nouvel
  // utilisateur sur l'instance utilisée).
  async function handleCreate() {
    const secondaryApp = initializeApp(primaryApp.options, 'secondary-' + Date.now());
    const secondaryAuth = getAuth(secondaryApp);
    try {
      const cred = await createUserWithEmailAndPassword(secondaryAuth, form.email, form.password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        role: form.role,
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const result = await sendCredentialsEmail({
        toName: `${form.firstName} ${form.lastName}`,
        toEmail: form.email,
        tempPassword: form.password,
        role: form.role,
      });
      setEmailStatus(result.sent ? 'email_sent' : 'email_not_configured');
    } finally {
      await secondaryAuth.signOut();
      await deleteApp(secondaryApp);
    }
  }

  // Modification : on ne touche PAS à l'e-mail/mot de passe (Firebase Auth
  // ne permet pas de changer l'e-mail d'un AUTRE utilisateur depuis le
  // client) — seulement le nom et le rôle.
  async function handleUpdate() {
    await usersService.update(editing.id, {
      firstName: form.firstName,
      lastName: form.lastName,
      role: form.role,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setEmailStatus('');
    setSaving(true);
    try {
      if (editing) await handleUpdate();
      else await handleCreate();
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' ? 'Cet e-mail est déjà utilisé.' : 'Erreur lors de l\'opération.');
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(a) {
    const newStatus = a.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await usersService.update(a.id, { status: newStatus });
    setAdmins((prev) => prev.map((x) => (x.id === a.id ? { ...x, status: newStatus } : x)));
  }

  // Suppression du profil admin (le compte Auth lui-même nécessiterait le
  // SDK Admin pour être supprimé — hors périmètre serverless ici).
  async function handleDelete(a) {
    if (!confirm(`Supprimer définitivement le compte de ${a.firstName} ${a.lastName} ?`)) return;
    await usersService.remove(a.id);
    setAdmins((prev) => prev.filter((x) => x.id !== a.id));
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Gestion des admins</h1>
        <Button onClick={openCreate}><Plus size={16} /> Créer un admin</Button>
      </div>

      {emailStatus === 'email_not_configured' && (
        <p className="mb-5 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Compte créé, mais l'envoi d'e-mail n'est pas encore configuré (voir README, section EmailJS). Communique les identifiants manuellement pour cette fois.
        </p>
      )}
      {emailStatus === 'email_sent' && (
        <p className="mb-5 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Compte créé et e-mail envoyé avec les identifiants ✓
        </p>
      )}

      {admins === null ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : admins.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="Aucun compte admin" />
      ) : (
        <div className="flex flex-col gap-2">
          {admins.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border border-black/5 bg-white p-4 shadow-sm">
              <div>
                <p className="font-semibold text-ink">{a.firstName} {a.lastName}</p>
                <p className="text-xs text-gray-400">{a.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={a.role === 'superadmin' ? 'gold' : 'blue'}>{a.role}</Badge>
                <Badge tone={a.status === 'ACTIVE' ? 'green' : 'red'}>{a.status}</Badge>
                <button onClick={() => toggleStatus(a)} className="text-xs font-bold text-brand">
                  {a.status === 'ACTIVE' ? 'Désactiver' : 'Activer'}
                </button>
                <button onClick={() => openEdit(a)} className="rounded-lg p-1.5 text-gray-400 hover:bg-black/5 hover:text-brand" title="Modifier">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(a)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Supprimer">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le compte admin' : 'Créer un compte admin'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            <Input label="Prénom" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <Input label="Nom" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <Input
            label="E-mail"
            type="email"
            required
            disabled={!!editing}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={editing ? 'bg-gray-50 text-gray-400' : ''}
          />
          {editing && <p className="-mt-2 text-xs text-gray-400">L'e-mail ne peut pas être modifié après création.</p>}
          {!editing && (
            <Input label="Mot de passe provisoire" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          )}
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Rôle</span>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-brand">
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </label>
          <Button type="submit" disabled={saving}>
            {saving ? 'Enregistrement…' : editing ? 'Enregistrer les modifications' : 'Créer le compte'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
