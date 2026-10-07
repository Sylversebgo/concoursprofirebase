import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, Phone, Mail, MapPin } from 'lucide-react';
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

const NAV = [
  { to: '/', label: 'Accueil' },
  { to: '/a-propos', label: 'À propos de nous' },
  { to: '/tarifs', label: 'Tarifs' },
  { to: '/contact', label: 'Contact' },
];

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://www.facebook.com/', icon: FaFacebookF, className: 'bg-[#1877f2] hover:bg-[#0f65d1]' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: FaLinkedinIn, className: 'bg-[#0a66c2] hover:bg-[#084f96]' },
  { label: 'Gmail', href: 'https://mail.google.com/mail/?view=cm&fs=1&to=applearn175@gmail.com', icon: SiGmail, className: 'bg-[#ea4335] hover:bg-[#c9362a]' },
];

export default function PublicLayout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f9fc]">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-black/5 bg-white px-5 md:px-10">
        <div className="absolute inset-x-0 top-0 flex h-1" aria-hidden="true">
          <span className="w-1/3 bg-[#c52836]" />
          <span className="w-1/3 bg-[#f5c842]" />
          <span className="w-1/3 bg-brand" />
        </div>
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-deep text-white">
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
            className="ml-1 rounded-xl bg-gradient-to-br from-brand to-brand-deep px-4 py-2 text-sm font-bold text-white"
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
              className="mt-2 rounded-xl bg-gradient-to-br from-brand to-brand-deep px-4 py-3 text-center text-sm font-bold text-white"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      )}

      <main className="flex-1">{children}</main>

      <footer className="relative overflow-hidden bg-[linear-gradient(135deg,#102f25_0%,#123d2c_55%,#0b3024_100%)] px-5 pt-12 pb-8 text-white/70 md:px-10">
        <div className="absolute inset-x-0 top-0 flex h-1.5" aria-hidden="true">
          <span className="w-1/3 bg-[#c52836]" />
          <span className="w-1/3 bg-[#f5c842]" />
          <span className="w-1/3 bg-brand" />
        </div>
        <div className="pointer-events-none absolute -right-20 top-8 h-64 w-64 rounded-full bg-brand/15 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">

          {/* Marque + description courte */}
          <div>
            <div className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-300 text-brand-deep shadow-lg shadow-black/15">
                <GraduationCap size={17} />
              </span>
              ConcoursPro
            </div>
            <p className="max-w-xs text-sm leading-6 text-white/65">
              Préparation aux concours directs et professionnels.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-yellow-200">
              <span className="h-2 w-2 rounded-full bg-[#c52836]" />
              Cap sur la réussite
            </div>
          </div>

          {/* Liens rapides — mêmes pages que la barre du haut */}
          <div>
            <p className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3 text-xs font-bold uppercase tracking-[0.16em] text-yellow-200">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c52836]" />
              Navigation
            </p>
            <ul className="flex flex-col gap-2.5 text-sm">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="inline-block transition hover:translate-x-1 hover:text-yellow-200">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services / concours proposés */}
          {/* TODO : adapte cette liste à tes vrais concours/services */}
          <div>
            <p className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3 text-xs font-bold uppercase tracking-[0.16em] text-yellow-200">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c52836]" />
              Nos services
            </p>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link to="/concours" className="inline-block transition hover:translate-x-1 hover:text-yellow-200">Services en ligne</Link></li>
              <li><Link to="/concours" className="inline-block transition hover:translate-x-1 hover:text-yellow-200">Conception de CV professionnel</Link></li>
            </ul>
          </div>

          {/* Contact */}
          {/* TODO : remplace le numéro et l'e-mail par les tiens */}
          <div>
            <p className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3 text-xs font-bold uppercase tracking-[0.16em] text-yellow-200">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c52836]" />
              Contact
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a href="https://wa.me/22657861564" target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-yellow-200">
                  <Phone size={15} className="shrink-0 text-yellow-300" /> +226 57 86 15 64
                </a>
              </li>
              <li>
                <a href="mailto:contact@concourspro.dev" className="flex items-center gap-2 transition hover:text-yellow-200">
                  <Mail size={15} className="shrink-0 text-yellow-300" /> applearn175@gmail.com
                </a>
              </li>
              {/* Décommente si tu veux afficher une adresse plus tard :
              <li className="flex items-center gap-2">
                <MapPin size={15} className="shrink-0" /> Ouagadougou, Burkina Faso
              </li>
              */}
            </ul>
            <div className="mt-5 flex items-center gap-2.5">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon, className }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Ouvrir ${label}`}
                  title={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg transition hover:-translate-y-1 ${className}`}
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

        </div>

        <div className="relative z-10 mx-auto mt-12 max-w-6xl">
          <div className="mb-5 flex h-px overflow-hidden" aria-hidden="true">
            <span className="w-1/3 bg-[#c52836]/80" />
            <span className="w-1/3 bg-[#f5c842]/80" />
            <span className="w-1/3 bg-brand/80" />
          </div>
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-white/55 sm:flex-row">
            <p>© {new Date().getFullYear()} ConcoursPro.</p>
            <div className="flex gap-5">
              <Link to="/mentions-legales" className="transition hover:text-yellow-200">Bonne chance !</Link>
              <Link to="/contact" className="transition hover:text-yellow-200">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}