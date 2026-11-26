import type { Metadata } from "next";
import { LegacyRedirect } from "@/components/LegacyRedirect";

// Old URL from the previous website — forwards to the "Membership plans" section of the home page.
export const metadata: Metadata = {
  title: "Membership Plans",
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LegacyRedirect to="/#pricing" label="Membership plans" />;
}
