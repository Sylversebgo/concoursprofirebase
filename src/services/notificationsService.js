import * as fs from '../firebase/firestoreService';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

const COL = 'notifications';

export function subscribeByUser(userId, callback) {
  const q = query(collection(db, COL), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

export const getByUser = (userId) =>
  fs.getAll(COL, [fs.where('userId', '==', userId), fs.orderBy('createdAt', 'desc')]);
export const create = (data) => fs.create(COL, data);
export const markAsRead = (id) => fs.update(COL, id, { read: true });
