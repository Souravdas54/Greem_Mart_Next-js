import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/page";
import Footer from "@/components/footer/page";
import ToasterProvider from "./ToasterProvider";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteConfig = {
  name: "Green Mart",
  url: "https://greenmart.com",
  description: "Green Mart — Your one-stop online nursery and plant marketplace. Shop fresh plants, seeds, pots, and gardening supplies delivered to your door.",
  logo: "/logo/android-chrome-512x512.png",
  logoSmall: "/logo/android-chrome-192x192.png",
};

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Online Nursery & Plant Shop`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "green mart", "online nursery", "plant shop", "buy plants online",
    "gardening supplies", "seeds", "pots", "indoor plants", "outdoor plants",
    "plant delivery", "nursery admin", "green mart india"
  ],
  authors: [{ name: "Green Mart", url: siteConfig.url }],
  creator: "Green Mart",
  publisher: "Green Mart",
  // ── Canonical URL ──────────────────────────────────────────────────────────
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  // ── Favicons & Icons ───────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/logo/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/logo/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/logo/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome", url: "/logo/android-chrome-192x192.png", sizes: "192x192" },
      { rel: "android-chrome", url: "/logo/android-chrome-512x512.png", sizes: "512x512" },
    ],
  },

  // ── Open Graph (Facebook, WhatsApp, LinkedIn) ──────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Online Nursery & Plant Shop`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.logo,
        width: 512,
        height: 512,
        alt: "Green Mart Logo",
      },
    ],
  },

  // ── Twitter Card ───────────────────────────────────────────────────────────
  twitter: {
    card: "summary",
    title: `${siteConfig.name} — Online Nursery & Plant Shop`,
    description: siteConfig.description,
    images: [siteConfig.logo],
    // creator: "@greenmart",   // ✅ add your Twitter handle if you have one
  },

  // ── Robots ─────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── App manifest (PWA) ─────────────────────────────────────────────────────
  manifest: "/site.webmanifest",
};

// ── Schema.org JSON-LD ────────────────────────────────────────────────────────
const schemaOrg = {
  "@context": "https://schema.org",
  "@graph": [
    // 1. Organisation
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      logo: {
        "@type": "ImageObject",
        "@id": `${siteConfig.url}/#logo`,
        url: `${siteConfig.url}${siteConfig.logo}`,
        width: 512,
        height: 512,
        caption: siteConfig.name,
      },
      image: { "@id": `${siteConfig.url}/#logo` },
      sameAs: [
        // ✅ Add your social media URLs here
        // "https://www.facebook.com/greenmart",
        // "https://www.instagram.com/greenmart",
        // "https://twitter.com/greenmart",
      ],
    },

    // 2. Website + Sitelinks Searchbox
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: { "@id": `${siteConfig.url}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteConfig.url}/shop?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "en-IN",
    },

    // 3. Local Business (Nursery + E-commerce)
    {
      "@type": ["LocalBusiness", "Store", "Florist"],
      "@id": `${siteConfig.url}/#localbusiness`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      image: `${siteConfig.url}${siteConfig.logo}`,
      priceRange: "₹₹",
      currenciesAccepted: "INR",
      paymentAccepted: "Cash, Credit Card, UPI",
      // ✅ Fill in your real address
      address: {
        "@type": "PostalAddress",
        streetAddress: "",          // e.g. "123 Green Street"
        addressLocality: "Kolkata",
        addressRegion: "West Bengal",
        postalCode: "",          // e.g. "700001"
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 22.5726,           // Kolkata lat
        longitude: 88.3639,           // Kolkata lng
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "09:00",
          closes: "18:00",
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Plants & Gardening Supplies",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Indoor Plants" } },
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Outdoor Plants" } },
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Seeds" } },
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Pots & Planters" } },
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Gardening Tools" } },
        ],
      },
      parentOrganization: { "@id": `${siteConfig.url}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
        <AuthProvider>
          <Navbar />
          <ToasterProvider />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
