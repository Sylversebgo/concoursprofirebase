# ConcoursPro — Serverless (React + Vite + Tailwind + Firebase)

Reconstruction 100% serverless de ConcoursPro. Aucun backend à héberger : le
frontend parle directement à Firestore, sécurisé par les règles de sécurité
(`firestore.rules`). Gratuit à vie sur le plan Firebase **Spark**, **aucune
carte bancaire requise**, tant que Cloud Functions et Cloud Storage restent
désactivés (voir §"Limites connues" plus bas).

## 1. Créer le projet Firebase

1. Va sur https://console.firebase.google.com → **Ajouter un projet**.
2. Une fois créé, clique sur l'icône **Web `</>`** pour ajouter une app web.
3. Copie l'objet `firebaseConfig` affiché.
4. Colle ces valeurs dans `src/firebase/config.js` (remplace les `REMPLACE_MOI`).
5. Dans le menu de gauche → **Authentication** → onglet **Sign-in method** →
   active **E-mail/Mot de passe**.
6. Dans le menu de gauche → **Firestore Database** → **Créer une base de
   données** → mode production → choisis une région proche (ex: `eur3`).

## 2. Installer et lancer en local

```bash
npm install
npm run dev
```

## 3. Créer le premier compte superadmin

Impossible de le faire depuis l'interface (il faut déjà être superadmin pour
en créer un). On utilise un script avec les droits d'administration :

1. Console Firebase → ⚙️ **Paramètres du projet** → **Comptes de service**
   → **Générer une nouvelle clé privée** → télécharge le fichier JSON.
2. Renomme-le en `serviceAccountKey.json`, place-le dans le dossier `scripts/`.
3. Lance :
   ```bash
   node scripts/seed-superadmin.mjs
   ```
4. Connecte-toi sur `/connexion-admin` avec `superadmin@concourspro.dev` /
   `Super2026!`, puis **change immédiatement ce mot de passe** depuis ton
   profil.

**Optionnel** — pour ne pas partir d'une app totalement vide (1 module + 2
questions de démo) :
```bash
node scripts/seed-demo-data.mjs
```

⚠️ Ne commite JAMAIS `serviceAccountKey.json` dans Git (déjà exclu via
`.gitignore`).

## 4. Déployer les règles de sécurité Firestore

**Étape obligatoire avant toute mise en production** — sans ça, la base est
soit totalement ouverte soit totalement fermée par défaut selon le mode
choisi à la création.

```bash
npm install -g firebase-tools
firebase login
firebase init            # sélectionne le projet existant, ne recoche rien d'autre
firebase deploy --only firestore:rules
```

## 5. Déployer le site sur Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

Ton app sera accessible sur `https://TON-PROJET.web.app`.

## 6. Créer des comptes admin supplémentaires

Une fois connecté en superadmin, va sur **Gestion admins** dans le menu
latéral → **Créer un admin**. Ça fonctionne directement depuis l'interface,
sans script.

## 7. Configurer l'envoi d'e-mails (identifiants de connexion)

Quand un admin/superadmin crée un compte (candidat ou admin), l'app essaie
d'envoyer automatiquement un e-mail avec les identifiants — via **EmailJS**,
un service qui envoie des e-mails **directement depuis le navigateur**, sans
backend, sans Cloud Function, gratuit jusqu'à 200 e-mails/mois, **aucune
carte bancaire requise**.

1. Crée un compte gratuit sur https://www.emailjs.com
2. **Email Services** → **Add New Service** → choisis Gmail (ou autre) →
   connecte ta boîte mail.
3. **Email Templates** → **Create New Template**. Utilise ces variables dans
   le corps du template (elles seront remplacées automatiquement) :
   - `{{to_name}}` — nom du destinataire
   - `{{to_email}}` — à mettre dans le champ "To Email" du template
   - `{{role}}` — "candidat" ou "admin"
   - `{{temp_password}}` — mot de passe provisoire
   - `{{login_url}}` — lien direct vers la bonne page de connexion

   Exemple de corps de template :
   ```
   Bonjour {{to_name}},

   Un compte {{role}} a été créé pour vous sur ConcoursPro.

   Connectez-vous ici : {{login_url}}
   Mot de passe provisoire : {{temp_password}}

   Merci de le changer dès votre première connexion.
   ```
4. Récupère 3 valeurs : **Account** → **General** → ta **Public Key**, puis
   l'ID du service (Email Services) et l'ID du template (Email Templates).
5. Colle ces 3 valeurs dans `src/lib/emailService.js`, à la place des
   `REMPLACE_MOI`.

Tant que ce n'est pas configuré, la création de compte fonctionne quand même
normalement — un message t'informe juste que l'e-mail n'est pas parti, à
communiquer les identifiants manuellement.

## 8. Comprendre le flux "essai gratuit" (10 QCM)

- Un visiteur qui clique sur **"Commencer gratuitement"** (accueil) arrive
  sur `/essai-gratuit` : 10 questions avec correction + explication après
  chaque réponse, sans avoir besoin de compte.
- S'il s'inscrit lui-même via `/inscription`, il reste **toujours** redirigé
  vers `/essai-gratuit` à chaque connexion (compte `accountType: "free"`) —
  jamais sur le vrai tableau de bord.
- À la fin des 10 QCM : une carte "Contactez-nous sur WhatsApp" (numéro
  configuré dans `EssaiGratuit.jsx`), un bouton **Retour** (accueil) et un
  bouton **Continuer** (tarifs).
- **Seul un admin/superadmin peut faire passer un candidat en accès complet** :
  en le créant lui-même depuis **Utilisateurs** (`accountType: "paid"`
  automatique). Le candidat reçoit alors ses identifiants par e-mail et
  atterrit directement sur le vrai tableau de bord à la connexion.
- Le superadmin choisit les 10 questions utilisées dans l'essai gratuit
  depuis le menu **"Essai gratuit"** (visible uniquement pour lui).

## Structure du projet

```
src/
  firebase/         Config Firebase + couche d'accès Firestore générique
  services/         Un fichier par collection (modulesService, questionsService...)
  contexts/          AuthContext (remplace auth-service + user-service)
  components/
    ui/              Composants réutilisables (Button, Card, Input, Modal...)
    layout/          PublicLayout, CandidatLayout, AdminLayout
    ProtectedRoute   Garde de route basée sur le rôle
  pages/
    public/          Accueil, connexion, inscription, tarifs...
    candidat/         Dashboard, modules, entraînement, examens, progression...
    admin/            Dashboard, CRUD questions/modules/examens, statistiques...
    shared/           Messagerie (utilisée par candidat ET admin)
firestore.rules      Règles de sécurité (remplace Spring Security)
scripts/              Scripts d'administration (seed superadmin, données de démo)
```

## Limites connues (pour rester 100% gratuit, sans carte)

- **Cloud Storage désactivé** : Google exige le plan payant Blaze pour Cloud
  Storage depuis février 2026, même a minima. La page "Gestion documents"
  fonctionne donc avec des **liens externes** (Google Drive, etc.) plutôt que
  de vrais fichiers hébergés. Si tu passes un jour sur Blaze, il suffira
  d'ajouter l'upload de fichier dans `GestionDocuments.jsx`.
- **Calcul de score côté client** : le score d'un examen est calculé dans le
  navigateur du candidat au moment de la soumission. C'est largement
  suffisant pour une phase de validation, mais pas infalsifiable — à durcir
  plus tard avec une Cloud Function si le projet grandit.
- **Messagerie simplifiée** : une conversation = un candidat (pas de fils
  multiples). Suffisant pour un support candidat ↔ équipe basique.

## Aller plus loin

- Ajouter des index composites Firestore si la console te le demande (un
  lien direct apparaît dans l'erreur de la console navigateur).
- Ajouter un nom de domaine personnalisé : Firebase Hosting → **Ajouter un
  domaine personnalisé** (gratuit, certificat SSL inclus).
