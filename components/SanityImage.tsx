import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { PUBLICATION_CARDS_QUERY_RESULT } from "@/sanity.types";

type SanityImageValue = NonNullable<PUBLICATION_CARDS_QUERY_RESULT[number]["image"]>;

type Props = {
  value?: SanityImageValue | null;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  priority?: boolean;
  fallbackAlt: string;
};

export function SanityImage({ value, width, height, sizes, className, priority, fallbackAlt }: Props) {
  if (!value?.asset) return null;
  const src = urlFor(value).width(width).height(height).fit("crop").auto("format").url();
  return <Image src={src} alt={value.alt || fallbackAlt} width={width} height={height} sizes={sizes} className={className} priority={priority} placeholder={value.asset.metadata?.lqip ? "blur" : "empty"} blurDataURL={value.asset.metadata?.lqip ?? undefined} />;
}
