import { useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-xl px-5 py-16 md:px-10">
      <h1 className="mb-2 font-display text-3xl font-bold text-ink">Contactez-nous</h1>
      <p className="mb-8 text-gray-500">Une question ? Écrivez-nous, on vous répond rapidement.</p>
      {sent ? (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">Message envoyé, merci !</p>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="flex flex-col gap-4">
          <Input label="Nom" required />
          <Input label="E-mail" type="email" required />
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Message</span>
            <textarea required rows={5} className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
          </label>
          <Button type="submit">Envoyer</Button>
        </form>
      )}
    </div>
  );
}
