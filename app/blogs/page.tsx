import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Animations from "@/components/Animations";
import PageHero from "@/components/PageHero";
import VisitBand from "@/components/VisitBand";
import BlogsIndex from "@/components/BlogsIndex";
import { listBlogPostsForDisplay } from "@/lib/blogStore";

// Blog posts are admin-editable in MongoDB — always read fresh, never
// statically prerender this page.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blogs · Amaya Senior Living by Vera Vita",
  description:
    "Stories and guides on independent senior living, healthcare, residences, community and life at Amaya, Medchal, Hyderabad.",
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: "Blogs · Amaya Senior Living",
    description:
      "Stories and guides on independent senior living, healthcare, residences, community and life at Amaya, Medchal, Hyderabad.",
    type: "website",
    url: "/blogs",
    images: [
      {
        url: "/og-images/OG_Tag.png",
        width: 1200,
        height: 628,
        alt: "Amaya by Vera Vita | Active Senior Living in Hyderabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogs · Amaya Senior Living",
    description:
      "Stories and guides on independent senior living, healthcare, residences, community and life at Amaya, Medchal, Hyderabad.",
    images: ["/og-images/OG_Tag.png"],
  },
};

export default async function BlogsPage() {
  const posts = await listBlogPostsForDisplay();

  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow="The Journal"
          titleLines={["Notes on", "living well."]}
          sub="Writing on homes, care, community and the shape of a day at Amaya."
        />

        {posts.length > 0 ? (
          <BlogsIndex posts={posts} />
        ) : (
          <section className="section">
            <div className="container">
              <p className="gallery-empty">More stories are coming soon.</p>
            </div>
          </section>
        )}
        <VisitBand />
        <Footer />
      </main>
      <Animations />
    </>
  );
}
