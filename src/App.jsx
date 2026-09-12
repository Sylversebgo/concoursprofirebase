import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/layout/PublicLayout';
import CandidatLayout from './components/layout/CandidatLayout';
import AdminLayout from './components/layout/AdminLayout';

// Pages publiques
import Home from './pages/public/Home';
import Pays from './pages/public/Pays';
import International from './pages/public/International';
import Concours from './pages/public/Concours';
import APropos from './pages/public/APropos';
import Tarifs from './pages/public/Tarifs';
import Offre from './pages/public/Offre';
import Connexion from './pages/public/Connexion';
import ConnexionAdmin from './pages/public/ConnexionAdmin';
import Inscription from './pages/public/Inscription';
import EssaiGratuit from './pages/public/EssaiGratuit';
import Contact from './pages/public/Contact';
import ContactWhatsApp from './pages/public/ContactWhatsApp';
import MentionsLegales from './pages/public/MentionsLegales';
import MotDePasseOublie from './pages/public/MotDePasseOublie';
import AccesRefuse from './pages/public/AccesRefuse';
import NotFound from './pages/public/NotFound';

// Pages candidat
import DashboardCandidat from './pages/candidat/DashboardCandidat';
import MesModules from './pages/candidat/MesModules';
import ModuleDetail from './pages/candidat/ModuleDetail';
import Entrainement from './pages/candidat/Entrainement';
import EntrainementQuestions from './pages/candidat/EntrainementQuestions';
import CorrectionQuestion from './pages/candidat/CorrectionQuestion';
import ExamensCandidat from './pages/candidat/ExamensCandidat';
import PasserExamen from './pages/candidat/PasserExamen';
import Resultat from './pages/candidat/Resultat';
import Progression from './pages/candidat/Progression';
import DocumentsCandidat from './pages/candidat/DocumentsCandidat';
import Profil from './pages/candidat/Profil';

// Page partagée
import Messagerie from './pages/shared/Messagerie';
import Notifications from './pages/shared/Notifications';

// Pages admin
import Dashboard from './pages/admin/Dashboard';
import Utilisateurs from './pages/admin/Utilisateurs';
import GestionQuestions from './pages/admin/GestionQuestions';
import ImportCsv from './pages/admin/ImportCsv';
import VerificationCsv from './pages/admin/VerificationCsv';
import GestionModules from './pages/admin/GestionModules';
import GestionExamens from './pages/admin/GestionExamens';
import CopiesExamens from './pages/admin/CopiesExamens';
import CorrectionCopie from './pages/admin/CorrectionCopie';
import SuiviCandidats from './pages/admin/SuiviCandidats';
import GestionDocuments from './pages/admin/GestionDocuments';
import StatistiquesAdmin from './pages/admin/StatistiquesAdmin';
import GestionAdmins from './pages/admin/GestionAdmins';
import GestionEssaiGratuit from './pages/admin/GestionEssaiGratuit';

function wrap(Layout, Page) {
  return (
    <Layout>
      <Page />
    </Layout>
  );
}

function protect(roles, Layout, Page) {
  return (
    <ProtectedRoute roles={roles}>
      <Layout>
        <Page />
      </Layout>
    </ProtectedRoute>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={wrap(PublicLayout, Home)} />
      <Route path="/pays" element={wrap(PublicLayout, Pays)} />
      <Route path="/international" element={wrap(PublicLayout, International)} />
      <Route path="/concours" element={wrap(PublicLayout, Concours)} />
      <Route path="/a-propos" element={wrap(PublicLayout, APropos)} />
      <Route path="/tarifs" element={wrap(PublicLayout, Tarifs)} />
      <Route path="/offre" element={wrap(PublicLayout, Offre)} />
      <Route path="/connexion" element={wrap(PublicLayout, Connexion)} />
      <Route path="/connexion-admin" element={wrap(PublicLayout, ConnexionAdmin)} />
      <Route path="/inscription" element={wrap(PublicLayout, Inscription)} />
      <Route path="/essai-gratuit" element={wrap(PublicLayout, EssaiGratuit)} />
      {/* Ancienne URL conservée en redirection, au cas où des liens externes existent déjà */}
      <Route path="/tester-gratuitement" element={<Navigate to="/essai-gratuit" replace />} />
      <Route path="/contact" element={wrap(PublicLayout, Contact)} />
      <Route path="/contact-whatsapp" element={wrap(PublicLayout, ContactWhatsApp)} />
      <Route path="/mentions-legales" element={wrap(PublicLayout, MentionsLegales)} />
      <Route path="/mot-de-passe-oublie" element={wrap(PublicLayout, MotDePasseOublie)} />
      <Route path="/acces-refuse" element={wrap(PublicLayout, AccesRefuse)} />

      {/* Candidat */}
      <Route path="/dashboard-candidat" element={protect(['candidat'], CandidatLayout, DashboardCandidat)} />
      <Route path="/mes-modules" element={protect(['candidat'], CandidatLayout, MesModules)} />
      <Route path="/module-detail" element={protect(['candidat'], CandidatLayout, ModuleDetail)} />
      <Route path="/entrainement" element={protect(['candidat'], CandidatLayout, Entrainement)} />
      <Route path="/entrainement-questions" element={protect(['candidat'], CandidatLayout, EntrainementQuestions)} />
      <Route path="/correction-question" element={protect(['candidat'], CandidatLayout, CorrectionQuestion)} />
      <Route path="/examens" element={protect(['candidat'], CandidatLayout, ExamensCandidat)} />
      <Route path="/passer-examen/:id" element={protect(['candidat'], CandidatLayout, PasserExamen)} />
      <Route path="/resultat" element={protect(['candidat'], CandidatLayout, Resultat)} />
      <Route path="/progression" element={protect(['candidat'], CandidatLayout, Progression)} />
      <Route path="/documents" element={protect(['candidat'], CandidatLayout, DocumentsCandidat)} />
      <Route path="/profil" element={protect(['candidat'], CandidatLayout, Profil)} />

      {/* Admin / Superadmin */}
      <Route path="/dashboard" element={protect(['admin', 'superadmin'], AdminLayout, Dashboard)} />
      <Route path="/utilisateurs" element={protect(['admin', 'superadmin'], AdminLayout, Utilisateurs)} />
      <Route path="/gestion-questions" element={protect(['admin', 'superadmin'], AdminLayout, GestionQuestions)} />
      <Route path="/import-csv" element={protect(['admin', 'superadmin'], AdminLayout, ImportCsv)} />
      <Route path="/verification-csv" element={protect(['admin', 'superadmin'], AdminLayout, VerificationCsv)} />
      <Route path="/gestion-modules" element={protect(['admin', 'superadmin'], AdminLayout, GestionModules)} />
      <Route path="/gestion-examens" element={protect(['admin', 'superadmin'], AdminLayout, GestionExamens)} />
      <Route path="/essai-gratuit-admin" element={protect(['superadmin'], AdminLayout, GestionEssaiGratuit)} />
      <Route path="/copies-examens" element={protect(['admin', 'superadmin'], AdminLayout, CopiesExamens)} />
      <Route path="/correction-copie/:id" element={protect(['admin', 'superadmin'], AdminLayout, CorrectionCopie)} />
      <Route path="/suivi-candidats" element={protect(['admin', 'superadmin'], AdminLayout, SuiviCandidats)} />
      <Route path="/gestion-documents" element={protect(['admin', 'superadmin'], AdminLayout, GestionDocuments)} />
      <Route path="/statistiques-admin" element={protect(['admin', 'superadmin'], AdminLayout, StatistiquesAdmin)} />
      <Route path="/gestion-admins" element={protect(['superadmin'], AdminLayout, GestionAdmins)} />

      {/* Messagerie et Notifications : partagées candidat / admin, layout choisi selon le rôle */}
      <Route path="/messagerie" element={<MessagerieRouter />} />
      <Route path="/notifications" element={<NotificationsRouter />} />

      <Route path="*" element={wrap(PublicLayout, NotFound)} />
    </Routes>
  );
}

function MessagerieRouter() {
  const { hasRole } = useAuth();
  const Layout = hasRole('admin', 'superadmin') ? AdminLayout : CandidatLayout;
  return (
    <ProtectedRoute roles={['candidat', 'admin', 'superadmin']}>
      <Layout>
        <Messagerie />
      </Layout>
    </ProtectedRoute>
  );
}

function NotificationsRouter() {
  const { hasRole } = useAuth();
  const Layout = hasRole('admin', 'superadmin') ? AdminLayout : CandidatLayout;
  return (
    <ProtectedRoute roles={['candidat', 'admin', 'superadmin']}>
      <Layout>
        <Notifications />
      </Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
