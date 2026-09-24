import {
  Body,
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
import { XinteckEmailSignature } from './XinteckEmailSignature';

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
  // Convert newlines to breaks for safe rendering
  const formattedContent = content.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <Html>
      <Head />
      <Preview>{subject} — Xinteck Digital Engineering</Preview>
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
          <Container className="bg-bg mx-auto py-[40px] px-[32px] max-w-[600px] border border-border shadow-2xl rounded-[16px]">
            {/* Header with Logo */}
            <Section className="text-left mb-[32px]">
              <Link href="https://xinteck.co.ke">
                <Img
                  src="https://xinteck.co.ke/logos/logo-dark-full.png"
                  width="180"
                  height="60"
                  alt="Xinteck Logo"
                  className="block"
                  style={{ objectFit: 'contain' }}
                />
              </Link>
            </Section>

            {/* Main Content Area */}
            <Section className="bg-surface border border-border rounded-[12px] p-[28px] mb-[28px]">
              <Text className="text-[16px] leading-[26px] text-text font-semibold m-0 mb-[16px]">
                Hello {recipientName},
              </Text>
              
              <Text className="text-[15px] leading-[26px] text-text m-0 mb-[20px]">
                {formattedContent}
              </Text>

              <Hr className="border border-[#222222] my-[20px]" />

              <Text className="text-[13px] leading-[22px] text-dimText m-0">
                You can reply directly to this email to continue the conversation with our engineering team, or reach us at{' '}
                <Link href="mailto:info@xinteck.co.ke" className="text-brand font-semibold no-underline">
                  info@xinteck.co.ke
                </Link>.
              </Text>
            </Section>

            {/* Professional Signature */}
            <XinteckEmailSignature />

            {/* Footer */}
            <Section className="text-center mt-[32px] px-[20px]">
              <Text className="text-dimText text-[11px] leading-[18px] m-0">
                Sent by {sentBy} via Xinteck Engineering Platform.<br />
                Replies to this email are monitored by our technical leadership team.<br />
                {referenceId && <span className="font-mono text-[10px] text-dimText/60">Ref: {referenceId}</span>}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OutboundOutreachEmail;
