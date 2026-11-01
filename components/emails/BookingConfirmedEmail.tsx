import { Button, Column, Heading, Hr, Img, Link, Row, Section, Text } from '@react-email/components';
import { XinteckEmailLayout } from './XinteckEmailLayout';

export interface BookingConfirmedEmailProps {
  name: string;
  date: string;       // "2027-01-15"
  startTime: string;  // "10:10"
  endTime: string;    // "10:25"
  meetLink: string;   // "https://meet.google.com/xyz-abc-def"
  googleCalendarUrl?: string;
  adminNote?: string | null;
}

export const BookingConfirmedEmail = ({
  name = "John",
  date = "2027-01-15",
  startTime = "10:10",
  endTime = "10:25",
  meetLink = "https://meet.google.com/xyz-abc-def",
  googleCalendarUrl = "#",
  adminNote = null,
}: BookingConfirmedEmailProps) => {
  return (
    <XinteckEmailLayout previewText={`Confirmed: Your Xinteck Discovery Call is on ${date} at ${startTime} EAT`} showSignature={true}>
      <Heading className="text-[22px] font-black tracking-tight text-brand m-0 mb-[16px]">
        Your Discovery Call is Confirmed! ✅
      </Heading>

      <Text className="text-white text-[15px] leading-[26px] m-0 mb-[24px]">
        Hello {name},<br /><br />
        We're excited to speak with you! Your free 15-minute discovery call has been confirmed. Below are your meeting details and direct Google Meet video link.
      </Text>

      {/* Prominent Google Meet Box */}
      <Section className="bg-[#141414] border-2 border-brand rounded-[10px] p-[20px] sm:p-[28px] mb-[24px] text-left">
        <Text className="text-dimText text-[12px] uppercase font-bold tracking-widest m-0 mb-[6px]" style={{ color: '#D4AF37' }}>
          Google Meet Video Room
        </Text>
        <Text className="text-white text-[18px] sm:text-[20px] font-black m-0 mb-[20px]">
          📅 {date} · ⏰ {startTime} – {endTime} EAT
        </Text>

        {/* Buttons Stacked Vertically & Left-Aligned */}
        <div style={{ marginBottom: '12px' }}>
          <Button
            href={meetLink}
            className="bg-brand text-[#0A0A0A] font-black uppercase tracking-widest text-[13px] sm:text-[14px] rounded-[6px] px-[28px] py-[15px] text-center inline-block shadow-lg"
            style={{ display: 'inline-block', textAlign: 'center', backgroundColor: '#D4AF37', color: '#0A0A0A' }}
          >
            Join Google Meet Call →
          </Button>
        </div>

        {googleCalendarUrl && googleCalendarUrl !== "#" && (
          <div style={{ marginBottom: '4px' }}>
            <Button
              href={googleCalendarUrl}
              className="bg-[#222222] text-white border border-[#444] font-bold text-[12px] sm:text-[13px] rounded-[6px] px-[22px] py-[12px] text-center inline-block"
              style={{ display: 'inline-block', textAlign: 'center', backgroundColor: '#222222', color: '#FFFFFF' }}
            >
              🗓️ Add to Google Calendar
            </Button>
          </div>
        )}

        <Text className="text-dimText text-[12px] m-0 mt-[16px]" style={{ wordBreak: 'break-all', color: '#C0C0C0' }}>
          Meeting Link: <a href={meetLink} className="text-brand underline" style={{ color: '#D4AF37' }}>{meetLink}</a>
        </Text>
      </Section>

      {/* Personal Admin Note if provided */}
      {adminNote && (
        <Section className="bg-[#0A0A0A] border border-[#222222] rounded-[8px] p-[20px] mb-[24px]">
          <Text className="text-dimText text-[12px] uppercase tracking-wider mb-[6px] m-0 font-bold" style={{ color: '#D4AF37' }}>
            Note from our team:
          </Text>
          <Text className="text-white text-[14px] leading-[22px] m-0 italic" style={{ color: '#FFFFFF' }}>
            "{adminNote}"
          </Text>
        </Section>
      )}

      {/* Preparation Tips */}
      <Section className="bg-[#0A0A0A] border border-[#222222] rounded-[8px] p-[24px] mb-[24px]">
        <Text className="text-[12px] font-black text-brand uppercase tracking-widest m-0 mb-[12px]">
          How to get the most from this 15-minute call
        </Text>
        <Row className="mb-[8px]">
          <Column style={{ width: '20px' }}><Text className="text-brand text-[14px] m-0">✓</Text></Column>
          <Column><Text className="text-dimText text-[13px] m-0" style={{ color: '#E0E0E0' }}>Have a brief outline of the project, goal, or technical obstacle you'd like to discuss.</Text></Column>
        </Row>
        <Row className="mb-[8px]">
          <Column style={{ width: '20px' }}><Text className="text-brand text-[14px] m-0">✓</Text></Column>
          <Column><Text className="text-dimText text-[13px] m-0" style={{ color: '#E0E0E0' }}>Ensure you have a working microphone and camera for Google Meet.</Text></Column>
        </Row>
        <Row>
          <Column style={{ width: '20px' }}><Text className="text-brand text-[14px] m-0">✓</Text></Column>
          <Column><Text className="text-dimText text-[13px] m-0" style={{ color: '#E0E0E0' }}>Join 1-2 minutes early so we can dive straight into actionable solutions.</Text></Column>
        </Row>
      </Section>

      <Hr className="border border-[#222222] my-[24px]" />
    </XinteckEmailLayout>
  );
};

export default BookingConfirmedEmail;
