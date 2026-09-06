import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const PLANS = [
  { name: 'Gratuit', price: '', features: ['Accès à 1 module', 'Essai limité', 'Support communautaire'] },
  { name: 'Standard', price: '', features: ['Tous les modules', 'Examens blancs illimités', 'Suivi de progression'], highlight: true },
  { name: 'Premium', price: '', features: ['Tout Standard', 'Correction personnalisée', 'Support prioritaire'] },
];

export default function Tarifs() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-10">
      <h1 className="mb-2 text-center font-display text-3xl font-bold text-ink">Nos offres</h1>
      <p className="mb-12 text-center text-gray-500">Choisissez la formule adaptée à votre préparation.</p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div key={plan.name} className={`rounded-2xl border p-8 shadow-sm ${plan.highlight ? 'border-brand bg-blue-50/40 ring-2 ring-brand' : 'border-black/5 bg-white'}`}>
            <h3 className="text-lg font-bold text-ink">{plan.name}</h3>
            <p className="mt-2 mb-6 text-2xl font-bold text-brand">{plan.price}</p>
            <ul className="mb-8 flex flex-col gap-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-green-600" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/inscription" className="block rounded-xl bg-gradient-to-br from-blue-600 to-brand-deep py-3 text-center font-bold text-white">
              Choisir
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
