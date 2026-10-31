import {
    Body,
    Container,
    Font,
    Head,
    Html,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
import * as React from 'react';
import { XinteckEmailSignature } from './XinteckEmailSignature';

interface XinteckEmailLayoutProps {
  children: React.ReactNode;
  previewText?: string;
  showSignature?: boolean;
}

export const XinteckEmailLayout = ({
  children,
  previewText = "Message from Xinteck Administration",
  showSignature = false,
}: XinteckEmailLayoutProps) => {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: '#D4AF37', // Xinteck Gold
              bg: '#0A0A0A',
              surface: '#111111',
              border: '#2E2E2E',
              text: '#F5F5F5',
              dimText: '#C0C0C0',
            },
            fontFamily: {
              sans: ["'Outfit'", '-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
            },
          },
        },
      }}
    >
      <Html lang="en">
        <Head>
          <Font
            fontFamily="Outfit"
            fallbackFontFamily="sans-serif"
            webFont={{
              url: "https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NJtEtq.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
          <Font
            fontFamily="Outfit"
            fallbackFontFamily="sans-serif"
            webFont={{
              url: "https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGtk.woff2",
              format: "woff2",
            }}
            fontWeight={700}
            fontStyle="normal"
          />
        </Head>
        <Preview>{previewText}</Preview>
        <Body className="bg-[#050505] m-0 py-[20px] sm:py-[40px] px-[8px] sm:px-[16px] font-sans" style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
          <Container className="bg-bg mx-auto py-[24px] sm:py-[36px] px-[16px] sm:px-[28px] w-full max-w-[600px] border border-border shadow-2xl rounded-[16px]">
            {/* Main Content Area */}
            <Section className="bg-surface border border-border rounded-[12px] p-[20px] sm:p-[28px] mb-[28px] sm:mb-[36px]">
              {children}
            </Section>

            {/* Professional Signature — opt-in for client-facing emails */}
            {showSignature && <XinteckEmailSignature />}
            
            {/* Footer */}
            <Section className="text-left px-[12px] pt-[8px]">
              <Text className="text-dimText text-[12px] leading-[20px] m-0" style={{ color: '#B5B5B5' }}>
                This is an automated administrative notification from Xinteck Technologies.<br />
                Do not reply directly to this automated address.<br /><br />
                <a href="https://xinteck.co.ke" className="text-brand font-bold uppercase tracking-widest no-underline" style={{ textDecoration: 'none', color: '#D4AF37' }}>
                  Xinteck.co.ke
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

