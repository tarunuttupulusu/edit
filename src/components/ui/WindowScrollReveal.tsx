"use client";

import React, { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface WindowScrollRevealProps {
  src: string;
  alt: string;
  index?: number;
  delay?: number;
  className?: string;
  aspectRatio?: string;
  children?: ReactNode;
}

export function WindowScrollReveal({
  src,
  alt,
  index = 0,
  delay: customDelay,
  className = "",
  aspectRatio = "2 / 1",
  children,
}: WindowScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    const img = imgRef.current;
    if (!container || !wrapper || !img) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const calculatedDelay = customDelay ?? (index % 2 === 0 ? 0 : 0.22);

    const ctx = gsap.context(() => {
      // 1. Smooth window aperture entrance reveal: rises smoothly and expands outward
      gsap.fromTo(
        wrapper,
        {
          clipPath: "inset(16% 0% 16% 0% round 24px)",
          y: 44,
          scale: 0.95,
          opacity: 0.2,
        },
        {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1.1,
          delay: calculatedDelay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 86%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 2. Smooth parallax glide inside the window container
      gsap.fromTo(
        img,
        {
          yPercent: -4,
          scale: 1.05,
        },
        {
          yPercent: 4,
          scale: 1.02,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <div
        ref={wrapperRef}
        className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-[#121212] shadow-2xl transition-colors duration-500 will-change-transform group-hover:border-gaude-orange/40"
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        {/* Crystal-clear project image occupying the TOTAL box without distortion */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover object-top will-change-transform transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
        />

        {/* Optional overlay content */}
        {children && (
          <>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/85 to-transparent z-[2]" />
            {children}
          </>
        )}
      </div>
    </div>
  );
}

export default WindowScrollReveal;
