import {
  LayoutDashboard, BookOpen, Dumbbell, ClipboardList, TrendingUp,
  FileText, Bell, User,
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const ITEMS = [
  { to: '/dashboard-candidat', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/mes-modules', label: 'Mes modules', icon: BookOpen },
  { to: '/entrainement', label: 'Entraînement', icon: Dumbbell },
  { to: '/examens', label: 'Examens', icon: ClipboardList },
  { to: '/progression', label: 'Progression', icon: TrendingUp },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profil', label: 'Mon profil', icon: User },
];

export default function CandidatLayout({ children }) {
  return (
    <DashboardLayout items={ITEMS} title="Espace candidat">
      {children}
    </DashboardLayout>
  );
}
