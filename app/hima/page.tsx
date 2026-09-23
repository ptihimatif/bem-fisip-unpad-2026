import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/sanity/lib/live";
import {
  CONTENT_TERM,
  SITE_SETTINGS_QUERY,
  STUDENT_ASSOCIATIONS_QUERY,
} from "@/sanity/lib/queries";
import HimaGallery from "@/components/HimaGallery";

export const metadata: Metadata = {
  title: "Hima/Huria — BEM FISIP Unpad 2026",
  description:
    "Kenali Himpunan Mahasiswa (Hima) dan Huria mahasiswa FISIP Unpad. Galeri profil dan informasi resmi setiap organisasi mahasiswa.",
};

export default async function HimaPage() {
  const params = { term: CONTENT_TERM };
  const [settingsResult, associationsResult] = await Promise.all([
    sanityFetch({
      query: SITE_SETTINGS_QUERY,
      params,
      perspective: "published",
      stega: false,
    }),
    sanityFetch({
      query: STUDENT_ASSOCIATIONS_QUERY,
      params,
      perspective: "published",
      stega: false,
    }),
  ]);
  const associations = associationsResult.data ?? [];

  return (
    <div
      className="relative overflow-x-hidden text-white pt-24 min-h-screen"
      style={{
        backgroundImage: `
          radial-gradient(at 30% 15%, rgba(0, 12, 35, 0.95) 0px, transparent 50%),
          radial-gradient(at 75% 10%, rgba(0, 48, 137, 0.85) 0px, transparent 50%),
          radial-gradient(at 5% 65%, rgba(255, 186, 58, 0.25) 0px, transparent 50%),
          radial-gradient(at 85% 55%, rgba(0, 102, 204, 0.55) 0px, transparent 50%),
          radial-gradient(at 10% 90%, rgba(255, 138, 0, 0.25) 0px, transparent 50%),
          radial-gradient(at 90% 95%, rgba(0, 30, 90, 0.95) 0px, transparent 50%),
          radial-gradient(at 15% 5%, rgba(90, 140, 255, 0.45) 0px, transparent 50%),
          linear-gradient(180deg, #000c23 0%, #003089 52%, #000c23 100%)
        `,
      }}
    >
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {/* HEADER SECTION */}
        <section aria-labelledby="hima-title" className="">
          <h1
            id="hima-title"
            className="text-depth text-4xl sm:text-6xl font-extrabold mt-2"
            style={{ letterSpacing: "-0.05em" }}
          >
            Hima/Huria
          </h1>
        </section>
        {/* GARIS LURUS FULL WIDTH */}
        <div
          className="border-t border-white mt-2.5 mb-10"
          style={{
            position: "relative",
            width: "100vw",
            left: "50%",
            marginLeft: "-50vw",
          }}
        />

        <HimaGallery associations={associations} />
      </main>
      <Footer settings={settingsResult.data} />
    </div>
  );
}
