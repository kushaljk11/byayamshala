import type { Metadata } from "next";
import { LegacyRedirect } from "@/components/LegacyRedirect";

// Old URL from the previous website — forwards to the "About us" section of the home page.
export const metadata: Metadata = {
  title: "About Us",
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LegacyRedirect to="/#about" label="About us" />;
}
