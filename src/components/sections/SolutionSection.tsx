"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { 
  Zap, 
  Palette, 
  Users, 
  Search, 
  BarChart3, 
  ShieldCheck,
  Rocket,
  ChevronLeft,
  ChevronRight,
  ArrowDown
} from "lucide-react";
import { solution } from "@/content/landing";
import { sectionFlow } from "@/lib/stickyStack";

const SOLUTION_ICONS = [
  Zap,        // Workflow Automations
  Palette,    // UI/UX Design
  Users,      // CRM & Lead Management
  Search,     // SEO & AEO
  BarChart3,  // Scale-Ready Performance
  ShieldCheck // Security/Quality
];

const cardColors = [
  "#D4FF3F", // Lime/Yellow
  "#C3A4F6", // Lavender
  "#FF8A5C", // Vibrant Orange
  "#36DF93", // Mint Green
  "#FF7EB6", // Pink
  "#88E0EF", // Cyan/Sky
];

export function SolutionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Hook into window scroll over the tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate and apply overlapping card animation based on scroll progress
  const updateSlides = useCallback((p: number) => {
    const track = trackRef.current;
    if (!track) return;

    const slides = Array.from(track.children) as HTMLElement[];
    if (!slides.length) return;

    const total = slides.length;
    const firstSlide = slides[0];
    const lastSlide = slides[total - 1];
    
    // Total horizontal distance needed so the last card reaches main focus
    const totalDistance = lastSlide.offsetLeft - firstSlide.offsetLeft;
    const currentX = -p * totalDistance;
    const vwOffset = window.innerWidth * 0.045;

    slides.forEach((slide, i) => {
      const slideWidth = slide.offsetWidth || 480;
      const slideLeft = slide.offsetLeft + currentX;
      const isLast = i === total - 1;

      if (slideLeft < 0 && !isLast) {
        const ratio = Math.min(1, Math.abs(slideLeft) / slideWidth);
        slide.style.transformOrigin = "left 70%";
        slide.style.transform = `translateX(${
          currentX + Math.abs(slideLeft) + ratio * vwOffset
        }px) rotate(${-12 * ratio}deg) scale(${1 - ratio * 0.3})`;
        slide.style.position = "relative";
        slide.style.zIndex = `${i + 1}`;
      } else {
        slide.style.transformOrigin = "left 70%";
        slide.style.transform = `translateX(${currentX}px) rotate(0deg) scale(1)`;
        slide.style.position = "relative";
        slide.style.zIndex = `${i + 1}`;
      }
    });

    const currentIndex = Math.min(total - 1, Math.max(0, Math.round(p * (total - 1))));
    setActiveSlide(currentIndex);
    setScrollProgress(p);
  }, []);

  // Listen to window scroll changes
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    updateSlides(latest);
  });

  // Initialize and handle window resize
  useEffect(() => {
    const onResize = () => {
      updateSlides(scrollYProgress.get());
    };
    window.addEventListener("resize", onResize);

    const timer = setTimeout(() => {
      updateSlides(scrollYProgress.get());
    }, 60);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
  }, [updateSlides, scrollYProgress]);

  // Smooth scroll window to a specific card when buttons or dots are clicked
  const scrollToCard = useCallback((targetIndex: number) => {
    const container = containerRef.current;
    if (!container) return;
    const total = solution.cards.length;
    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const containerHeight = container.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollableDistance = containerHeight - windowHeight;
    const targetScroll = containerTop + (targetIndex / (total - 1)) * scrollableDistance;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth"
    });
  }, []);

  const handlePrev = useCallback(() => {
    scrollToCard(Math.max(0, activeSlide - 1));
  }, [scrollToCard, activeSlide]);

  const handleNext = useCallback(() => {
    scrollToCard(Math.min(solution.cards.length - 1, activeSlide + 1));
  }, [scrollToCard, activeSlide]);

  return (
    <section 
      id={solution.id}
      ref={containerRef}
      className={`${sectionFlow} relative w-full bg-white h-[380vh] sm:h-[420vh] md:h-[460vh]`}
    >
      {/* Sticky Viewport Stage: Split-screen layout matching Swiper reference perfectly */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-white flex flex-col lg:flex-row items-center justify-between px-5 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-6 lg:py-0 pb-16 lg:pb-0">
        
        {/* Left Column: Signature Bold Heading & Controls */}
        <div className="w-full lg:w-[42%] xl:w-[38%] flex flex-col justify-center shrink-0 pr-0 lg:pr-8 py-2 lg:py-8 border-b lg:border-b-0 lg:border-r border-black/10 pb-3 lg:pb-8">
          <p className="font-archivo text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-gaude-orange mb-2 sm:mb-3">
            SYSTEMS ARCHITECTURE // 0{activeSlide + 1}
          </p>

          <h2 className="font-archivo text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black uppercase leading-[0.94] tracking-tighter text-black">
            EDITCO MEDIA BUILDS COMPLETE <br />
            <span className="text-gaude-orange">DIGITAL GROWTH SYSTEMS.</span>
          </h2>

          <p className="mt-3 sm:mt-4 font-inter text-xs sm:text-sm md:text-base font-medium leading-relaxed text-black/75 max-w-lg">
            {solution.description}
          </p>

          {/* Controls & Indicator Row */}
          <div className="mt-5 sm:mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 rounded-full border border-black/15 bg-black/[0.04] px-3.5 py-1.5 font-archivo text-[11px] font-black uppercase tracking-wider text-black/80 shadow-sm">
              <ArrowDown size={13} className="text-gaude-orange animate-bounce" />
              <span>Scroll to explore</span>
            </div>

            <span className="font-archivo text-xs sm:text-sm font-black uppercase text-black/60 tabular-nums">
              0{activeSlide + 1} / 0{solution.cards.length}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous system"
                className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-[2px_2px_0_0_#000] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                disabled={activeSlide === 0}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next system"
                className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-[2px_2px_0_0_#000] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                disabled={activeSlide === solution.cards.length - 1}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Dot Pagination */}
          <div className="mt-4 flex items-center gap-1.5">
            {solution.cards.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToCard(i)}
                aria-label={`Scroll to system ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeSlide === i 
                    ? "w-7 bg-gaude-orange" 
                    : "w-2 bg-black/15 hover:bg-black/35"
                }`}
              />
            ))}
            <span className="ml-2 font-archivo text-[11px] font-bold text-black/45 tabular-nums">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>

        {/* Right Column: Full-Height, Completely Visible Overlapping Cards Track */}
        <div className="w-full lg:w-[58%] xl:w-[62%] h-full flex items-center relative overflow-hidden pl-0 lg:pl-8 py-4 sm:py-6 lg:py-0">
          <div 
            ref={trackRef} 
            className="flex items-center will-change-transform pl-4 sm:pl-6 md:pl-8 py-8"
          >
            {solution.cards.map((card, index) => {
              const Icon = SOLUTION_ICONS[index % SOLUTION_ICONS.length];
              const bgColor = cardColors[index % cardColors.length];
              const isLast = index === solution.cards.length - 1;

              return (
                <div
                  key={card.title}
                  className={`relative shrink-0 w-[85vw] sm:w-[65vw] md:w-[52vw] lg:w-[38vw] xl:w-[34vw] max-w-[540px] h-[340px] sm:h-[380px] md:h-[410px] lg:h-[440px] rounded-[24px] sm:rounded-[28px] md:rounded-[32px] border-4 border-black p-5 sm:p-7 md:p-8 shadow-[8px_8px_0_0_#000] flex flex-col justify-between ${
                    !isLast ? "mr-6 sm:mr-8 md:mr-10" : ""
                  }`}
                  style={{
                    backgroundColor: bgColor,
                    transformOrigin: "left 70%",
                  }}
                >
                  {/* Subtle Grid / Dot Texture */}
                  <div 
                    className="pointer-events-none absolute inset-0 rounded-[20px] sm:rounded-[24px] md:rounded-[28px] opacity-[0.05]" 
                    style={{ 
                      backgroundImage: "radial-gradient(circle at 2px 2px, black 1px, transparent 0)",
                      backgroundSize: "18px 18px"
                    }} 
                  />

                  {/* Main Card Content Layout */}
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    {/* Top Row: System Badge & Icon */}
                    <div className="flex items-center justify-between border-b border-black/15 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-black text-white shadow-sm shrink-0">
                          <Icon size={20} />
                        </div>
                        <span className="font-archivo text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-black/70">
                          System 0{index + 1}
                        </span>
                      </div>
                      <span className="font-archivo text-xs font-black uppercase tracking-widest text-black/50">
                        0{index + 1} / 0{solution.cards.length}
                      </span>
                    </div>

                    {/* Middle Section: Title, Description & Wireframe Illustration */}
                    <div className="flex items-center justify-between gap-4 my-auto py-2">
                      <div className="flex-1 space-y-2">
                        <h3 className="break-words font-archivo text-2xl sm:text-3xl md:text-4xl font-black uppercase leading-[1.02] tracking-tight text-black">
                          {card.title}
                        </h3>
                        <p className="font-inter text-xs sm:text-sm font-medium leading-relaxed text-black/80 max-w-sm">
                          {card.body}
                        </p>
                      </div>

                      {/* Wireframe Illustration */}
                      <div className="hidden sm:flex shrink-0 items-center justify-center">
                        <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 overflow-hidden rounded-2xl border-2 border-black/15 bg-black/[0.04] flex items-center justify-center shadow-inner">
                          <CardIllustration index={index} />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Row */}
                    <div className="pt-3 border-t border-black/15 flex items-center justify-between">
                      <a 
                        href="#cta" 
                        className="group inline-flex items-center gap-2 rounded-full border-2 border-black bg-black px-4 sm:px-5 py-2 font-archivo text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-black shadow-sm"
                      >
                        Get Started
                        <Rocket className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={13} />
                      </a>

                      <p className="font-archivo text-[10px] font-black uppercase tracking-widest text-black/45 hidden sm:block">
                        Editco Growth Engine v2.0 // Layer 0{index + 1}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function CardIllustration({ index }: { index: number }) {
  const illustrations = [
    // 0: Websites
    <svg key="0" className="w-full h-full p-3 sm:p-4" viewBox="0 0 200 120" fill="none">
      <rect x="20" y="15" width="160" height="90" rx="8" stroke="black" strokeWidth="2.5" />
      <rect x="32" y="38" width="42" height="42" rx="6" fill="black" fillOpacity="0.12" />
      <rect x="86" y="38" width="82" height="6" rx="3" fill="black" fillOpacity="0.25" />
      <rect x="86" y="52" width="64" height="6" rx="3" fill="black" fillOpacity="0.25" />
      <rect x="86" y="66" width="48" height="6" rx="3" fill="black" fillOpacity="0.25" />
    </svg>,
    // 1: AI Calling
    <svg key="1" className="w-full h-full p-3 sm:p-4" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="42" stroke="black" strokeWidth="2.5" strokeDasharray="5 5" />
      <circle cx="60" cy="60" r="22" fill="black" fillOpacity="0.12" stroke="black" strokeWidth="2" />
      <path d="M38 60H82" stroke="black" strokeWidth="2.5" />
      <path d="M60 38V82" stroke="black" strokeWidth="2.5" />
    </svg>,
    // 2: Automations
    <svg key="2" className="w-full h-full p-3 sm:p-4" viewBox="0 0 120 120" fill="none">
      <rect x="18" y="18" width="34" height="34" rx="6" stroke="black" strokeWidth="2.5" fill="black" fillOpacity="0.1" />
      <rect x="68" y="68" width="34" height="34" rx="6" stroke="black" strokeWidth="2.5" fill="black" fillOpacity="0.1" />
      <path d="M52 35H85V68" stroke="black" strokeWidth="2.5" strokeDasharray="5 3" />
    </svg>,
    // 3: UI/UX
    <svg key="3" className="w-full h-full p-3 sm:p-4" viewBox="0 0 120 120" fill="none">
      <path d="M15 15L105 105M15 105L105 15" stroke="black" strokeOpacity="0.15" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="32" stroke="black" strokeWidth="2.5" />
      <rect x="44" y="44" width="32" height="32" rx="4" fill="black" fillOpacity="0.12" />
    </svg>,
    // 4: CRM
    <svg key="4" className="w-full h-full p-3 sm:p-4" viewBox="0 0 200 120" fill="none">
      <path d="M20 95 L65 45 L110 75 L150 25 L180 55" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="150" cy="25" r="7" fill="black" />
      <circle cx="65" cy="45" r="5" fill="black" fillOpacity="0.3" />
      <circle cx="110" cy="75" r="5" fill="black" fillOpacity="0.3" />
    </svg>,
    // 5: SEO
    <svg key="5" className="w-full h-full p-3 sm:p-4" viewBox="0 0 120 120" fill="none">
      <circle cx="50" cy="50" r="30" stroke="black" strokeWidth="2.5" />
      <path d="M72 72L102 102" stroke="black" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  ];

  return illustrations[index % illustrations.length];
}
