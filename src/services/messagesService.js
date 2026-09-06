import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const COL = 'messages';

// Abonnement temps réel : le callback est rappelé automatiquement à
// chaque nouveau message (envoyé par l'un ou l'autre participant), sans
// avoir besoin de recharger la page. Retourne une fonction de désabonnement.
export function subscribeToConversation(conversationId, callback) {
  const q = query(
    collection(db, COL),
    where('conversationId', '==', conversationId),
    orderBy('createdAt')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function send(data) {
  await addDoc(collection(db, COL), { ...data, createdAt: serverTimestamp() });
}
