import { RoiCalculatorClient } from "@/components/roi/RoiCalculatorClient";
import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { TYPOGRAPHY } from "@/lib/typography";
import { VIDEO_STATS } from "@/lib/videoStats";
import { Calculator, Sparkles } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Software ROI Calculator | Xinteck Technologies",
    description:
        "Calculate the direct financial return of custom software, workflow automation, and digital modernization in Kenya. Uncover your potential savings and revenue lift.",
    openGraph: {
        title: "Software ROI Calculator | Xinteck Technologies Kenya",
        description:
            "Interactive software investment calculator. See how much time and money custom software saves your Kenyan business.",
        url: "https://xinteck.co.ke/roi-calculator",
        siteName: "Xinteck Technologies",
    },
};

export default function RoiCalculatorPage() {
    return (
        <VideoScrollLayout
            videoSrc={VIDEO_STATS.services.src}
            videoStats={VIDEO_STATS.services}
        >
            <div className="flex flex-col gap-10 md:gap-14 py-12 md:py-20 px-4 sm:px-6">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto w-full text-center lg:text-left grid lg:grid-cols-2 gap-6 lg:gap-12 items-end pt-8 md:pt-14">
                    <div className="flex flex-col gap-5">
                        <div className="bg-white/90 dark:bg-black/80 backdrop-blur-xl p-6 md:p-8 rounded-[14px] inline-block w-fit mx-auto lg:mx-0 shadow-lg border border-border">
                            <h1 className="text-xs md:text-sm font-bold text-primary uppercase tracking-[0.2em] mb-2 flex items-center justify-center lg:justify-start gap-2">
                                <Calculator size={16} className="text-primary" />
                                <span>Software Value & Return Engine</span>
                            </h1>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground uppercase">
                                CALCULATE YOUR <br />
                                <span className="text-primary">FINANCIAL UPSIDE.</span>
                            </h2>
                        </div>
                        <p
                            className={`${TYPOGRAPHY.pageSubtitle} max-w-xl mx-auto lg:mx-0 bg-white/90 dark:bg-black/80 backdrop-blur-xl p-5 md:p-6 rounded-[14px] shadow-lg text-foreground font-medium border border-border leading-relaxed text-sm md:text-base`}
                        >
                            High-performing software is an investment that pays for itself. Use our live interactive calculator to model automated labor savings or digital conversion lift tailored to your business scale.
                        </p>
                    </div>

                    <div className="hidden lg:flex flex-col gap-3 text-right items-end">
                        <div
                            className={`${TYPOGRAPHY.badge} flex items-center gap-2.5 text-primary bg-white/90 dark:bg-black/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border border-border`}
                        >
                            <Sparkles size={16} />
                            <span>100% Free Financial Modeling</span>
                        </div>
                        <div className="text-xs font-semibold text-foreground bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-border">
                            🇰🇪 Tailored for Kenyan Business Scale
                        </div>
                    </div>
                </section>

                {/* Main Interactive Calculator Component */}
                <section className="max-w-7xl mx-auto w-full">
                    <RoiCalculatorClient />
                </section>
            </div>
        </VideoScrollLayout>
    );
}

