// ============================================================
// REMINDER MODAL
// "Need a reminder?" feature with reassurance text + video
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Heart, Volume2, VolumeX } from "lucide-react";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Reassurance messages that rotate
const REASSURANCE_MESSAGES = [
  { text: "You are so loved.", emoji: "💗" },
  { text: "I'm always here for you.", emoji: "🤗" },
  { text: "You make everything better.", emoji: "✨" },
  { text: "I believe in you.", emoji: "💪" },
  { text: "You're doing amazing.", emoji: "🌟" },
];

// Video URL - can be configured
const REMINDER_VIDEO_URL = "/reminder-video.mp4"; // Place video in public folder

export const ReminderModal = ({ isOpen, onClose }: ReminderModalProps) => {
  const [phase, setPhase] = useState<"text" | "video">("text");
  const [message, setMessage] = useState(REASSURANCE_MESSAGES[0]);
  const [autoplayFailed, setAutoplayFailed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pick a random message on open
  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * REASSURANCE_MESSAGES.length);
      setMessage(REASSURANCE_MESSAGES[randomIndex]);
      setPhase("text");
      setAutoplayFailed(false);

      // Transition to video after 2.5 seconds
      timerRef.current = setTimeout(() => {
        setPhase("video");
      }, 2500);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOpen]);

  // Attempt autoplay when video phase starts
  useEffect(() => {
    if (phase === "video" && videoRef.current) {
      const playVideo = async () => {
        try {
          // Start muted for autoplay (browser requirement)
          videoRef.current!.muted = true;
          await videoRef.current!.play();
          // If autoplay worked, we can offer to unmute
          setAutoplayFailed(false);
        } catch {
          // Autoplay blocked - show play button
          setAutoplayFailed(true);
        }
      };
      playVideo();
    }
  }, [phase]);

  const handleManualPlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play();
      setAutoplayFailed(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  }, []);

  const handleClose = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-sm aspect-[3/4] bg-gradient-to-br from-blush-50 to-white rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-30 w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-black/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/30 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Text Phase */}
          <AnimatePresence mode="wait">
            {phase === "text" && (
              <motion.div
                key="text"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-accent-pink/20 flex items-center justify-center mb-6"
                >
                  <Heart size={40} className="text-accent-pink" fill="currentColor" />
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-gray-800 mb-2"
                >
                  {message.text}
                </motion.p>
                
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl"
                >
                  {message.emoji}
                </motion.span>

                {/* Loading indicator */}
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-1 bg-accent-pink"
                />
              </motion.div>
            )}

            {/* Video Phase */}
            {phase === "video" && (
              <motion.div
                key="video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black"
              >
                <video
                  ref={videoRef}
                  src={REMINDER_VIDEO_URL}
                  playsInline
                  loop
                  preload="auto"
                  className="w-full h-full object-cover"
                  muted={isMuted}
                />

                {/* Play button overlay if autoplay failed */}
                {autoplayFailed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/40"
                  >
                    <button
                      onClick={handleManualPlay}
                      className="w-20 h-20 rounded-full bg-accent-pink text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                      aria-label="Play video"
                    >
                      <Play size={36} className="ml-1" />
                    </button>
                  </motion.div>
                )}

                {/* Mute/Unmute button */}
                {!autoplayFailed && (
                  <button
                    onClick={toggleMute}
                    className="absolute bottom-4 right-4 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                )}

                {/* Video fallback message */}
                <div className="absolute bottom-4 left-4 right-16">
                  <p className="text-white/80 text-xs bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
                    Remember: I love you always 💕
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReminderModal;
