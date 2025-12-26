import React from "react";
import ItineraryPage from "./HelperComponent";

// Enable dynamic SSR for metadata fetching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Dynamic SEO using generateMetadata
export async function generateMetadata({ params }) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!id) {
    return {
      title: "Project Preview",
      description: "Explore this project",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  try {
    const res = await fetch(`${baseUrl}/user/itineraries/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error(`Bad response: ${res.status}`);
    const projectApiResponse = await res.json();
    const projectData = projectApiResponse?.data;

    // Use SEO data if available, otherwise fallback to default
    const title = projectData?.seo_title || projectData?.title || "Project Preview";
    const description = projectData?.seo_description || projectData?.shortDescription || "Explore this project";
    const keywords = projectData?.seo_keywords || "";
    const author = projectData?.seo_author || "safarwanderlust";
    const isIndexed = projectData?.seo_indexed !== false; // Default to true if not set
    
    const pageUrl = `https://safarwanderlust.com/itinerary/${id}`;
    const ogImageUrl = `${pageUrl}/opengraph-image`;

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
      title: "Itinerary Details",
      description: "Explore this travel itinerary",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}


// Main component rendering JSON-LD + content
const PageComponent = async ({ params }) => {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!id) return null;

  let jsonLdTitle = "Project Preview";
  let jsonLdDescription = "Explore this project";
  let jsonLdPageUrl = `https://safarwanderlust.com/itinerary/${id}`;

  try {
    const res = await fetch(`${baseUrl}/user/itineraries/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (res.ok) {
      const apiResponse = await res.json();
      const data = apiResponse?.data;
      if (data) {
        jsonLdTitle = data.title ?? jsonLdTitle;
        jsonLdDescription = data.shortDescription ?? jsonLdDescription;
      }
    }
  } catch (error) {
    // Gracefully fallback if fetch fails
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: jsonLdTitle,
    url: jsonLdPageUrl,
    description: jsonLdDescription,
    publisher: {
      "@type": "Organization",
      name: "Safar Wanderlust",
      url: "https://www.safarwanderlust.com",
      logo: {
        "@type": "ImageObject",
        url: "https://ik.imagekit.io/76zqyzwii/Imp%20files/Safar%20Wanderlust%20(1).png?updatedAt=1750515942891",
      },
    },
  };

  return (
    <div>
      <ItineraryPage ldData={structuredData} />
    </div>
  );
};

export default PageComponent;
