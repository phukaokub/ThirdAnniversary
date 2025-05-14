import type { Metadata } from "next"
import LandingPage from "@/components/landing-page"

export const metadata: Metadata = {
  title: "3 Year Anniversary Gift",
  description: "A special gift for our 3 year anniversary",
}

export default function Home() {
  return <LandingPage />
}
