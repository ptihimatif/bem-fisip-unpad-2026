import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import type { Post } from "@/sanity/lib/types";
import { urlFor } from "@/sanity/lib/image";
import { SanityPortableText } from "@/components/SanityPortableText";

export default async function Home() {
  const { data } = await sanityFetch({ query: POSTS_QUERY });
  const posts = data as Post[];

  return (
    <main className="max-w-4xl mx-auto p-8 font-sans">
      <h1 className="text-4xl font-bold mb-8">Postan</h1>
      <div className="space-y-12">
        {posts.map((post) => (
          <article
            key={post._id}
            className="border border-gray-200 p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-2xl font-semibold">{post.judul}</h2>
              {post.postCategory && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider">
                  {post.postCategory}
                </span>
              )}
            </div>

            {post.publishedAt && (
              <p className="text-gray-500 text-sm mb-4">
                {new Date(post.publishedAt).toLocaleDateString()}
              </p>
            )}

            {post.image && (
              <img
                src={urlFor(post.image).width(800).height(400).url()}
                alt={post.judul || "Post image"}
                className="w-full h-auto rounded-md mb-6 object-cover bg-gray-100"
              />
            )}

            {post.instagramUrl && (
              <a 
                href={post.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mb-6 text-pink-600 font-semibold hover:underline"
              >
                View on Instagram →
              </a>
            )}

            {/* We no longer need the "prose" class from Tailwind since we are customizing styles directly */}
            <div>
              {post.body ? (
                <SanityPortableText blocks={post.body} />
              ) : (
                <p className="text-gray-400 italic">No content available</p>
              )}
            </div>
          </article>
        ))}
        {posts.length === 0 && <p className="text-gray-500">No posts found.</p>}
      </div>
    </main>
  );
}
