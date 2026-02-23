import {
    Body,
    Container,
    Head,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface XinteckEmailLayoutProps {
  children: React.ReactNode;
  previewText?: string;
}

export const XinteckEmailLayout = ({
  children,
  previewText = "Message from Xinteck Administration",
}: XinteckEmailLayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
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
            {/* Header / Logo */}
            <Section className="text-center mb-[40px]">
              <Img
                src="https://xinteck.co.ke/logos/logo-dark-full.webp"
                height="48"
                alt="Xinteck Logo"
                className="mx-auto block"
                style={{ objectFit: 'contain' }}
              />
            </Section>
            
            {/* Main Content Area */}
            <Section className="bg-surface border border-border rounded-[12px] p-[32px] mb-[40px]">
              {children}
            </Section>
            
            {/* Footer */}
            <Section className="text-center px-[20px]">
              <Text className="text-dimText text-[12px] leading-[20px] m-0">
                This is an automated administrative notification from Xinteck.<br />
                Do not reply directly to this email.<br /><br />
                <a href="https://xinteck.co.ke" className="text-brand font-bold uppercase tracking-widest no-underline" style={{ textDecoration: 'none' }}>
                  Xinteck.co.ke
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
