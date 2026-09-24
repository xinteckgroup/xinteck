import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

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
    <Html>
      <Head />
      <Preview>Client Reply: {clientName} ({clientEmail})</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: '#D4AF37', // Xinteck Gold
                bg: '#0A0A0A',
                surface: '#111111',
                border: '#222222',
                text: '#E5E5E5',
                dimText: '#888888',
              },
              fontFamily: {
                sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
              },
            },
          },
        }}
      >
        <Body className="bg-white m-0 py-[40px] px-[20px] font-sans">
          <Container className="bg-bg mx-auto py-[36px] px-[28px] max-w-[600px] border border-border shadow-2xl rounded-[16px]">
            {/* Header */}
            <Section className="text-left mb-[24px]">
              <Img
                src="https://xinteck.co.ke/logos/logo-dark-full.png"
                width="160"
                height="50"
                alt="Xinteck"
                className="block"
                style={{ objectFit: 'contain' }}
              />
            </Section>

            {/* Title Badge */}
            <Section className="mb-[20px]">
              <Text className="text-brand text-[12px] font-bold uppercase tracking-widest m-0 mb-[6px]">
                Inbound Client Message Received
              </Text>
              <Text className="text-text text-[20px] font-extrabold m-0 leading-[28px]">
                {subject}
              </Text>
            </Section>

            {/* Client Metadata Card */}
            <Section className="bg-[#141414] border border-[#2a2a2a] rounded-[10px] p-[20px] mb-[24px]">
              <table cellPadding="0" cellSpacing="0" border={0} style={{ width: '100%', fontSize: '13px' }}>
                <tbody>
                  <tr>
                    <td style={{ color: '#888', paddingBottom: '6px', width: '90px' }}>From:</td>
                    <td style={{ color: '#fff', fontWeight: 600, paddingBottom: '6px' }}>{clientName} &lt;{clientEmail}&gt;</td>
                  </tr>
                  <tr>
                    <td style={{ color: '#888', paddingBottom: '6px' }}>Received:</td>
                    <td style={{ color: '#E5E5E5', paddingBottom: '6px' }}>{receivedAt}</td>
                  </tr>
                  <tr>
                    <td style={{ color: '#888' }}>Lead ID:</td>
                    <td style={{ color: '#D4AF37', fontFamily: 'monospace' }}>{leadId || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Message Body */}
            <Section className="bg-surface border border-border rounded-[10px] p-[24px] mb-[28px]">
              <Text className="text-dimText text-[11px] font-bold uppercase tracking-wider m-0 mb-[12px]">
                Client Message:
              </Text>
              <Text className="text-text text-[15px] leading-[26px] m-0 italic">
                {formattedContent}
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="text-center mb-[28px]">
              <Button
                href={`https://xinteck.co.ke/admin/leads?search=${encodeURIComponent(clientEmail)}`}
                className="bg-brand text-black font-extrabold px-[28px] py-[12px] rounded-[8px] text-[13px] no-underline inline-block uppercase tracking-wider"
                style={{ backgroundColor: '#D4AF37', color: '#000', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 800 }}
              >
                Open Lead in Admin CRM
              </Button>
            </Section>

            <Hr className="border border-[#222222] my-[20px]" />

            <Section className="text-center">
              <Text className="text-dimText text-[11px] leading-[18px] m-0">
                This notification was relayed by Xinteck CRM to your linked address winterjacksonwj@gmail.com.<br />
                You can reply directly in the CRM or from your email client.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InboundReplyAlertEmail;
