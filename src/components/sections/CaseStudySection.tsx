"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { caseStudy, works as staticWorks } from "@/content/landing";
import { sectionFlow } from "@/lib/stickyStack";
import { WindowScrollReveal } from "@/components/ui/WindowScrollReveal";
import type { SiteWorkItem } from "@/lib/site-content";

interface RowPreset {
  col1Width: string;
  col2Width: string;
  col2Offset: string;
}

const ROW_PRESETS: RowPreset[] = [
  {
    col1Width: "w-full md:w-[57%]",
    col2Width: "w-full md:w-[39%]",
    col2Offset: "md:pt-14",
  },
  {
    col1Width: "w-full md:w-[39%]",
    col2Width: "w-full md:w-[57%]",
    col2Offset: "md:pt-14",
  },
  {
    col1Width: "w-full md:w-[57%]",
    col2Width: "w-full md:w-[39%]",
    col2Offset: "md:pt-14",
  },
];

export function CaseStudySection({ works: worksProp }: { works?: SiteWorkItem[] }) {
  const works = worksProp?.length
    ? worksProp
    : staticWorks.map((w) => ({
        id: w.id,
        title: w.title,
        location: w.location,
        category: w.category,
        image: w.image,
        fullWidth: w.fullWidth,
        problem: w.problem,
        approach: w.approach,
        outcome: w.outcome,
        focus: [...w.focus],
      }));

  // Dynamically group all projects into pairs for the staggered editorial layout
  const rows: { items: { work: SiteWorkItem; globalIndex: number }[]; rowIndex: number }[] = [];
  for (let i = 0; i < works.length; i += 2) {
    const pair = works.slice(i, i + 2).map((work, offset) => ({
      work,
      globalIndex: i + offset,
    }));
    rows.push({ items: pair, rowIndex: Math.floor(i / 2) });
  }

  return (
    <section
      id={caseStudy.id}
      className={`relative flex min-h-[100svh] flex-col justify-center bg-gaude-black py-24 md:py-32 ${sectionFlow}`}
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-14 flex items-center justify-between gap-4 md:mb-20">
          <h2 className="font-archivo text-[clamp(2rem,6vw,4.25rem)] uppercase leading-none tracking-tighter text-white md:text-6xl lg:text-7xl">
            Selected{" "}
            <span className="text-gaude-orange">Works</span>
          </h2>

          <Link
            href="/work"
            aria-label="Know more about our work"
            title="Know more"
            className="group inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white transition-all hover:border-gaude-orange hover:bg-gaude-orange md:h-14 md:w-14"
          >
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:h-6 md:w-6" />
            <span className="sr-only">Know more</span>
          </Link>
        </div>

        {/* Dynamic Staggered Projects Grid: Total Image Appears Uncropped */}
        <div className="flex flex-col gap-14 md:gap-24">
          {rows.map(({ items, rowIndex }) => {
            const preset = ROW_PRESETS[rowIndex % ROW_PRESETS.length];

            // If lone item in final row, center nicely
            if (items.length === 1) {
              const { work, globalIndex } = items[0];
              return (
                <div key={work.id} className="flex justify-center">
                  <div className="w-full md:w-[70%]">
                    <Link href="/work" className="group block">
                      <WindowScrollReveal
                        src={work.image}
                        alt={work.title}
                        index={globalIndex}
                        aspectRatio="2 / 1"
                      />
                      <div className="mt-4 flex items-start justify-between gap-4">
                        <div>
                          <p className="font-archivo text-[11px] font-bold uppercase tracking-[0.2em] text-gaude-orange">
                            {work.category}
                          </p>
                          <h3 className="mt-1 font-archivo text-xl font-bold uppercase tracking-tight text-white transition-colors group-hover:text-gaude-orange sm:text-2xl md:text-3xl">
                            {work.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 pt-1">
                          <span className="font-mono text-xs tracking-wider text-white/50">
                            {work.location}
                          </span>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-md transition-all group-hover:border-gaude-orange group-hover:bg-gaude-orange">
                            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            }

            const first = items[0];
            const second = items[1];

            return (
              <div
                key={`row-${rowIndex}`}
                className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between"
              >
                {/* First Project in Pair */}
                <div className={preset.col1Width}>
                  <Link href="/work" className="group block">
                    <WindowScrollReveal
                      src={first.work.image}
                      alt={first.work.title}
                      index={first.globalIndex}
                      delay={0}
                      aspectRatio="2 / 1"
                    />

                    <div className="mt-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-archivo text-[11px] font-bold uppercase tracking-[0.2em] text-gaude-orange">
                          {first.work.category}
                        </p>
                        <h3 className="mt-1 font-archivo text-xl font-bold uppercase tracking-tight text-white transition-colors group-hover:text-gaude-orange sm:text-2xl md:text-3xl">
                          {first.work.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 pt-1">
                        <span className="font-mono text-xs tracking-wider text-white/50">
                          {first.work.location}
                        </span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-md transition-all group-hover:border-gaude-orange group-hover:bg-gaude-orange">
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Second Project in Pair (With staggered delay and vertical offset) */}
                <div className={`${preset.col2Width} ${preset.col2Offset}`}>
                  <Link href="/work" className="group block">
                    <WindowScrollReveal
                      src={second.work.image}
                      alt={second.work.title}
                      index={second.globalIndex}
                      delay={0.22}
                      aspectRatio="2 / 1"
                    />

                    <div className="mt-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-archivo text-[11px] font-bold uppercase tracking-[0.2em] text-gaude-orange">
                          {second.work.category}
                        </p>
                        <h3 className="mt-1 font-archivo text-xl font-bold uppercase tracking-tight text-white transition-colors group-hover:text-gaude-orange sm:text-2xl md:text-3xl">
                          {second.work.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 pt-1">
                        <span className="font-mono text-xs tracking-wider text-white/50">
                          {second.work.location}
                        </span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-md transition-all group-hover:border-gaude-orange group-hover:bg-gaude-orange">
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


