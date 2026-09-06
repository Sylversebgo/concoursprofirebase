import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ConnexionAdmin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const profile = await login(form.email, form.password);
      if (profile?.role !== 'admin' && profile?.role !== 'superadmin') {
        setError("Ce compte n'a pas les droits administrateur.");
        return;
      }
      navigate('/dashboard');
    } catch {
      setError('Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-2 font-display text-xl font-bold text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-white">
            <ShieldCheck size={18} />
          </span>
          Administration
        </div>
        <h1 className="mb-1 text-2xl font-bold text-ink">Connexion admin</h1>
        <p className="mb-6 text-sm text-gray-500">Accès réservé à l'équipe ConcoursPro.</p>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Adresse e-mail" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Mot de passe" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Button type="submit" disabled={loading} className="mt-1 w-full">
            {loading ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>
      </div>
    </div>
  );
}
