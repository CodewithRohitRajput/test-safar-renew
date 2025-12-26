import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Safar Wanderlust | Best Rated Group Travel Company",
  description:
    "Safar Wanderlust curates unforgettable group trips and personalized travel experiences across India and abroad. Explore top destinations like Himachal, Manali, and beyond with the best travel community from Indore.",
  keywords: [
    "group travel company",
    "Safar Wanderlust Indore",
    "best travel company India",
    "international group trips",
    "customized trips",
    "Himachal group trip",
    "Manali package from Indore",
  ],
  icons: {
    icon: "/favicon.png",
  },
  url: "https://safarwanderlust.com",
  metadataBase: new URL("https://safarwanderlust.com"),
  alternates: {
    canonical: "https://safarwanderlust.com",
  },
  openGraph: {
    title: "Safar Wanderlust | Group Travel Adventures India & Abroad",
    description:
      "Join Safar Wanderlust for domestic & international group travel. Trusted by hundreds of travelers from Indore and beyond. Discover Himachal, Manali, Bali, Vietnam & more.",
    url: "https://safarwanderlust.com",
    siteName: "Safar Wanderlust",
    images: [
      {
        url: "https://safarwanderlust.com/assets/svgs/logo/HeroSectionImage.webp",
        width: 1200,
        height: 630,
        alt: "Safar Wanderlust Group Travel Adventures",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Safar Wanderlust | Group Travel Adventures India & Abroad",
    description:
      "Best rated group travel company from Indore. Safar Wanderlust offers Himachal, Manali & international trips with curated itineraries and fun experiences.",
    images: [
      "https://safarwanderlust.com/assets/svgs/logo/HeroSectionImage.webp",
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* GTM Head Script */}
      <Script id="gtm-head" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NPQ5BL8');
        `}
      </Script>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* GTM NoScript Fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NPQ5BL8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {/* JSON-LD Structured Data for SEO */}
        <Script
          id="safar-schema"
          type="application/ld+json"
          strategy="afterInteractive"
        >{`
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "Safar Wanderlust",
  "url": "https://safarwanderlust.com",
  "logo": "https://safarwanderlust.com/assets/svgs/logo/HeroSectionImage.webp",
  "sameAs": [
    "https://www.instagram.com/safar_wanderlust",
    "https://www.facebook.com/safarwanderlust",
    "https://www.youtube.com/@safarwanderlust"
  ],
  "description": "Safar Wanderlust is India’s best rated group travel company offering domestic and international trips. From Himachal & Manali to Bali & Vietnam, we create unforgettable experiences for travelers from Indore and across India.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Indore",
    "addressRegion": "Madhya Pradesh",
    "addressCountry": "IN"
  },
  "makesOffer": [
    {
      "@type": "Offer",
      "name": "Himachal Group Trip from Indore",
      "url": "https://safarwanderlust.com/itinerary/himachal-group-trip"
    },
    {
      "@type": "Offer",
      "name": "Manali Weekend Group Trip",
      "url": "https://safarwanderlust.com/itinerary/manali-group-trip"
    },
    {
      "@type": "Offer",
      "name": "International Trips",
      "url": "https://safarwanderlust.com/international-trips"
    }
  ]
}
        `}</Script>

        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
