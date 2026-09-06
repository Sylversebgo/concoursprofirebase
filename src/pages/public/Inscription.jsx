import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Inscription() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/essai-gratuit');
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use'
        ? 'Cet e-mail est déjà utilisé.'
        : "Impossible de créer le compte.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-br from-ink to-brand-deep px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-2 font-display text-xl font-bold text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-brand-deep text-white">
            <GraduationCap size={18} />
          </span>
          ConcoursPro
        </div>
        <h1 className="mb-1 text-2xl font-bold text-ink">Créer un compte</h1>
        <p className="mb-6 text-sm text-gray-500">Commencez gratuitement, sans engagement.</p>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Prénom" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <Input label="Nom" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <Input label="Adresse e-mail" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Téléphone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Mot de passe" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Input label="Confirmer le mot de passe" type="password" required minLength={6} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          <Button type="submit" disabled={loading} className="mt-1 w-full">
            {loading ? 'Création…' : 'Créer mon compte'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Déjà un compte ? <Link to="/connexion" className="font-bold text-brand">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
