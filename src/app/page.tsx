import Navbar from '@/components/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import LensShowcase from '@/components/landing/LensShowcase'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/Footer'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <LensShowcase />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
