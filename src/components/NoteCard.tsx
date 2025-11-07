import  { Lock, Unlock, Calendar, Trash, Clock } from 'lucide-react';
import { TimeCapsuleNote } from '../types';

interface NoteCardProps {
  note: TimeCapsuleNote;
  onDelete: (id: string) => void;
}

export  const NoteCard = ({ note, onDelete }: NoteCardProps) => {
  const unlockDateTime = new Date(`${note.unlockDate}T${note.unlockTime || '00:00'}`);
  const createdDate = new Date(note.createdAt);
  const isUnlocked = note.isUnlocked;
  
  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
 

  return (
    <div className={`bg-white rounded-xl p-6 shadow-lg border-2 ${
      isUnlocked ? 'border-green-200 bg-green-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {isUnlocked ? (
            <Unlock className="w-5 h-5 text-green-600" />
          ) : (
            <Lock className="w-5 h-5 text-gray-500" />
          )}
          <h3 className={`font-semibold ${isUnlocked ? 'text-green-800' : 'text-gray-800'}`}>
            {note.title}
          </h3>
        </div>
        <button
          onClick={() => onDelete(note.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>

      {isUnlocked ? (
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed">{note.content}</p>
        </div>
      ) : (
        <div className="mb-4">
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">This note will unlock on the specified date</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 animate-pulse" />
          Created: {formatDateTime(createdDate)}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className={`w-3 h-3 ${isUnlocked ? 'text-green-500 animate-pulse' : 'animate-bounce'}`} />
          Unlocks: {formatDateTime(unlockDateTime)}
          {!isUnlocked && <span className="text-amber-500 animate-pulse ml-1">⏳</span>}
        </div>
      </div>
    </div>
  );
};
 