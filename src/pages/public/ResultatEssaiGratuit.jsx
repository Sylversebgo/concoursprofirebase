import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

export default function ResultatEssaiGratuit() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('concourspro_free_trial_result');
    if (raw) setResult(JSON.parse(raw));
  }, []);

  if (!result) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="text-gray-500 mb-4">Aucun résultat trouvé.</p>
        <Link to="/tester-gratuitement" className="font-bold text-brand">Faire l'essai gratuit →</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-20 text-center md:px-10">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
        <Trophy size={30} />
      </div>
      <h1 className="mb-2 font-display text-2xl font-bold text-ink">Résultat de votre essai</h1>
      <p className="mb-6 text-5xl font-bold text-brand">{result.percentage}%</p>
      <p className="mb-8 text-gray-500">{result.correct} bonnes réponses sur {result.total}</p>
      <Link to="/inscription" className="inline-block rounded-xl bg-gradient-to-br from-blue-600 to-brand-deep px-6 py-3.5 font-bold text-white">
        Créer un compte pour continuer
      </Link>
    </div>
  );
}
