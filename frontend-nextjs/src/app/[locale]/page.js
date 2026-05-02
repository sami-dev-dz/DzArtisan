"use client"

import * as React from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "@/i18n/routing"
import { Hero } from "@/components/landing/Hero"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { Features } from "@/components/landing/Features"
import { FeaturedArtisans } from "@/components/landing/FeaturedArtisans"
import { LandingPageSkeleton } from "@/components/ui/SkeletonLayouts"

export default function LandingPage() {
  const { user, loading, redirectAfterLogin } = useAuth()

  // REMOVED: Automatic redirect if user is logged in
  // Allowing users to see the landing page even when authenticated
  
  if (loading) {
    return <LandingPageSkeleton />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <HowItWorks />
      <Features />
      <FeaturedArtisans />
    </div>
  )
}
