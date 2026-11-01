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
  showLogo?: boolean;
  footerText?: React.ReactNode;
}

export const XinteckEmailLayout = ({
  children,
  previewText = "Message from Xinteck Administration",
  showSignature = false,
  showLogo = true,
  footerText,
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
          <meta name="color-scheme" content="dark" />
          <meta name="supported-color-schemes" content="dark" />
          <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
          <style>{`
            a { color: #D4AF37; text-decoration: none; }
            a[x-apple-data-detectors] {
              color: inherit !important;
              text-decoration: none !important;
              font-size: inherit !important;
              font-family: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
            }
          `}</style>
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
        <Body className="bg-[#050505] m-0 py-[20px] sm:py-[40px] px-[8px] sm:px-[16px] font-sans" style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", backgroundColor: '#050505', color: '#F5F5F5' }}>
          <Container className="bg-bg mx-auto py-[24px] sm:py-[36px] px-[16px] sm:px-[28px] w-full max-w-[600px] border border-border shadow-2xl rounded-[16px]" style={{ backgroundColor: '#0A0A0A', borderColor: '#2E2E2E' }}>
            {/* Standardized Brand Logo Header — Identical on all screen sizes & templates */}
            {showLogo && (
              <Section className="text-left mb-[24px]">
                <a href="https://xinteck.co.ke" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  <img
                    src="https://xinteck.co.ke/logos/logo-dark-full.png"
                    width="170"
                    height="55"
                    alt="Xinteck Technologies"
                    style={{
                      display: 'block',
                      border: 'none',
                      outline: 'none',
                      objectFit: 'contain',
                      objectPosition: 'left center',
                      maxWidth: '170px',
                      height: 'auto',
                    }}
                  />
                </a>
              </Section>
            )}

            {/* Main Content Area */}
            <Section className="bg-surface border border-border rounded-[12px] p-[20px] sm:p-[28px] mb-[28px] sm:mb-[36px]" style={{ backgroundColor: '#111111', borderColor: '#2E2E2E' }}>
              {children}
            </Section>

            {/* Professional Signature — opt-in for client-facing emails */}
            {showSignature && <XinteckEmailSignature />}
            
            {/* Footer */}
            <Section className="text-left px-[12px] pt-[8px]">
              <Text className="text-dimText text-[12px] leading-[20px] m-0" style={{ color: '#B5B5B5' }}>
                {footerText ? (
                  footerText
                ) : (
                  <>
                    This is an automated notification from Xinteck Technologies.<br />
                    Do not reply directly to this automated address.<br /><br />
                  </>
                )}
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

