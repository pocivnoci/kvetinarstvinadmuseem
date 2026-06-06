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
// Sekce recenzí připravená — zapnout, až budou reálné recenze (REVIEWS v cs/en slovníku)
// import { Reviews } from "@/components/Reviews";
import { Visit } from "@/components/Visit";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { StructuredData } from "@/components/StructuredData";
import { getDictionary, defaultLocale, isLocale } from "@/lib/i18n";

export default function HomePage({ params }: { params: { locale: string } }) {
  const t = getDictionary(params.locale);
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;

  return (
    <main>
      <StructuredData t={t} locale={locale} />
      <Nav t={t} locale={locale} />
      <HeroCarousel t={t} />
      <InfoBar t={t} />
      <BrandStrip t={t} />
      <WallpaperFeature t={t} />
      <Seasons t={t} />
      <Signature t={t} />
      <Gallery t={t} />
      <Prostor t={t} />
      <About t={t} />
      {/* <Reviews t={t} />  — zapnout, až dorazí reálné recenze z Googlu */}
      <Visit t={t} />
      <Footer t={t} />
      <WhatsAppFab t={t} />
    </main>
  );
}
