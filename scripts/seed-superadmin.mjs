// Crée le tout premier compte superadmin (impossible à faire depuis
// l'interface, puisqu'il faut déjà être superadmin pour en créer un).
//
// UTILISATION :
// 1. Console Firebase -> Paramètres du projet -> Comptes de service
//    -> "Générer une nouvelle clé privée" -> télécharge le fichier JSON
//    -> renomme-le en `serviceAccountKey.json` et place-le dans ce dossier /scripts
// 2. node scripts/seed-superadmin.mjs

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./scripts/serviceAccountKey.json', 'utf8'));

initializeApp({ credential: cert(serviceAccount) });

const auth = getAuth();
const db = getFirestore();

const EMAIL = 'superadmin@concourspro.dev';
const PASSWORD = 'Super2026!'; // à changer immédiatement après la première connexion

async function main() {
  let user;
  try {
    user = await auth.createUser({ email: EMAIL, password: PASSWORD });
    console.log('Compte Auth créé :', user.uid);
  } catch (err) {
    if (err.code === 'auth/email-already-exists') {
      user = await auth.getUserByEmail(EMAIL);
      console.log('Compte Auth déjà existant, réutilisation :', user.uid);
    } else {
      throw err;
    }
  }

  await db.collection('users').doc(user.uid).set({
    firstName: 'Super',
    lastName: 'Admin',
    email: EMAIL,
    role: 'superadmin',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  }, { merge: true });

  console.log('\n✅ Superadmin prêt.');
  console.log('   Email    :', EMAIL);
  console.log('   Password :', PASSWORD);
  console.log('   Connecte-toi sur /connexion-admin puis change ce mot de passe.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
