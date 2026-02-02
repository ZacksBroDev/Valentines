import confetti from "canvas-confetti";

// Small burst for saving favorites
export const smallConfetti = () => {
  confetti({
    particleCount: 30,
    spread: 60,
    origin: { y: 0.7 },
    colors: ["#ff4da6", "#ff6b9d", "#ffb8ca", "#e6d5ff", "#ff1a6b"],
    scalar: 0.8,
    gravity: 1.2,
    ticks: 150,
  });
};

// Medium burst for secret unlock
export const secretUnlockConfetti = () => {
  const duration = 1500;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#ff4da6", "#e6d5ff", "#ff6b9d"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#ff4da6", "#e6d5ff", "#ff6b9d"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};

// Big celebration for end screen
export const bigConfetti = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: [
        "#ff4da6",
        "#ff6b9d",
        "#ffb8ca",
        "#e6d5ff",
        "#ff1a6b",
        "#ffffff",
      ],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: [
        "#ff4da6",
        "#ff6b9d",
        "#ffb8ca",
        "#e6d5ff",
        "#ff1a6b",
        "#ffffff",
      ],
    });
  }, 250);
};

// Heart-shaped confetti for special moments
export const heartConfetti = () => {
  const heart = confetti.shapeFromText({ text: "💕", scalar: 2 });

  confetti({
    shapes: [heart],
    particleCount: 20,
    spread: 100,
    origin: { y: 0.6 },
    scalar: 1.5,
    gravity: 0.8,
    ticks: 200,
  });
};
