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
            <div className="flex flex-col gap-12 md:gap-24 py-12 md:py-20 px-6">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto w-full pt-12 md:pt-20">
                    <div className="flex flex-col gap-6 md:gap-8 max-w-3xl">
                        <div className="bg-white/30 dark:bg-black/80 backdrop-blur-xl p-6 md:p-8 rounded-[10px] inline-block w-fit shadow-lg">
                            <h1 className="text-sm md:text-base font-bold text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Calculator size={18} className="text-primary" />
                                <span>Interactive ROI Calculator</span>
                            </h1>
                            <h2 className="text-2xl md:text-5xl font-extrabold tracking-tighter text-foreground uppercase">
                                SEE YOUR POTENTIAL <br />
                                <span className="text-primary">SAVINGS & RETURNS.</span>
                            </h2>
                        </div>
                        <p
                            className={`${TYPOGRAPHY.pageSubtitle} bg-white/30 dark:bg-black/80 backdrop-blur-xl p-6 rounded-[10px] shadow-lg text-foreground font-medium leading-relaxed text-sm md:text-base`}
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

