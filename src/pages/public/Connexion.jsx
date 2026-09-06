import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Connexion() {
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
      if (profile?.role === 'candidat') {
        // Un candidat "free" (pas encore payé) reste sur l'essai à 10 QCM,
        // même après connexion, tant qu'un admin ne l'a pas repassé en "paid".
        const isFree = profile.accountType !== 'paid';
        navigate(isFree ? '/essai-gratuit' : '/dashboard-candidat');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError("Email ou mot de passe incorrect.");
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
        <h1 className="mb-1 text-2xl font-bold text-ink">Connexion candidat</h1>
        <p className="mb-6 text-sm text-gray-500">Ravi de vous revoir !</p>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Adresse e-mail"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Mot de passe"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <div className="text-right">
            <Link to="/mot-de-passe-oublie" className="text-xs font-semibold text-brand">
              Mot de passe oublié ?
            </Link>
          </div>
          <Button type="submit" disabled={loading} className="mt-1 w-full">
            {loading ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="font-bold text-brand">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}
