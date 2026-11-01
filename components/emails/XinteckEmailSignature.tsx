import { Column, Hr, Img, Link, Row, Section, Text } from '@react-email/components';
import * as React from 'react';

/**
 * Xinteck professional email signature — React Email component.
 * 
 * Translated from public/email/signature.html into React Email primitives.
 * Used in client-facing emails (lead replies, newsletters, outreach).
 * 
 * Design: Gold divider → Logo | Name + Title + Contact → Gold accent bar → Disclaimer
 * Outlook-safe: avoids linear-gradient, uses solid #D4AF37 fallback.
 */
export const XinteckEmailSignature = () => {
  return (
    <Section className="mt-[32px]">
      {/* Gold Divider */}
      <Hr style={{ border: 'none', borderTop: '2px solid #D4AF37', margin: '0 0 16px 0' }} />

      {/* Signature Body */}
      <table cellPadding="0" cellSpacing="0" border={0} style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: '14px', color: '#E5E5E5', maxWidth: '500px' }}>
        <tbody>
          <tr>
            {/* Logo Column */}
            <td valign="top" style={{ paddingRight: '18px', borderRight: '2px solid #D4AF37', width: '88px' }}>
              <Img
                src="https://xinteck.co.ke/logos/logo-dark.png"
                alt="Xinteck Logo"
                width="70"
                height="70"
                style={{ display: 'block', borderRadius: '8px', objectFit: 'contain' }}
              />
            </td>

            {/* Info Column */}
            <td valign="top" style={{ paddingLeft: '18px' }}>
              {/* Name */}
              <Text style={{ margin: '0 0 2px 0', fontSize: '17px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.3px' }}>
                John Jackson O.
              </Text>
              {/* Title */}
              <Text style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#D4AF37', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px' }}>
                Software Developer
              </Text>

              {/* Contact Details */}
              <table cellPadding="0" cellSpacing="0" border={0} style={{ fontSize: '13px', color: '#CCCCCC' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '2px 0', color: '#CCCCCC' }}>
                      📞 &nbsp;{' '}
                      <Link href="tel:+254795213399" style={{ color: '#E5E5E5', textDecoration: 'none' }}>+254 795 213 399</Link>
                      &nbsp;|&nbsp;
                      <Link href="tel:+254782063736" style={{ color: '#E5E5E5', textDecoration: 'none' }}>+254 782 063 736</Link>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '2px 0', color: '#CCCCCC' }}>
                      📧 &nbsp;{' '}
                      <Link href="mailto:info@xinteck.co.ke" style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: 600 }}>info@xinteck.co.ke</Link>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '2px 0', color: '#CCCCCC' }}>
                      🌐 &nbsp;{' '}
                      <Link href="https://www.xinteck.co.ke" style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: 600 }}>www.xinteck.co.ke</Link>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '2px 0', color: '#CCCCCC' }}>
                      📍 &nbsp; Nairobi, Kenya
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Tagline */}
              <Text style={{ margin: '10px 0 0 0', fontSize: '11px', color: '#D4AF37', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' as const }}>
                Xinteck — Digital Solutions
              </Text>
            </td>
          </tr>

          {/* Bottom Gold Accent Bar */}
          <tr>
            <td colSpan={2} style={{ paddingTop: '14px' }}>
              <table cellPadding="0" cellSpacing="0" border={0} width="100%">
                <tbody>
                  <tr>
                    <td style={{ backgroundColor: '#D4AF37', height: '3px', borderRadius: '2px', fontSize: '1px', lineHeight: '1px' }}>&nbsp;</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Disclaimer */}
          <tr>
            <td colSpan={2} style={{ paddingTop: '10px' }}>
              <Text style={{ margin: 0, fontSize: '11px', color: '#B5B5B5', lineHeight: '1.5' }}>
                This email and any attachments are confidential. If you are not the intended recipient, please notify the sender and delete this message.
              </Text>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  );
};

/**
 * Raw HTML version of the signature for non-React-Email contexts (e.g., outreach scripts).
 * Returns a string of HTML that can be concatenated into raw email templates.
 */
export const XINTECK_SIGNATURE_HTML = `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Outfit', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; color: #E5E5E5; max-width: 500px; margin-top: 32px;">
  <tr>
    <td colspan="2" style="padding: 0 0 16px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr><td style="border-bottom: 2px solid #D4AF37; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td valign="top" style="padding-right: 18px; border-right: 2px solid #D4AF37; width: 88px;">
      <img src="https://xinteck.co.ke/logos/logo-dark.png" alt="Xinteck Logo" width="70" height="70" style="display: block; border-radius: 8px; object-fit: contain;" />
    </td>
    <td valign="top" style="padding-left: 18px;">
      <p style="margin: 0 0 2px 0; font-size: 17px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.3px;">John Jackson O.</p>
      <p style="margin: 0 0 10px 0; font-size: 13px; color: #D4AF37; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Software Developer</p>
      <table cellpadding="0" cellspacing="0" border="0" style="font-size: 13px; color: #CCCCCC;">
        <tr><td style="padding: 2px 0; color: #CCCCCC;">📞 &nbsp; <a href="tel:+254795213399" style="color: #E5E5E5; text-decoration: none;">+254 795 213 399</a> &nbsp;|&nbsp; <a href="tel:+254782063736" style="color: #E5E5E5; text-decoration: none;">+254 782 063 736</a></td></tr>
        <tr><td style="padding: 2px 0; color: #CCCCCC;">📧 &nbsp; <a href="mailto:info@xinteck.co.ke" style="color: #D4AF37; text-decoration: none; font-weight: 600;">info@xinteck.co.ke</a></td></tr>
        <tr><td style="padding: 2px 0; color: #CCCCCC;">🌐 &nbsp; <a href="https://www.xinteck.co.ke" style="color: #D4AF37; text-decoration: none; font-weight: 600;">www.xinteck.co.ke</a></td></tr>
        <tr><td style="padding: 2px 0; color: #CCCCCC;">📍 &nbsp; Nairobi, Kenya</td></tr>
      </table>
      <p style="margin: 10px 0 0 0; font-size: 11px; color: #D4AF37; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;">Xinteck — Digital Solutions</p>
    </td>
  </tr>
  <tr>
    <td colspan="2" style="padding: 14px 0 0 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr><td style="background-color: #D4AF37; height: 3px; border-radius: 2px; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td colspan="2" style="padding: 10px 0 0 0;">
      <p style="margin: 0; font-size: 11px; color: #B5B5B5; line-height: 1.5;">This email and any attachments are confidential. If you are not the intended recipient, please notify the sender and delete this message.</p>
    </td>
  </tr>
</table>
`;

export default XinteckEmailSignature;
