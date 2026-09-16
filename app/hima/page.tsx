import Footer from "@/components/Footer";
import { sanityFetch } from "@/sanity/lib/live";
import { CONTENT_TERM, SITE_SETTINGS_QUERY, STUDENT_ASSOCIATIONS_QUERY } from "@/sanity/lib/queries";
import HimaGallery from "@/components/HimaGallery";

export default async function HimaPage() {
  const params = { term: CONTENT_TERM };
  const [settingsResult, associationsResult] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, params, perspective: "published", stega: false }),
    sanityFetch({ query: STUDENT_ASSOCIATIONS_QUERY, params, perspective: "published", stega: false }),
  ]);
  const associations = associationsResult.data ?? [];

  return (
    <div
      className="relative overflow-x-hidden text-white pt-24 min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #000c23 0%, #003089 52%, #000c23 100%)",
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
