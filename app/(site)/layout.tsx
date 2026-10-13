import { getActiveAnnouncements } from "@/actions/announcements";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { FloatingDock } from "@/components/layout/FloatingDock";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ServicesProvider } from "@/components/providers/ServicesContext";
import { getServiceNavItems } from "@/lib/public-data";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [services, announcements] = await Promise.all([
    getServiceNavItems(),
    getActiveAnnouncements(),
  ]);

  // Map DB records to the banner's expected shape
  const bannerItems = announcements.map((a) => ({
    text: a.text,
    icon: a.icon,
    highlight: a.highlight,
    link: a.link,
  }));

  return (
    <ServicesProvider services={services}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <AnnouncementBanner items={bannerItems} />
        <main className="flex-grow pt-20 w-full px-[5px]">
          {children}
        </main>
        <Footer />
        <FloatingDock />
      </div>
    </ServicesProvider>
  );
}
