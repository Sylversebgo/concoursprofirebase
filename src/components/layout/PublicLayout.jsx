import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';

const NAV = [
  { to: '/', label: 'Accueil' },
  { to: '/concours', label: 'Concours' },
  { to: '/tarifs', label: 'Tarifs' },
  { to: '/contact', label: 'Contact' },
];

export default function PublicLayout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f9fc]">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-black/5 bg-white px-5 md:px-10">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-brand-deep text-white">
            <GraduationCap size={17} />
          </span>
          ConcoursPro
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                location.pathname === item.to ? 'bg-blue-50 text-brand' : 'text-ink/70 hover:bg-black/5'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/connexion" className="ml-2 rounded-lg px-3.5 py-2 text-sm font-semibold text-ink/70 hover:bg-black/5">
            Se connecter
          </Link>
          <Link
            to="/inscription"
            className="ml-1 rounded-xl bg-gradient-to-br from-blue-600 to-brand-deep px-4 py-2 text-sm font-bold text-white"
          >
            S'inscrire
          </Link>
        </nav>

        <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Ouvrir le menu">
          <Menu size={22} />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-72 flex-col gap-1 bg-white p-5">
            <button className="mb-4 self-end" onClick={() => setOpen(false)} aria-label="Fermer">
              <X size={22} />
            </button>
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-ink hover:bg-black/5"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/connexion" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-semibold text-ink hover:bg-black/5">
              Se connecter
            </Link>
            <Link
              to="/inscription"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-gradient-to-br from-blue-600 to-brand-deep px-4 py-3 text-center text-sm font-bold text-white"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      )}

      <main className="flex-1">{children}</main>

      <footer className="border-t border-black/5 bg-ink px-5 py-10 text-center text-sm text-white/60 md:px-10">
        <p>© {new Date().getFullYear()} ConcoursPro — Préparation aux concours directs et professionnels.</p>
        <div className="mt-3 flex justify-center gap-4">
          <Link to="/mentions-legales" className="hover:text-white">Mentions légales</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
