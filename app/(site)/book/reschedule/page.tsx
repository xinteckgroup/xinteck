import { getBookingForReschedule } from "@/actions/bookings";
import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { VIDEO_STATS } from "@/lib/videoStats";
import { Metadata } from "next";
import Link from "next/link";
import RescheduleClient from "./RescheduleClient";

export const metadata: Metadata = {
    title: "Reschedule Strategy Session | Xinteck Technologies",
    description: "Adjust your 15-minute technical strategy session schedule with Xinteck.",
};

export const dynamic = "force-dynamic";

export default async function ReschedulePage({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>;
}) {
    const { id } = await searchParams;

    if (!id) {
        return (
            <VideoScrollLayout videoSrc={VIDEO_STATS.contact.src} videoStats={VIDEO_STATS.contact}>
                <div className="max-w-xl mx-auto py-32 px-6 text-center">
                    <div className="p-10 rounded-2xl bg-white/40 dark:bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl">
                        <h2 className="text-2xl font-black text-foreground mb-3">Invalid Reschedule Link</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            No booking identifier was provided in this link. Please check your confirmation email.
                        </p>
                        <Link
                            href="/book"
                            className="inline-block px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-xs uppercase"
                        >
                            Book a New Call
                        </Link>
                    </div>
                </div>
            </VideoScrollLayout>
        );
    }

    const booking = await getBookingForReschedule(id);

    if (!booking) {
        return (
            <VideoScrollLayout videoSrc={VIDEO_STATS.contact.src} videoStats={VIDEO_STATS.contact}>
                <div className="max-w-xl mx-auto py-32 px-6 text-center">
                    <div className="p-10 rounded-2xl bg-white/40 dark:bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl">
                        <h2 className="text-2xl font-black text-foreground mb-3">Booking Not Found</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            We could not locate this appointment. It may have already been cancelled or moved.
                        </p>
                        <Link
                            href="/book"
                            className="inline-block px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-xs uppercase"
                        >
                            Schedule a Consultation
                        </Link>
                    </div>
                </div>
            </VideoScrollLayout>
        );
    }

    return (
        <VideoScrollLayout videoSrc={VIDEO_STATS.contact.src} videoStats={VIDEO_STATS.contact}>
            <div className="max-w-5xl mx-auto py-20 md:py-28 px-4 sm:px-6">
                <RescheduleClient booking={booking} />
            </div>
        </VideoScrollLayout>
    );
}
