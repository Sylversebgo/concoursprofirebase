import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Layout partagé par l'espace candidat et l'espace admin.
// `items` = [{ to, label, icon }], `title` = nom affiché en haut de la sidebar.
export default function DashboardLayout({ items, title, children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="flex min-h-screen bg-[#f7f9fc]">
      <aside className="fixed hidden h-screen w-64 flex-col bg-ink md:flex">
        <div className="flex items-center gap-2 px-5 py-5 font-display text-lg font-bold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <GraduationCap size={17} />
          </span>
          ConcoursPro
        </div>
        <p className="px-5 pb-4 text-xs font-semibold uppercase tracking-wide text-white/40">{title}</p>

        <nav className="flex-1 overflow-y-auto px-3 pb-3">
          {items.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  active ? 'bg-white text-ink' : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <Icon size={17} strokeWidth={2} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-white/10 p-3">
          <div className="mb-2 px-2 text-xs text-white/50">
            {profile?.firstName} {profile?.lastName}
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/10"
          >
            <LogOut size={17} /> Déconnexion
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-ink">
            <button className="self-end p-4 text-white" onClick={() => setOpen(false)} aria-label="Fermer">
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 px-5 py-2 font-display text-lg font-bold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <GraduationCap size={17} />
              </span>
              ConcoursPro
            </div>
            <p className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-white/40">{title}</p>

            <nav className="flex-1 overflow-y-auto px-3">
              {items.map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      active ? 'bg-white text-ink' : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={17} strokeWidth={2} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="shrink-0 border-t border-white/10 p-3">
              <div className="mb-2 px-2 text-xs text-white/50">
                {profile?.firstName} {profile?.lastName}
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/10"
              >
                <LogOut size={17} /> Déconnexion
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 md:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/5 bg-white px-5 md:px-8">
          <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Ouvrir le menu">
            <Menu size={22} />
          </button>
          <span className="hidden text-sm font-semibold text-ink/50 md:block">
            Bonjour, {profile?.firstName} 👋
          </span>
          <div className="flex items-center gap-2">
            <Link to={items.find((i) => i.to.includes('notification'))?.to || '/notifications'} className="rounded-lg p-2 hover:bg-black/5">
              <Bell size={19} />
            </Link>
            {/* Bouton déconnexion visible même en desktop en haut, en plus de la sidebar */}
            <button
              onClick={handleLogout}
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-ink/60 hover:bg-black/5 md:flex"
              title="Se déconnecter"
            >
              <LogOut size={15} /> Déconnexion
            </button>
          </div>
        </header>

        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
