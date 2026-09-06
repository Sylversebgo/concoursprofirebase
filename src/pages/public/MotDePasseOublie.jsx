import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function MotDePasseOublie() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      setError("Impossible d'envoyer l'e-mail. Vérifiez l'adresse saisie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-br from-ink to-brand-deep px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="mb-1 text-2xl font-bold text-ink">Mot de passe oublié</h1>
        <p className="mb-6 text-sm text-gray-500">On vous envoie un lien de réinitialisation par e-mail.</p>

        {sent ? (
          <p className="rounded-lg bg-green-50 px-3 py-3 text-sm text-green-700">
            E-mail envoyé ! Vérifiez votre boîte de réception (et vos spams).
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <Input label="Adresse e-mail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Envoi…' : 'Envoyer le lien'}
            </Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link to="/connexion" className="font-bold text-brand">Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}
