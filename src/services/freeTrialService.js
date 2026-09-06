import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import * as questionsService from './questionsService';

const DOC_REF = 'freeTrialConfig/current';

// Renvoie les 10 questions configurées par le superadmin pour l'essai
// gratuit. Si rien n'a encore été configuré, retombe sur 10 questions
// prises au hasard parmi toutes les questions actives (pour ne jamais
// bloquer la page si le superadmin n'a pas encore choisi).
export async function getFreeTrialQuestions() {
  const snap = await getDoc(doc(db, 'freeTrialConfig', 'current'));
  const configuredIds = snap.exists() ? snap.data().questionIds || [] : [];

  if (configuredIds.length > 0) {
    const questions = await Promise.all(configuredIds.map((id) => questionsService.getById(id)));
    const valid = questions.filter(Boolean);
    if (valid.length > 0) return valid;
  }

  // Repli : 10 questions aléatoires parmi toutes les questions actives.
  const all = await questionsService.getAll();
  const active = all.filter((q) => q.active);
  return shuffle(active).slice(0, 10);
}

export async function getConfiguredQuestionIds() {
  const snap = await getDoc(doc(db, 'freeTrialConfig', 'current'));
  return snap.exists() ? snap.data().questionIds || [] : [];
}

export async function setConfiguredQuestionIds(questionIds) {
  await setDoc(doc(db, 'freeTrialConfig', 'current'), {
    questionIds,
    updatedAt: serverTimestamp(),
  });
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
