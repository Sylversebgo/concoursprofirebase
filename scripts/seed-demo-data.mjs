// Ajoute quelques modules et questions de démo, pour ne pas partir d'une
// app totalement vide. Nécessite le même serviceAccountKey.json que
// seed-superadmin.mjs (voir ce fichier pour l'obtenir).
//
// UTILISATION : node scripts/seed-demo-data.mjs

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./scripts/serviceAccountKey.json', 'utf8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function main() {
  const modulesRef = db.collection('modules');
  const mod1 = await modulesRef.add({
    title: 'Culture générale',
    description: 'Questions de culture générale pour les concours de la fonction publique.',
    category: 'fonction_publique',
    active: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const questions = [
    {
      moduleId: mod1.id,
      statement: 'Quelle est la capitale du Burkina Faso ?',
      options: [
        { id: 'a', label: 'Bobo-Dioulasso' },
        { id: 'b', label: 'Ouagadougou' },
        { id: 'c', label: 'Koudougou' },
        { id: 'd', label: 'Banfora' },
      ],
      correctAnswer: 'b',
      explanation: 'Ouagadougou est la capitale politique et administrative du Burkina Faso.',
      difficulty: 'facile',
      active: true,
    },
    {
      moduleId: mod1.id,
      statement: 'En quelle année le Burkina Faso a-t-il pris son nom actuel ?',
      options: [
        { id: 'a', label: '1960' },
        { id: 'b', label: '1974' },
        { id: 'c', label: '1984' },
        { id: 'd', label: '1991' },
      ],
      correctAnswer: 'c',
      explanation: 'Le pays, anciennement Haute-Volta, a pris le nom de Burkina Faso en 1984 sous Thomas Sankara.',
      difficulty: 'moyen',
      active: true,
    },
  ];

  for (const q of questions) {
    await db.collection('questions').add({
      ...q,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  console.log('✅ Données de démo ajoutées : 1 module, 2 questions.');
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
