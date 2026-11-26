import type { Metadata } from "next";
import { LegacyRedirect } from "@/components/LegacyRedirect";

// Old URL from the previous website — forwards to the "Programs & classes" section of the home page.
export const metadata: Metadata = {
  title: "Group Fitness Classes",
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LegacyRedirect to="/#programs" label="Programs & classes" />;
}
