"use client";

import { motion } from "framer-motion";

export default function Home() {
  const heroTextMotion = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const },
  };

  const cardMotion = (index: number) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: {
      duration: 0.45,
      delay: index * 0.12,
      ease: "easeOut" as const,
    },
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-gray-900">
      <header className="sticky top-0 z-20 h-16 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="rounded-md border border-dashed border-gray-300 bg-gray-100 px-3 py-1 text-sm font-medium">
            Logo Placeholder
          </div>
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-3 md:flex"
          >
            <div className="rounded-md border border-dashed border-gray-300 bg-gray-100 px-3 py-1 text-sm">
              Nav Link
            </div>
            <div className="rounded-md border border-dashed border-gray-300 bg-gray-100 px-3 py-1 text-sm">
              Nav Link
            </div>
            <div className="rounded-md border border-dashed border-gray-300 bg-gray-100 px-3 py-1 text-sm">
              Nav Link
            </div>
          </nav>
        </div>
      </header>

      <main className="min-h-screen overflow-x-hidden">
        <section className="mx-auto flex min-h-[80vh] w-full max-w-7xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex w-full max-w-3xl flex-col items-center gap-5 text-center">
            <motion.h1
              {...heroTextMotion}
              className="w-full rounded-lg border border-dashed border-gray-300 bg-gray-100 px-4 py-6 text-4xl font-bold sm:text-5xl"
            >
              H1 Placeholder
            </motion.h1>
            <motion.p
              {...heroTextMotion}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="w-full rounded-lg border border-dashed border-gray-300 bg-gray-100 px-4 py-4 text-base sm:text-lg"
            >
              Paragraph placeholder text for the hero description area.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22, ease: "easeOut" }}
              type="button"
              className="rounded-md border border-dashed border-gray-300 bg-gray-100 px-6 py-3 text-sm font-medium"
            >
              Button Placeholder
            </motion.button>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-100 px-4 py-8 text-xl font-semibold">
            Section Title Placeholder
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <motion.article
              {...cardMotion(0)}
              className="aspect-video rounded-lg border border-dashed border-gray-300 bg-gray-100"
            />
            <motion.article
              {...cardMotion(1)}
              className="aspect-video rounded-lg border border-dashed border-gray-300 bg-gray-100"
            />
            <motion.article
              {...cardMotion(2)}
              className="aspect-video rounded-lg border border-dashed border-gray-300 bg-gray-100"
            />
          </div>
        </section>

        <footer className="border-t border-gray-200">
          <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-md border border-dashed border-gray-300 bg-gray-100 px-4 py-3 text-sm">
                Footer Link Group
              </div>
              <div className="rounded-md border border-dashed border-gray-300 bg-gray-100 px-4 py-3 text-sm">
                Footer Link Group
              </div>
              <div className="rounded-md border border-dashed border-gray-300 bg-gray-100 px-4 py-3 text-sm">
                Footer Link Group
              </div>
            </div>
            <div className="mt-8 rounded-md border border-dashed border-gray-300 bg-gray-100 px-4 py-3 text-center text-sm">
              Copyright Placeholder
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
