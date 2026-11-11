import { Button, Column, Heading, Hr, Img, Link, Row, Section, Text } from '@react-email/components';
import { XinteckEmailLayout } from './XinteckEmailLayout';

export interface AdminBookingAlertEmailProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  service?: string | null;
  message?: string | null;
  date: string;       // "2027-01-15"
  startTime: string;  // "09:00"
  endTime: string;    // "09:15"
}

export const AdminBookingAlertEmail = ({
  id = "sample-booking-id",
  name = "John Kamau",
  email = "john@example.com",
  phone = "+254 712 345 678",
  company = "Acme Global",
  service = "Web Development",
  message = "We need an enterprise web application with direct M-Pesa integration.",
  date = "2027-01-15",
  startTime = "10:10",
  endTime = "10:25",
}: AdminBookingAlertEmailProps) => {
  return (
    <XinteckEmailLayout previewText={`New Strategy Session: ${name} (${date} at ${startTime} EAT)`}>
      <Heading className="text-[20px] font-black tracking-tight text-brand m-0 mb-[24px]">
        New Strategy Session Booking Alert
      </Heading>

      {/* Appointment Window Highlight */}
      <Section className="bg-[#141414] border-2 border-brand/40 rounded-[8px] p-[20px] mb-[24px] text-left">
        <Text className="text-dimText text-[12px] uppercase font-bold tracking-widest m-0 mb-[6px]" style={{ color: '#D4AF37' }}>
          Scheduled Strategy Session (15 Minutes)
        </Text>
        <Text className="text-white text-[18px] font-black m-0">
          📅 {date} · ⏰ {startTime} – {endTime} EAT
        </Text>
      </Section>
      
      {/* Client Details */}
      <Section className="bg-[#0A0A0A] border border-[#222222] rounded-[8px] p-[24px] mb-[24px]">
        <Text className="text-[12px] font-black text-white uppercase tracking-widest m-0 mb-[16px]">
          Client Details
        </Text>
        
        <Row className="mb-[8px]">
          <Column style={{ width: '110px' }}><Text className="text-dimText text-[14px] m-0" style={{ color: '#C0C0C0' }}>Client Name:</Text></Column>
          <Column><Text className="text-white font-medium text-[14px] m-0">{name}</Text></Column>
        </Row>
        <Row className="mb-[8px]">
          <Column style={{ width: '110px' }}><Text className="text-dimText text-[14px] m-0" style={{ color: '#C0C0C0' }}>Email:</Text></Column>
          <Column><a href={`mailto:${email}`} className="text-brand text-[14px] m-0" style={{ color: '#D4AF37', textDecoration: 'none' }}>{email}</a></Column>
        </Row>
        <Row className="mb-[8px]">
          <Column style={{ width: '110px' }}><Text className="text-dimText text-[14px] m-0" style={{ color: '#C0C0C0' }}>Phone / WA:</Text></Column>
          <Column><a href={`tel:${phone}`} className="text-white font-medium text-[14px] m-0" style={{ color: '#FFFFFF', textDecoration: 'none' }}>{phone || 'N/A'}</a></Column>
        </Row>
        <Row>
          <Column style={{ width: '110px' }}><Text className="text-dimText text-[14px] m-0" style={{ color: '#C0C0C0' }}>Company:</Text></Column>
          <Column><Text className="text-white font-medium text-[14px] m-0">{company || 'Not provided'}</Text></Column>
        </Row>
      </Section>

      {/* Service Scope & Discussion Notes */}
      <Section className="bg-[#0A0A0A] border border-[#222222] rounded-[8px] p-[24px] mb-[32px]">
        <Text className="text-[12px] font-black text-white uppercase tracking-widest m-0 mb-[16px]">
          Consultation Focus
        </Text>
        
        <Row className="mb-[8px]">
          <Column style={{ width: '110px' }}><Text className="text-dimText text-[14px] m-0" style={{ color: '#C0C0C0' }}>Service:</Text></Column>
          <Column><Text className="text-brand font-black text-[14px] m-0" style={{ color: '#D4AF37' }}>{service || 'General Discovery'}</Text></Column>
        </Row>

        <Hr className="border border-[#222222] my-[16px]" />

        <Text className="text-dimText text-[12px] uppercase tracking-wider mb-[8px] m-0" style={{ color: '#D4AF37' }}>Client Notes / Objective</Text>
        <Text className="text-text text-[14px] leading-[24px] bg-[#111] p-[16px] rounded-[6px] border border-[#333] m-0 italic" style={{ color: '#FFFFFF' }}>
          "{message || "No additional message provided."}"
        </Text>
      </Section>

      {/* Action Buttons — Stacked Vertically & Left-Aligned */}
      <Section className="text-left mb-[24px]">
        <div style={{ marginBottom: '12px' }}>
          <Button
            href={`https://xinteck.co.ke/admin/bookings?id=${id}&action=confirm`}
            className="bg-brand text-[#0A0A0A] font-black uppercase tracking-widest text-[13px] rounded-[6px] px-[24px] py-[14px] text-center inline-block"
            style={{ display: 'inline-block', textAlign: 'center', backgroundColor: '#D4AF37', color: '#0A0A0A' }}
          >
            Confirm & Assign Meet →
          </Button>
        </div>
        <div>
          <Button
            href={`mailto:${email}`}
            className="bg-[#222222] text-white border border-[#333333] font-black uppercase tracking-widest text-[13px] rounded-[6px] px-[24px] py-[14px] text-center inline-block"
            style={{ display: 'inline-block', textAlign: 'center', backgroundColor: '#222222', color: '#FFFFFF' }}
          >
            Reply to Client ✉
          </Button>
        </div>
      </Section>
    </XinteckEmailLayout>
  );
};

export default AdminBookingAlertEmail;
