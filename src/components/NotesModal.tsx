import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "./Modal";
import { Note } from "../types";
import { getNotes, saveNote, deleteNote } from "../utils/storage";
// Use cloud storage for cross-device sync
import { 
  CloudSharedNote,
  fetchSharedNotes,
  submitSharedNote,
  markCloudNoteAsRead,
} from "../utils/cloudStorage";
import { Heart, Send } from "lucide-react";

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotesRead?: () => void; // Called when unread notes are marked as read
}

export const NotesModal = ({ isOpen, onClose, onNotesRead }: NotesModalProps) => {
  const [notes, setNotes] = useState<Note[]>(getNotes);
  const [sharedNotes, setSharedNotes] = useState<CloudSharedNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [sendToHim, setSendToHim] = useState(false); // Toggle for sharing
  const [activeTab, setActiveTab] = useState<"personal" | "shared">("personal");
  const [, setIsLoading] = useState(false);

  const refreshNotes = useCallback(async () => {
    setNotes(getNotes());
    setIsLoading(true);
    try {
      const cloudNotes = await fetchSharedNotes();
      setSharedNotes(cloudNotes);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error fetching shared notes:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load notes when modal opens
  useEffect(() => {
    if (isOpen) {
      refreshNotes();
    }
  }, [isOpen, refreshNotes]);

  // Notes from admin (him) to display in shared tab
  const notesFromAdmin = sharedNotes
    .filter(n => n.from === "admin")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadFromAdmin = notesFromAdmin.filter(n => !n.read).length;

  // Auto-mark admin notes as read when viewing the "From Him" tab
  useEffect(() => {
    if (activeTab === "shared" && unreadFromAdmin > 0) {
      const markAllAsRead = async () => {
        const unreadNotes = notesFromAdmin.filter(n => !n.read);
        await Promise.all(unreadNotes.map(n => markCloudNoteAsRead(n.id)));
        refreshNotes();
        // Notify parent that notes were read so badge can update
        onNotesRead?.();
      };
      markAllAsRead();
    }
  }, [activeTab, unreadFromAdmin, notesFromAdmin, refreshNotes, onNotesRead]);

  const handleSave = useCallback(async () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      content: newNote.trim(),
      timestamp: Date.now(),
    };

    saveNote(note);
    // Only share if she chose to send it to him
    if (sendToHim) {
      await submitSharedNote(newNote.trim(), "her");
    }
    setNewNote("");
    setSendToHim(false);
    setIsComposing(false);
    refreshNotes();
  }, [newNote, sendToHim, refreshNotes]);

  const handleMarkRead = useCallback(async (id: string) => {
    await markCloudNoteAsRead(id);
    refreshNotes();
  }, [refreshNotes]);

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
    <Modal isOpen={isOpen} onClose={onClose} title="Notes">
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setActiveTab("personal")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === "personal"
                ? "bg-white text-accent-pink shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            My Notes
          </button>
          <button
            onClick={() => setActiveTab("shared")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all relative ${
              activeTab === "shared"
                ? "bg-white text-accent-pink shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center justify-center gap-1">
              <Heart size={14} />
              From Him
            </span>
            {unreadFromAdmin > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                {unreadFromAdmin}
              </span>
            )}
          </button>
        </div>

        {/* Personal Notes Tab */}
        {activeTab === "personal" && (
          <>
            {/* Compose button or input */}
            {!isComposing ? (
              <button
                onClick={() => setIsComposing(true)}
                className="w-full p-4 rounded-2xl border-2 border-dashed border-blush-200 text-gray-500 hover:border-accent-pink hover:text-accent-pink transition-colors flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Leave a note for him...
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
                        setSendToHim(false);
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
                
                {/* Send to him toggle */}
                <div 
                  onClick={() => setSendToHim(!sendToHim)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    sendToHim 
                      ? "bg-accent-pink/10 border-2 border-accent-pink" 
                      : "bg-gray-50 border-2 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Heart size={16} className={sendToHim ? "text-accent-pink" : "text-gray-400"} />
                    <span className={`text-sm font-medium ${sendToHim ? "text-accent-pink" : "text-gray-600"}`}>
                      Also send to him 💕
                    </span>
                  </div>
                  <div className={`w-10 h-6 rounded-full transition-all ${sendToHim ? "bg-accent-pink" : "bg-gray-300"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm mt-1 transition-all ${sendToHim ? "ml-5" : "ml-1"}`} />
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
          </>
        )}

        {/* Notes From Him Tab */}
        {activeTab === "shared" && (
          <div className="space-y-3">
            {notesFromAdmin.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl mb-2 block">💕</span>
                <p className="text-gray-500">No notes from him yet</p>
                <p className="text-gray-400 text-sm">
                  Sweet messages will appear here
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {notesFromAdmin.map((note) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    onClick={() => !note.read && handleMarkRead(note.id)}
                    className={`rounded-2xl p-4 relative cursor-pointer transition-all ${
                      !note.read 
                        ? "bg-accent-pink/10 border-2 border-accent-pink/30" 
                        : "bg-blush-50"
                    }`}
                  >
                    {!note.read && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-accent-pink text-white text-[10px] font-semibold rounded-full">
                        NEW
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <Heart size={14} className="text-accent-pink" fill="currentColor" />
                      <span className="text-xs text-accent-pink font-medium">From your boyfriend 💕</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(note.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
