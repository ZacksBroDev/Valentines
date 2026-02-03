import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "./Modal";
import { Note } from "../types";
import { getNotes, saveNote, deleteNote } from "../utils/storage";

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotesModal = ({ isOpen, onClose }: NotesModalProps) => {
  const [notes, setNotes] = useState<Note[]>(getNotes);
  const [newNote, setNewNote] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const refreshNotes = useCallback(() => setNotes(getNotes()), []);

  const handleSave = useCallback(() => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      content: newNote.trim(),
      timestamp: Date.now(),
    };

    saveNote(note);
    setNewNote("");
    setIsComposing(false);
    refreshNotes();
  }, [newNote, refreshNotes]);

  const handleDelete = useCallback(
    (id: string) => {
      deleteNote(id);
      refreshNotes();
    },
    [refreshNotes],
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Notes" icon="📝">
      <div className="space-y-4">
        {/* Compose button or input */}
        {!isComposing ? (
          <button
            onClick={() => setIsComposing(true)}
            className="w-full p-4 rounded-2xl border-2 border-dashed border-blush-200 text-gray-500 hover:border-accent-pink hover:text-accent-pink transition-colors"
          >
            ✏️ Leave a note...
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <textarea
              autoFocus
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write something sweet..."
              maxLength={280}
              className="w-full p-4 rounded-2xl border border-blush-200 focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/20 outline-none resize-none"
              rows={3}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {newNote.length}/280
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsComposing(false);
                    setNewNote("");
                  }}
                  className="px-4 py-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!newNote.trim()}
                  className="px-4 py-2 rounded-full bg-accent-pink text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Notes list */}
        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-2 block">💌</span>
              <p className="text-gray-500">No notes yet</p>
              <p className="text-gray-400 text-sm">
                Leave little love notes here
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, x: -20 }}
                  className="bg-blush-50 rounded-2xl p-4 relative group"
                >
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {note.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDate(note.timestamp)}
                  </p>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                    aria-label="Delete note"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </Modal>
  );
};
