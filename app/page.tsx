// LOCATION: app/page.tsx
import IntroGate from "@/components/IntroGate";
import MotionEffects from "@/components/MotionEffects";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Packages from "@/components/Packages";
import Films from "@/components/Films";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/content-server";

// Always load the newest content, so changes saved in /admin appear immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const c = await getContent();
  const { whatsapp, phone } = c.settings;
  // The three small floating pictures beside the photographer in the hero.
  const floats = ["Pre-Weddings", "Weddings", "Half Saree"]
    .map((cat) => c.photos.find((p) => p.cat === cat))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <IntroGate>
      <MotionEffects />
      <Nav whatsapp={whatsapp} />
      <main>
        <Hero hero={c.hero} photographerPhoto={c.settings.photographerPhoto} floats={floats} whatsapp={whatsapp} />
        <About about={c.about} photographerPhoto={c.settings.photographerPhoto} photos={c.photos} />
        <Services services={c.services} photos={c.photos} whatsapp={whatsapp} />
        <Portfolio photos={c.photos} categories={c.categories} />
        <Films films={c.films} />
        <Packages data={c.packages} whatsapp={whatsapp} />
        <Testimonials testimonials={c.testimonials} />
        <Contact phone={phone} whatsapp={whatsapp} serviceNames={c.services.map((s) => s.name)} packages={c.packages.items} />
      </main>
      <Footer phone={phone} whatsapp={whatsapp} social={c.settings.social} serviceNames={c.services.map((s) => s.name)} />
    </IntroGate>
  );
}