import * as fs from '../firebase/firestoreService';

const COL = 'users';

export const getAll = () => fs.getAll(COL, [fs.orderBy('createdAt', 'desc')]);
export const getCandidats = () => fs.getAll(COL, [fs.where('role', '==', 'candidat')]);
export const getAdmins = () =>
  fs.getAll(COL, [fs.where('role', 'in', ['admin', 'superadmin'])]);
export const subscribeCandidats = (callback) =>
  fs.subscribe(COL, [fs.where('role', '==', 'candidat')], callback);
export const subscribeAdmins = (callback) =>
  fs.subscribe(COL, [fs.where('role', 'in', ['admin', 'superadmin'])], callback);
export const getById = (id) => fs.getById(COL, id);
export const update = (id, data) => fs.update(COL, id, data);
export const remove = (id) => fs.remove(COL, id);
