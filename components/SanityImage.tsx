import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { PUBLICATION_CARDS_QUERY_RESULT } from "@/sanity.types";

type SanityImageValue = NonNullable<
  PUBLICATION_CARDS_QUERY_RESULT[number]["image"]
>;

type Props = {
  value?: SanityImageValue | null;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  priority?: boolean;
  fallbackAlt: string;
  fit?: "crop" | "clip";
  preserveAspectRatio?: boolean;
};

export function SanityImage({
  value,
  width,
  height,
  sizes,
  className,
  priority,
  fallbackAlt,
  fit = "crop",
  preserveAspectRatio = false,
}: Props) {
  if (!value?.asset) return null;
  const imageBuilder = urlFor(value).width(width);
  const src = preserveAspectRatio
    ? imageBuilder.auto("format").url()
    : imageBuilder.height(height).fit(fit).auto("format").url();
  const dimensions = value.asset.metadata?.dimensions;
  // Sanity serves these variants directly. `sizes` alone has no effect when
  // Next Image is unoptimized, so a picture source supplies actual candidates.
  const maxWidth = Math.min(width * 2, dimensions?.width ?? width * 2);
  const widths = [...new Set([320, 480, 640, 800, 960, 1200, 1600, maxWidth])]
    .filter((candidate) => candidate > 0 && candidate <= maxWidth).sort((a, b) => a - b);
  const srcSet = widths.map((candidate) => {
    const variant = urlFor(value).width(candidate);
    const url = preserveAspectRatio
      ? variant.auto("format").url()
      : variant.height(Math.max(1, Math.round(candidate * height / width))).fit(fit).auto("format").url();
    return `${url} ${candidate}w`;
  }).join(", ");

  // Calculate aspect ratio to prevent CLS on lazy-loaded images
  const aspectRatio =
    preserveAspectRatio && dimensions
      ? `${dimensions.width} / ${dimensions.height}`
      : `${width} / ${height}`;

  return (
    <picture className="contents">
      <source srcSet={srcSet} sizes={sizes} />
    <Image
      src={src}
      alt={value.alt || fallbackAlt}
      width={preserveAspectRatio ? (dimensions?.width ?? width) : width}
      height={preserveAspectRatio ? (dimensions?.height ?? height) : height}
      sizes={sizes}
      className={className}
      priority={priority}
      // src is already resized/format-negotiated by the Sanity CDN; skip the second /_next/image pass
      unoptimized
      placeholder={value.asset.metadata?.lqip ? "blur" : "empty"}
      blurDataURL={value.asset.metadata?.lqip ?? undefined}
      style={{ aspectRatio }}
    />
    </picture>
  );
}
