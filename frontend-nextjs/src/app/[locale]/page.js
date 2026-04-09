"use client"

import * as React from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "@/i18n/routing"
import { Hero } from "@/components/landing/Hero"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { Features } from "@/components/landing/Features"
import { FeaturedArtisans } from "@/components/landing/FeaturedArtisans"

export default function LandingPage() {
  const { user, loading, redirectAfterLogin } = useAuth()

  React.useEffect(() => {
    if (!loading && user) {
      redirectAfterLogin(user)
    }
  }, [user, loading, redirectAfterLogin])

  if (loading || user) {
    // Show a loading state or nothing while redirecting
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-[#0a0f1e]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C4793A] border-t-transparent"></div>
      </div>
    )
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
