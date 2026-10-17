import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Clients from "@/components/Clients";
import EditingStyles from "@/components/EditingStyles";
import Testimonial from "@/components/Testimonial";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AsciiBackground from "@/components/AsciiBackground";
import ScrollRuler from "@/components/ScrollRuler";
import QuoteCalculator from "@/components/QuoteCalculator";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <AsciiBackground />
      <Header />
      <Hero />
      <ScrollRuler start={0} />
      <Clients />
      <EditingStyles />
      <QuoteCalculator />
      <ScrollRuler start={96} />
      <Testimonial />
      <Contact />
      <Footer />
    </main>
  );
}
