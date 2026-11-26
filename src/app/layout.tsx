import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Roboto } from "next/font/google";
import { Footer, Header } from "@/components/layout";
import { Providers } from "@/components/motion/Providers";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { introBootScript } from "@/components/intro/introBoot";
import { siteConfig, socialLinks } from "@/constants/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Used only by the App Store / Play Store badges.
const roboto = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

/** Link preview image (WhatsApp, Facebook, X, Google): a frame of the hero film + logo. */
const shareImage = {
  url: "/images/og-cover.jpg",
  width: 1200,
  height: 630,
  alt: "The Byayamshala — gym, personal training and online coaching in Itahari, Nepal",
};

/** Browser UI colour on mobile (address bar), matching the dark hero and header. */
export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.seoTitle, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.seoTitle,
    description: siteConfig.description,
    locale: "en_US",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seoTitle,
    description: siteConfig.description,
    images: [shareImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: true, email: true, address: true },
  category: "fitness",
};

/** Local business details so search engines can show the gym's address, phone and hours. */
const gymJsonLd = {
  "@context": "https://schema.org",
  "@type": "ExerciseGym",
  name: siteConfig.legalName,
  alternateName: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  image: new URL(shareImage.url, siteConfig.url).toString(),
  logo: new URL("/images/logo.png", siteConfig.url).toString(),
  email: siteConfig.email,
  telephone: siteConfig.phone.display,
  foundingDate: String(siteConfig.foundingYear),
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.locality,
    addressRegion: siteConfig.address.region,
    addressCountry: siteConfig.address.country,
  },
  // Coordinates carried over from the previous site's structured data.
  geo: { "@type": "GeoCoordinates", latitude: 26.66198539744463, longitude: 87.27014571350836 },
  hasMap: siteConfig.address.mapUrl,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: `+${siteConfig.whatsapp.number}`,
    contactType: "customer service",
    availableLanguage: ["English", "Nepali"],
  },
  currenciesAccepted: "NPR",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: siteConfig.hours.opens,
    closes: siteConfig.hours.closes,
  },
  areaServed: ["Itahari", "Sunsari", "Nepal"],
  sameAs: socialLinks.map((s) => s.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${roboto.variable} h-full antialiased`}
      // The intro boot script sets data-intro before React hydrates.
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        {/* Must run before the page paints: decides whether the opening intro plays. */}
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
        {/* No JavaScript: never show the intro overlay. */}
        <noscript>
          <style>{`.intro-overlay{display:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          // Static site data — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(gymJsonLd) }}
        />
        <Providers>
          <ScrollProgress />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
