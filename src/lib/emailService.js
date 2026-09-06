// Envoi d'e-mails SANS backend, via EmailJS (plan gratuit : 200 e-mails/mois,
// aucune carte bancaire requise, aucune Cloud Function nécessaire).
//
// CONFIGURATION REQUISE (voir README, section "Configurer l'envoi d'e-mails") :
// 1. Crée un compte gratuit sur https://www.emailjs.com
// 2. Connecte un service e-mail (Gmail par ex.)
// 3. Crée un template avec les variables : to_name, to_email, login_url, role, temp_password
// 4. Remplace les 3 valeurs ci-dessous par les tiennes (Dashboard EmailJS -> Account -> General)

import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_ntjn1mn';
const EMAILJS_TEMPLATE_ID = 'template_q2gty9w';
const EMAILJS_PUBLIC_KEY = 'mgsXLTRNgE8DPY0aY';

const isConfigured =
  EMAILJS_SERVICE_ID !== 'REMPLACE_MOI' &&
  EMAILJS_TEMPLATE_ID !== 'REMPLACE_MOI' &&
  EMAILJS_PUBLIC_KEY !== 'REMPLACE_MOI';

/**
 * Envoie un e-mail avec les identifiants de connexion à un utilisateur
 * fraîchement créé (admin ou candidat) par un admin/superadmin.
 * Si EmailJS n'est pas encore configuré, l'échec est silencieux (l'app
 * continue de fonctionner, mais aucun e-mail ne part) — évite de bloquer
 * la création du compte pour un problème d'e-mail.
 */
export async function sendCredentialsEmail({ toName, toEmail, tempPassword, role }) {
  if (!isConfigured) {
    console.warn(
      "EmailJS n'est pas configuré (src/lib/emailService.js) — aucun e-mail envoyé. " +
      "Voir le README pour l'activer."
    );
    return { sent: false, reason: 'not_configured' };
  }

  const loginUrl = role === 'candidat'
    ? `${window.location.origin}/connexion`
    : `${window.location.origin}/connexion-admin`;

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_name: toName,
        to_email: toEmail,
        login_url: loginUrl,
        role,
        temp_password: tempPassword,
      },
      { publicKey: EMAILJS_PUBLIC_KEY }
    );
    return { sent: true };
  } catch (err) {
    console.error("Échec de l'envoi de l'e-mail :", err);
    return { sent: false, reason: 'send_error', error: err };
  }
}