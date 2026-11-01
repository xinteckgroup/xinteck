import { Button, Heading, Hr, Img, Link, Section, Text } from '@react-email/components';
import { XinteckEmailLayout } from './XinteckEmailLayout';

export interface BookingCancellationEmailProps {
  name: string;
  date: string;       // "2027-01-15"
  startTime: string;  // "10:10"
  reason?: string | null;
}

export const BookingCancellationEmail = ({
  name = "John",
  date = "2027-01-15",
  startTime = "10:10",
  reason = "Schedule conflict due to emergency client deployment.",
}: BookingCancellationEmailProps) => {
  return (
    <XinteckEmailLayout previewText={`Update regarding your discovery call on ${date}`} showSignature={true}>
      <Heading className="text-[20px] font-black tracking-tight text-brand m-0 mb-[16px]">
        Discovery Call Update
      </Heading>

      <Text className="text-white text-[15px] leading-[26px] m-0 mb-[24px]">
        Hello {name},<br /><br />
        We regret to inform you that your scheduled discovery call on <strong>{date} at {startTime} EAT</strong> has been cancelled.
      </Text>

      {/* Reason Box */}
      {reason && (
        <Section className="bg-[#0A0A0A] border border-[#222222] rounded-[8px] p-[20px] mb-[28px]">
          <Text className="text-dimText text-[12px] uppercase font-bold tracking-wider mb-[6px] m-0" style={{ color: '#D4AF37' }}>
            Reason for update:
          </Text>
          <Text className="text-white text-[14px] leading-[22px] m-0 italic" style={{ color: '#FFFFFF' }}>
            "{reason}"
          </Text>
        </Section>
      )}

      {/* Rebook CTA — Left-Aligned */}
      <Section className="bg-[#111111] border border-brand/30 rounded-[8px] p-[20px] sm:p-[24px] mb-[24px] text-left">
        <Text className="text-white font-bold text-[15px] m-0 mb-[8px]">
          We would still love to speak with you!
        </Text>
        <Text className="text-dimText text-[13px] leading-[22px] m-0 mb-[16px]" style={{ color: '#E0E0E0' }}>
          Please select any upcoming open slot on our calendar that fits your schedule.
        </Text>
        <div>
          <Button
            href="https://xinteck.co.ke/book"
            className="bg-brand text-[#0A0A0A] font-black uppercase tracking-widest text-[13px] rounded-[6px] px-[24px] py-[14px] text-center inline-block"
            style={{ display: 'inline-block', textAlign: 'center', backgroundColor: '#D4AF37', color: '#0A0A0A' }}
          >
            Select a New Time Slot →
          </Button>
        </div>
      </Section>

      <Hr className="border border-[#222222] my-[24px]" />
    </XinteckEmailLayout>
  );
};

export default BookingCancellationEmail;
