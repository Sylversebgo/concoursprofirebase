import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const snap = await getDoc(doc(db, 'users', user.uid));
        setProfile(snap.exists() ? { id: user.uid, ...snap.data() } : null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Auto-inscription publique -> toujours role "candidat" + accountType "free"
  // (le candidat reste sur la page d'essai gratuit tant qu'un admin ne l'a
  // pas fait passer en "paid" en créant lui-même son compte définitif).
  async function register({ firstName, lastName, email, phone, password }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const newProfile = {
      firstName,
      lastName,
      email,
      phone: phone || '',
      role: 'candidat',
      status: 'ACTIVE',
      accountType: 'free',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', cred.user.uid), newProfile);
    setProfile({ id: cred.user.uid, ...newProfile });
    return cred.user;
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, 'users', cred.user.uid));
    const p = snap.exists() ? { id: cred.user.uid, ...snap.data() } : null;
    setProfile(p);
    return p;
  }

  async function logout() {
    await signOut(auth);
  }

  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
  }

  async function changePassword(newPassword) {
    if (!auth.currentUser) throw new Error('Non connecté');
    await updatePassword(auth.currentUser, newPassword);
  }

  const value = {
    firebaseUser,
    profile,
    loading,
    isAuthenticated: !!firebaseUser && !!profile,
    role: profile?.role || null,
    hasRole: (...roles) => roles.includes(profile?.role),
    // Un candidat "free" (auto-inscrit, pas encore payé) doit toujours
    // atterrir sur la page d'essai à 10 QCM, jamais sur le vrai tableau de bord.
    isFreeCandidat: profile?.role === 'candidat' && profile?.accountType !== 'paid',
    register,
    login,
    logout,
    resetPassword,
    changePassword,
    setProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un <AuthProvider>');
  return ctx;
}
