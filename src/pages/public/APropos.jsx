import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: 'Pourquoi choisir ConcoursPro ?',
    answer: 'ConcoursPro met à votre disposition des ressources pédagogiques de qualité pour vous aider à apprendre plus facilement. Vous bénéficiez notamment de milliers de QCM accessibles en ligne. Vous n’avez donc plus besoin de transporter plusieurs documents physiques encombrants : il vous suffit de vous connecter à notre site pour réviser et progresser efficacement.',
  },
  {
    question: 'Comment se connecter ?',
    answer: "Pour vous connecter à notre site, vous devez d’abord demander à l’administrateur de créer votre compte. Une fois votre compte créé, vos identifiants de connexion ainsi que votre mot de passe vous seront envoyés dans votre boîte Gmail. Pensez à vérifier le dossier des spams, puis utilisez ces informations pour accéder à votre compte.",
  },
  {
    question: 'Comment puis-je m’inscrire ?',
    answer: "Pour vous inscrire, veuillez contacter l’administrateur afin d’obtenir toutes les informations nécessaires, notamment celles concernant les tarifs.",
  },
];

export default function APropos() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 md:px-10">
      <h1 className="mb-3 text-center font-display text-3xl font-bold text-ink">À propos de nous</h1>
      <p className="mb-10 text-center text-gray-500">Découvrez les réponses aux questions les plus fréquentes.</p>

      <div className="flex flex-col gap-4">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question} className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-ink"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <ChevronDown size={20} className={`shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <p className="border-t border-black/5 px-5 pb-5 pt-4 text-sm leading-6 text-gray-600">{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
