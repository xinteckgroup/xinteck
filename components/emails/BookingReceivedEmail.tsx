import { Column, Heading, Hr, Img, Link, Row, Section, Text } from '@react-email/components';
import { XinteckEmailLayout } from './XinteckEmailLayout';

export interface BookingReceivedEmailProps {
  name: string;
  date: string;       // "2027-01-15"
  startTime: string;  // "09:00"
  endTime: string;    // "09:15"
  service?: string | null;
}

export const BookingReceivedEmail = ({
  name = "John",
  date = "2027-01-15",
  startTime = "10:10",
  endTime = "10:25",
  service = "Web Development",
}: BookingReceivedEmailProps) => {
  return (
    <XinteckEmailLayout previewText={`We've received your discovery call request for ${date} at ${startTime} EAT`} showSignature={true}>
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

      <Heading className="text-[22px] font-black tracking-tight text-brand m-0 mb-[16px]">
        Discovery Call Request Received 🎯
      </Heading>

      <Text className="text-white text-[15px] leading-[26px] m-0 mb-[24px]">
        Hello {name},<br /><br />
        Thank you for scheduling a <strong>Free 15-Minute Discovery Call</strong> with Xinteck. We have successfully logged your appointment request in our system.
      </Text>

      {/* Appointment Window Details */}
      <Section className="bg-[#0A0A0A] border border-[#222222] rounded-[8px] p-[24px] mb-[24px]">
        <Text className="text-[12px] font-black text-brand uppercase tracking-widest m-0 mb-[16px]">
          Requested Session Details
        </Text>
        
        <Row className="mb-[8px]">
          <Column style={{ width: '120px' }}><Text className="text-dimText text-[14px] m-0" style={{ color: '#C0C0C0' }}>Date:</Text></Column>
          <Column><Text className="text-white font-medium text-[14px] m-0">{date}</Text></Column>
        </Row>
        <Row className="mb-[8px]">
          <Column style={{ width: '120px' }}><Text className="text-dimText text-[14px] m-0" style={{ color: '#C0C0C0' }}>Time Window:</Text></Column>
          <Column><Text className="text-white font-medium text-[14px] m-0">{startTime} – {endTime} (East Africa Time, UTC+3)</Text></Column>
        </Row>
        <Row className="mb-[8px]">
          <Column style={{ width: '120px' }}><Text className="text-dimText text-[14px] m-0" style={{ color: '#C0C0C0' }}>Duration:</Text></Column>
          <Column><Text className="text-white font-medium text-[14px] m-0">15 Minutes</Text></Column>
        </Row>
        {service && (
          <Row>
            <Column style={{ width: '120px' }}><Text className="text-dimText text-[14px] m-0" style={{ color: '#C0C0C0' }}>Focus Area:</Text></Column>
            <Column><Text className="text-brand font-medium text-[14px] m-0" style={{ color: '#D4AF37' }}>{service}</Text></Column>
          </Row>
        )}
      </Section>

      {/* Next Step Information Box */}
      <Section className="bg-[#111111] border border-brand/30 rounded-[8px] p-[20px] mb-[24px]">
        <Text className="text-white font-bold text-[14px] m-0 mb-[8px]">
          What happens next?
        </Text>
        <Text className="text-dimText text-[13px] leading-[22px] m-0" style={{ color: '#D0D0D0' }}>
          Our engineering team is preparing for your session. You will receive an official confirmation email containing your direct <strong>Google Meet video link</strong> shortly.
        </Text>
      </Section>

      <Hr className="border border-[#222222] my-[24px]" />
    </XinteckEmailLayout>
  );
};

export default BookingReceivedEmail;
