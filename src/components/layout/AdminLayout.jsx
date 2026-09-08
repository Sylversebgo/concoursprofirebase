import {
  LayoutDashboard, Users, HelpCircle, Upload, BookOpen, ClipboardList,
  FileCheck, LineChart, FolderOpen, ShieldCheck, MessageSquare, Bell, Sparkles,
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';

const BASE_ITEMS = [
  { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/utilisateurs', label: 'Utilisateurs', icon: Users },
  { to: '/gestion-questions', label: 'Questions', icon: HelpCircle },
  { to: '/import-csv', label: 'Import CSV', icon: Upload },
  { to: '/gestion-modules', label: 'Modules', icon: BookOpen },
  { to: '/copies-examens', label: 'Copies à corriger', icon: FileCheck },
  { to: '/suivi-candidats', label: 'Suivi candidats', icon: LineChart },
  { to: '/gestion-documents', label: 'Documents', icon: FolderOpen },
  { to: '/statistiques-admin', label: 'Statistiques', icon: LineChart },
  { to: '/messagerie', label: 'Messagerie', icon: MessageSquare },
  { to: '/notifications', label: 'Notifications', icon: Bell },
];

// La gestion des examens est accessible aux admins et superadmins.
const SUPERADMIN_ITEMS = [
  { to: '/essai-gratuit-admin', label: 'Essai gratuit', icon: Sparkles },
  { to: '/gestion-admins', label: 'Gestion admins', icon: ShieldCheck },
];

export default function AdminLayout({ children }) {
  const { hasRole } = useAuth();
  const items = hasRole('superadmin')
    ? [...BASE_ITEMS, { to: '/gestion-examens', label: 'Examens', icon: ClipboardList }, ...SUPERADMIN_ITEMS]
    : [...BASE_ITEMS, { to: '/gestion-examens', label: 'Examens', icon: ClipboardList }];

  return (
    <DashboardLayout items={items} title="Espace administration">
      {children}
    </DashboardLayout>
  );
}
