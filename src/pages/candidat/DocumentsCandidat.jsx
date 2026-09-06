import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import * as documentsService from '../../services/documentsService';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

export default function DocumentsCandidat() {
  const [documents, setDocuments] = useState(null);

  useEffect(() => {
    documentsService.getPublished().then(setDocuments).catch(() => setDocuments([]));
  }, []);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Documents</h1>
      {documents === null ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : documents.length === 0 ? (
        <EmptyState icon={FileText} title="Aucun document disponible" />
      ) : (
        <div className="flex flex-col gap-3">
          {documents.map((d) => (
            <div key={d.id} className="flex items-center gap-3 rounded-xl border border-black/5 bg-white p-4 shadow-sm">
              <FileText className="text-brand shrink-0" size={20} />
              <div>
                <p className="font-semibold text-ink">{d.filename}</p>
                <p className="text-xs text-gray-400">{d.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
