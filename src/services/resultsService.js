import * as fs from '../firebase/firestoreService';

const COL = 'results';

export const getByCandidate = (candidateId) =>
  fs.getAll(COL, [fs.where('candidateId', '==', candidateId), fs.orderBy('createdAt', 'desc')]);
export const create = (data) => fs.create(COL, data);
