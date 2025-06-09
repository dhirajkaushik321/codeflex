import Image from "next/image";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import CallToActionSection from "../components/CallToActionSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-50 via-white to-blue-100 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col gap-0">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
}
