"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { faq } from "@/content/landing";
import { sectionFlowAfter } from "@/lib/stickyStack";

gsap.registerPlugin(ScrollTrigger);

export function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Wait slightly for DOM layout and fonts to settle before measuring natural bubble sizes
    const ctx = gsap.context(() => {
      const messages = section.querySelectorAll<HTMLElement>(".faq-message");
      if (!messages.length) return;

      messages.forEach((message) => {
        const faqRow = message.parentElement as HTMLElement | null;
        const typingIndicator = message.querySelector<HTMLElement>(".typing-indicator");
        const messageCopy = message.querySelectorAll<HTMLElement>(".faq-content p");

        // Measure natural expanded width and height
        const expandedWidth = message.offsetWidth;
        const expandedHeight = message.offsetHeight;

        message.style.width = `${expandedWidth}px`;
        if (faqRow) {
          faqRow.style.minHeight = `${expandedHeight}px`;
        }

        // Collapse to small circular typing bubble initial state
        gsap.set(message, {
          width: 58,
          height: 58,
          borderRadius: "9999px",
          padding: 0,
          scale: 0,
        });

        gsap.set(messageCopy, {
          opacity: 0,
        });

        let collapseWhenDone = false;

        // Timeline 1: Bubble pops into view with typing indicator
        const enterTimeline = gsap.timeline({ paused: true });
        enterTimeline.to(message, {
          scale: 1,
          duration: 0.35,
          ease: "back.out(1.5)",
        });

        // Timeline 2: Typing dots fade, bubble morphs and expands to reveal full text
        const expandTimeline = gsap.timeline({
          paused: true,
          onReverseComplete: () => {
            if (collapseWhenDone) {
              collapseWhenDone = false;
              enterTimeline.reverse();
            }
          },
        });

        expandTimeline
          .to(typingIndicator, {
            autoAlpha: 0,
            duration: 0.2,
          })
          .to(message, {
            width: expandedWidth,
            borderRadius: "1.75rem",
            paddingLeft: "1.75rem",
            paddingRight: "1.75rem",
            duration: 0.45,
            ease: "power3.inOut",
          })
          .to(
            message,
            {
              height: expandedHeight,
              paddingTop: "1.25rem",
              paddingBottom: "1.25rem",
              duration: 0.4,
              ease: "power3.inOut",
            },
            "-=0.2"
          )
          .to(
            messageCopy,
            {
              opacity: 1,
              duration: 0.3,
              stagger: 0.05,
            },
            "-=0.2"
          );

        // ScrollTrigger 1: Pop in typing bubble as user approaches
        ScrollTrigger.create({
          trigger: message,
          start: "top 88%",
          onEnter: () => {
            collapseWhenDone = false;
            enterTimeline.play();
          },
          onLeaveBack: () => {
            if (expandTimeline.progress() > 0) {
              collapseWhenDone = true;
            } else {
              enterTimeline.reverse();
            }
          },
        });

        // ScrollTrigger 2: Expand to full message bubble
        ScrollTrigger.create({
          trigger: message,
          start: "top 76%",
          onEnter: () => expandTimeline.play(),
          onLeaveBack: () => expandTimeline.reverse(),
        });
      });
    }, section);

    // Refresh ScrollTrigger after layout calculation
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id={faq.id}
      ref={sectionRef}
      className={`relative w-full border-b-4 border-gaude-black bg-gaude-black px-4 py-24 sm:px-6 sm:py-32 md:px-8 md:py-36 text-white ${sectionFlowAfter}`}
    >
      <style>{`
        @keyframes faq-typing-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-typing-1 {
          animation: faq-typing-bounce 1s infinite ease-in-out;
        }
        .animate-typing-2 {
          animation: faq-typing-bounce 1s infinite ease-in-out 0.2s;
        }
        .animate-typing-3 {
          animation: faq-typing-bounce 1s infinite ease-in-out 0.4s;
        }
      `}</style>

      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.04] via-transparent to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="mb-16 md:mb-24 text-center">
          <p className="font-archivo text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-gaude-orange mb-3">
            HAVE QUESTIONS? // WE HAVE ANSWERS
          </p>
          <h2 className="font-archivo text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white leading-[0.9]">
            {faq.heading}
          </h2>
          <p className="mt-4 mx-auto max-w-xl font-inter text-sm sm:text-base md:text-lg text-white/70 font-medium leading-relaxed">
            Everything you need to know about our growth systems, automations, and delivery process.
          </p>
        </div>

        {/* Conversational Scroll-Animated FAQ Container */}
        <div className="flex flex-col gap-10 sm:gap-14 md:gap-16">
          {faq.items.map((item, index) => (
            <div key={index} className="flex flex-col gap-4 sm:gap-5">
              {/* Question Row (Left Aligned Chat Bubble) */}
              <div className="flex justify-start items-start w-full">
                <div
                  className="faq-message relative overflow-hidden self-start max-w-[85%] sm:max-w-[75%] md:max-w-[70%] rounded-[1.75rem] border-2 border-white/20 bg-[#dbe4ec] text-black shadow-lg"
                  style={{ willChange: "transform, width, height" }}
                >
                  {/* Bouncing Typing Dots (Indicator) */}
                  <div className="typing-indicator absolute inset-0 flex items-center justify-center gap-1.5 pointer-events-none">
                    <span className="h-2 w-2 rounded-full bg-black animate-typing-1" />
                    <span className="h-2 w-2 rounded-full bg-black animate-typing-2" />
                    <span className="h-2 w-2 rounded-full bg-black animate-typing-3" />
                  </div>

                  {/* Question Content */}
                  <div className="faq-content w-max max-w-full flex flex-col px-6 py-4">
                    <p className="font-archivo text-sm sm:text-base md:text-lg font-black uppercase tracking-tight text-black leading-snug">
                      {item.q}
                    </p>
                  </div>
                </div>
              </div>

              {/* Answer Row (Right Aligned Chat Bubble) */}
              <div className="flex justify-end items-start w-full">
                <div
                  className="faq-message relative overflow-hidden self-end max-w-[88%] sm:max-w-[80%] md:max-w-[72%] rounded-[1.75rem] border-2 border-[#ff7033] bg-gaude-orange text-white shadow-xl"
                  style={{ willChange: "transform, width, height" }}
                >
                  {/* Bouncing Typing Dots (Indicator) */}
                  <div className="typing-indicator absolute inset-0 flex items-center justify-center gap-1.5 pointer-events-none">
                    <span className="h-2 w-2 rounded-full bg-white animate-typing-1" />
                    <span className="h-2 w-2 rounded-full bg-white animate-typing-2" />
                    <span className="h-2 w-2 rounded-full bg-white animate-typing-3" />
                  </div>

                  {/* Answer Content */}
                  <div className="faq-content w-max max-w-full flex flex-col px-6 py-4">
                    <p className="font-inter text-xs sm:text-sm md:text-base font-semibold leading-relaxed text-white">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
