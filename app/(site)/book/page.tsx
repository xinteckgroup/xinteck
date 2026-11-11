import { getContactConfig } from "@/actions/public-config";
import { BookingClient } from "@/components/booking/BookingClient";
import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { prisma } from "@/lib/prisma";
import { TYPOGRAPHY } from "@/lib/typography";
import { VIDEO_STATS } from "@/lib/videoStats";
import { Clock, Video } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Executive Strategy Session | Xinteck Technologies",
    description: "Schedule a high-impact technical architecture session with senior engineers at Xinteck Technologies. Discuss web platforms, mobile apps, eTIMS integration, and custom business software.",
    openGraph: {
        title: "Executive Strategy Session | Xinteck Technologies",
        description: "Direct architectural advice from senior engineers. Focused scope alignment and technical roadmap.",
        url: "https://xinteck.co.ke/book",
        siteName: "Xinteck Technologies",
    },
};

export default async function BookDiscoveryCallPage() {
    // 1. Fetch available services
    const contactConfig = await getContactConfig();
    const servicesList = contactConfig?.services || [
        "Web Development",
        "Mobile App Development",
        "Custom Software Development",
        "UI/UX Design",
        "Cloud & DevOps",
        "Graphic Design",
    ];

    // 2. Fetch blocked dates / holidays
    const blockedRecords = await prisma.bookingBlockedDate.findMany({
        select: { date: true },
    });
    const initialBlockedDates = blockedRecords.map(
        (b) => b.date.toISOString().split("T")[0]
    );

    return (
        <VideoScrollLayout
            videoSrc={VIDEO_STATS.contact.src}
            videoStats={VIDEO_STATS.contact}
        >
            <div className="flex flex-col gap-12 md:gap-24 py-12 md:py-20 px-6">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto w-full text-center lg:text-left grid lg:grid-cols-2 gap-12 lg:gap-16 items-end pt-12 md:pt-20">
                    <div className="flex flex-col gap-6 md:gap-8">
                        <div className="bg-white/30 dark:bg-black/80 backdrop-blur-xl p-6 md:p-8 rounded-[10px] inline-block w-fit mx-auto lg:mx-0 shadow-lg">
                            <h1 className="text-sm md:text-base font-bold text-primary uppercase tracking-[0.2em] mb-4 flex items-center justify-center lg:justify-start gap-2">
                                <Video size={18} className="text-primary" />
                                <span>Executive Strategy Session</span>
                            </h1>
                            <h2 className="text-2xl md:text-5xl font-extrabold tracking-tighter text-foreground uppercase">
                                ENGINEER YOUR <br />
                                <span className="text-primary">NEXT BIG LEAP.</span>
                            </h2>
                        </div>
                        <p className={`${TYPOGRAPHY.pageSubtitle} max-w-xl mx-auto lg:mx-0 bg-white/30 dark:bg-black/80 backdrop-blur-xl p-6 rounded-[10px] shadow-lg text-foreground font-medium leading-relaxed text-sm md:text-base`}>
                            Reserve a focused technical architecture session with our team. We&apos;ll analyze your operational bottlenecks, architect the right technical solutions (M-Pesa, eTIMS, Cloud, Systems), and outline your exact implementation roadmap.
                        </p>
                    </div>

                    <div className="hidden lg:flex flex-col gap-4 text-right items-end">
                        <div className={`${TYPOGRAPHY.badge} flex items-center gap-3 text-primary bg-white/30 dark:bg-black/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg`}>
                            <Clock size={20} />
                            <span>Architecture & Scope Session</span>
                        </div>
                        <div className="text-xs font-semibold text-foreground bg-white/30 dark:bg-black/80 backdrop-blur-md px-5 py-2 rounded-full shadow-md">
                            ✨ Real-time calendar sync
                        </div>
                    </div>
                </section>

                {/* Main Interactive Booking Component */}
                <section className="max-w-7xl mx-auto w-full">
                    <Suspense fallback={
                        <div className="w-full max-w-7xl mx-auto flex items-center justify-center py-20">
                            <div className="animate-pulse text-foreground/60 text-sm font-medium">Loading booking calendar…</div>
                        </div>
                    }>
                        <BookingClient
                            servicesList={servicesList}
                            initialBlockedDates={initialBlockedDates}
                        />
                    </Suspense>
                </section>
            </div>
        </VideoScrollLayout>
    );
}
