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
      <Section className="text-left mb-[40px]">
        <Link href="https://xinteck.co.ke">
          <Img
            src="https://xinteck.co.ke/logos/logo-dark-full.png"
            width="200"
            height="200"
            alt="Xinteck Logo"
            className="mx-auto block"
            style={{ objectFit: 'contain' }}
          />
        </Link>
      </Section>

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
          <Text className="text-dimText text-[12px] uppercase font-bold tracking-wider mb-[6px] m-0">
            Reason for update:
          </Text>
          <Text className="text-white text-[14px] leading-[22px] m-0 italic">
            "{reason}"
          </Text>
        </Section>
      )}

      {/* Rebook CTA */}
      <Section className="bg-[#111111] border border-brand/30 rounded-[8px] p-[24px] mb-[28px] text-center">
        <Text className="text-white font-bold text-[15px] m-0 mb-[12px]">
          We would still love to speak with you!
        </Text>
        <Text className="text-dimText text-[13px] leading-[22px] m-0 mb-[20px]">
          Please select any upcoming open slot on our calendar that fits your schedule.
        </Text>
        <Button
          href="https://xinteck.co.ke/book"
          className="bg-brand text-[#0A0A0A] font-black uppercase tracking-widest text-[13px] rounded-[6px] px-[28px] py-[14px] text-center inline-block"
        >
          Select a New Time Slot →
        </Button>
      </Section>

      <Hr className="border border-[#222222] my-[24px]" />
    </XinteckEmailLayout>
  );
};

export default BookingCancellationEmail;
