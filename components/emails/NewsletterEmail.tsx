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
        <XinteckEmailLayout previewText={previewText || subject} showSignature>
            {/* Subject as heading */}
            <Section className="mb-[24px]">
                <Text className="text-[22px] font-bold text-brand m-0 leading-[30px] tracking-tight">
                    {subject}
                </Text>
            </Section>

            {/* Newsletter body — rendered from HTML */}
            <Section className="text-[15px] leading-[26px] text-text m-0" style={{ color: '#F5F5F5' }}>
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </Section>

            <Hr className="border border-[#222222] my-[32px]" />

            {/* Footer with unsubscribe */}
            <Section className="text-left">
                <Text className="text-dimText text-[12px] leading-[20px] m-0" style={{ color: '#B5B5B5' }}>
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
                        style={{ textDecoration: 'underline', color: '#CCCCCC' }}
                    >
                        Privacy Policy
                    </Link>
                </Text>
                <Text className="text-dimText text-[11px] leading-[16px] m-0 mt-[8px]" style={{ color: '#A0A0A0' }}>
                    &copy; {new Date().getFullYear()} Xinteck. All rights reserved.
                </Text>
            </Section>
        </XinteckEmailLayout>
    );
};

export default NewsletterEmail;
