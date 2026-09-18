import * as fs from '../firebase/firestoreService';

const SUBJECTS = 'writingSubjects';
const SUBMISSIONS = 'writingSubmissions';

export const subscribeSubjects = (callback, onError) =>
  fs.subscribe(SUBJECTS, [fs.orderBy('createdAt', 'desc')], callback, onError);
export const createSubject = (data) => fs.create(SUBJECTS, data);
export const updateSubject = (id, data) => fs.update(SUBJECTS, id, data);
export const removeSubject = (id) => fs.remove(SUBJECTS, id);

export const subscribeSubmissions = (callback, onError) =>
  fs.subscribe(SUBMISSIONS, [fs.orderBy('createdAt', 'desc')], callback, onError);
export const getByCandidate = (candidateId) =>
  fs.getAll(SUBMISSIONS, [fs.where('candidateId', '==', candidateId), fs.orderBy('createdAt', 'desc')]);
export const createSubmission = (data) => fs.create(SUBMISSIONS, data);
export const updateSubmission = (id, data) => fs.update(SUBMISSIONS, id, data);