// Couche d'accès générique à Firestore.
// Chaque "service" métier (modulesService, questionsService, ...) est une
// fine couche par-dessus ces fonctions, pour éviter de répéter la logique
// Firestore dans chaque page.
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  limit as fbLimit,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';

export function docToObject(docSnap) {
  return { id: docSnap.id, ...docSnap.data() };
}

export async function getAll(collectionName, constraints = []) {
  const q = query(collection(db, collectionName), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(docToObject);
}

// Abonnement temps réel générique : le callback est rappelé automatiquement
// à chaque ajout/modification/suppression (par n'importe quel utilisateur,
// admin ou candidat) — c'est ça qui rend tout instantané dans toute l'app.
// Retourne une fonction de désabonnement à appeler au démontage du composant.
export function subscribe(collectionName, constraints, callback) {
  const q = query(collection(db, collectionName), ...constraints);
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(docToObject));
  });
}

export async function getById(collectionName, id) {
  const snap = await getDoc(doc(db, collectionName, id));
  return snap.exists() ? docToObject(snap) : null;
}

export async function create(collectionName, data) {
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function update(collectionName, id, data) {
  await updateDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function remove(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id));
}

// Écriture groupée (utilisé par l'import CSV : max 500 opérations/batch Firestore)
export async function createMany(collectionName, items) {
  const chunks = [];
  for (let i = 0; i < items.length; i += 450) {
    chunks.push(items.slice(i, i + 450));
  }
  for (const chunk of chunks) {
    const batch = writeBatch(db);
    chunk.forEach((item) => {
      const ref = doc(collection(db, collectionName));
      batch.set(ref, {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
  }
}

export { where, orderBy, fbLimit as limit };
