import * as fs from '../firebase/firestoreService';

const COL = 'exams';

export const getAll = () => fs.getAll(COL, [fs.orderBy('createdAt', 'desc')]);
export const getPublished = () =>
  fs.getAll(COL, [fs.where('published', '==', true)]);
export const subscribeAll = (callback) => fs.subscribe(COL, [fs.orderBy('createdAt', 'desc')], callback);
export const subscribePublished = (callback) =>
  fs.subscribe(COL, [fs.where('published', '==', true)], callback);
export const getById = (id) => fs.getById(COL, id);
export const create = (data) => fs.create(COL, data);
export const update = (id, data) => fs.update(COL, id, data);
export const remove = (id) => fs.remove(COL, id);
