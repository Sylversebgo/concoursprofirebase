import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, Phone, Mail, MapPin } from 'lucide-react';

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

      <footer className="border-t border-black/5 bg-ink px-5 pt-14 pb-8 text-white/70 md:px-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">

          {/* Marque + description courte */}
          <div>
            <div className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <GraduationCap size={17} />
              </span>
              ConcoursPro
            </div>
            <p className="text-sm text-white/50">
              Préparation aux concours directs et professionnels.
            </p>
          </div>

          {/* Liens rapides — mêmes pages que la barre du haut */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-wide text-white/40">Navigation</p>
            <ul className="flex flex-col gap-2.5 text-sm">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-white">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services / concours proposés */}
          {/* TODO : adapte cette liste à tes vrais concours/services */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-wide text-white/40">Nos services</p>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link to="/concours" className="hover:text-white">Services en ligne</Link></li>
              <li><Link to="/concours" className="hover:text-white">Conception de CV professionnel</Link></li>
            </ul>
          </div>

          {/* Contact */}
          {/* TODO : remplace le numéro et l'e-mail par les tiens */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-wide text-white/40">Contact</p>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a href="https://wa.me/22657861564" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white">
                  <Phone size={15} className="shrink-0" /> +226 57 86 15 64
                </a>
              </li>
              <li>
                <a href="mailto:contact@concourspro.dev" className="flex items-center gap-2 hover:text-white">
                  <Mail size={15} className="shrink-0" /> applearn175@gmail.com
                </a>
              </li>
              {/* Décommente si tu veux afficher une adresse plus tard :
              <li className="flex items-center gap-2">
                <MapPin size={15} className="shrink-0" /> Ouagadougou, Burkina Faso
              </li>
              */}
            </ul>
          </div>

        </div>

        <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} ConcoursPro.</p>
          <div className="flex gap-4">
            <Link to="/mentions-legales" className="hover:text-white">Bonne chance !</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}