"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stickySlide1 } from "@/lib/stickyStack";
import { ChevronDown } from "lucide-react";
import CursorGrid from "@/components/motion/CursorGrid";

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = heroRef.current?.querySelector("[data-parallax-layers]");
    if (!triggerElement) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0,
        },
      });

      const layers = [
        { layer: "1", yPercent: 70 },
        { layer: "2", yPercent: 55 },
        { layer: "3", yPercent: 40 },
        { layer: "4", yPercent: 10 },
      ];

      layers.forEach((layerObj, idx) => {
        const targets = triggerElement.querySelectorAll(
          `[data-parallax-layer="${layerObj.layer}"]`
        );
        if (targets.length > 0) {
          tl.to(
            targets,
            {
              yPercent: layerObj.yPercent,
              ease: "none",
            },
            idx === 0 ? undefined : "<"
          );
        }
      });
    }, heroRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className={`parallax relative flex min-h-[100svh] flex-col overflow-x-clip bg-gaude-black ${stickySlide1}`}
    >
      <div className="parallax__visuals relative flex min-h-[100svh] w-full flex-1 flex-col overflow-hidden">
        <div className="parallax__black-line-overflow" />

        <div
          data-parallax-layers
          className="parallax__layers relative flex min-h-[100svh] w-full flex-1 flex-col justify-between overflow-hidden"
        >
          {/* Layer 1: Sky / Distant Horizon Background */}
          <img
            src="https://cdn.21st.dev/assets/mirror/a4/a43f4eae3459c461345ee676f12d6e1ddca65e8a5279a5af00d475b17ff83aea.webp"
            loading="eager"
            width="1920"
            height="1080"
            data-parallax-layer="1"
            alt="Parallax background horizon"
            className="parallax__layer-img absolute inset-0 z-0 h-[120%] w-full -top-[10%] object-cover pointer-events-none select-none"
          />

          {/* Interactive Cursor Grid (subtle glow layer over background) */}
          <div
            data-parallax-layer="1"
            className="pointer-events-none absolute inset-0 z-[1] opacity-35"
          >
            <CursorGrid
              cellSize={60}
              color="#FF4E00"
              radius={160}
              falloff="smooth"
              holdTime={350}
              fadeDuration={700}
              lineWidth={1.4}
              maxOpacity={0.9}
              fillOpacity={0.15}
              gridOpacity={0.06}
              cellRadius={12}
              clickPulse
              pulseSpeed={650}
              highlightOnView
              className="h-full w-full"
            />
          </div>

          {/* Layer 2: Midground Mountain Ridge */}
          <img
            src="https://cdn.21st.dev/assets/mirror/50/50ca6a0d36d2780bfcb469d6db7eaec0be7e0d2961ba69a63d2a1473b040338d.webp"
            loading="eager"
            width="1920"
            height="1080"
            data-parallax-layer="2"
            alt="Parallax midground mountains"
            className="parallax__layer-img is-third absolute inset-0 z-[2] h-[120%] w-full -top-[10%] object-cover pointer-events-none select-none"
          />

          {/* Layer 3: EDITCO Giant Wordmark Headline (between midground & foreground) */}
          <div
            data-parallax-layer="3"
            className="parallax__layer-title pointer-events-none absolute inset-0 z-[3] flex flex-col items-center justify-center px-3 pt-16 pb-28 sm:px-6 sm:pt-24 sm:pb-36"
          >
            <div className="relative flex w-full max-w-[100%] flex-col items-center">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex w-full flex-col items-center text-center"
              >
                <h1 className="hero-wordmark w-full max-w-[100%] select-none font-archivo font-black uppercase leading-[0.85] tracking-[-0.04em] text-white drop-shadow-[0_12px_40px_rgba(0,0,0,0.85)] sm:leading-[0.82] sm:tracking-[-0.05em]">
                  <span className="inline-block max-w-full bg-gradient-to-b from-white via-white/95 to-white/60 bg-clip-text text-transparent">
                    EDITCO
                  </span>
                </h1>
              </motion.div>
            </div>
          </div>

          {/* Layer 4: Foreground Mountain Ridge Cutout (overlapped in front of the EDITCO letters) */}
          <img
            src="https://cdn.21st.dev/assets/mirror/e1/e1c8137b5f971c3b3ec1a0f9e79b9c17018767005f844a10082b890472afecfb.webp"
            loading="eager"
            width="1920"
            height="1080"
            data-parallax-layer="4"
            alt="Parallax foreground mountain"
            className="parallax__layer-img absolute inset-0 z-[4] h-[120%] w-full -top-[10%] object-cover pointer-events-none select-none"
          />

          {/* Layer 4: Content Overlay (Subtitle, Action CTAs, and Scroll Down) */}
          <div
            data-parallax-layer="4"
            className="pointer-events-none absolute inset-x-0 bottom-4 z-[25] flex flex-col items-center px-4 text-center sm:bottom-8"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-[20rem] px-2 font-space-grotesk text-[0.85rem] font-medium leading-snug tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] sm:max-w-xl sm:text-[clamp(0.85rem,1.85vw,1.35rem)] sm:leading-snug md:max-w-3xl md:leading-snug"
            >
              We build smart websites, AI calling agents, and growth systems for
              modern businesses
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6 flex w-full flex-col items-center sm:mt-8"
            >
              <div className="flex w-full max-w-md flex-col items-center gap-3 px-1 sm:max-w-none sm:flex-row sm:justify-center sm:gap-6 sm:px-4">
                <button
                  type="button"
                  data-cal-link="editco-media/15min"
                  data-cal-namespace="15min"
                  data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
                  className="pointer-events-auto group relative flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border border-gaude-orange bg-gaude-orange px-6 font-archivo text-[10px] font-bold uppercase tracking-widest text-white shadow-xl transition-all hover:shadow-[0_0_35px_rgba(255,78,0,0.55)] sm:h-14 sm:w-auto sm:px-10 md:h-16 md:text-[11px]"
                >
                  Book a Call
                </button>
                <a
                  href="#calculator"
                  className="pointer-events-auto group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-full border border-white/20 bg-black/60 px-6 font-archivo text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md shadow-xl transition-all hover:bg-white hover:text-gaude-black sm:h-14 sm:w-auto sm:px-10 md:h-16 md:text-[11px]"
                >
                  Growth Calculator
                </a>
              </div>
            </motion.div>

            <a
              href="#problem"
              className="pointer-events-auto relative mt-5 flex w-fit flex-col items-center gap-1.5 font-archivo text-[10px] font-medium uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white sm:mt-6"
            >
              Scroll to know more
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </a>
          </div>

          {/* Seamless Bottom Fade to next section */}
          <div className="parallax__fade pointer-events-none absolute bottom-0 left-0 z-[20] h-36 w-full" />
        </div>
      </div>
    </section>
  );
}


