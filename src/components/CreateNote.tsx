import  { useState } from 'react';
import { Plus, Calendar, FileText, Clock } from 'lucide-react';
import { QuickDateButtons } from './QuickDateButtons';

interface CreateNoteProps {
  onCreateNote: (note: { title: string; content: string; unlockDate: string; unlockTime: string }) => void;
}
 

export  const CreateNote = ({ onCreateNote }: CreateNoteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [unlockTime, setUnlockTime] = useState('09:00');
 

   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content && unlockDate && unlockTime) {
      onCreateNote({ title, content, unlockDate, unlockTime });
      setTitle('');
      setContent('');
      setUnlockDate('');
      setUnlockTime('09:00');
      setIsOpen(false);
    }
  };
 

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="mb-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Time Capsule Note
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg border-2 border-amber-200">
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
              placeholder="What's this note about?"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to Future Self
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 h-32"
              placeholder="Write your message..."
              required
            />
          </div>
          <div className="mb-6">
            <QuickDateButtons 
              onSelectDate={(date, time) => {
                setUnlockDate(date);
                setUnlockTime(time);
              }} 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Unlock Date
                </label>
                <input
                  type="date"
                  value={unlockDate}
                  onChange={(e) => setUnlockDate(e.target.value)}
                  min={minDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4" />
                  Unlock Time
                </label>
                <input
                  type="time"
                  value={unlockTime}
                  onChange={(e) => setUnlockTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Create Note
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
 