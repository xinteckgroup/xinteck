import { Button, Heading, Hr, Link, Section, Text } from '@react-email/components';
import * as React from 'react';
import { XinteckEmailLayout } from './XinteckEmailLayout';

export interface InboundReplyAlertEmailProps {
  clientName: string;
  clientEmail: string;
  subject: string;
  replyContent: string;
  leadId: string;
  receivedAt?: string;
}

export const InboundReplyAlertEmail = ({
  clientName = "Client",
  clientEmail = "client@example.com",
  subject = "Re: Project Inquiry",
  replyContent = "I would like to move forward with the discussion.",
  leadId = "",
  receivedAt = new Date().toLocaleString(),
}: InboundReplyAlertEmailProps) => {
  const formattedContent = replyContent.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <XinteckEmailLayout
      previewText={`Client Reply: ${clientName} (${clientEmail})`}
      footerText={
        <>
          This notification was relayed by Xinteck CRM.<br />
          You can reply directly in the CRM or from your email client.<br /><br />
        </>
      }
    >
      {/* Category Badge */}
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
          Inbound Client Message Received
        </div>
      </Section>

      <Heading className="text-[22px] font-black tracking-tight text-white m-0 mb-[20px]">
        {subject}
      </Heading>

      {/* Client Metadata Card */}
      <Section className="bg-[#141414] border border-[#2A2A2A] rounded-[10px] p-[20px] mb-[24px]">
        <table cellPadding="0" cellSpacing="0" border={0} style={{ width: '100%', fontSize: '13px' }}>
          <tbody>
            <tr>
              <td style={{ color: '#C0C0C0', paddingBottom: '8px', width: '90px', fontWeight: 600 }}>From:</td>
              <td style={{ color: '#FFFFFF', fontWeight: 600, paddingBottom: '8px' }}>
                {clientName}{' '}
                <a href={`mailto:${clientEmail}`} style={{ color: '#D4AF37', textDecoration: 'none' }}>
                  &lt;{clientEmail}&gt;
                </a>
              </td>
            </tr>
            <tr>
              <td style={{ color: '#C0C0C0', paddingBottom: '8px', fontWeight: 600 }}>Received:</td>
              <td style={{ color: '#F0F0F0', paddingBottom: '8px' }}>{receivedAt}</td>
            </tr>
            {leadId && (
              <tr>
                <td style={{ color: '#C0C0C0', fontWeight: 600 }}>Lead ID:</td>
                <td style={{ color: '#D4AF37', fontFamily: 'monospace' }}>{leadId}</td>
              </tr>
            )}
          </tbody>
        </table>
      </Section>

      {/* Message Body */}
      <Section className="bg-[#0A0A0A] border border-[#222222] rounded-[10px] p-[24px] mb-[28px]">
        <Text className="text-dimText text-[11px] font-bold uppercase tracking-wider m-0 mb-[12px]" style={{ color: '#D4AF37' }}>
          Client Message:
        </Text>
        <Text className="text-text text-[15px] leading-[26px] m-0 italic" style={{ color: '#F5F5F5' }}>
          {formattedContent}
        </Text>
      </Section>

      {/* CTA Button — Left-Aligned */}
      <Section className="text-left mb-[24px]">
        <div>
          <Button
            href={`https://xinteck.co.ke/admin/leads?search=${encodeURIComponent(clientEmail)}`}
            className="bg-brand text-[#0A0A0A] font-black uppercase tracking-widest text-[13px] rounded-[6px] px-[24px] py-[14px] text-center inline-block"
            style={{ display: 'inline-block', textAlign: 'center', backgroundColor: '#D4AF37', color: '#0A0A0A' }}
          >
            Open Lead in Admin CRM →
          </Button>
        </div>
      </Section>

      <Hr className="border border-[#222222] my-[20px]" />
    </XinteckEmailLayout>
  );
};

export default InboundReplyAlertEmail;
