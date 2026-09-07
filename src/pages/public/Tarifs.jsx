import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const PLANS = [
  { name: 'Gratuit', price: '', features: ['Accès à 1 module', 'Essai limité', 'Support communautaire'] },
  { name: 'Standard', price: '', features: ['Tous les modules', 'Examens blancs illimités', 'Suivi de progression'], highlight: true },
  { name: 'Premium', price: '', features: ['Tout Standard', 'Correction personnalisée', 'Support prioritaire'] },
];

export default function Tarifs() {
  const [activePlan, setActivePlan] = useState(null);
  const planRefs = useRef([]);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    if (!mobileQuery.matches) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visiblePlan = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visiblePlan) setActivePlan(visiblePlan.target.dataset.plan);
      },
      { threshold: [0.35, 0.6, 0.85], rootMargin: '-10% 0px -10% 0px' },
    );

    planRefs.current.forEach((plan) => {
      if (plan) observer.observe(plan);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-10">
      <h1 className="mb-2 text-center font-display text-3xl font-bold text-ink">Nos offres</h1>
      <p className="mb-12 text-center text-gray-500">Choisissez la formule adaptée à votre préparation.</p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {PLANS.map((plan, index) => (
          <div
            key={plan.name}
            ref={(element) => { planRefs.current[index] = element; }}
            data-plan={plan.name}
            className={`rounded-2xl border p-8 shadow-sm transition-colors duration-300 ${
              activePlan === plan.name
                ? 'border-brand bg-blue-50/40 ring-2 ring-brand'
                : 'border-black/5 bg-white'
            } ${
              plan.highlight
                ? 'md:border-brand md:bg-blue-50/40 md:ring-2 md:ring-brand'
                : 'md:border-black/5 md:bg-white md:ring-0'
            }`}
          >
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
