import { useEffect, useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import * as questionsService from '../../services/questionsService';
import * as modulesService from '../../services/modulesService';
import * as freeTrialService from '../../services/freeTrialService';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function GestionEssaiGratuit() {
  const [questions, setQuestions] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      questionsService.getAll(),
      modulesService.getAll(),
      freeTrialService.getConfiguredQuestionIds(),
    ]).then(([qs, mods, configuredIds]) => {
      setQuestions(qs.filter((q) => q.active));
      setModules(mods);
      setSelectedIds(configuredIds);
    });
  }, []);

  function toggle(id) {
    setSaved(false);
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 50) return prev; // max 50
      return [...prev, id];
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      await freeTrialService.setConfiguredQuestionIds(selectedIds);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  const moduleTitleById = Object.fromEntries(modules.map((m) => [m.id, m.title]));

  if (questions === null) return <div className="flex justify-center py-16"><Spinner /></div>;

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Sparkles size={22} className="text-brand" />
        <h1 className="font-display text-2xl font-bold text-ink">Essai gratuit (50 QCM maximum)</h1>
      </div>
      <p className="mb-6 max-w-xl text-sm text-gray-500">
        Choisis jusqu'à 50 questions que verront les visiteurs qui cliquent sur
        "Commencer gratuitement" (et les candidats qui n'ont pas encore payé).
        Tu peux les changer à tout moment — le changement est pris en compte
        immédiatement.
      </p>

      <div className="mb-5 flex items-center justify-between rounded-xl border border-black/5 bg-white px-4 py-3">
        <p className="text-sm font-bold text-ink">
          {selectedIds.length} / 50 questions sélectionnées
        </p>
        <Button onClick={handleSave} disabled={saving || selectedIds.length === 0}>
          {saving ? 'Enregistrement…' : saved ? 'Enregistré ✓' : 'Enregistrer la sélection'}
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {questions.map((q) => {
          const isSelected = selectedIds.includes(q.id);
          const disabled = !isSelected && selectedIds.length >= 50;
          return (
            <button
              key={q.id}
              onClick={() => toggle(q.id)}
              disabled={disabled}
              className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm shadow-sm transition ${
                isSelected ? 'border-brand bg-blue-50' : 'border-black/5 bg-white'
              } ${disabled ? 'opacity-40' : ''}`}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{q.statement}</p>
                <Badge tone="gray">{moduleTitleById[q.moduleId] || 'Module inconnu'}</Badge>
              </div>
              {isSelected && (
                <span className="ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <Check size={14} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
