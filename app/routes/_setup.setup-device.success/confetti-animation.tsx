import { useEffect } from "react";

export function ConfettiAnimation() {
  useEffect(() => {
    // Create and animate confetti particles
    const container = document.getElementById("confetti-container");
    if (!container) return;

    const colors = ["#22c55e", "#10b981", "#059669"];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute w-2 h-2 rounded-full";
      particle.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = "50%";
      particle.style.animation = `confetti-fall ${
        1 + Math.random() * 2
      }s ease-out forwards`;
      container.appendChild(particle);
    }

    return () => {
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div
      id="confetti-container"
      className="absolute inset-0 overflow-hidden pointer-events-none"
    />
  );
}
