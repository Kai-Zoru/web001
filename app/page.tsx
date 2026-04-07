"use client";
import { animate, motion, MotionValue, useMotionValue, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Desktop: full peacock at spread === 1. Index 3 = center anchor (no motion). */
const PEACOCK_DESKTOP = [
  { x: -480, y: 60, rotate: -12, bg: "bg-gray-700" },
  { x: -320, y: 30, rotate: -7, bg: "bg-gray-600" },
  { x: -160, y: 10, rotate: -3, bg: "bg-gray-500" },
  { x: 0, y: 0, rotate: 0, bg: "bg-gray-400" },
  { x: 160, y: 10, rotate: 3, bg: "bg-gray-500" },
  { x: 320, y: 30, rotate: 7, bg: "bg-gray-600" },
  { x: 480, y: 60, rotate: 12, bg: "bg-gray-700" },
] as const;

/** Mobile (<768px): reduced fan so cards stay on-screen. */
const PEACOCK_MOBILE = [
  { x: -120, y: 20, rotate: -5, bg: "bg-gray-700" },
  { x: -80, y: 12, rotate: -3, bg: "bg-gray-600" },
  { x: -40, y: 6, rotate: -2, bg: "bg-gray-500" },
  { x: 0, y: 0, rotate: 0, bg: "bg-gray-400" },
  { x: 40, y: 6, rotate: 2, bg: "bg-gray-500" },
  { x: 80, y: 12, rotate: 3, bg: "bg-gray-600" },
  { x: 120, y: 20, rotate: 5, bg: "bg-gray-700" },
] as const;

function zIndexForCard(index: number) {
  if (index === 3) return 70;
  return 30 - Math.abs(index - 3) * 4;
}

function PeacockCard({
  index,
  spread,
  target,
}: {
  index: number;
  spread: MotionValue<number>;
  target: { readonly x: number; readonly y: number; readonly rotate: number; readonly bg: string };
}) {
  const x = useTransform(spread, (s) => target.x * s);
  const y = useTransform(spread, (s) => target.y * s);
  const rotate = useTransform(spread, (s) => target.rotate * s);
  const opacity = useTransform(spread, [0, 0.15, 1], [0, 1, 1]);
  const scale = useTransform(spread, [0, 0.15, 1], [0.8, 1, 1]);

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        opacity,
        scale,
        zIndex: zIndexForCard(index),
      }}
      className={`absolute inset-0 rounded-2xl shadow-xl ${target.bg}`}
    />
  );
}

function HeroPeacockPin() {
  const scrollRef = useRef<HTMLElement | null>(null);
  const spread = useMotionValue(0);
  const [entranceDone, setEntranceDone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const controls = animate(spread, 0.15, {
      type: "spring",
      stiffness: 200,
      damping: 20,
    });
    void controls.then(() => setEntranceDone(true));
    return () => controls.stop();
  }, [spread]);

  useEffect(() => {
    if (!entranceDone) return;
    const applyScroll = (latest: number) => {
      spread.set(0.15 + latest * 0.85);
    };
    applyScroll(scrollYProgress.get());
    return scrollYProgress.on("change", applyScroll);
  }, [entranceDone, scrollYProgress, spread]);

  const targets = isMobile ? PEACOCK_MOBILE : PEACOCK_DESKTOP;

  return (
    <section ref={scrollRef} className="relative h-[400vh]">
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-y-6 px-4 pb-4 pt-24 text-center sm:px-6 sm:pt-28">
          <h1 className="text-3xl font-bold text-white sm:text-5xl">
            One Browser For All Your Accounts
          </h1>

          <div className="relative h-56 w-44 sm:h-80 sm:w-64">
            {targets.map((t, index) => (
              <PeacockCard key={index} index={index} spread={spread} target={t} />
            ))}
          </div>

          <button
            type="button"
            className="rounded-full border border-white/20 bg-[#000102] px-5 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#0f172a]"
          >
            Download
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-clip text-white">
      <header
        className={`fixed top-0 left-0 z-[100] w-full isolate bg-[#0f172a]/70 backdrop-blur-3xl ${
          isMobileMenuOpen ? "" : "border-b border-white/10"
        }`}
      >
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="text-xl font-bold tracking-widest text-white font-[family-name:var(--font-cantata)]">ORBIS</div>
          <div className="hidden items-center gap-x-8 md:flex">
            <a href="#" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
              Features
            </a>
            <a href="#" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
              Pricing
            </a>
            <a href="#" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
              FAQ
            </a>
          </div>
          <button
            type="button"
            className="hidden rounded-full border border-white bg-transparent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 md:block"
          >
            Download
          </button>
          <button
            type="button"
            aria-label="Open menu"
            className="text-white md:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </nav>
        {isMobileMenuOpen ? (
          <div className="absolute left-0 top-full z-[100] w-full border-b border-white/10 bg-[#000102] px-4 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] md:hidden">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
              <a href="#" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
                Features
              </a>
              <a href="#" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
                Pricing
              </a>
              <a href="#" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
                FAQ
              </a>
              <button
                type="button"
                className="w-full rounded-full border border-white bg-transparent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Download
              </button>
            </div>
          </div>
        ) : null}
      </header>

      <main className="min-h-screen bg-[linear-gradient(180deg,#000102_0%,#004E9C_100%)] bg-fixed bg-cover">
        <HeroPeacockPin />

        <section className="w-full overflow-x-hidden py-24">
          <div className="mx-auto flex h-auto min-h-[calc(100vh-8rem)] w-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 md:h-full md:grid-cols-3 md:grid-rows-2 md:gap-4">
              <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#000102]/50 p-8 backdrop-blur-xl md:col-span-2">
              <h3 className="text-2xl font-bold text-white">Dynamic Fingerprinting</h3>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-gray-400">
                Forge a unique digital identity for every profile. To trackers, each session appears as a completely distinct physical device.
              </p>
              <div className="mt-auto min-h-[80px] w-full flex-1 rounded-xl border border-dashed border-white/20 bg-black/50" />
              </article>

              <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#000102]/50 p-8 backdrop-blur-xl md:col-span-1">
              <h3 className="text-2xl font-bold text-white">Isolated Environments</h3>
              <p className="mt-3 text-sm font-medium leading-6 text-gray-400">
                Run unlimited accounts in total isolation. Each profile maintains its own dedicated cookies, local storage, and secure sandbox.
              </p>
              <div className="mt-auto min-h-[80px] w-full flex-1 rounded-xl border border-dashed border-white/20 bg-white/5" />
              </article>

              <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#000102]/50 p-8 backdrop-blur-xl md:col-span-1">
              <h3 className="text-2xl font-bold text-white">Granular Proxy Control</h3>
              <p className="mt-3 text-sm font-medium leading-6 text-gray-400">
                Assign independent Proxies or VPNs to each profile with zero leakage. Maintain regional consistency across your entire workflow.
              </p>
              <div className="mt-auto min-h-[80px] w-full flex-1 rounded-xl border border-dashed border-white/20 bg-black/50" />
              </article>

              <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#000102]/50 p-8 backdrop-blur-xl md:col-span-2">
              <h3 className="text-2xl font-bold text-white">Cross-Profile Privacy</h3>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-gray-400">
                Shatter the data trail. Our architecture prevents trackers from correlating your activities, ensuring your profiles remain invisible to each other.
              </p>
              <div className="mt-auto min-h-[80px] w-full flex-1 rounded-xl border border-dashed border-white/20 bg-black/50" />
              </article>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center gap-y-2 mob_land:w-full mob_land:flex-row mob_land:items-center mob_land:justify-between mob_land:gap-0 mob_land:text-left md:w-full md:flex-row md:items-center md:justify-between md:gap-0 md:text-left">
              <div className="text-xl font-bold tracking-widest text-white font-[family-name:var(--font-cantata)]">ORBIS</div>
              <p className="text-sm text-gray-400">© 2026 ORBIS. All rights reserved.</p>
            </div>
            <p className="mx-auto mt-12 max-w-3xl text-center text-xs text-gray-300 transition-colors duration-300 hover:text-gray-100">
              DISCLAIMER: This website is a conceptual mockup created solely for portfolio demonstration. It is not a real company, offers no actual services, and does not collect or store any personal data. Any resemblance to real entities is purely coincidental.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
