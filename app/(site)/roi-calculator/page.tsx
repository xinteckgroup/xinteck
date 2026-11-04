import { RoiCalculatorClient } from "@/components/roi/RoiCalculatorClient";
import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { TYPOGRAPHY } from "@/lib/typography";
import { VIDEO_STATS } from "@/lib/videoStats";
import { Calculator } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Software ROI Calculator | Xinteck Technologies",
    description:
        "See what custom software and automation could save or earn your business with our easy interactive calculator.",
    openGraph: {
        title: "Software ROI Calculator | Xinteck Technologies",
        description:
            "Explore your potential return on investment in real time with our straightforward software calculator.",
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
            <div className="flex flex-col gap-8 md:gap-12 py-12 md:py-20 px-4 sm:px-6">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto w-full pt-8 md:pt-14">
                    <div className="flex flex-col gap-4 max-w-3xl">
                        <div className="bg-white/90 dark:bg-black/80 backdrop-blur-xl p-6 md:p-8 rounded-[14px] inline-block w-fit shadow-lg border border-border">
                            <h1 className="text-xs md:text-sm font-bold text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                <Calculator size={16} className="text-primary" />
                                <span>Interactive ROI Calculator</span>
                            </h1>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground uppercase">
                                SEE YOUR POTENTIAL <br />
                                <span className="text-primary">SAVINGS & RETURNS.</span>
                            </h2>
                        </div>
                        <p
                            className={`${TYPOGRAPHY.pageSubtitle} bg-white/90 dark:bg-black/80 backdrop-blur-xl p-5 md:p-6 rounded-[14px] shadow-lg text-foreground font-medium border border-border leading-relaxed text-sm md:text-base`}
                        >
                            Curious what custom software could actually save or earn your business? Move the simple sliders below to see your estimated return in real time — no complicated formulas, just clear, practical numbers.
                        </p>
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

