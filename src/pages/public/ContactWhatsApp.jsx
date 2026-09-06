import { MessageCircle } from 'lucide-react';

export default function ContactWhatsApp() {
  return (
    <div className="mx-auto max-w-xl px-5 py-20 text-center md:px-10">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
        <MessageCircle size={30} />
      </div>
      <h1 className="mb-3 font-display text-2xl font-bold text-ink">Contactez-nous sur WhatsApp</h1>
      <p className="mb-8 text-gray-500">Réponse rapide garantie, du lundi au samedi.</p>
      <a
        href="https://wa.me/22600000000"
        target="_blank"
        rel="noreferrer"
        className="inline-block rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white"
      >
        Ouvrir WhatsApp
      </a>
    </div>
  );
}
