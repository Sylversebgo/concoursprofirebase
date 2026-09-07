import * as fs from '../firebase/firestoreService';

const COL = 'modules';

export const getAll = () => fs.getAll(COL, [fs.orderBy('title')]);
export const getActive = () =>
  fs.getAll(COL, [fs.where('active', '==', true), fs.orderBy('title')]);
export const subscribeAll = (callback) => fs.subscribe(COL, [fs.orderBy('title')], callback);
export const subscribeActive = (callback, onError) =>
  fs.subscribe(COL, [fs.where('active', '==', true), fs.orderBy('title')], callback, onError);
export const getById = (id) => fs.getById(COL, id);
export const create = (data) => fs.create(COL, data);
export const update = (id, data) => fs.update(COL, id, data);
export const remove = (id) => fs.remove(COL, id);
