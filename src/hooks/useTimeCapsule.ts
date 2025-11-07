import  { useState, useEffect } from 'react';
import { TimeCapsuleNote } from '../types';

const STORAGE_KEY = 'timeCapsuleNotes';

export const useTimeCapsule = () => {
  const [notes, setNotes] = useState<TimeCapsuleNote[]>([]);

   useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedNotes = JSON.parse(stored) as TimeCapsuleNote[];
      const updatedNotes = parsedNotes.map(note => {
        const unlockDateTime = new Date(`${note.unlockDate}T${note.unlockTime || '00:00'}`);
        return {
          ...note,
          unlockTime: note.unlockTime || '00:00',
          isUnlocked: new Date() >= unlockDateTime
        };
      });
      setNotes(updatedNotes);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    }
  }, []);
 

   const addNote = (note: Omit<TimeCapsuleNote, 'id' | 'createdAt' | 'isUnlocked'>) => {
    const unlockDateTime = new Date(`${note.unlockDate}T${note.unlockTime}`);
    const newNote: TimeCapsuleNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isUnlocked: new Date() >= unlockDateTime
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  };
 

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  };

  return { notes, addNote, deleteNote };
};
 