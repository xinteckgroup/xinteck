import { Hr, Img, Link, Section, Text } from '@react-email/components';
import { XinteckEmailLayout } from './XinteckEmailLayout';

export interface NewsletterEmailProps {
    subject: string;
    content: string;
    previewText?: string;
    unsubscribeUrl: string;
}

export const NewsletterEmail = ({
    subject = "Newsletter from Xinteck",
    content = "<p>Newsletter content goes here.</p>",
    previewText,
    unsubscribeUrl = "#",
}: NewsletterEmailProps) => {
    return (
        <XinteckEmailLayout previewText={previewText || subject}>
            {/* Logo */}
            <Section className="text-center mb-[32px]">
                <Link href="https://xinteck.co.ke">
                    <Img
                        src="https://xinteck.co.ke/logos/logo-dark-full.png"
                        width="180"
                        height="180"
                        alt="Xinteck Logo"
                        className="mx-auto block"
                        style={{ objectFit: 'contain' }}
                    />
                </Link>
            </Section>

            {/* Subject as heading */}
            <Section className="mb-[24px]">
                <Text className="text-[22px] font-bold text-brand m-0 leading-[30px] tracking-tight">
                    {subject}
                </Text>
            </Section>

            {/* Newsletter body — rendered from HTML */}
            <Section className="text-[15px] leading-[26px] text-text m-0">
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </Section>

            <Hr className="border border-[#222222] my-[32px]" />

            {/* Footer with unsubscribe */}
            <Section className="text-center">
                <Text className="text-dimText text-[12px] leading-[20px] m-0">
                    You are receiving this email because you subscribed to Xinteck updates.<br />
                    <Link
                        href={unsubscribeUrl}
                        className="text-brand underline"
                        style={{ textDecoration: 'underline', color: '#D4AF37' }}
                    >
                        Unsubscribe
                    </Link>
                    {' '}&middot;{' '}
                    <Link
                        href="https://xinteck.co.ke/privacy"
                        className="text-dimText underline"
                        style={{ textDecoration: 'underline', color: '#888888' }}
                    >
                        Privacy Policy
                    </Link>
                </Text>
                <Text className="text-dimText text-[11px] leading-[16px] m-0 mt-[8px]">
                    &copy; {new Date().getFullYear()} Xinteck. All rights reserved.
                </Text>
            </Section>
        </XinteckEmailLayout>
    );
};

export default NewsletterEmail;
