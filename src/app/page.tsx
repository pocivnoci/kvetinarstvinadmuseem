import { Nav } from "@/components/Nav";
import { HeroCarousel } from "@/components/HeroCarousel";
import { InfoBar } from "@/components/InfoBar";
import { BrandStrip } from "@/components/BrandStrip";
import { WallpaperFeature } from "@/components/WallpaperFeature";
import { Seasons } from "@/components/Seasons";
import { Signature } from "@/components/Signature";
import { Gallery } from "@/components/Gallery";
import { Prostor } from "@/components/Prostor";
import { About } from "@/components/About";
// Sekce recenzí připravená — zapnout, až budou reálné recenze (viz REVIEWS v constants.ts)
// import { Reviews } from "@/components/Reviews";
import { Visit } from "@/components/Visit";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { StructuredData } from "@/components/StructuredData";

export default function HomePage() {
  return (
    <main>
      <StructuredData />
      <Nav />
      <HeroCarousel />
      <InfoBar />
      <BrandStrip />
      <WallpaperFeature />
      <Seasons />
      <Signature />
      <Gallery />
      <Prostor />
      <About />
      {/* <Reviews />  — zapnout, až dorazí reálné recenze z Googlu */}
      <Visit />
      <Footer />
      <WhatsAppFab />
    </main>
  );
}
