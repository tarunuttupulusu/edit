"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const DEFAULT_PX_STEPS = [2, 5, 9, 18, 35, 100];

export interface PixelImageProps {
  src?: string;
  children?: ReactNode;
  pxSteps?: number[];
  triggerStart?: string;
  speed?: number;
  initialDelay?: number;
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function PixelImage({
  src: propSrc,
  children,
  pxSteps = DEFAULT_PX_STEPS,
  triggerStart = "top 75%",
  speed = 80,
  initialDelay = 280,
  active,
  className = "",
  style = {},
}: PixelImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasRevealed, setHasRevealed] = useState(false);

  // Extract source from prop or child
  let imageSrc = propSrc || "";
  if (!imageSrc && children) {
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const p = child.props as { src?: string | { src?: string } };
        if (typeof p.src === "string") {
          imageSrc = p.src;
        } else if (p.src && typeof p.src.src === "string") {
          imageSrc = p.src.src;
        }
      }
    });
  }

  const stateRef = useRef<{
    pxIndex: number;
    imgRatio: number;
    img: HTMLImageElement | null;
    isLoaded: boolean;
    timeoutId: NodeJS.Timeout | null;
    hasAnimatedOnScroll: boolean;
  }>({
    pxIndex: 0,
    imgRatio: 1,
    img: null,
    isLoaded: false,
    timeoutId: null,
    hasAnimatedOnScroll: false,
  });

  const renderFrame = useCallback(
    (stepIndex: number) => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      const state = stateRef.current;
      if (!container || !canvas || !state.img || !state.isLoaded) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cw = container.offsetWidth;
      const ch = container.offsetHeight;
      if (cw === 0 || ch === 0) return;

      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }

      const w = cw;
      const h = ch;
      let newWidth = w;
      let newHeight = h;
      let newX = 0;
      let newY = 0;

      if (w / h > state.imgRatio) {
        newHeight = Math.round(w / state.imgRatio);
      } else {
        newWidth = Math.round(h * state.imgRatio);
        newX = (w - newWidth) / 2;
      }

      const safeIndex = Math.min(stepIndex, pxSteps.length - 1);
      const isFinalStep = safeIndex === pxSteps.length - 1;
      const pct = (pxSteps[safeIndex] || 100) * 0.01;

      ctx.clearRect(0, 0, cw, ch);

      if (isFinalStep) {
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(state.img, newX, newY, newWidth, newHeight);
      } else {
        const offW = Math.max(2, Math.round(w * pct));
        const offH = Math.max(2, Math.round(h * pct));

        const offCanvas = document.createElement("canvas");
        offCanvas.width = offW;
        offCanvas.height = offH;
        const offCtx = offCanvas.getContext("2d");

        if (offCtx) {
          offCtx.imageSmoothingEnabled = false;
          offCtx.drawImage(state.img, 0, 0, offW, offH);

          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(offCanvas, 0, 0, offW, offH, newX, newY, newWidth, newHeight);
        }
      }
    },
    [pxSteps]
  );

  const startPixelSequence = useCallback(
    (startDelay = initialDelay) => {
      const state = stateRef.current;
      if (!state.isLoaded) return;
      if (state.timeoutId) clearTimeout(state.timeoutId);

      state.pxIndex = 0;
      renderFrame(0);

      const step = () => {
        if (state.pxIndex < pxSteps.length) {
          renderFrame(state.pxIndex);
          state.pxIndex++;
          const nextDelay = state.pxIndex === 1 ? startDelay : speed;
          state.timeoutId = setTimeout(step, nextDelay);
        } else {
          setHasRevealed(true);
        }
      };

      state.timeoutId = setTimeout(step, startDelay);
    },
    [initialDelay, speed, pxSteps.length, renderFrame]
  );

  // Initialize and load image
  useEffect(() => {
    if (!imageSrc) return;
    const state = stateRef.current;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      state.isLoaded = true;
      state.img = img;
      state.imgRatio = img.width / img.height || 1;

      // Draw initial chunky pixelated state
      renderFrame(0);

      // ScrollTrigger to reveal pixels when section enters viewport
      const container = containerRef.current;
      if (container) {
        const st = ScrollTrigger.create({
          trigger: container,
          start: triggerStart,
          onEnter: () => {
            if (!state.hasAnimatedOnScroll) {
              state.hasAnimatedOnScroll = true;
              startPixelSequence(initialDelay);
            }
          },
          once: true,
        });

        // If already in viewport on mount, trigger sequence
        if (st.progress > 0 && !state.hasAnimatedOnScroll) {
          state.hasAnimatedOnScroll = true;
          startPixelSequence(150);
        }
      }
    };

    const handleResize = () => {
      renderFrame(state.pxIndex > 0 ? state.pxIndex - 1 : 0);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (state.timeoutId) clearTimeout(state.timeoutId);
    };
  }, [imageSrc, triggerStart, initialDelay, renderFrame, startPixelSequence]);

  // When card becomes active (e.g., clicked or hovered in accordion), re-run pixel reveal
  useEffect(() => {
    if (active === true && stateRef.current.isLoaded) {
      // Delay slightly for container expansion spring animation
      const timer = setTimeout(() => {
        startPixelSequence(100);
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [active, startPixelSequence]);

  const handleMouseEnter = () => {
    if (active && stateRef.current.isLoaded) {
      startPixelSequence(60);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Hidden underlying children, ensuring correct sizing context */}
      <div className="absolute inset-0 opacity-0 pointer-events-none">
        {children}
      </div>

      {/* Main Pixel Canvas — visibly renders pixelation steps */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none z-[1]"
      />
    </div>
  );
}

export default PixelImage;
