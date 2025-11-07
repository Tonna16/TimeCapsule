import  React, { useState, useEffect } from 'react';
import { Clock, Plus, Lock, Unlock, Calendar, AlertCircle, Zap } from 'lucide-react';
 

interface Note {
  id: string;
  title: string;
  content: string;
  unlockDate: string;
  unlockTime: string;
  isUnlocked: boolean;
  createdAt: string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const saved = localStorage.getItem('timeCapsuleNotes');
    if (saved) {
      setNotes(JSON.parse(saved));
    }
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('timeCapsuleNotes', JSON.stringify(notes));
  }, [notes]);

  const createNote = (noteData: Omit<Note, 'id' | 'isUnlocked' | 'createdAt'>) => {
    const note: Note = {
      ...noteData,
      id: Date.now().toString(),
      isUnlocked: false,
      createdAt: new Date().toISOString(),
    };
    setNotes(prev => [...prev, note]);
    setShowForm(false);
  };

  const isNoteUnlocked = (note: Note) => {
    const unlockDateTime = new Date(`${note.unlockDate}T${note.unlockTime}`);
    return currentTime >= unlockDateTime;
  };

  const unlockedNotes = notes.filter(isNoteUnlocked);
  const lockedNotes = notes.filter(note => !isNoteUnlocked(note));

   return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 pb-16 max-w-4xl min-h-screen flex flex-col">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Clock className="w-12 h-12 text-yellow-400 animate-spin-slow" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent animate-glow">
              Time Capsule
            </h1>
            <Clock className="w-12 h-12 text-yellow-400 animate-spin-slow-reverse" />
          </div>
          <p className="text-xl text-gray-300 animate-slide-up">Write notes to your future self</p>
          <div className="text-lg text-yellow-300 font-mono mt-2 animate-pulse-glow">
            {currentTime.toLocaleString()}
          </div>
        </header>
 

               <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all duration-300 transform hover:scale-110 hover:rotate-1 shadow-lg hover:shadow-2xl active:scale-95 group animate-bounce-gentle"
          >
            <Plus className="w-6 h-6 group-hover:rotate-180 transition-transform duration-300" />
            Create Time Capsule
            <Zap className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-yellow-300" />
          </button>
        </div>
 

        {showForm && (
          <CreateNoteForm 
            onSubmit={createNote} 
            onCancel={() => setShowForm(false)} 
          />
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Unlock className="w-6 h-6 text-green-400" />
              Unlocked ({unlockedNotes.length})
            </h2>
            <div className="space-y-4">
              {unlockedNotes.map(note => (
                <NoteCard key={note.id} note={note} unlocked />
              ))}
              {unlockedNotes.length === 0 && (
                <p className="text-gray-400 text-center py-8">No unlocked notes yet</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-red-400" />
              Locked ({lockedNotes.length})
            </h2>
            <div className="space-y-4">
              {lockedNotes.map(note => (
                <NoteCard key={note.id} note={note} unlocked={false} />
              ))}
              {lockedNotes.length === 0 && (
                <p className="text-gray-400 text-center py-8">No locked notes</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const  CreateNoteForm = ({ onSubmit, onCancel }: any) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [unlockTime, setUnlockTime] = useState('12:00');
  const [error, setError] = useState('');
  const [showingQuickSelect, setShowingQuickSelect] = useState(false);
 

  const validateDateTime = () => {
    if (!unlockDate || !unlockTime) return false;
    const unlockDateTime = new Date(`${unlockDate}T${unlockTime}`);
    const now = new Date();
    return unlockDateTime > now;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim() || !content.trim() || !unlockDate) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!validateDateTime()) {
      setError('Unlock time must be in the future!');
      return;
    }
    
    onSubmit({ title: title.trim(), content: content.trim(), unlockDate, unlockTime });
  };

   const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    return now.toISOString().slice(0, 16);
  };

  const setQuickDate = (days: number, hours: number = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(date.getHours() + hours);
    setUnlockDate(date.toISOString().split('T')[0]);
    setUnlockTime(date.toTimeString().slice(0, 5));
    setShowingQuickSelect(false);
  };
 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto transform animate-scale-in shadow-2xl border border-gray-700">
        <h3 className="text-2xl font-bold mb-4 text-center animate-glow">Create Time Capsule</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
              placeholder="What's this note about?"
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white h-32 resize-none"
              placeholder="Write your message to the future..."
              maxLength={500}
            />
          </div>

                   <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Unlock Time</label>
              <button
                type="button"
                onClick={() => setShowingQuickSelect(!showingQuickSelect)}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Quick Select
              </button>
            </div>
            
            {showingQuickSelect && (
              <div className="grid grid-cols-2 gap-2 mb-3 p-3 bg-gray-700 rounded-lg animate-slide-down">
                <button type="button" onClick={() => setQuickDate(0, 1)} className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm transition-all hover:scale-105">1 Hour</button>
                <button type="button" onClick={() => setQuickDate(1)} className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm transition-all hover:scale-105">1 Day</button>
                <button type="button" onClick={() => setQuickDate(7)} className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm transition-all hover:scale-105">1 Week</button>
                <button type="button" onClick={() => setQuickDate(30)} className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm transition-all hover:scale-105">1 Month</button>
                <button type="button" onClick={() => setQuickDate(365)} className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm transition-all hover:scale-105">1 Year</button>
                <button type="button" onClick={() => setQuickDate(1825)} className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm transition-all hover:scale-105">5 Years</button>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="date"
                  value={unlockDate}
                  onChange={(e) => setUnlockDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
              <div>
                <input
                  type="time"
                  value={unlockTime}
                  onChange={(e) => setUnlockTime(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>
          </div>
 

          {error && (
            <div className="bg-red-900 border border-red-500 rounded-lg p-3 flex items-center gap-2 text-red-200">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-2 rounded-lg transition-all duration-300"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const  NoteCard = ({ note, unlocked }: { note: Note; unlocked: boolean }) => {
  const unlockDateTime = new Date(`${note.unlockDate}T${note.unlockTime}`);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`p-4 rounded-lg border-2 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 cursor-pointer group animate-slide-up ${
        unlocked 
          ? 'bg-green-900 border-green-500 shadow-green-500/20 shadow-lg hover:shadow-green-500/40 hover:shadow-xl animate-unlock-glow' 
          : 'bg-gray-800 border-gray-600 hover:border-gray-500 hover:bg-gray-750'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
 
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg group-hover:text-white transition-colors">{note.title}</h3>
        {unlocked ? (
          <Unlock className={`w-5 h-5 text-green-400 transition-all duration-300 ${isHovered ? 'animate-bounce scale-110' : ''}`} />
        ) : (
          <Lock className={`w-5 h-5 text-red-400 transition-all duration-300 ${isHovered ? 'animate-shake' : ''}`} />
        )}
      </div>
      
      {unlocked ? (
        <p className="text-gray-200 mb-3">{note.content}</p>
      ) : (
        <p className="text-gray-500 italic mb-3">🔒 Message locked until unlock time</p>
      )}
      
      <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
        <Calendar className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`} />
        {unlocked ? 'Unlocked:' : 'Unlocks:'} {unlockDateTime.toLocaleString()}
      </div>
    </div>
  );
};

export default App;
 