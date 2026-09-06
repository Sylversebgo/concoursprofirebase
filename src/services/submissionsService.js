import * as fs from '../firebase/firestoreService';

const COL = 'submissions';

export const getByCandidate = (candidateId) =>
  fs.getAll(COL, [fs.where('candidateId', '==', candidateId), fs.orderBy('createdAt', 'desc')]);
export const getAll = () => fs.getAll(COL, [fs.orderBy('createdAt', 'desc')]);
export const getById = (id) => fs.getById(COL, id);
export const create = (data) => fs.create(COL, data);
export const update = (id, data) => fs.update(COL, id, data);
