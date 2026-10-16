import Link from "next/link";
import ParallaxImage from "@/components/ParallaxImage";
import ArticleCard from "@/components/ArticleCard";
import { SanityImage } from "@/components/SanityImage";
import { SanityPortableText } from "@/components/SanityPortableText";
import Footer from "@/components/Footer";
import InfiniteCarousel from "@/components/InfiniteCarousel";
import dynamic from "next/dynamic";
const ProgramCarousel = dynamic(() => import("@/components/ProgramCarousel"));
const InstagramEmbed = dynamic(() => import("@/components/InstagramEmbed"));
import ScrollToSectionButton from "@/components/ScrollToSectionButton";
import type { PortableTextBlock } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { safeExternalUrl } from "@/sanity/lib/urls";
import type {
  FEATURED_PROGRAMS_QUERY_RESULT,
  MAPRES_QUERY_RESULT,
  PUBLICATION_CARDS_QUERY_RESULT,
} from "@/sanity.types";
import {
  CABINET_PROFILE_QUERY,
  CONTENT_TERM,
  FEATURED_PROGRAMS_QUERY,
  MAPRES_QUERY,
  PUBLICATION_CARDS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";

export default async function Home() {
  const params = { term: CONTENT_TERM };
  const [
    settingsResult,
    cabinetResult,
    programsResult,
    postsResult,
    mapresResult,
  ] = await Promise.all([
    sanityFetch({
      query: SITE_SETTINGS_QUERY,
      params,
      perspective: "published",
      stega: false,
    }),
    sanityFetch({
      query: CABINET_PROFILE_QUERY,
      params,
      perspective: "published",
      stega: false,
    }),
    sanityFetch({
      query: FEATURED_PROGRAMS_QUERY,
      params,
      perspective: "published",
      stega: false,
    }),
    sanityFetch({
      query: PUBLICATION_CARDS_QUERY,
      params,
      perspective: "published",
      stega: false,
    }),
    sanityFetch({
      query: MAPRES_QUERY,
      params,
      perspective: "published",
      stega: false,
    }),
  ]);

  const settings = settingsResult.data;
  const cabinet = cabinetResult.data;
  const programs = (programsResult.data ??
    []) as FEATURED_PROGRAMS_QUERY_RESULT;
  const posts = postsResult.data ?? [];
  const mapres = mapresResult.data ?? [];

  const kajianPosts = posts.filter(
    (post: PUBLICATION_CARDS_QUERY_RESULT[number]) =>
      post.postCategory.toLowerCase().includes("kajian"),
  );
  const artikelPosts = posts.filter(
    (post: PUBLICATION_CARDS_QUERY_RESULT[number]) =>
      !post.postCategory.toLowerCase().includes("kajian"),
  );
  const allArticles = [...kajianPosts, ...artikelPosts].slice(0, 3);

  return (
    <div
      className="relative overflow-x-hidden"
      style={{
        background:
          "linear-gradient(180deg, #000c23 0%, #003089 52%, #000c23 100%)",
      }}
    >
      {/* HERO SECTION - FULL SCREEN */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-28 pb-16 text-center">
        <ParallaxImage
          src="/assets/LOGO KABINET/logo-full.png"
          alt=""
          width={800}
          height={800}
          speed={0.12}
          className="pointer-events-none absolute right-[-50vw] top-1/2 z-0 h-[58vh] w-auto -translate-y-1/2 object-contain opacity-20 sm:right-[-25vw] sm:h-[68vh] md:right-[-30vw] lg:right-[-18vw] lg:h-[82vh]"
          style={{ width: "auto" }}
          aria-hidden="true"
          priority
        />
        <div className="relative z-10 flex flex-col items-center gap-0">
          <h1
            className="text-depth text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-widest text-white leading-tight"
            style={{ textShadow: "0 4px 24px rgba(0,0,0,0.35)" }}
          >
            BEM FISIP UNPAD 2026
          </h1>
          <p className="text-depth text-lg text-white sm:text-xl">
            {cabinet?.cabinetName ?? "Kabinet Pendar Mentari"} · 2026
          </p>
        </div>
        <div className="absolute bottom-10 left-1/2 z-10 flex w-[min(100%-2rem,42rem)] -translate-x-1/2 flex-col items-center gap-5 sm:bottom-12">
          <div className="flex items-center">
            <ScrollToSectionButton
              targetId="mengapa-pendar-mentari"
              className="group inline-flex flex-col items-center gap-0 text-sm font-bold text-white transition-colors hover:text-white"
            >
              Lebih Lanjut Tentang Kami
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transition-transform group-hover:translate-y-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m7 10 5 5 5-5"
                />
              </svg>
            </ScrollToSectionButton>
          </div>
        </div>
      </section>

      {/* MENGAPA PENDAR MENTARI */}
      <section
        id="mengapa-pendar-mentari"
        className="relative isolate scroll-mt-8 max-w-7xl mx-auto px-6 py-24 flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center"
      >
        <ParallaxImage
          src="/assets/home/asset1.png"
          alt=""
          width={864}
          height={960}
          speed={0.18}
          className="hidden lg:block pointer-events-none absolute right-[-18%] top-[56%] z-0 h-[105%] w-[52%] max-w-none -translate-y-1/2 object-contain opacity-75 lg:right-[-8%] lg:top-[56%] lg:h-[120%] lg:w-[42%]"
          aria-hidden="true"
        />

        {/* Heading khusus Mobile & Tablet (Muncul pertama, order-1) */}
        <h2
          className="text-depth text-4xl sm:text-5xl font-bold text-white leading-tight lg:hidden order-1"
          style={{ letterSpacing: "-0.05em" }}
        >
          Mengapa Pendar Mentari?
        </h2>

        {/* Video YouTube (Urutan kedua di sm/md, urutan kanan di lg) */}
        <div className="relative z-10 w-full aspect-video overflow-hidden border border-white/15 lg:h-80 lg:w-[84%] lg:justify-self-start lg:aspect-auto order-2 lg:order-2">
          <iframe
            className="absolute inset-0 z-10 h-full w-full"
            src="https://www.youtube.com/embed/znT9GP-2LYo"
            title="Video profil BEM FISIP UNPAD"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
          />
        </div>

        {/* Deskripsi Teks (Urutan ketiga di sm/md, urutan kiri di lg) */}
        <div className="space-y-6 order-3 lg:order-1">
          {/* Heading khusus Desktop */}
          <h2
            className="hidden lg:block text-depth text-4xl sm:text-5xl font-bold text-white leading-tight"
            style={{ letterSpacing: "-0.05em" }}
          >
            Mengapa Pendar Mentari?
          </h2>
          <SanityPortableText
            blocks={(cabinet?.overview ?? []) as unknown as PortableTextBlock[]}
            className="text-base text-white sm:text-lg text-justify"
          />
          <Link
            href="/about"
            className="inline-flex items-center gap-2 font-bold text-white transition-colors hover:text-white text-sm"
          >
            Pelajari lebih lanjut
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* PROGRAM KAMI */}
      <section className="relative py-20 mt-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <ParallaxImage
            src="/assets/home/asset2.png"
            alt=""
            width={864}
            height={960}
            speed={0.15}
            className="absolute left-1/2 top-1/2 z-0 h-full w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-80"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 mb-10 text-center">
          <h2
            className="text-depth text-5xl sm:text-6xl font-bold text-white"
            style={{ letterSpacing: "-0.05em" }}
          >
            Program Kami
          </h2>
        </div>

        <div className="relative z-20">
          {programs.length > 0 ? (
            <ProgramCarousel programs={programs} />
          ) : (
            <EmptyState text="Belum ada program yang dipublikasikan." />
          )}
        </div>
      </section>

      {/* MAHASISWA BERPRESTASI */}
      <section className="relative isolate overflow-hidden py-20 mb-20">
        <div className="relative z-5 max-w-6xl mx-auto px-6 mb-10 text-center pt-20">
          <h2
            className="text-depth text-5xl sm:text-6xl font-bold text-white"
            style={{ letterSpacing: "-0.05em" }}
          >
            Mahasiswa Berprestasi
          </h2>
        </div>
        <div className="relative z-10">
          {mapres.length > 0 ? (
            <InfiniteCarousel ariaLabel="Mahasiswa berprestasi">
              {mapres.map((item: MAPRES_QUERY_RESULT[number]) => {
                const dimensions = item.image.asset?.metadata?.dimensions;
                const aspectRatio = dimensions
                  ? `${dimensions.width} / ${dimensions.height}`
                  : "3 / 4";
                const profileUrl = safeExternalUrl(item.instagramUrl);

                const card = (
                  <article
                    key={item._id}
                    className="group relative h-72 flex-none overflow-hidden sm:h-80 lg:h-96"
                    style={{ aspectRatio }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <SanityImage
                        value={item.image}
                        width={384}
                        height={512}
                        sizes="(min-width: 1024px) 288px, 240px"
                        fallbackAlt={`Foto ${item.nama_mapres}`}
                        className="h-full w-full bg-black/10 object-contain brightness-70 transition-brightness duration-300 group-hover:brightness-100 rounded-lg"
                        preserveAspectRatio
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/45 to-transparent px-4 pb-4 pt-16 rounded-lg">
                        <h3 className="text-depth font-bold text-white text-sm">
                          {item.nama_mapres}
                        </h3>
                        {item.achievementTitle && (
                          <p className="text-white text-xs mt-1 line-clamp-5">
                            {item.achievementTitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );

                return profileUrl ? (
                  <a
                    key={item._id}
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Lihat profil Instagram ${item.nama_mapres}`}
                    className="flex-none cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-yellow"
                  >
                    {card}
                  </a>
                ) : (
                  card
                );
              })}
            </InfiniteCarousel>
          ) : (
            <EmptyState text="Belum ada data prestasi yang dipublikasikan." />
          )}
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="relative z-10 py-5">
        <div className="max-w-6xl mx-auto px-6 mb-10 text-center">
          <h2
            className="text-depth text-5xl sm:text-6xl font-bold text-white"
            style={{ letterSpacing: "-0.05em" }}
          >
            Siaran Pers
          </h2>
        </div>
        <InstagramEmbed />
      </section>

      {/* ARTIKEL DAN KAJIAN */}
      <section className="relative isolate z-1 overflow py-20">
        <ParallaxImage
          src="/assets/home/asset5.png"
          alt=""
          width={1200}
          height={1200}
          speed={0.15}
          className="pointer-events-none absolute -left-1/4 top-1/2 translate-y-[-60%] h-[125%] w-auto max-w-none z-0 opacity-80"
          style={{ width: "auto" }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 ">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
            <h2
              className="text-depth text-5xl sm:text-6xl font-bold text-white"
              style={{ letterSpacing: "-0.05em" }}
            >
              <Link href="/article">Artikel dan Kajian</Link>
            </h2>
            <p className="text-white text-base sm:text-lg underline text-left md:text-right shrink-0">
              <Link href="/article">Lihat semua</Link>
            </p>
          </div>

          {allArticles.length > 0 ? (
            <div className="flex flex-col gap-6">
              {allArticles.map(
                (post: PUBLICATION_CARDS_QUERY_RESULT[number]) => (
                  <ArticleCard key={post._id} post={post} />
                ),
              )}
            </div>
          ) : (
            <EmptyState text="Belum ada artikel atau kajian yang dipublikasikan." />
          )}
        </div>
      </section>

      {/* FOOTER */}
      <Footer settings={settings} />
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <p
        className="p-6 text-white text-sm"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {text}
      </p>
    </div>
  );
}
