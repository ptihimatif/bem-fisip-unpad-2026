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

  // Calculate aspect ratio to prevent CLS on lazy-loaded images
  const aspectRatio =
    preserveAspectRatio && dimensions
      ? `${dimensions.width} / ${dimensions.height}`
      : `${width} / ${height}`;

  return (
    <Image
      src={src}
      alt={value.alt || fallbackAlt}
      width={preserveAspectRatio ? (dimensions?.width ?? width) : width}
      height={preserveAspectRatio ? (dimensions?.height ?? height) : height}
      sizes={sizes}
      className={className}
      priority={priority}
      placeholder={value.asset.metadata?.lqip ? "blur" : "empty"}
      blurDataURL={value.asset.metadata?.lqip ?? undefined}
      style={{ aspectRatio }}
    />
  );
}
