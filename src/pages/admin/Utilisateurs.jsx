import { useEffect, useState } from 'react';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Users, Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { db, app as primaryApp } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import * as usersService from '../../services/usersService';
import { sendCredentialsEmail } from '../../lib/emailService';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const EMPTY_FORM = { firstName: '', lastName: '', email: '', phone: '', password: '' };

function generatePassword() {
  return 'Cp' + Math.random().toString(36).slice(-8) + '!';
}

export default function Utilisateurs() {
  const { hasRole } = useAuth();
  const isSuperAdmin = hasRole('superadmin');

  const [users, setUsers] = useState(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM, password: generatePassword() });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [emailStatus, setEmailStatus] = useState('');

  // Temps réel : un candidat créé par un AUTRE admin apparaît instantanément
  // ici aussi (y compris pour le superadmin).
  useEffect(() => {
    const unsub = usersService.subscribeCandidats(setUsers);
    return unsub;
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, password: generatePassword() });
    setError('');
    setModalOpen(true);
  }

  function openEdit(u) {
    setEditing(u);
    setForm({ firstName: u.firstName, lastName: u.lastName, email: u.email, phone: u.phone || '', password: '' });
    setError('');
    setModalOpen(true);
  }

  async function toggleStatus(u) {
    const newStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await usersService.update(u.id, { status: newStatus });
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, status: newStatus } : x)));
  }

  // Suppression réservée au superadmin (supprime le profil Firestore ;
  // le compte d'authentification lui-même ne peut être supprimé que via
  // le SDK Admin, ce qui nécessiterait un backend — hors périmètre ici).
  async function handleDelete(u) {
    if (!confirm(`Supprimer définitivement le profil de ${u.firstName} ${u.lastName} ?\n\n(Le compte de connexion ne pourra plus accéder à l'application.)`)) return;
    await usersService.remove(u.id);
    setUsers((prev) => prev.filter((x) => x.id !== u.id));
  }

  // Création d'un candidat par un admin/superadmin, via une instance
  // Firebase secondaire (pour ne pas déconnecter l'admin actuel) — même
  // technique que GestionAdmins.jsx.
  async function handleCreate() {
    const secondaryApp = initializeApp(primaryApp.options, 'secondary-' + Date.now());
    const secondaryAuth = getAuth(secondaryApp);
    try {
      const cred = await createUserWithEmailAndPassword(secondaryAuth, form.email, form.password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        role: 'candidat',
        status: 'ACTIVE',
        accountType: 'paid', // créé par un admin = candidat payant, accès direct au tableau de bord
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const result = await sendCredentialsEmail({
        toName: `${form.firstName} ${form.lastName}`,
        toEmail: form.email,
        tempPassword: form.password,
        role: 'candidat',
      });
      setEmailStatus(result.sent ? 'email_sent' : 'email_not_configured');
    } finally {
      await secondaryAuth.signOut();
      await deleteApp(secondaryApp);
    }
  }

  // Modification : nom, prénom, téléphone uniquement (pas l'e-mail, qui est
  // lié au compte d'authentification et ne peut être changé côté client
  // pour un AUTRE utilisateur que soi-même).
  async function handleUpdate() {
    await usersService.update(editing.id, {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
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
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' ? 'Cet e-mail est déjà utilisé.' : "Erreur lors de l'opération.");
    } finally {
      setSaving(false);
    }
  }

  const filtered = users?.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Utilisateurs (candidats)</h1>
        <Button onClick={openCreate}><Plus size={16} /> Créer un candidat</Button>
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

      <div className="mb-5 max-w-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Rechercher un candidat…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-black/10 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand"
          />
        </div>
      </div>

      {users === null ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="Aucun candidat trouvé" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-bold uppercase text-gray-400">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Téléphone</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-black/5">
                  <td className="px-4 py-3 font-semibold text-ink">{u.firstName} {u.lastName}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3 text-gray-500">{u.phone || '—'}</td>
                  <td className="px-4 py-3"><Badge tone={u.status === 'ACTIVE' ? 'green' : 'red'}>{u.status}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => toggleStatus(u)} className="text-xs font-bold text-brand">
                        {u.status === 'ACTIVE' ? 'Désactiver' : 'Activer'}
                      </button>
                      <button onClick={() => openEdit(u)} className="rounded-lg p-1.5 text-gray-400 hover:bg-black/5 hover:text-brand" title="Modifier">
                        <Pencil size={14} />
                      </button>
                      {/* Suppression réservée au superadmin */}
                      {isSuperAdmin && (
                        <button onClick={() => handleDelete(u)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Supprimer">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le candidat' : 'Créer un compte candidat'}>
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
          <Input label="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          {!editing && (
            <>
              <Input
                label="Mot de passe provisoire (généré, modifiable)"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <p className="-mt-2 text-xs text-gray-400">
                Ce mot de passe (et le lien de connexion) sera envoyé par e-mail au candidat s'il a configuré EmailJS.
              </p>
            </>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? 'Enregistrement…' : editing ? 'Enregistrer les modifications' : 'Créer et envoyer les identifiants'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
