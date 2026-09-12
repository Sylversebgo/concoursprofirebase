import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText, ClipboardCheck, BarChart3, Landmark, Briefcase, ChevronDown, X } from 'lucide-react';
import heroImage from '../../assets/hero.jpg';

const FORMATIONS = [
  {
    icon: Landmark,
    title: 'Concours directs',
  },
  {
    icon: Briefcase,
    title: 'Concours professionnels',
  },
];

const STATISTICS_BASE_COUNT = 115;
const STATISTICS_BASE_DATE = new Date('2026-09-08T00:00:00');

function getStatisticsTarget() {
  const elapsedDays = Math.floor((Date.now() - STATISTICS_BASE_DATE.getTime()) / (1000 * 60 * 60 * 24));
  return STATISTICS_BASE_COUNT + Math.max(0, Math.floor(elapsedDays / 5));
}

function FormationCard({ icon: Icon, title }) {
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

      {/* Astuce grid-rows [0fr -> 1fr] : anime la hauteur en douceur,
          même si le contenu déplié a une hauteur variable/inconnue. */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <Link
            to="/concours"
            onClick={(e) => e.stopPropagation()}
            className="border-t border-black/5 pt-4 text-sm font-bold text-brand hover:underline"
          >
            Voir les modules disponibles →
          </Link>
        </div>
      </div>
    </button>
  );
}

export default function Home() {
  const [toastVisible, setToastVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statsTitleVisible, setStatsTitleVisible] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [statsMessageVisible, setStatsMessageVisible] = useState(false);
  const [joinMessageVisible, setJoinMessageVisible] = useState(false);
  const statsSectionRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setToastVisible(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(current + 2, 100);
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let countInterval;
    let titleTimer;
    let countStartTimer;
    let statsMessageTimer;
    let joinMessageTimer;
    const targetCount = getStatisticsTarget();

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      titleTimer = setTimeout(() => setStatsTitleVisible(true), 250);
      countStartTimer = setTimeout(() => {
        countInterval = setInterval(() => {
          setRegisteredCount((current) => {
            if (current >= targetCount) {
              clearInterval(countInterval);
              return targetCount;
            }
            const nextCount = Math.min(current + 2, targetCount);
            if (nextCount === targetCount) {
              clearInterval(countInterval);
              statsMessageTimer = setTimeout(() => setStatsMessageVisible(true), 350);
              joinMessageTimer = setTimeout(() => setJoinMessageVisible(true), 1_150);
            }
            return nextCount;
          });
        }, 35);
      }, 900);
    }, { threshold: 0.35 });

    if (statsSectionRef.current) observer.observe(statsSectionRef.current);

    return () => {
      observer.disconnect();
      clearTimeout(titleTimer);
      clearTimeout(countStartTimer);
      clearInterval(countInterval);
      clearTimeout(statsMessageTimer);
      clearTimeout(joinMessageTimer);
    };
  }, []);

  return (
    <div>
      {toastVisible && (
        <div className="fixed right-4 top-4 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-black/10 bg-white p-4 shadow-xl" role="alert" aria-live="polite" aria-atomic="true">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-ink">Bienvenue sur ConcoursPro</p>
              <p className="mt-1 text-sm text-gray-500">Commencez votre préparation dès aujourd'hui.</p>
            </div>
            <button
              type="button"
              onClick={() => setToastVisible(false)}
              className="shrink-0 rounded-lg p-1 text-gray-400 hover:bg-black/5 hover:text-ink"
              aria-label="Fermer la notification"
            >
              <X size={17} />
            </button>
          </div>
        </div>
      )}

      <section
        className="relative isolate overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(247, 249, 252, 0.58), rgba(247, 249, 252, 0.58)), url(${heroImage})` }}
      >
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-10 md:py-24">
        <div>
          <span className="mb-5 inline-block rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-deep">
            Préparation pour les concours directs et professionnels
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight text-ink md:text-6xl">
            Préparez-vous au concours
          </h1>
          <p className="mt-5 max-w-lg text-lg text-gray-500">
            Travaillez avec des questions corrigées et suivez vos progrès.
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
        <div className="admission-card rounded-3xl bg-gradient-to-br from-ink to-brand-deep p-10 text-white shadow-2xl">
          <p className="font-display text-2xl font-bold">ConcoursPro</p>
          <p className="mt-2 text-sm text-white/70">Carte d'admission</p>
          <div className="mt-8 h-2 w-full rounded-full bg-white/15">
            <div className="h-2 rounded-full bg-brand transition-[width] duration-75" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-white/60">Progression : {progress}%</p>
        </div>
        </div>
      </section>

      <section ref={statsSectionRef} className="mx-auto max-w-6xl px-5 pb-20 md:px-10">
        <div className="rounded-2xl border border-black/5 bg-white px-6 py-10 text-center shadow-sm md:px-10">
          <h2
            className={`font-display text-3xl font-bold text-ink transition-all duration-1000 ease-out ${
              statsTitleVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
            }`}
          >
            Statistique réel
          </h2>
          <div className="mt-8 grid items-center gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-10">
            <p
              className={`text-lg font-bold text-ink transition-all duration-700 ease-out ${
                statsMessageVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}
            >
              Plus de 100 personnes déjà inscrites !
            </p>
            <p className="font-display text-7xl font-bold leading-none text-brand" aria-live="polite">
              {registeredCount}
            </p>
            <p
              className={`text-lg font-bold text-ink transition-all duration-700 ease-out ${
                joinMessageVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}
            >
              Qu'attends-tu pour nous rejoindre ?
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 md:px-10">
        <h2 className="mb-8 text-center font-display text-3xl font-bold text-ink">Pourquoi ConcoursPro ?</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            { icon: BookOpenText, title: 'Formation', text: 'Une formation adaptée à vos besoins.' },
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

      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-10">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-8 text-center md:px-10">
          <h2 className="font-display text-3xl font-bold text-ink">Apprendre sur les pays de l’Afrique</h2>
          <Link to="/pays" className="mt-3 inline-flex items-center font-bold text-brand transition hover:translate-x-1 hover:text-brand-deep">
            Cliquez ici pour commencer →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-10">
        <div className="rounded-2xl border border-amber-100 bg-[#fffaf0] px-6 py-8 text-center md:px-10">
          <h2 className="font-display text-3xl font-bold text-ink">Apprendre sur les autres pays du monde</h2>
          <Link to="/international" className="mt-3 inline-flex items-center font-bold text-amber-700 transition hover:translate-x-1 hover:text-amber-800">
            Cliquez ici pour commencer →
          </Link>
        </div>
      </section>
    </div>
  );
}