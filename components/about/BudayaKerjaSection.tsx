const BUDAYA = [
  {
    title: "Open Mind",
    body: "Keterbukaan pikiran untuk melihat dan memahami. Organisasi harus berani menerima perspektif baru, merefleksikan cara pandang lama, dan menjadikan setiap ide sebagai peluang untuk bertumbuh.",
  },
  {
    title: "Open Heart",
    body: "Keterbukaan hati untuk merasakan dan peduli. Dengan empati dan solidaritas, organisasi mampu mendengar dengan hati, membangun koneksi yang lebih dalam, dan menciptakan lingkungan yang inklusif serta suportif.",
  },
  {
    title: "Open Will",
    body: "Keterbukaan tekad untuk berani bertindak. Organisasi dituntut untuk berani bertindak dengan integritas dan keberanian, tidak hanya berpikir dan merasakan, tetapi juga mengambil langkah nyata demi keberlanjutan dan dampak positif bagi mahasiswa.",
  },
];

export default function BudayaKerjaSection() {
  return (
    <section
      aria-labelledby="budaya-heading"
      className="relative isolate mx-auto max-w-6xl px-6 py-24 md:px-14"
    >
      {/* Same heading block as Misi: yellow, text-3xl → 5xl, mb-10. */}
      <div className="mb-10 text-center">
        <h2
          id="budaya-heading"
          className="text-depth text-3xl text-brand-yellow font-bold leading-snug sm:text-4xl lg:text-5xl"
          style={{ letterSpacing: "-0.03em" }}
        >
          Budaya Kerja
        </h2>
      </div>

      {/* Same 3-column grid and cards as Visi. Hover = Visi's "active" state. */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {BUDAYA.map((b) => (
          <article
            key={b.title}
            className="rounded border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-[0_8px_32px_-8px_rgba(255,255,255,0.12)] ring-1 ring-inset ring-white/10 transition-all duration-300 hover:border-white/25 hover:bg-white/15 hover:shadow-[0_12px_40px_-8px_rgba(255,255,255,0.2)] motion-reduce:transition-none sm:p-6"
          >
            {/* Title styled like Misi's card titles. */}
            <h3 className="text-xl font-bold text-white">{b.title}</h3>
            <p className="mt-3 text-left text-sm leading-7 text-white/90 lg:text-justify">
              {b.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
