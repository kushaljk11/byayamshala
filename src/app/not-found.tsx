import type { Metadata } from "next";
import { NotFoundView } from "@/components/sections/NotFoundView";

// Next adds <meta name="robots" content="noindex"> to this page automatically.
export const metadata: Metadata = {
  title: "Page Not Found",
  description: "This page doesn't exist. Head back to Byayamshala — gym, personal training and online coaching in Itahari, Nepal.",
};

export default function NotFound() {
  return <NotFoundView />;
}
