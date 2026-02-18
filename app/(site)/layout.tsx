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
  const services = await getServiceNavItems();

  return (
    <ServicesProvider services={services}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16 w-full px-[5px]">
          {children}
        </main>
        <Footer />
        <FloatingDock />
      </div>
    </ServicesProvider>
  );
}
