import { Link } from 'react-router-dom';
import { BookOpenText, ClipboardCheck, BarChart3, Landmark, GraduationCap, Banknote } from 'lucide-react';

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
            Entraînez-vous avec des questions corrigées par des experts et suivez votre
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
        <h2 className="mb-8 text-center font-display text-3xl font-bold text-ink">Concours disponibles</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            { icon: Landmark, title: 'Fonction Publique' },
            { icon: GraduationCap, title: 'Enseignement' },
            { icon: Banknote, title: 'Banque' },
          ].map(({ icon: Icon, title }) => (
            <Link key={title} to="/concours" className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-white">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-ink">Concours {title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
