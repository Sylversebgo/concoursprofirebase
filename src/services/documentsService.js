import * as fs from '../firebase/firestoreService';

const COL = 'documents';

export const getPublished = () =>
  fs.getAll(COL, [fs.where('published', '==', true), fs.orderBy('createdAt', 'desc')]);
export const getAll = () => fs.getAll(COL, [fs.orderBy('createdAt', 'desc')]);
export const create = (data) => fs.create(COL, data);
export const update = (id, data) => fs.update(COL, id, data);
export const remove = (id) => fs.remove(COL, id);
