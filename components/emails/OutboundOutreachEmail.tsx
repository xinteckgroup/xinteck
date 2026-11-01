import { Hr, Link, Section, Text } from '@react-email/components';
import * as React from 'react';
import { XinteckEmailLayout } from './XinteckEmailLayout';

export interface OutboundOutreachEmailProps {
  recipientName: string;
  subject: string;
  content: string;
  sentBy: string;
  referenceId?: string;
}

export const OutboundOutreachEmail = ({
  recipientName = "Valued Partner",
  subject = "Digital Engineering Collaboration",
  content = "We would love to discuss how our software engineering team can partner with you.",
  sentBy = "Xinteck Engineering",
  referenceId = "",
}: OutboundOutreachEmailProps) => {
  const formattedContent = content.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <XinteckEmailLayout
      previewText={`${subject} — Xinteck Digital Engineering`}
      showSignature={true}
      footerText={
        <>
          Sent by {sentBy} via Xinteck Engineering Platform.<br />
          Replies to this email are monitored by our technical leadership team.<br />
          {referenceId && <span className="font-mono text-[11px]" style={{ color: '#D4AF37' }}>Ref: {referenceId}</span>}
          <br /><br />
        </>
      }
    >
      <Section className="bg-[#0A0A0A] border border-[#222222] rounded-[10px] p-[24px] mb-[28px]">
        <Text className="text-[16px] leading-[26px] text-white font-bold m-0 mb-[16px]">
          Hello {recipientName},
        </Text>
        
        <Text className="text-[15px] leading-[26px] text-[#F5F5F5] m-0 mb-[20px]">
          {formattedContent}
        </Text>

        <Hr className="border border-[#222222] my-[20px]" />

        <Text className="text-[13px] leading-[22px] text-[#C0C0C0] m-0" style={{ color: '#C0C0C0' }}>
          You can reply directly to this email to continue the conversation with our engineering team, or reach us at{' '}
          <a href="mailto:info@xinteck.co.ke" className="text-brand font-semibold" style={{ color: '#D4AF37', textDecoration: 'none' }}>
            info@xinteck.co.ke
          </a>.
        </Text>
      </Section>
    </XinteckEmailLayout>
  );
};

export default OutboundOutreachEmail;
