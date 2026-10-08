"use client";

import { useEffect, useRef, useState } from "react";

function isInteractiveTarget(el: Element | null) {
  if (!el || !(el instanceof HTMLElement)) return false;
  return !!(
    el.closest("a") ||
    el.closest("button") ||
    el.closest("input") ||
    el.closest("textarea") ||
    el.closest("select") ||
    el.closest(".cursor-pointer") ||
    el.closest("[role='button']") ||
    el.closest("[href]") ||
    document.documentElement.classList.contains("ecm-chip-hover")
  );
}

export function ClientCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only enable on desktop devices with fine pointer (not touch screens)
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const root = document.documentElement;
    root.classList.add("ecm-custom-cursor");
    setEnabled(true);

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      const under = document.elementFromPoint(e.clientX, e.clientY);
      setIsHovering(isInteractiveTarget(under));
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth lerp loop for silky tracking
    const updateCursor = () => {
      currentX += (mouseX - currentX) * 0.45;
      currentY += (mouseY - currentY) * 0.45;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      rafId = requestAnimationFrame(updateCursor);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    rafId = requestAnimationFrame(updateCursor);

    return () => {
      cancelAnimationFrame(rafId);
      root.classList.remove("ecm-custom-cursor");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[999999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 hidden md:block will-change-transform ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ left: 0, top: 0 }}
      aria-hidden
    >
      <div
        className={`relative flex items-center justify-center transition-transform duration-200 ease-out ${
          isClicking ? "scale-90" : isHovering ? "scale-135" : "scale-100"
        }`}
      >
        {/* Ambient glow when hovering over interactive links/buttons */}
        <div
          className={`absolute -inset-1 rounded-full blur-md transition-all duration-300 ${
            isHovering
              ? "bg-gaude-orange/70 scale-150 opacity-100"
              : "bg-transparent scale-100 opacity-0"
          }`}
        />

        {/* Editco Media Official Logo Cursor */}
        <img
          src="/editco-logo.png"
          alt="Editco Cursor"
          className={`h-7 w-7 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] filter transition-all duration-200 ${
            isHovering ? "brightness-125 drop-shadow-[0_0_14px_rgba(255,78,0,0.9)]" : ""
          }`}
        />

        {/* Precision pointer dot at center */}
        <div
          className={`absolute h-1.5 w-1.5 rounded-full transition-all duration-200 ${
            isHovering ? "bg-gaude-orange scale-125 shadow-[0_0_6px_#ff4e00]" : "bg-white/80 scale-100"
          }`}
        />
      </div>
    </div>
  );
}

export default ClientCursor;
