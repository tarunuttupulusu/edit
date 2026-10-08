"use client";

import { tech } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sectionFlowAfter } from "@/lib/stickyStack";
import { Marquee } from "@/components/ui/marquee";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TECH_STACK = [
  { name: "TYPESCRIPT", color: "#3178c6" },
  { name: "JAVASCRIPT", color: "#f7df1e", textColor: "black" },
  { name: "NEXT.JS", color: "#000000" },
  { name: "REACT", color: "#61dafb", textColor: "black" },
  { name: "NODE.JS", color: "#339933" },
  { name: "MONGODB", color: "#47a248" },
  { name: "PYTHON", color: "#3776ab" },
  { name: "HTML5", color: "#e34f26" },
  { name: "CSS3", color: "#1572b6" },
  { name: "TAILWIND CSS", color: "#06b6d4" },
  { name: "VERCEL", color: "#000000" },
  { name: "AWS", color: "#ff9900" },
  { name: "FIREBASE", color: "#ffca28", textColor: "black" },
  { name: "GOOGLE CLOUD", color: "#4285f4" },
  { name: "EXPRESS.JS", color: "#000000" },
  { name: "WORDPRESS", color: "#21759b" },
  { name: "FIGMA", color: "#f24e1e" },
  { name: "FRAMER", color: "#0055ff" },
  { name: "GITHUB", color: "#181717" },
  { name: "GIT", color: "#f05032" },
  { name: "N8N", color: "#ff6d5a" },
  { name: "OPENAI", color: "#412991" },
  { name: "WHATSAPP API", color: "#25d366" },
  { name: "POSTGRES", color: "#4169e1" },
  { name: "SUPABASE", color: "#3ecf8e" },
  { name: "DOCKER", color: "#2496ed" },
  { name: "REDIS", color: "#dc382d" },
  { name: "NOTION", color: "#000000" },
  { name: "SLACK", color: "#4a154b" },
  { name: "STRIPE", color: "#008cdd" },
  { name: "POSTMAN", color: "#ff6c37" },
  { name: "CANVA", color: "#00c4cc" },
  { name: "THREEJS", color: "#000000" },
  { name: "VUE.JS", color: "#4fc08d" },
  { name: "FLUTTER", color: "#02569b" },
  { name: "RENDER", color: "#46e3b7", textColor: "black" },
  { name: "AZURE", color: "#0089d6" },
  { name: "PORTFOLIO", color: "#ff0000" },
  { name: "PRETTIER", color: "#f7b93e", textColor: "black" },
  { name: "ADOBE", color: "#ff0000" },
  { name: "BABEL", color: "#f9dc3e", textColor: "black" },
  { name: "WEBPACK", color: "#8dd6f9", textColor: "black" },
];

const ROW_1 = TECH_STACK.slice(0, 11);
const ROW_2 = TECH_STACK.slice(11, 21);
const ROW_3 = TECH_STACK.slice(21, 31);
const ROW_4 = TECH_STACK.slice(31);

interface TechItemProps {
  item: (typeof TECH_STACK)[number];
}

function TechBadge({ item }: TechItemProps) {
  return (
    <Badge
      style={{ backgroundColor: item.color }}
      className={cn(
        "cursor-default select-none rounded-[4px] border-0 px-3 py-1.5 font-archivo text-[10px] font-black uppercase tracking-wider shadow-sm transition-transform duration-200 hover:scale-110 sm:px-3.5 sm:py-2 sm:text-[11px] md:px-5 md:py-2.5 md:text-xs",
        item.textColor === "black" ? "text-black" : "text-white"
      )}
    >
      {item.name}
    </Badge>
  );
}

export function TechSection() {
  return (
    <section
      id={tech.id}
      className={`flex min-h-[60svh] flex-col justify-center overflow-x-clip bg-white px-4 py-24 md:min-h-[70svh] md:px-8 md:py-32 ${sectionFlowAfter}`}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-12">
          <SectionHeading title={tech.heading} description={tech.description} />
        </div>

        {/* Marquee Container with edge fading gradients */}
        <div className="relative -mx-4 flex flex-col gap-2.5 overflow-hidden sm:-mx-8 sm:gap-3 md:mx-0 md:gap-3.5">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-20 md:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-20 md:w-28" />

          {/* Row 1: Forward */}
          <Marquee pauseOnHover repeat={4} speed="normal" className="[--gap:8px] sm:[--gap:10px] md:[--gap:12px]">
            {ROW_1.map((item) => (
              <TechBadge key={item.name} item={item} />
            ))}
          </Marquee>

          {/* Row 2: Reverse */}
          <Marquee reverse pauseOnHover repeat={4} speed="normal" className="[--gap:8px] sm:[--gap:10px] md:[--gap:12px]">
            {ROW_2.map((item) => (
              <TechBadge key={item.name} item={item} />
            ))}
          </Marquee>

          {/* Row 3: Forward */}
          <Marquee pauseOnHover repeat={4} speed="normal" className="[--gap:8px] sm:[--gap:10px] md:[--gap:12px]">
            {ROW_3.map((item) => (
              <TechBadge key={item.name} item={item} />
            ))}
          </Marquee>

          {/* Row 4: Reverse */}
          <Marquee reverse pauseOnHover repeat={4} speed="normal" className="[--gap:8px] sm:[--gap:10px] md:[--gap:12px]">
            {ROW_4.map((item) => (
              <TechBadge key={item.name} item={item} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
