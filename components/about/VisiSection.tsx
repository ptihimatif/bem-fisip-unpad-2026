"use client";

import { useEffect, useState } from "react";

// ─── data ────────────────────────────────────────────────────────────────────

const VISI_PARTS = [
  { text: "BEM FISIP Unpad sebagai ", term: -1 },
  { text: "Pijar Asa", term: 0 },
  { text: " dalam Memenuhi Kebutuhan Mahasiswa Melalui ", term: -1 },
  { text: "Kolaborasi Strategis", term: 1 },
  { text: " untuk ", term: -1 },
  { text: "Perubahan yang Bermakna", term: 2 },
  { text: ".", term: -1 },
];

const PENJABARAN = [
  {
    term: 0,
    body: "Pijar Asa dimaknai sebagai cahaya kecil yang menyala konsisten dan tidak pernah padam. Ia mungkin tidak langsung menjadi api besar, tetapi ia hadir terus-menerus, menerangi kebutuhan paling mendasar mahasiswa. BEM FISIP Unpad memposisikan dirinya bukan sebagai sorotan yang menyilaukan, melainkan sebagai pijar yang hangat — hadir, terasa, dan memberi arah. Pijar Asa berarti keberpihakan pada kebutuhan riil mahasiswa: akademik, kesejahteraan, ruang dialektika, hingga pengembangan potensi.",
  },
  {
    term: 1,
    body: "Kolaborasi Strategis dimaknai sebagai kerja bersama yang terarah, setara, dan saling menguatkan. BEM FISIP Unpad tidak berdiri sebagai pusat kuasa, melainkan sebagai simpul penghubung antara Himpunan, Huria, UKM, komunitas, dan fakultas. Strategis berarti tidak seremonial dan tidak sporadis, melainkan dirancang dengan kesadaran arah bersama.",
  },
  {
    term: 2,
    body: "Perubahan yang Bermakna bukan sekadar perubahan yang terlihat, tetapi perubahan yang dirasakan dan berkelanjutan. BEM FISIP Unpad hadir untuk memastikan setiap perubahan yang diperjuangkan berorientasi pada kebermanfaatan nyata bagi mahasiswa — perbaikan sistem, penguatan budaya akademik, peningkatan kesejahteraan, dan ekosistem organisasi yang sehat.",
  },
];

// ─── component ───────────────────────────────────────────────────────────────

const CYCLE_MS = 2400; // ms each card stays lit when the device can't hover

export default function VisiSection() {
  // Which term is highlighted. -1 = none (whole sentence reads plain).
  const [active, setActive] = useState<number | null>(null);

  // Devices with no pointer (touch): cycle the highlight card by card, the way
  // the logo section cycles its pieces. Hover/focus devices keep manual control.
  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (canHover || reduceMotion) return;

    const section = document.getElementById("visi-section");
    if (!section) return;

    let i = 0;
    let timer: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      if (timer) return;
      timer = setInterval(() => setActive(i++ % PENJABARAN.length), CYCLE_MS);
    };
    const stop = () => {
      clearInterval(timer);
      timer = undefined;
      setActive(null);
    };

    // Only cycle while the section is actually on screen.
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.25 },
    );
    observer.observe(section);

    return () => {
      stop();
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="visi-section"
      aria-labelledby="visi-heading"
      className="px-6 py-24 md:px-14"
    >
      {/* ── Visi headline ── */}
      <div className="mx-auto max-w-5xl text-center">
        <h2
          id="visi-heading"
          className="text-depth text-3xl text-brand-yellow font-bold leading-snug sm:text-4xl lg:text-5xl "
          style={{ letterSpacing: "-0.03em" }}
        >
          Visi
        </h2>
        <h2
          className="text-depth text-2xl font-bold leading-snug sm:text-3xl lg:text-4xl"
          style={{ letterSpacing: "-0.03em" }}
        >
          {VISI_PARTS.map((part, i) =>
            part.term === -1 ? (
              <span key={i}>{part.text}</span>
            ) : (
              <span
                key={i}
                className="inline-block transition-colors duration-300 motion-reduce:transition-none"
                style={
                  active === part.term
                    ? { color: "var(--color-brand-yellow)" }
                    : { color: "white" }
                }
              >
                {part.text}
              </span>
            ),
          )}
        </h2>
      </div>

      {/* ── Penjabaran: all three, side by side ── */}
      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {PENJABARAN.map((p) => {
          const isActive = active === p.term;
          return (
            <article
              key={p.term}
              onMouseEnter={() => setActive(p.term)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(p.term)}
              onBlur={() => setActive(null)}
              tabIndex={0}
              className={[
                "rounded border p-5 backdrop-blur-sm sm:p-6 transition-colors duration-300 motion-reduce:transition-none",
                isActive
                  ? "border-white/20 bg-brand-yellow/10"
                  : "border-white/10 bg-white/5",
              ].join(" ")}
            >
              <p className="text-left text-sm leading-7 text-white/90 lg:text-justify">
                {p.body}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}