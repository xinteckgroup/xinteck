import { Button, Heading, Hr, Link, Section, Text } from '@react-email/components';
import * as React from 'react';
import { XinteckEmailLayout } from './XinteckEmailLayout';

export interface AdminBookingBriefingEmailProps {
  variant?: 'executive' | 'host';
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  assignedHostName?: string | null;
  assignedHostRole?: string | null;
  company?: string | null;
  service?: string | null;
  clientNotes?: string | null;
  meetLink: string;
  bookingId?: string;
}

export const AdminBookingBriefingEmail = ({
  variant = 'executive',
  clientName = "Alex Kimani",
  clientEmail = "alex.kimani@example.com",
  clientPhone = "+254 712 345 678",
  date = "2027-02-15",
  startTime = "10:00",
  endTime = "10:15",
  assignedHostName = "John Jackson O.",
  assignedHostRole = "SUPER_ADMIN",
  company = "Apex Logistics Ltd",
  service = "Enterprise Web Architecture",
  clientNotes = "We need a robust multi-region dispatch portal with real-time driver tracking.",
  meetLink = "https://meet.google.com/xyz-tech-call",
  bookingId = "sample-booking-id",
}: AdminBookingBriefingEmailProps) => {
  const isHost = variant === 'host';

  return (
    <XinteckEmailLayout
      previewText={`${isHost ? 'Host Assignment' : 'Executive Briefing'}: Strategy Session with ${clientName} (${date} at ${startTime} EAT)`}
    >
      {/* Executive/Host Category Badge */}
      <Section className="text-left mb-[16px]">
        <div
          style={{
            display: 'inline-block',
            padding: '5px 12px',
            backgroundColor: 'rgba(212, 175, 55, 0.12)',
            color: '#D4AF37',
            fontSize: '11px',
            fontWeight: 800,
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            border: '1px solid rgba(212, 175, 55, 0.35)',
          }}
        >
          {isHost ? '🗓️ Strategy Session Host Assignment' : 'Executive Calendar Notification'}
        </div>
      </Section>

      <Heading className="text-[22px] font-black tracking-tight text-white m-0 mb-[8px]">
        {isHost ? 'Strategy Session Host Assignment' : 'Strategy Session Confirmed'}
      </Heading>

      <Text className="text-[#E0E0E0] text-[14px] leading-[22px] m-0 mb-[24px]">
        {isHost
          ? 'You are the assigned lead host for this confirmed technical strategy session. Below are the briefing details:'
          : 'A new strategy session has been confirmed. Below are the executive briefing details:'}
      </Text>

      {/* Prominent Appointment Window Box */}
      <Section className="bg-[#141414] border-2 border-brand/40 rounded-[10px] p-[20px] mb-[24px] text-left">
        <Text className="text-dimText text-[11px] uppercase font-bold tracking-widest m-0 mb-[6px]" style={{ color: '#D4AF37' }}>
          Scheduled Strategy Session (15 Minutes)
        </Text>
        <Text className="text-white text-[18px] sm:text-[20px] font-black m-0">
          📅 {date} · ⏰ {startTime} – {endTime} EAT
        </Text>
      </Section>

      {/* Executive Briefing Details Card */}
      <Section className="bg-[#0A0A0A] border border-[#222222] rounded-[10px] p-[22px] mb-[24px]">
        <Text className="text-[12px] font-black text-brand uppercase tracking-widest m-0 mb-[16px]">
          Session Details & Client Profile
        </Text>

        <table cellPadding="0" cellSpacing="0" border={0} style={{ width: '100%', fontSize: '14px', color: '#FFFFFF' }}>
          <tbody>
            <tr>
              <td style={{ color: '#C0C0C0', padding: '6px 0', width: '120px', verticalAlign: 'top', fontWeight: 600 }}>Client:</td>
              <td style={{ color: '#FFFFFF', padding: '6px 0' }}>
                <strong style={{ color: '#FFFFFF' }}>{clientName}</strong>{' '}
                <a href={`mailto:${clientEmail}`} style={{ color: '#D4AF37', textDecoration: 'none' }}>
                  &lt;{clientEmail}&gt;
                </a>
              </td>
            </tr>
            {clientPhone && (
              <tr>
                <td style={{ color: '#C0C0C0', padding: '6px 0', verticalAlign: 'top', fontWeight: 600 }}>Phone / WA:</td>
                <td style={{ color: '#FFFFFF', padding: '6px 0' }}>
                  <a href={`tel:${clientPhone}`} style={{ color: '#E5E5E5', textDecoration: 'none' }}>
                    {clientPhone}
                  </a>
                </td>
              </tr>
            )}
            <tr>
              <td style={{ color: '#C0C0C0', padding: '6px 0', verticalAlign: 'top', fontWeight: 600 }}>Date & Time:</td>
              <td style={{ color: '#FFFFFF', padding: '6px 0', fontWeight: 500 }}>
                {date} · {startTime} – {endTime} EAT
              </td>
            </tr>
            <tr>
              <td style={{ color: '#C0C0C0', padding: '6px 0', verticalAlign: 'top', fontWeight: 600 }}>Assigned Host:</td>
              <td style={{ color: '#D4AF37', padding: '6px 0', fontWeight: 700 }}>
                {assignedHostName || 'Unassigned'}{' '}
                {assignedHostRole && <span style={{ color: '#A0A0A0', fontSize: '12px', fontWeight: 400 }}>({assignedHostRole})</span>}
              </td>
            </tr>
            <tr>
              <td style={{ color: '#C0C0C0', padding: '6px 0', verticalAlign: 'top', fontWeight: 600 }}>Company:</td>
              <td style={{ color: '#FFFFFF', padding: '6px 0' }}>{company || 'N/A'}</td>
            </tr>
            <tr>
              <td style={{ color: '#C0C0C0', padding: '6px 0', verticalAlign: 'top', fontWeight: 600 }}>Service:</td>
              <td style={{ color: '#D4AF37', padding: '6px 0', fontWeight: 700 }}>{service || 'General Inquiry'}</td>
            </tr>
          </tbody>
        </table>

        {clientNotes && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #222222' }}>
            <Text className="text-dimText text-[11px] uppercase tracking-wider mb-[8px] m-0 font-bold" style={{ color: '#D4AF37' }}>
              Client Notes / Scope
            </Text>
            <Text className="text-text text-[14px] leading-[24px] bg-[#141414] p-[14px] rounded-[6px] border border-[#2A2A2A] m-0 italic" style={{ color: '#FFFFFF' }}>
              "{clientNotes}"
            </Text>
          </div>
        )}
      </Section>

      {/* Google Meet Video Room Card */}
      <Section className="bg-[#141414] border border-[#2E2E2E] rounded-[10px] p-[22px] mb-[24px] text-left">
        <Text className="text-dimText text-[11px] uppercase font-bold tracking-widest m-0 mb-[6px]" style={{ color: '#D4AF37' }}>
          Video Conference Room
        </Text>
        <Text className="text-white text-[15px] font-bold m-0 mb-[16px]">
          Google Meet link assigned to this session:
        </Text>

        {/* Buttons Stacked Vertically & Left-Aligned */}
        <div style={{ marginBottom: '12px' }}>
          <Button
            href={meetLink}
            className="bg-brand text-[#0A0A0A] font-black uppercase tracking-widest text-[13px] rounded-[6px] px-[24px] py-[14px] text-center inline-block"
            style={{ display: 'inline-block', textAlign: 'center', backgroundColor: '#D4AF37', color: '#0A0A0A' }}
          >
            Join Google Meet Call →
          </Button>
        </div>

        {bookingId && (
          <div style={{ marginBottom: '12px' }}>
            <Button
              href={`https://xinteck.co.ke/admin/bookings?id=${bookingId}`}
              className="bg-[#222222] text-white border border-[#333333] font-black uppercase tracking-widest text-[13px] rounded-[6px] px-[24px] py-[14px] text-center inline-block"
              style={{ display: 'inline-block', textAlign: 'center', backgroundColor: '#222222', color: '#FFFFFF' }}
            >
              Open in Admin Dashboard ↗
            </Button>
          </div>
        )}

        <Text className="text-dimText text-[12px] m-0 mt-[12px]" style={{ wordBreak: 'break-all', color: '#C0C0C0' }}>
          Direct link: <a href={meetLink} style={{ color: '#D4AF37', textDecoration: 'underline' }}>{meetLink}</a>
        </Text>
      </Section>

      <Hr className="border border-[#222222] my-[20px]" />

      {/* Push Notification / ICS Note */}
      <Text className="text-[#A5A5A5] text-[12px] leading-[20px] m-0" style={{ color: '#A5A5A5' }}>
        The attached calendar invitation (.ics) automatically synchronizes with your Google Calendar for mobile push notifications.
      </Text>
    </XinteckEmailLayout>
  );
};

export default AdminBookingBriefingEmail;
