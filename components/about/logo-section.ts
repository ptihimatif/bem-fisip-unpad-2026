// ---------------------------------------------------------------------------
// Static data for LogoSection – keeps content separate from presentation.
// ---------------------------------------------------------------------------

/** Shape of a single explanation card shown alongside the logo. */
export interface Explanation {
  title: string;
  description: string;
  /** Logo piece IDs to highlight. Omit to show the full logo. */
  parts?: string[];
  /** Light the pieces one at a time instead of all together. */
  cycle?: boolean;
}

// ---- Logo piece groups --------------------------------------------------- //

export const WAVE = ["Group-1", "Group-16"] as const;
export const SUN = ["Group-13", "Group-14", "Group-15"] as const;
export const CORE = ["Group-4"] as const;

// ---- Every clickable / highlightable SVG layer --------------------------- //

export const PARTS = [
  "Group-1",
  "Group-4",
  "Group-13",
  "Group-14",
  "Group-15",
  "Group-16",
] as const;

// ---- Explanation cards (index 0 = intro) --------------------------------- //

export const explanations: Explanation[] = [
  { title: "", description: "" },
  {
    title: "Bentuk Ombak Angka 17",
    description:
      "Garis lengkung pada bagian bawah logo membentuk angka 17 yang menyerupai ombak. Elemen ini melambangkan 17 departemen/biro BEM FISIP Unpad 2026 yang bergerak dalam satu arah dan tujuan. Angka 7 seperti ombak menggambarkan dinamika, kekuatan, serta kemampuan organisasi untuk terus bergerak maju dan beradaptasi.",
    parts: [...WAVE],
  },
  {
    title: 'Huruf "P" sebagai Pendar',
    description:
      'Bentuk lingkaran di tengah logo membentuk huruf "P" yang merupakan inisial dari Pendar. Posisi huruf P sebagai pusat matahari melambangkan peran fungsionaris BEM FISIP Unpad sebagai sumber semangat, inspirasi, dan penggerak yang menyatukan seluruh elemen organisasi.',
    parts: [...CORE],
  },
  {
    title: 'Huruf "M" sebagai Mentari',
    description:
      'Garis-garis yang menjulang pada bagian atas logo membentuk huruf "M" yang melambangkan Mentari sebagai representasi harapan, energi positif, dan semangat untuk terus memberikan manfaat bagi lingkungan sekitar.',
    parts: [...SUN],
    cycle: true,
  },
  {
    title: "Enam Sudut Mentari",
    description:
      "Enam sudut pancaran matahari pada logo melambangkan 6 bidang yang menjadi pilar utama BEM FISIP Unpad 2026. Setiap sudut menggambarkan kontribusi dan kolaborasi antar bidang dalam mendukung tercapainya visi dan misi bersama.",
    parts: [...SUN],
  },
  {
    title: "Matahari sebagai Simbol Kehidupan",
    description:
      "Bentuk matahari menjadi simbol cahaya, kehidupan, dan optimisme. Pancaran sinarnya mencerminkan semangat BEM FISIP Unpad 2026 untuk terus berkembang, menginspirasi, serta memberikan dampak positif bagi masyarakat.",
    parts: [...CORE, ...SUN],
  },
  {
    title: "Warna Kuning Keemasan",
    description:
      "Warna kuning keemasan melambangkan kejayaan, prestasi, optimisme, dan semangat. Warna ini juga merepresentasikan cahaya mentari yang memberikan harapan, energi, dan motivasi untuk terus berkarya.",
    parts: [...CORE, ...SUN],
    cycle: true,
  },
  {
    title: "Warna Biru",
    description:
      "Warna biru melambangkan kepercayaan, profesionalisme, stabilitas, dan kebersamaan. Warna biru juga mencerminkan ketenangan serta komitmen organisasi dalam menjalankan setiap program secara bertanggung jawab.",
    parts: [...WAVE],
    cycle: true,
  },
  {
    title: "Sinergi Pendar Mentari",
    description:
      "Logo ini menggambarkan sinergi antara 17 departemen dan 6 bidang yang bersatu dalam semangat kebersamaan. Pendar Mentari mencerminkan BEM FISIP Unpad 2026 yang terus bergerak maju, menginspirasi, dan memberikan manfaat melalui kerja sama, inovasi, dan dedikasi seluruh anggotanya.",
  },
];

// ---- Layout & animation constants ---------------------------------------- //

export const CARD_VH = 70; // height of one text card (vh)
export const STEP_VH = 50; // page scroll needed to move to the next card (vh)
export const PART_DIM = 0.15; // opacity of non-highlighted (dimmed) parts
export const CYCLE_MS = 1000; // ms each piece stays lit in cycle mode

// ---- Asset paths ---------------------------------------------------------- //

export const ASSET_DIR = "/assets/LOGO KABINET" as const;
export const PARTS_DIR = `${ASSET_DIR}/pecahan logo baru` as const;

// ---- Visual constants ----------------------------------------------------- //

export const GRADIENT =
  "linear-gradient(180deg, #39589b 0%, #003089 50%, #000c23 100%)";
export const SIZES = "(min-width: 1024px) 480px, 320px";
