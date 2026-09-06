import * as fs from '../firebase/firestoreService';

const COL = 'questions';

export const getAll = () => fs.getAll(COL, [fs.orderBy('createdAt', 'desc')]);
export const getByModule = (moduleId) =>
  fs.getAll(COL, [fs.where('moduleId', '==', moduleId), fs.where('active', '==', true)]);
export const subscribeAll = (callback) => fs.subscribe(COL, [fs.orderBy('createdAt', 'desc')], callback);
export const subscribeByModule = (moduleId, callback) =>
  fs.subscribe(COL, [fs.where('moduleId', '==', moduleId), fs.where('active', '==', true)], callback);
export const getById = (id) => fs.getById(COL, id);
export const create = (data) => fs.create(COL, data);
export const update = (id, data) => fs.update(COL, id, data);
export const remove = (id) => fs.remove(COL, id);
export const createMany = (items) => fs.createMany(COL, items);
