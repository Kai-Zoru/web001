"use client";
import { animate, motion, MotionValue, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** Desktop: full peacock at spread === 1. Index 3 = center anchor (no motion). */
const PEACOCK_DESKTOP = [
  { x: -480, y: 60, rotate: -12 },
  { x: -320, y: 30, rotate: -7 },
  { x: -160, y: 10, rotate: -3 },
  { x: 0, y: 0, rotate: 0 },
  { x: 160, y: 10, rotate: 3 },
  { x: 320, y: 30, rotate: 7 },
  { x: 480, y: 60, rotate: 12 }
] as const;

/** Mobile (<768px): reduced fan so cards stay on-screen. */
const PEACOCK_MOBILE = [
  { x: -120, y: 20, rotate: -5 },
  { x: -80, y: 12, rotate: -3 },
  { x: -40, y: 6, rotate: -2 },
  { x: 0, y: 0, rotate: 0 },
  { x: 40, y: 6, rotate: 2 },
  { x: 80, y: 12, rotate: 3 },
  { x: 120, y: 20, rotate: 5 },
] as const;

const CARD_IMAGES = [
  "/images/card_01.png",
  "/images/card_02.png",
  "/images/card_03.png",
  "/images/card_04.png",
  "/images/card_05.png",
  "/images/card_06.png",
  "/images/card_07.png",
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
  target: { readonly x: number; readonly y: number; readonly rotate: number };
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
      className="absolute inset-0 overflow-hidden rounded-2xl drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)]"
    >
      <Image
        src={CARD_IMAGES[index]}
        alt={`Card ${index + 1}`}
        fill
        className="rounded-2xl object-cover"
      />
    </motion.div>
  );
}

function HeroPeacockPin() {
  const scrollRef = useRef<HTMLElement | null>(null);
  const spread = useMotionValue(0);
  const smoothedSpread = useSpring(spread, {
    stiffness: 180,
    damping: 24,
    mass: 0.6,
  });
  const [entranceDone, setEntranceDone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });
  const heldProgress = useTransform(scrollYProgress, [0, 0.7, 1], [0.15, 1, 1]);

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
      spread.set(latest);
    };
    applyScroll(heldProgress.get());
    return heldProgress.on("change", applyScroll);
  }, [entranceDone, heldProgress, spread]);

  const targets = isMobile ? PEACOCK_MOBILE : PEACOCK_DESKTOP;

  return (
    <section ref={scrollRef} className="relative h-[160vh]">
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center px-4 pb-8 pt-20 text-center sm:px-6 md:max-lg:justify-between md:max-lg:py-24 md:pb-4 md:pt-28 lg:justify-center lg:gap-y-6">
          <div className="flex w-full flex-1 items-end justify-center pb-8 md:max-lg:flex-1 md:max-lg:items-start md:max-lg:pt-12 lg:flex-none lg:items-center lg:pb-0">
            <h1 className="font-sans text-3xl font-bold tracking-tighter text-white sm:text-5xl">
              One Browser For All Your Accounts
            </h1>
          </div>

          <div className="relative h-56 w-44 shrink-0 sm:h-80 sm:w-64">
            {targets.map((t, index) => (
              <PeacockCard key={index} index={index} spread={smoothedSpread} target={t} />
            ))}
          </div>

          <div className="flex w-full flex-1 items-start justify-center pt-8 md:max-lg:flex-1 md:max-lg:items-end md:max-lg:pb-20 lg:flex-none lg:items-center lg:pt-0">
            <button
              type="button"
              className="rounded-full border border-white/20 bg-[#000102] px-5 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#0f172a]"
            >
              Download
            </button>
          </div>
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

        <section className="min-h-screen py-20 flex items-center justify-center">
          <div className="max-w-7xl mx-auto w-full px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <article className="relative min-h-[280px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl md:col-span-7">
              <div className="relative z-10 p-8 md:p-10">
                <h3 className="text-2xl font-bold text-white">Dynamic Fingerprinting</h3>
                <p className="mt-4 max-w-md text-sm font-medium leading-6 text-gray-400">
                  Forge a unique digital identity for every profile. To trackers, each session appears as a completely distinct physical device.
                </p>
              </div>
              </article>

              <article className="relative min-h-[280px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl md:col-span-5">
              <div className="relative z-10 p-8 md:p-10">
              <h3 className="text-2xl font-bold text-white">Isolated Environments</h3>
              <p className="mt-4 max-w-md text-sm font-medium leading-6 text-gray-400">
                Run unlimited accounts in total isolation. Each profile maintains its own dedicated cookies, local storage, and secure sandbox.
              </p>
              </div>
              </article>

              <article className="relative min-h-[280px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl md:col-span-5">
              <div className="relative z-10 p-8 md:p-10">
              <h3 className="text-2xl font-bold text-white">Granular Proxy Control</h3>
              <p className="mt-4 max-w-md text-sm font-medium leading-6 text-gray-400">
                Assign independent Proxies or VPNs to each profile with zero leakage. Maintain regional consistency across your entire workflow.
              </p>
              </div>
              </article>

              <article className="relative min-h-[280px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl md:col-span-7">
              <div className="relative z-10 p-8 md:p-10">
              <h3 className="text-2xl font-bold text-white">Cross-Profile Privacy</h3>
              <p className="mt-4 max-w-md text-sm font-medium leading-6 text-gray-400">
                Shatter the data trail. Our architecture prevents trackers from correlating your activities, ensuring your profiles remain invisible to each other.
              </p>
              </div>
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
