import { Heading, Hr, Section, Text } from '@react-email/components';
import * as React from 'react';
import { XinteckEmailLayout } from './XinteckEmailLayout';

export interface AdminBookingCancelledEmailProps {
  clientName: string;
  date: string;
  startTime: string;
  cancelledBy: string;
  reason?: string | null;
  isExecutive?: boolean;
}

export const AdminBookingCancelledEmail = ({
  clientName = "Alex Kimani",
  date = "2027-02-15",
  startTime = "10:00",
  cancelledBy = "Super Admin",
  reason = "Schedule conflict due to emergency client deployment.",
  isExecutive = false,
}: AdminBookingCancelledEmailProps) => {
  return (
    <XinteckEmailLayout
      previewText={`[Cancelled] Strategy Session: ${clientName} (${date} at ${startTime} EAT)`}
    >
      {/* Category Badge */}
      <Section className="text-left mb-[16px]">
        <div
          style={{
            display: 'inline-block',
            padding: '5px 12px',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            color: '#EF4444',
            fontSize: '11px',
            fontWeight: 800,
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            border: '1px solid rgba(239, 68, 68, 0.35)',
          }}
        >
          {isExecutive ? 'Executive Cancellation Alert' : 'Strategy Session Cancelled'}
        </div>
      </Section>

      <Heading className="text-[22px] font-black tracking-tight text-white m-0 mb-[16px]">
        Strategy Session Cancelled
      </Heading>

      <Text className="text-[#E0E0E0] text-[15px] leading-[26px] m-0 mb-[24px]">
        The strategy session with <strong style={{ color: '#FFFFFF' }}>{clientName}</strong> scheduled for{' '}
        <strong style={{ color: '#FFFFFF' }}>{date} at {startTime} EAT</strong> was cancelled by{' '}
        <strong style={{ color: '#D4AF37' }}>{cancelledBy}</strong>.
      </Text>

      {/* Details Box */}
      <Section className="bg-[#0A0A0A] border border-[#222222] rounded-[10px] p-[20px] mb-[24px]">
        <Text className="text-dimText text-[11px] uppercase font-bold tracking-wider mb-[8px] m-0" style={{ color: '#D4AF37' }}>
          Cancellation Reason:
        </Text>
        <Text className="text-white text-[14px] leading-[22px] m-0 italic" style={{ color: '#FFFFFF' }}>
          "{reason || 'No specific reason provided.'}"
        </Text>
      </Section>

      <Hr className="border border-[#222222] my-[20px]" />

      <Text className="text-[#A5A5A5] text-[12px] leading-[20px] m-0" style={{ color: '#A5A5A5' }}>
        The attached cancellation .ics file automatically removes this event from your synchronized Google Calendar.
      </Text>
    </XinteckEmailLayout>
  );
};

export default AdminBookingCancelledEmail;
