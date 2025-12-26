import ExplorePage from '@/components/User/explorePage/ExplorePage'
import React from 'react'

// Enable dynamic SSR for metadata fetching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Dynamic SEO using generateMetadata
export async function generateMetadata({ params }) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!id) {
    return {
      title: "Explore Categories",
      description: "Explore travel categories",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  try {
    const res = await fetch(`${baseUrl}/user/categories/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error(`Bad response: ${res.status}`);
    const categoryResponse = await res.json();
    const categoryData = categoryResponse?.data;

    // Use SEO data if available, otherwise fallback to default
    const title = categoryData?.seo_title || categoryData?.name || "Explore Category";
    const description = categoryData?.seo_description || categoryData?.short_description || categoryData?.description || "Explore this travel category";
    const keywords = categoryData?.seo_keywords || "";
    const author = categoryData?.seo_author || "safarwanderlust";
    const isIndexed = categoryData?.seo_indexed !== false; // Default to true if not set
    
    const pageUrl = `https://safarwanderlust.com/explore/${id}`;
    const ogImageUrl = categoryData?.image || categoryData?.banner_image || "https://safarwanderlust.com/assets/svgs/logo/HeroSectionImage.webp";

    return {
      title,
      description,
      keywords: keywords ? keywords.split(',').map(k => k.trim()) : undefined,
      authors: [{ name: author }],
      robots: {
        index: isIndexed,
        follow: isIndexed,
        googleBot: {
          index: isIndexed,
          follow: isIndexed,
        },
      },
      openGraph: {
        title,
        description,
        type: "website",
        locale: "en_US",
        url: pageUrl,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImageUrl],
      },
      alternates: {
        canonical: pageUrl,
      },
    };
  } catch (error) {
    return {
      title: "Explore Category",
      description: "Explore travel categories and destinations",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

const page = () => {
  return (
    <div>
        <ExplorePage />
    </div>
  )
}

export default page