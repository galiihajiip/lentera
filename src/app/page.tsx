import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import LensShowcase from '@/components/landing/LensShowcase'
import CTASection from '@/components/landing/CTASection'

export default function LandingPage() {
  return (
    <main className="flex-1">
      <HeroSection />
      <FeaturesSection />
      <LensShowcase />
      <CTASection />
    </main>
  )
}
