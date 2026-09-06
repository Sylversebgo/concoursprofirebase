import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText, ClipboardCheck, BarChart3, Landmark, Briefcase, ChevronDown } from 'lucide-react';

const FORMATIONS = [
  {
    icon: Landmark,
    title: 'Concours directs',
    summary: "Pour les nouveaux diplômés qui intègrent la fonction publique ou une entreprise pour la première fois.",
    details: [
      'Ouvert dès l\'obtention du diplôme requis, sans expérience professionnelle exigée.',
      'Épreuves de culture générale, spécialité et parfois entretien de motivation.',
      'Modules disponibles : Fonction publique, Enseignement, Banque.',
    ],
  },
  {
    icon: Briefcase,
    title: 'Concours professionnels',
    summary: "Pour les agents déjà en poste qui souhaitent évoluer ou changer de catégorie.",
    details: [
      'Réservé aux candidats justifiant d\'une expérience professionnelle minimale.',
      'Épreuves souvent plus techniques, centrées sur le métier exercé.',
      'Une bonne voie pour progresser sans repartir de zéro.',
    ],
  },
];

function FormationCard({ icon: Icon, title, summary, details }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen((o) => !o)}
      className="w-full rounded-2xl border border-black/5 bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink text-white">
          <Icon size={24} />
        </div>
        <ChevronDown
          size={20}
          className={`mt-2 shrink-0 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </div>

      <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{summary}</p>

      {/* Astuce grid-rows [0fr -> 1fr] : anime la hauteur en douceur,
          même si le contenu déplié a une hauteur variable/inconnue. */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <ul className="flex flex-col gap-2 border-t border-black/5 pt-4 text-sm text-gray-600">
            {details.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {line}
              </li>
            ))}
          </ul>
          <Link
            to="/concours"
            onClick={(e) => e.stopPropagation()}
            className="mt-4 inline-block text-sm font-bold text-brand hover:underline"
          >
            Voir les modules disponibles →
          </Link>
        </div>
      </div>
    </button>
  );
}

export default function Home() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-10 md:py-24">
        <div>
          <span className="mb-5 inline-block rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-deep">
            Préparation pour les concours directs et professionnels
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight text-ink md:text-6xl">
            Préparez le concours qui <span className="text-brand">va changer votre vie.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-gray-500">
            Entraînez-vous avec des questions corrigées  et suivez votre
            progression jusqu'au jour de l'examen.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/essai-gratuit" className="rounded-xl bg-gradient-to-br from-blue-600 to-brand-deep px-6 py-3.5 font-bold text-white shadow-lg shadow-brand/20">
              Commencer gratuitement
            </Link>
            <Link to="/connexion" className="rounded-xl border border-brand/40 px-6 py-3.5 font-bold text-brand">
              Se connecter
            </Link>
          </div>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-ink to-brand-deep p-10 text-white shadow-2xl">
          <p className="font-display text-2xl font-bold">ConcoursPro</p>
          <p className="mt-2 text-sm text-white/70">Carte d'admission</p>
          <div className="mt-8 h-2 w-full rounded-full bg-white/15">
            <div className="h-2 w-3/4 rounded-full bg-brand" />
          </div>
          <p className="mt-2 text-xs text-white/60">Progression : 75%</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 md:px-10">
        <h2 className="mb-8 text-center font-display text-3xl font-bold text-ink">Pourquoi ConcoursPro ?</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            { icon: BookOpenText, title: 'Formations', text: 'Des cours complets et structurés par des experts.' },
            { icon: ClipboardCheck, title: 'Quiz', text: 'Des milliers de questions corrigées et expliquées.' },
            { icon: BarChart3, title: 'Progression', text: 'Un suivi détaillé pour cibler vos révisions.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-brand">
                <Icon size={22} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-ink">{title}</h3>
              <p className="text-sm text-gray-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-10">
        <h2 className="mb-2 text-center font-display text-3xl font-bold text-ink">Formations proposées</h2>
        <p className="mb-8 text-center text-sm text-gray-500">Cliquez sur une carte pour en savoir plus.</p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {FORMATIONS.map((f) => (
            <FormationCard key={f.title} {...f} />
          ))}
        </div>
      </section>
    </div>
  );
}