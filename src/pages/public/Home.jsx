import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText, ClipboardCheck, BarChart3, Landmark, Briefcase, ChevronDown, X, ArrowUpRight, Globe2, MapPinned } from 'lucide-react';
import graduationImage from '../../assets/hero-graduation.jpg';
import femaleStudentImage from '../../assets/hero-etudiante.jpg';
import maleStudentImage from '../../assets/hero-etudiant-ordinateur.jpg';

const HERO_SLIDES = [graduationImage, femaleStudentImage, maleStudentImage];

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

function CountryFlag({ code, label, className = 'h-5 w-7' }) {
  const flags = {
    bf: (
      <>
        <rect width="40" height="20" fill="#ef2b2d" />
        <rect y="10" width="40" height="10" fill="#159447" />
        <path d="m20 5 1.18 3.63H25l-3.09 2.24 1.18 3.63L20 12.26l-3.09 2.24 1.18-3.63L15 8.63h3.82L20 5Z" fill="#f9d616" />
      </>
    ),
    ci: (
      <>
        <rect width="13.34" height="20" fill="#f77f00" />
        <rect x="13.33" width="13.34" height="20" fill="#fff" />
        <rect x="26.66" width="13.34" height="20" fill="#009e60" />
      </>
    ),
    sn: (
      <>
        <rect width="13.34" height="20" fill="#00853f" />
        <rect x="13.33" width="13.34" height="20" fill="#fdef42" />
        <rect x="26.66" width="13.34" height="20" fill="#e31b23" />
        <path d="m20 6 1.08 3.32h3.49l-2.82 2.04 1.08 3.32L20 12.63l-2.82 2.05 1.08-3.32-2.82-2.04h3.48L20 6Z" fill="#00853f" />
      </>
    ),
    gh: (
      <>
        <rect width="40" height="6.67" fill="#ce1126" />
        <rect y="6.66" width="40" height="6.68" fill="#fcd116" />
        <rect y="13.33" width="40" height="6.67" fill="#006b3f" />
        <path d="m20 8.1.62 1.9h2l-1.62 1.18.62 1.9L20 11.9l-1.62 1.18.62-1.9-1.62-1.18h2L20 8.1Z" fill="#000" />
      </>
    ),
    fr: (
      <>
        <rect width="13.34" height="20" fill="#0055a4" />
        <rect x="13.33" width="13.34" height="20" fill="#fff" />
        <rect x="26.66" width="13.34" height="20" fill="#ef4135" />
      </>
    ),
    ca: (
      <>
        <rect width="8" height="20" fill="#d80621" />
        <rect x="8" width="24" height="20" fill="#fff" />
        <rect x="32" width="8" height="20" fill="#d80621" />
        <path d="m20 4 1.5 3 2.3-1.1-.8 3 2.4 1.1-2.2 1.6.7 3.1-3.9-1.5-3.9 1.5.7-3.1-2.2-1.6 2.4-1.1-.8-3L18.5 7 20 4Z" fill="#d80621" />
      </>
    ),
    jp: (
      <>
        <rect width="40" height="20" fill="#fff" />
        <circle cx="20" cy="10" r="6" fill="#bc002d" />
      </>
    ),
  };

  return (
    <svg className={`${className} shrink-0 overflow-hidden rounded-[3px] shadow-sm ring-1 ring-black/10`} viewBox="0 0 40 20" role="img" aria-label={label}>
      {flags[code]}
    </svg>
  );
}

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
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const statsSectionRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setToastVisible(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const interval = setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, 5500);

    return () => clearInterval(interval);
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
        aria-label="Présentation de ConcoursPro"
      >
        <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          {HERO_SLIDES.map((image, index) => {
            const position = (index - activeHeroSlide + HERO_SLIDES.length) % HERO_SLIDES.length;
            const offset = position === 0 ? 0 : position === HERO_SLIDES.length - 1 ? -100 : 100;

            return (
              <div
                key={image}
                className={`absolute inset-0 overflow-hidden transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${index === activeHeroSlide ? 'opacity-100' : 'opacity-0'}`}
                style={{ transform: `translateX(${offset}%)` }}
              >
                <img
                  src={image}
                  alt=""
                  className={`h-full w-full object-cover ${index === activeHeroSlide ? 'hero-image-drift' : ''}`}
                />
              </div>
            );
          })}
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(10,44,28,0.91)_0%,rgba(12,61,39,0.78)_55%,rgba(15,55,35,0.62)_100%)]" />
        </div>
        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-10 md:py-24">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-yellow-200 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c52836]" />
            Préparation pour les concours directs et professionnels
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-6xl">
            Préparez-vous au <span className="text-yellow-300">concours</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-white/75">
            Travaillez avec des questions corrigées et suivez vos progrès.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/essai-gratuit" className="rounded-xl bg-yellow-300 px-6 py-3.5 font-bold text-ink shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-yellow-200">
              Commencer gratuitement
            </Link>
            <Link to="/connexion" className="rounded-xl border border-white/40 bg-white/5 px-6 py-3.5 font-bold text-white transition hover:bg-white/15">
              Se connecter
            </Link>
          </div>
        </div>
        <div className="admission-card relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-ink to-brand-deep p-10 text-white shadow-2xl">
          <div className="absolute inset-x-0 top-0 flex h-1" aria-hidden="true">
            <span className="w-1/3 bg-[#c52836]" />
            <span className="w-1/3 bg-[#f5c842]" />
            <span className="w-1/3 bg-brand" />
          </div>
          <p className="font-display text-2xl font-bold">ConcoursPro</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-white/70"><span className="h-2 w-2 rounded-full bg-yellow-300" />Carte d'admission</p>
          <div className="mt-8 h-2 w-full rounded-full bg-white/15">
            <div className="h-2 rounded-full bg-yellow-300 transition-[width] duration-75" style={{ width: `${progress}%` }} />
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
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand">Explorez et découvrez</p>
          <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">Le monde à portée de main</h2>
          <p className="mt-3 text-sm text-gray-500">Parcourez les pays, leurs drapeaux et leurs informations clés.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Link
            to="/pays"
            className="destination-card-enter group relative flex min-h-64 overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#0f3c2b_0%,#14633e_65%,#173f33_100%)] p-7 text-white shadow-lg shadow-brand/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30 md:p-9"
          >
            <MapPinned className="pointer-events-none absolute -bottom-10 -right-6 h-56 w-56 -rotate-12 text-white/[0.07] transition duration-500 group-hover:rotate-0 group-hover:scale-110" strokeWidth={1} aria-hidden="true" />
            <div className="relative z-10 flex w-full flex-col justify-between gap-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-yellow-300 shadow-inner backdrop-blur-sm transition duration-300 group-hover:scale-105 group-hover:bg-white/15" aria-label="Carte de l’Afrique">
                  <svg viewBox="0 0 48 48" className="h-9 w-9 drop-shadow-sm" role="img" aria-hidden="true">
                    <path fill="currentColor" d="m20 3 5 2 4 3 5-1 3 4 5 2-2 5 2 4-3 4-1 5-4 2-2 5-4 2-2 5-4 2-4-4-2-6-4-3-1-5-4-3-1-5-4-3 2-4-2-4 4-3 2-4 5-1 3-3 4 1Z" />
                  </svg>
                </div>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-yellow-200">Drapeaux et capitales</span>
              </div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-bold md:text-3xl">L’Afrique</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-white/70">Découvrez les pays, les capitales et les drapeaux du continent.</p>
                  <div className="mt-4 flex items-center gap-2" aria-label="Quelques drapeaux d’Afrique">
                    <CountryFlag code="gh" label="Ghana" />
                    <CountryFlag code="ci" label="Côte d’Ivoire" />
                    <CountryFlag code="sn" label="Sénégal" />
                  </div>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-300 text-brand-deep transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true">
                  <ArrowUpRight size={21} />
                </span>
              </div>
            </div>
          </Link>

          <Link
            to="/international"
            className="destination-card-enter group relative flex min-h-64 overflow-hidden rounded-3xl border border-amber-200/70 bg-[linear-gradient(135deg,#fff8e5_0%,#ffffff_55%,#effaf3_100%)] p-7 text-ink shadow-lg shadow-amber-900/5 transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-900/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/50 md:p-9"
          >
            <Globe2 className="pointer-events-none absolute -bottom-10 -right-7 h-56 w-56 rotate-12 text-brand/[0.08] transition duration-500 group-hover:rotate-0 group-hover:scale-110" strokeWidth={1} aria-hidden="true" />
            <div className="relative z-10 flex w-full flex-col justify-between gap-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand/10 bg-white/80 shadow-sm transition duration-300 group-hover:scale-105 group-hover:bg-white">
                  <Globe2 className="h-8 w-8 text-brand" strokeWidth={1.7} aria-hidden="true" />
                </div>
                <span className="rounded-full border border-brand/10 bg-white/75 px-3 py-1.5 text-xs font-semibold text-brand-deep">Le monde entier</span>
              </div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-bold md:text-3xl">Les autres pays</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-ink/65">Partez à la découverte des pays et des cultures du monde.</p>
                  <div className="mt-4 flex items-center gap-2" aria-label="Quelques drapeaux du monde">
                    <CountryFlag code="fr" label="France" />
                    <CountryFlag code="ca" label="Canada" />
                    <CountryFlag code="jp" label="Japon" />
                  </div>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true">
                  <ArrowUpRight size={21} />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}