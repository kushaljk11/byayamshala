import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Roboto } from "next/font/google";
import { Footer, Header } from "@/components/layout";
import { Providers } from "@/components/motion/Providers";
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

const shareImage = {
  url: "/images/hero-bg.png",
  width: 1629,
  height: 965,
  alt: "Member training with battle ropes at Byayamshala gym, Itahari",
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
  robots: { index: true, follow: true },
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
  hasMap: siteConfig.address.mapUrl,
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
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          // Static site data — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(gymJsonLd) }}
        />
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
