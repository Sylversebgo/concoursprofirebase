// Petit état de session (sessionStorage) pour faire transiter les données
// d'un quiz d'une page à l'autre (Entrainement -> EntrainementQuestions ->
// Resultat) sans avoir besoin d'un state manager global.
const KEY = 'concourspro_quiz_session';

export function startSession({ questions, moduleId, mode }) {
  const session = {
    moduleId,
    mode, // "entrainement" | "examen" | "essai_gratuit"
    questions,
    answers: {},
    current: 0,
    startedAt: Date.now(),
  };
  sessionStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function getSession() {
  const raw = sessionStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveSession(session) {
  sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem(KEY);
}
