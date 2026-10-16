import ParallaxImage from "@/components/ParallaxImage";

const NILAI = [
  {
    title: "Empati",
    body: "BEM FISIP Unpad menjunjung tinggi nilai empati sebagai dasar dalam memahami dan merespons kebutuhan mahasiswa. Dengan empati, organisasi hadir lebih dekat, peka terhadap permasalahan, serta mampu menciptakan lingkungan yang inklusif dan suportif.",
  },
  {
    title: "Resilien",
    body: "Resiliensi menjadi kekuatan untuk menghadapi tantangan dan dinamika organisasi. Nilai ini menekankan kemampuan beradaptasi, bangkit dari kesulitan, serta menjaga konsistensi dalam mewujudkan visi dan misi organisasi.",
  },
  {
    title: "Kolaboratif",
    body: "Semangat kolaborasi diwujudkan melalui kerja sama lintas departemen, biro, maupun dengan stakeholder lainnya. Nilai ini mencerminkan keterbukaan, sinergi, dan komitmen untuk membangun gerakan mahasiswa yang berdampak.",
  },
  {
    title: "Meritokrasi",
    body: "BEM FISIP Unpad menegakkan prinsip meritokrasi dengan memberikan kesempatan berdasarkan kemampuan, prestasi, dan kontribusi nyata. Nilai ini memastikan setiap individu dihargai secara adil, profesional, dan proporsional sesuai kapasitasnya.",
  },
];

export default function NilaiSection() {
  return (
    <section
      aria-labelledby="nilai-heading"
      className="relative mx-auto max-w-6xl px-6 py-24 md:px-14"
    >
      {/* Background strip (was the divider between Budaya Kerja and Nilai).
          Absolute = takes no layout space. Pinned to the top of this section,
          screen-wide, behind the content. */}
      <div aria-hidden className="pointer-events-none relative h-0">
        <ParallaxImage
          src="/assets/about/asset4.png"
          alt=""
          width={1200}
          height={400}
          speed={0.2}
          sizes="100vw"
          className="absolute top-0 -z-10 h-auto w-[60vw] max-w-none -translate-x-1/2 -translate-y-1/2 select-none  opacity-45  hidden md:block"
        />
      </div>

      <div className="mb-10 text-center">
        <h2
          id="nilai-heading"
          className="text-depth text-3xl text-brand-yellow font-bold leading-snug sm:text-4xl lg:text-5xl"
          style={{ letterSpacing: "-0.03em" }}
        >
          Nilai-Nilai
        </h2>
      </div>

      {/* Four values -> 2 × 2 on md+, so each card keeps a readable width. */}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {NILAI.map((n) => (
          <article
            key={n.title}
            className="rounded border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-white/20 hover:bg-brand-yellow/10 motion-reduce:transition-none sm:p-6"
          >
            <h3 className="text-xl font-bold text-white">{n.title}</h3>
            <p className="mt-3 text-left text-sm leading-7 text-white/90 lg:text-justify">
              {n.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
