import { useEffect, useRef, useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import * as messagesService from '../../services/messagesService';
import * as usersService from '../../services/usersService';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

// Pour rester simple sans Cloud Functions : chaque candidat a UNE conversation
// avec "l'équipe admin", identifiée par conversationId = candidateId.
// Les messages arrivent EN DIRECT (Firestore onSnapshot), des deux côtés.
export default function Messagerie() {
  const { profile, hasRole } = useAuth();
  const isAdmin = hasRole('admin', 'superadmin');

  const [candidats, setCandidats] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(isAdmin ? null : profile.id);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isAdmin) usersService.getCandidats().then(setCandidats).catch(() => setCandidats([]));
  }, [isAdmin]);

  // Abonnement temps réel : se réabonne à chaque changement de conversation,
  // se désabonne automatiquement en quittant la page ou en changeant de conv.
  useEffect(() => {
    if (!activeConversationId) return undefined;
    const unsubscribe = messagesService.subscribeToConversation(activeConversationId, setMessages);
    return unsubscribe;
  }, [activeConversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const content = text.trim();
    setText('');
    await messagesService.send({
      conversationId: activeConversationId,
      senderId: profile.id,
      senderRole: profile.role,
      content,
    });
    // Pas besoin de mettre à jour `messages` manuellement : onSnapshot
    // le fait automatiquement dès que Firestore confirme l'écriture.
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Messagerie</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[260px_1fr]">
        {isAdmin && (
          <div className="rounded-2xl border border-black/5 bg-white p-3 shadow-sm">
            {candidats === null ? (
              <Spinner />
            ) : (
              candidats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveConversationId(c.id)}
                  className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold ${
                    activeConversationId === c.id ? 'bg-blue-50 text-brand' : 'text-ink hover:bg-black/5'
                  }`}
                >
                  {c.firstName} {c.lastName}
                </button>
              ))
            )}
          </div>
        )}

        <div className="flex h-[500px] flex-col rounded-2xl border border-black/5 bg-white shadow-sm">
          {!activeConversationId ? (
            <EmptyState icon={MessageSquare} title="Sélectionnez un candidat" />
          ) : (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.length === 0 && <EmptyState icon={MessageSquare} title="Aucun message — dites bonjour !" />}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[75%] rounded-xl px-3.5 py-2 text-sm ${
                      m.senderId === profile.id ? 'ml-auto bg-brand text-white' : 'bg-gray-100 text-ink'
                    }`}
                  >
                    {m.content}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={handleSend} className="flex gap-2 border-t border-black/5 p-3">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Votre message…"
                  className="flex-1 rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                <button type="submit" className="rounded-xl bg-brand px-4 text-white"><Send size={18} /></button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
