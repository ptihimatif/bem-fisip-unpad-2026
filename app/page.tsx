import Link from "next/link";
import Image from "next/image";
import { SanityImage } from "@/components/SanityImage";
import Footer from "@/components/Footer";
import InfiniteCarousel from "@/components/InfiniteCarousel";
import ScrollToSectionButton from "@/components/ScrollToSectionButton";
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
  const programs = programsResult.data ?? [];
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
        <Image
          src="/assets/LOGO KABINET/logo-full.png"
          alt=""
          width={800}
          height={800}
          className="pointer-events-none absolute right-[-50vw] top-1/2 z-0 h-[58vh] w-auto -translate-y-1/2 object-contain opacity-20 sm:right-[-25vw] sm:h-[68vh] md:right-[-30vw] lg:right-[-18vw] lg:h-[82vh]"
          aria-hidden="true"
          priority
        />
        <div className="relative z-10 flex flex-col items-center gap-0">
          <h1
            className="text-depth text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[0.18em] text-white leading-tight"
            style={{ textShadow: "0 4px 24px rgba(0,0,0,0.35)" }}
          >
            BEM FISIP UNPAD 2026
          </h1>
          <p className="text-depth text-lg tracking-[0.18em] text-white sm:text-xl">
            {cabinet?.cabinetName ?? "Kabinet Pendar Mentari"} · 2026
          </p>
        </div>
        <div className="absolute bottom-10 left-1/2 z-10 flex w-[min(100%-2rem,42rem)] -translate-x-1/2 flex-col items-center gap-5 sm:bottom-12">
          <div className="flex items-center">
            <ScrollToSectionButton
              targetId="mengapa-pendar-mentari"
              className="group inline-flex flex-col items-center gap-2 text-sm font-bold text-white transition-colors hover:text-white"
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
                  d="M12 5v14m7-7-7 7-7-7"
                />
              </svg>
            </ScrollToSectionButton>
          </div>
        </div>
      </section>

      {/* MENGAPA PENDAR MENTARI */}
      <section
        id="mengapa-pendar-mentari"
        className="relative isolate scroll-mt-8 max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center"
      >
        <Image
          src="/assets/home/asset1.png"
          alt=""
          width={864}
          height={960}
          className="pointer-events-none absolute right-[-18%] top-1/2 z-0 h-[125%] w-[62%] max-w-none -translate-y-1/2 object-contain opacity-75 lg:right-[-8%] lg:h-[145%] lg:w-[48%]"
          aria-hidden="true"
        />
        <div className="space-y-6">
          <h2
            className="text-depth text-4xl sm:text-5xl font-bold text-white leading-tight"
            style={{ letterSpacing: "-0.05em" }}
          >
            Mengapa Pendar Mentari?
          </h2>
          <p className=" text-base text-white sm:text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            vitae justo nec arcu tincidunt consequat. Sed at libero vel nisl
            posuere facilisis, sementara semangat kolaborasi terus tumbuh di
            tengah mahasiswa FISIP. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Integer vitae justo nec arcu tincidunt consequat.
            Sed at libero vel nisl posuere facilisis, sementara semangat
            kolaborasi terus tumbuh di tengah mahasiswa FISIP.
          </p>
          <p className="text-base text-white sm:text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            vitae justo nec arcu tincidunt consequat. Sed at libero vel nisl
            posuere facilisis.
          </p>
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
        <div className="relative z-10 aspect-video w-full overflow-hidden border border-white/15 lg:h-80 lg:w-[84%] lg:justify-self-start lg:aspect-auto">
          <iframe
            className="absolute inset-0 z-10 h-full w-full"
            src="https://www.youtube.com/embed/znT9GP-2LYo"
            title="Video profil BEM FISIP UNPAD"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </section>

      {/* PROGRAM KAMI */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 mb-10 text-center">
          <h2
            className="text-depth text-5xl sm:text-6xl font-bold text-white"
            style={{ letterSpacing: "-0.05em" }}
          >
            Program Kami
          </h2>
        </div>
        {programs.length > 0 ? (
          <InfiniteCarousel ariaLabel="Program unggulan">
            {programs.map((program: FEATURED_PROGRAMS_QUERY_RESULT[number]) => {
              const programUrl = safeExternalUrl(program.externalLink);
              const card = (
                <article
                  key={program._id}
                  className="group relative w-72 flex-none overflow-hidden"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <SanityImage
                      value={program.coverImage}
                      width={576}
                      height={324}
                      sizes="288px"
                      fallbackAlt={`Gambar ${program.name}`}
                      className="h-full w-full object-cover opacity-55 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/45 to-transparent px-4 pb-4 pt-16">
                      <h3 className="text-depth font-bold text-white text-sm leading-snug">
                        {program.name}
                      </h3>
                      {program.shortDescription && (
                        <p className="text-white text-xs leading-relaxed line-clamp-2">
                          {program.shortDescription}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );

              return programUrl ? (
                <a
                  key={program._id}
                  href={programUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Buka program ${program.name}`}
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
          <EmptyState text="Belum ada program yang dipublikasikan." />
        )}
      </section>

      {/* MAHASISWA BERPRESTASI */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 mb-10 text-center">
          <h2
            className="text-depth text-5xl sm:text-6xl font-bold text-white"
            style={{ letterSpacing: "-0.05em" }}
          >
            Mahasiswa Berprestasi
          </h2>
        </div>
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
                  <div className="absolute inset-0">
                    <SanityImage
                      value={item.image}
                      width={384}
                      height={512}
                      sizes="(min-width: 1024px) 288px, 240px"
                      fallbackAlt={`Foto ${item.nama_mapres}`}
                      className="h-full w-full bg-black/10 object-contain opacity-55 transition-opacity duration-300 group-hover:opacity-100"
                      preserveAspectRatio
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/45 to-transparent px-4 pb-4 pt-16">
                      <h3 className="text-depth font-bold text-white text-sm">
                        {item.nama_mapres}
                      </h3>
                      {item.achievementTitle && (
                        <p className="text-white text-xs mt-1 line-clamp-2">
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
      </section>

      {/* SIARAN PERS */}
      {posts.length > 0 && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6 mb-10 text-center">
            <h2
              className="text-depth text-5xl sm:text-6xl font-bold text-white"
              style={{ letterSpacing: "-0.05em" }}
            >
              Siaran Pers
            </h2>
          </div>
          <div className="flex gap-5 overflow-x-auto scrollbar-hide px-6 max-w-6xl mx-auto pb-4">
            {posts
              .slice(0, 6)
              .map((post: PUBLICATION_CARDS_QUERY_RESULT[number]) => (
                <Link
                  key={post._id}
                  href={`/post/${post.slug ?? post._id}`}
                  className="flex-none w-72 overflow-hidden group"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <SanityImage
                      value={post.image}
                      width={576}
                      height={324}
                      sizes="288px"
                      fallbackAlt={`Gambar ${post.judul}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{
                        background: "linear-gradient(90deg, #FFBA3A, #FFF9EE)",
                      }}
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-xs font-bold text-white uppercase tracking-widest">
                      {post.postCategory}
                    </span>
                    <h3 className="text-depth font-bold text-white text-sm leading-snug line-clamp-2">
                      {post.judul}
                    </h3>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* ARTIKEL DAN KAJIAN */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-depth text-5xl sm:text-6xl font-bold text-white mb-12"
            style={{ letterSpacing: "-0.05em" }}
          >
            Artikel dan Kajian
          </h2>
          {allArticles.length > 0 ? (
            <div className="flex flex-col gap-6">
              {allArticles.map(
                (post: PUBLICATION_CARDS_QUERY_RESULT[number]) => {
                  const isKajian = post.postCategory
                    ?.toLowerCase()
                    .includes("kajian");
                  return (
                    <Link
                      key={post._id}
                      href={`/post/${post.slug ?? post._id}`}
                      className="flex gap-0 overflow-hidden group"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div
                        className="w-1.5 flex-none"
                        style={{ background: isKajian ? "#FF7700" : "#8CFF00" }}
                      />
                      <div className="flex-1 p-6 space-y-2">
                        <div className="flex items-center gap-3">
                          <span
                            className="text-xs font-bold uppercase tracking-widest px-2 py-0.5"
                            style={{
                              background: "rgba(255,255,255,0.12)",
                              color: "#FFFFFF",
                            }}
                          >
                            {isKajian ? "Kajian" : "Artikel"}
                          </span>
                          <span className="text-white text-xs">
                            {post.postCategory}
                          </span>
                        </div>
                        <h3 className="text-depth font-bold text-white text-lg leading-snug group-hover:text-white transition-colors line-clamp-2">
                          {post.judul}
                        </h3>
                        {post.excerpt && (
                          <p className="text-white text-sm leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                        {post.publishedAt && (
                          <p className="text-white text-xs">
                            {new Intl.DateTimeFormat("id-ID", {
                              dateStyle: "long",
                            }).format(new Date(post.publishedAt))}
                          </p>
                        )}
                      </div>
                      <div className="relative w-48 flex-none hidden sm:block overflow-hidden">
                        <SanityImage
                          value={post.image}
                          width={384}
                          height={244}
                          sizes="192px"
                          fallbackAlt={`Gambar ${post.judul}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>
                  );
                },
              )}
            </div>
          ) : (
            <EmptyState text="Belum ada artikel atau kajian yang dipublikasikan." />
          )}
          <div className="mt-10 text-center">
            <Link
              href="/article"
              className="inline-flex items-center gap-2 px-8 py-3 font-bold text-sm text-white bg-brand-yellow hover:bg-[#ffd27a] transition-colors shadow-lg"
            >
              Lihat Semua Publikasi
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
