"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

/**
 * Cinematic Loader Entrance for Editco Media.
 * Plays on first load/reload and splits open to reveal the landing page.
 */
export function LandingLoadOverlay() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const [isFinished, setIsFinished] = useState(!isHomepage);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHomepage) {
      setIsFinished(true);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Prevent body scrolling while the cinematic entrance plays
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = prevOverflow || "";
          setIsFinished(true);
        },
      });

      // Phase 1: Bands close to thirds & Marquees slide in from opposite sides
      tl.from(".loader-clip-top, .loader-clip-bottom", {
        duration: 1.4,
        height: "50vh",
        ease: "power4.inOut",
      }, 0.2);

      tl.to(".loader-marquee", {
        duration: 2.2,
        top: "50%",
        ease: "power4.inOut",
      }, 0.1);

      tl.from(".loader-clip-top .loader-marquee, .loader-clip-bottom .loader-marquee", {
        duration: 2.8,
        left: "120%",
        ease: "power3.inOut",
      }, 0.2);

      tl.from(".loader-clip-center .loader-marquee", {
        duration: 2.6,
        opacity: 0.9,
        left: "-120%",
        ease: "power3.inOut",
      }, 0.2);

      // Phase 2: Cinematic split open (reveal the landing page)
      tl.to(".loader-clip-top", {
        duration: 1.2,
        clipPath: "inset(0 0 100% 0)",
        ease: "power4.inOut",
      }, "+=0.2");

      tl.to(".loader-clip-bottom", {
        duration: 1.2,
        clipPath: "inset(100% 0 0 0)",
        ease: "power4.inOut",
      }, "<");

      tl.to(".loader-marquee span", {
        duration: 0.8,
        opacity: 0,
        ease: "power2.inOut",
      }, "<");

      tl.to(".cinematic-loader", {
        duration: 0.8,
        opacity: 0,
        ease: "power2.inOut",
      }, "-=0.4");
    }, container);

    return () => {
      document.body.style.overflow = prevOverflow || "";
      ctx.revert();
    };
  }, [isHomepage]);

  if (isFinished || !isHomepage) return null;

  const repeatItems = Array.from({ length: 8 }, (_, i) => (
    <span
      key={i}
      className="inline-block px-4 sm:px-6 md:px-8 font-archivo text-[clamp(2.5rem,7vw,9rem)] font-black tracking-tighter uppercase whitespace-nowrap select-none"
    >
      EDITCO MEDIA
    </span>
  ));

  const handleSkip = () => {
    document.body.style.overflow = "";
    setIsFinished(true);
  };

  return (
    <div
      ref={containerRef}
      className="cinematic-loader fixed inset-0 z-[9999999] w-screen h-screen overflow-hidden bg-white select-none cursor-pointer"
      onClick={handleSkip}
    >
      {/* Top Black Band */}
      <div
        className="loader-clip-top absolute top-0 left-0 w-full h-[33.33vh] overflow-clip z-20 bg-black"
        style={{ clipPath: "inset(0 0 0 0)" }}
      >
        <div
          className="loader-marquee absolute top-[200%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220vw] text-white flex justify-center items-center pointer-events-none"
          style={{ mixBlendMode: "difference" }}
        >
          <div className="flex w-full items-center justify-between">
            {repeatItems}
          </div>
        </div>
      </div>

      {/* Middle White Band */}
      <div className="loader-clip-center relative w-full h-[33.34vh] top-[33.33vh] overflow-hidden z-10 bg-white">
        <div
          className="loader-marquee absolute top-[200%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220vw] text-black flex justify-center items-center pointer-events-none"
        >
          <div className="flex w-full items-center justify-between text-black">
            {repeatItems}
          </div>
        </div>
      </div>

      {/* Bottom Black Band */}
      <div
        className="loader-clip-bottom absolute bottom-0 left-0 w-full h-[33.33vh] overflow-clip z-20 bg-black"
        style={{ clipPath: "inset(0 0 0 0)" }}
      >
        <div
          className="loader-marquee absolute top-[200%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220vw] text-white flex justify-center items-center pointer-events-none"
          style={{ mixBlendMode: "difference" }}
        >
          <div className="flex w-full items-center justify-between">
            {repeatItems}
          </div>
        </div>
      </div>

      {/* Subtle Skip Hint in Corner */}
      <div className="absolute bottom-5 right-6 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={handleSkip}
          className="font-archivo text-[10px] sm:text-xs font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors"
        >
          Click to skip ➔
        </button>
      </div>
    </div>
  );
}
