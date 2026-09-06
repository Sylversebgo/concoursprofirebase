import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ roles, children }) {
  const { isAuthenticated, hasRole, isFreeCandidat, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const isAdminRoute = roles?.some((r) => r === 'admin' || r === 'superadmin');
    return <Navigate to={isAdminRoute ? '/connexion-admin' : '/connexion'} replace />;
  }

  if (roles && roles.length > 0 && !hasRole(...roles)) {
    return <Navigate to="/acces-refuse" replace />;
  }

  // Un candidat "free" (auto-inscrit, pas encore payé) ne peut accéder à
  // AUCUNE page de l'espace candidat par URL directe — il est systématiquement
  // renvoyé vers l'essai gratuit à 10 QCM tant qu'un admin ne l'a pas fait
  // passer en "paid".
  if (roles?.includes('candidat') && isFreeCandidat) {
    return <Navigate to="/essai-gratuit" replace />;
  }

  return children;
}
