import { Button, Heading, Hr, Img, Link, Section, Text } from '@react-email/components';
import { XinteckEmailLayout } from './XinteckEmailLayout';

export interface BookingReminderEmailProps {
  name: string;
  date: string;       // "2026-11-02"
  startTime: string;  // "10:10"
  endTime: string;    // "10:25"
  meetLink: string;   // "https://meet.google.com/xyz-abc-def"
  reminderType?: "24h" | "1h" | "starting_soon";
  rescheduleUrl?: string;
}

export const BookingReminderEmail = ({
  name = "John",
  date = "2026-11-02",
  startTime = "10:10",
  endTime = "10:25",
  meetLink = "https://meet.google.com/xyz-abc-def",
  reminderType = "24h",
  rescheduleUrl,
}: BookingReminderEmailProps) => {
  const isUpcomingSoon = reminderType === "1h" || reminderType === "starting_soon";

  return (
    <XinteckEmailLayout
      previewText={
        isUpcomingSoon
          ? `Starting soon: Your Xinteck Discovery Call at ${startTime} EAT`
          : `Reminder: Your Xinteck Discovery Call tomorrow at ${startTime} EAT`
      }
      showSignature={true}
    >
      <Heading className="text-[22px] font-black tracking-tight text-brand m-0 mb-[16px]">
        {isUpcomingSoon ? "⏰ Your Discovery Call is Starting Soon!" : "🗓️ Reminder: Your Discovery Call Tomorrow"}
      </Heading>

      <Text className="text-white text-[15px] leading-[26px] m-0 mb-[24px]">
        Hello {name},<br /><br />
        This is a friendly reminder for your upcoming 15-minute technical discovery call with Xinteck Technologies.
        Our software engineering team is prepared to review your project goals and architecture roadmap.
      </Text>

      {/* Prominent Google Meet Box */}
      <Section className="bg-[#141414] border-2 border-brand rounded-[10px] p-[20px] sm:p-[28px] mb-[24px] text-left">
        <Text className="text-dimText text-[12px] uppercase font-bold tracking-widest m-0 mb-[6px]" style={{ color: '#D4AF37' }}>
          Google Meet Video Room
        </Text>
        <Text className="text-white text-[18px] sm:text-[20px] font-black m-0 mb-[18px]">
          📅 {date} · ⏰ {startTime} – {endTime} (Nairobi EAT, UTC+3)
        </Text>

        <div style={{ marginBottom: '14px' }}>
          <Button
            href={meetLink}
            className="bg-brand text-[#0A0A0A] font-black uppercase tracking-widest text-[13px] sm:text-[14px] rounded-[6px] px-[28px] py-[15px] text-center inline-block shadow-lg"
            style={{ display: 'inline-block', textAlign: 'center', backgroundColor: '#D4AF37', color: '#0A0A0A' }}
          >
            Join Google Meet Call ↗
          </Button>
        </div>

        <Text className="text-dimText text-[12px] m-0" style={{ wordBreak: 'break-all', color: '#C0C0C0' }}>
          Direct link: <Link href={meetLink} className="text-brand underline" style={{ color: '#D4AF37' }}>{meetLink}</Link>
        </Text>
      </Section>

      {/* Tips Section */}
      <Section className="bg-[#111111] border border-white/10 rounded-[8px] p-[20px] mb-[24px] text-left">
        <Text className="text-brand text-[13px] font-bold uppercase tracking-wider m-0 mb-[10px]">
          Quick Session Recommendations
        </Text>
        <Text className="text-white/80 text-[13px] leading-[22px] m-0" style={{ color: '#EAEAEA' }}>
          • Have a brief overview of your system goals, timeline, and current pain points.<br />
          • If you have existing code, wireframes, or API docs, feel free to share screen.<br />
          • Test your microphone and camera 2 minutes before the call starts.
        </Text>
      </Section>

      {rescheduleUrl && (
        <Section className="text-left mb-[20px]">
          <Hr className="border-t border-white/10 my-[20px]" />
          <Text className="text-dimText text-[12px] leading-[20px] m-0 mb-[10px]" style={{ color: '#D0D0D0' }}>
            Need to reschedule? You can easily adjust your time slot online up to 2 hours before the call:
          </Text>
          <div>
            <Button
              href={rescheduleUrl}
              className="bg-[#222222] text-white border border-[#444] font-bold text-[12px] sm:text-[13px] rounded-[6px] px-[20px] py-[10px] text-center inline-block"
              style={{ display: 'inline-block', textAlign: 'center', backgroundColor: '#222222', color: '#FFFFFF' }}
            >
              🗓️ Reschedule Appointment
            </Button>
          </div>
        </Section>
      )}
    </XinteckEmailLayout>
  );
};

export default BookingReminderEmail;
