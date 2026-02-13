// ============================================================
// REMINDER MODAL
// "Need a reminder?" feature with reassurance text + video
// Now with two reminder options: body positivity & love affirmation
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Heart, Volume2, VolumeX, Sparkles } from "lucide-react";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Reminder types
type ReminderType = "beautiful" | "loved" | null;

// Opening messages (shown briefly before selection)
const OPENING_MESSAGES = [
  "Hey beautiful...",
  "I'm here for you.",
  "What do you need today?",
];

// Messages for "Am I fat?" / body positivity
const BEAUTIFUL_MESSAGES = [
  "You are absolutely beautiful.",
  "I love every inch of you.",
  "You're perfect to me.",
  "Your body is amazing.",
  "You're so gorgeous.",
];

// Messages for "Do you still love me?"
const LOVED_MESSAGES = [
  "I love you more every day.",
  "You are my everything.",
  "I'll always love you.",
  "My heart is yours forever.",
  "Nothing could change how I feel about you.",
];

// Video URLs - place videos in public folder
const BEAUTIFUL_VIDEO_URL = "/reminder-beautiful.mp4"; // Body positivity video
const LOVED_VIDEO_URL = "/reminder-loved.mp4"; // "I love you" video
const FALLBACK_VIDEO_URL = "/reminder-video.mp4"; // Fallback if specific videos don't exist

export const ReminderModal = ({ isOpen, onClose }: ReminderModalProps) => {
  const [phase, setPhase] = useState<"text" | "selection" | "video">("text");
  const [reminderType, setReminderType] = useState<ReminderType>(null);
  const [message, setMessage] = useState(OPENING_MESSAGES[0]);
  const [autoplayFailed, setAutoplayFailed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get the appropriate video URL based on selection
  const getVideoUrl = useCallback(() => {
    if (reminderType === "beautiful") return BEAUTIFUL_VIDEO_URL;
    if (reminderType === "loved") return LOVED_VIDEO_URL;
    return FALLBACK_VIDEO_URL;
  }, [reminderType]);

  // Pick a random opening message on open
  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * OPENING_MESSAGES.length);
      setMessage(OPENING_MESSAGES[randomIndex]);
      setPhase("text");
      setReminderType(null);
      setAutoplayFailed(false);

      // Transition to selection screen after 2 seconds
      timerRef.current = setTimeout(() => {
        setPhase("selection");
      }, 2000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOpen]);

  // Handle reminder selection
  const handleSelectReminder = useCallback((type: ReminderType) => {
    setReminderType(type);

    // Show appropriate message based on selection
    const messages = type === "beautiful" ? BEAUTIFUL_MESSAGES : LOVED_MESSAGES;
    const randomIndex = Math.floor(Math.random() * messages.length);
    setMessage(messages[randomIndex]);

    // Brief pause on message, then show video
    setPhase("text");
    timerRef.current = setTimeout(() => {
      setPhase("video");
    }, 2500);
  }, []);

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
                  <Heart
                    size={40}
                    className="text-accent-pink"
                    fill="currentColor"
                  />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-gray-800 mb-2"
                >
                  {message}
                </motion.p>

                {/* Loading indicator - only show during initial opening, not after selection */}
                {!reminderType && (
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "linear" }}
                    className="absolute bottom-0 left-0 h-1 bg-accent-pink"
                  />
                )}
                {reminderType && (
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5, ease: "linear" }}
                    className="absolute bottom-0 left-0 h-1 bg-accent-pink"
                  />
                )}
              </motion.div>
            )}

            {/* Selection Phase - Ask what she needs */}
            {phase === "selection" && (
              <motion.div
                key="selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl font-medium text-gray-600 mb-8"
                >
                  What do you need to hear right now?
                </motion.p>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                  {/* "Am I beautiful?" button */}
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => handleSelectReminder("beautiful")}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-pink-100 to-rose-100 border-2 border-pink-200 hover:border-pink-400 hover:shadow-lg transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-pink-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Sparkles size={24} className="text-pink-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">
                        Am I beautiful?
                      </p>
                      <p className="text-sm text-gray-500">
                        Show me I'm perfect to you
                      </p>
                    </div>
                  </motion.button>

                  {/* "Do you still love me?" button */}
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => handleSelectReminder("loved")}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-200 hover:border-red-400 hover:shadow-lg transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-red-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Heart
                        size={24}
                        className="text-red-500"
                        fill="currentColor"
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">
                        Do you still love me?
                      </p>
                      <p className="text-sm text-gray-500">
                        Remind me how you feel
                      </p>
                    </div>
                  </motion.button>
                </div>
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
                  src={getVideoUrl()}
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

                {/* Video fallback message - contextual based on selection */}
                <div className="absolute bottom-4 left-4 right-16">
                  <p className="text-white/80 text-xs bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
                    {reminderType === "beautiful"
                      ? "You're absolutely gorgeous 💕"
                      : "I love you always 💕"}
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
