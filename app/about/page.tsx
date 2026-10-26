import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/page-metadata";
import Footer from "@/components/Footer";
import BudayaKerjaSection from "@/components/about/BudayaKerjaSection";
import DepartemenBiroSection from "@/components/about/DepartemenBiroSection";
import LogoSection from "@/components/about/LogoSection";
import MeshBackground from "@/components/about/MeshBackground";
import MisiSection from "@/components/about/MisiSection";
import VisiSection from "@/components/about/VisiSection";
import NilaiSection from "@/components/about/NilaiSection";
import KetuaWakilSection from "@/components/about/KetuaWakilSection";
import {
  PimpinanDepartemenBiroSection,
  SekretariatBidangSection,
} from "@/components/about/PetinggiCarouselSections";
import { sanityFetch } from "@/sanity/lib/live";
import {
  CONTENT_TERM,
  LEADERSHIP_MEMBERS_QUERY,
  CABINET_PROFILE_QUERY,
  ORGANIZATION_UNITS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> { return getPageMetadata({
  path: "/about",
  title: "Tentang — BEM FISIP Unpad 2026",
  description:
    "Pelajari lebih lanjut tentang Badan Eksekutif Mahasiswa FISIP Unpad 2026, kabinet Pendar Mentari, visi, misi, dan struktur organisasi.",
}); }

export default async function AboutPage() {
  const params = { term: CONTENT_TERM };
  const [settingsResult, unitsResult, membersResult, cabinetResult] = await Promise.all([
    sanityFetch({
      query: SITE_SETTINGS_QUERY,
      params,
      perspective: "published",
      stega: false,
    }),
    sanityFetch({
      query: ORGANIZATION_UNITS_QUERY,
      params,
      perspective: "published",
      stega: false,
    }),
    sanityFetch({
      query: LEADERSHIP_MEMBERS_QUERY,
      params,
      perspective: "published",
      stega: false,
    }),
    sanityFetch({ query: CABINET_PROFILE_QUERY, params, perspective: "published", stega: false }),
  ]);
  const settings = settingsResult.data;
  const units = unitsResult.data ?? [];
  const members = membersResult.data ?? [];

  return (
    // overflow-x-clip (not hidden): the 100vw dividers are wider than the page
    // when a vertical scrollbar is present, and `hidden` would break the
    // position: sticky inside LogoSection.
    <div className="relative isolate overflow-x-clip text-white">
      <MeshBackground />

      {/* SECTION 1 - Logo Philosophy */}
      <h1 className="sr-only">BEM FISIP Unpad 2026</h1>
      <LogoSection copy={cabinetResult.data?.logoExplanationItems} />

      {/* SECTION 2 - Visi */}
      <VisiSection vision={cabinetResult.data?.vision} highlights={cabinetResult.data?.visionHighlights} />

      {/* SECTION 3 - Misi */}
      <MisiSection items={cabinetResult.data?.missionItems} />

      {/* SECTION 4 - Budaya Kerja */}
      <BudayaKerjaSection items={cabinetResult.data?.workCultureItems} />

      {/* SECTION 5 - Nilai */}
      <NilaiSection values={cabinetResult.data?.values} />

      {/* SECTION 6-8 - Petinggi (with hierarchy connector) */}
      <div className="relative">
        {/* Vertical hierarchy spine connecting the leadership sections */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[60vh] bottom-[-2rem] w-3 -z-5 -translate-x-1/2 bg-gradient-to-b from-white/0 via-white/40 via-5% via-white/15 via-85% to-white/0"
          style={{ filter: "drop-shadow(0 0 14px rgba(255,255,255,0.4))" }}
        />
        {/* SECTION 6 - Petinggi */}
        <KetuaWakilSection members={members} />

        {/* SECTION 7 - Sekretariat Umum & Kepala Bidang */}
        <SekretariatBidangSection members={members} />

        {/* SECTION 8 - Kepala & Wakil Kepala Departemen & Biro */}
        <PimpinanDepartemenBiroSection members={members} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <DepartemenBiroSection units={units} />
      </div>

      <Footer settings={settings} />
    </div>
  );
}
