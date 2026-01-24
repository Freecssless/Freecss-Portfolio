import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Clients from "@/components/Clients";
import EditingStyles from "@/components/EditingStyles";
import Testimonial from "@/components/Testimonial";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Plasma } from "@/components/Plasma";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <div className="fixed inset-0 -z-10 w-full h-full">
        <Plasma 
          color="#36a9a1" 
          scale={2} 
          speed={0.5} 
          opacity={0.4} 
        />
      </div>
      <Header />
      <Hero />
      <Clients />
      <EditingStyles />
      <Testimonial />
      <Contact />
      <Footer />
    </main>
  );
}
