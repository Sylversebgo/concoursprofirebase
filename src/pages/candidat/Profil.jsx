import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as usersService from '../../services/usersService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function Profil() {
  const { profile, setProfile, changePassword } = useAuth();
  const [form, setForm] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    phone: profile?.phone || '',
  });
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await usersService.update(profile.id, form);
      setProfile({ ...profile, ...form });
      setMessage('Profil mis à jour ✓');
    } catch {
      setMessage("Erreur lors de la mise à jour.");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPassword.length < 6) {
      setMessage('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    try {
      await changePassword(newPassword);
      setMessage('Mot de passe modifié ✓');
      setNewPassword('');
    } catch {
      setMessage('Reconnectez-vous puis réessayez (opération sensible).');
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Mon profil</h1>

      {message && <p className="mb-5 rounded-lg bg-blue-50 px-3 py-2 text-sm text-brand-deep">{message}</p>}

      <Card className="mb-6">
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Prénom" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <Input label="Nom" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <Input label="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="E-mail" value={profile?.email} disabled className="bg-gray-50 text-gray-400" />
          <Button type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
        </form>
      </Card>

      <Card>
        <p className="mb-4 font-bold text-ink">Changer de mot de passe</p>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <Input label="Nouveau mot de passe" type="password" minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <Button type="submit" variant="secondary">Modifier le mot de passe</Button>
        </form>
      </Card>
    </div>
  );
}
