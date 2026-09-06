import { useEffect, useState } from 'react';
import { Users, HelpCircle, BookOpen, ClipboardList } from 'lucide-react';
import * as usersService from '../../services/usersService';
import * as questionsService from '../../services/questionsService';
import * as modulesService from '../../services/modulesService';
import * as examsService from '../../services/examsService';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      usersService.getCandidats(),
      questionsService.getAll(),
      modulesService.getAll(),
      examsService.getAll(),
    ]).then(([candidats, questions, modules, exams]) => {
      setStats({ candidats: candidats.length, questions: questions.length, modules: modules.length, exams: exams.length });
    }).catch(() => setStats({ candidats: 0, questions: 0, modules: 0, exams: 0 }));
  }, []);

  const cards = [
    { label: 'Candidats', value: stats?.candidats, icon: Users, tone: 'text-brand bg-blue-50' },
    { label: 'Questions', value: stats?.questions, icon: HelpCircle, tone: 'text-amber-600 bg-amber-50' },
    { label: 'Modules', value: stats?.modules, icon: BookOpen, tone: 'text-green-600 bg-green-50' },
    { label: 'Examens', value: stats?.exams, icon: ClipboardList, tone: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Tableau de bord</h1>

      {stats === null ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {cards.map(({ label, value, icon: Icon, tone }) => (
            <Card key={label}>
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                <Icon size={19} />
              </div>
              <p className="text-2xl font-bold text-ink">{value}</p>
              <p className="text-xs font-semibold text-gray-400">{label}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
