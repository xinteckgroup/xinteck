import { Button, Heading, Hr, Img, Link, Section, Text } from '@react-email/components';
import { XinteckEmailLayout } from './XinteckEmailLayout';

export interface PasswordResetEmailProps {
  resetLink: string;
}

export const PasswordResetEmail = ({
  resetLink = "https://xinteck.co.ke/admin/reset-password",
}: PasswordResetEmailProps) => {
  return (
    <XinteckEmailLayout previewText="Reset your Xinteck password">
      <Heading className="text-[22px] sm:text-[24px] font-black tracking-tight text-left text-white m-0 mb-[20px]">
        Password Reset Request
      </Heading>
      
      <Text className="text-[15px] sm:text-[16px] leading-[26px] text-text m-0 mb-[16px]" style={{ color: '#F5F5F5' }}>
        You requested a password reset for your Xinteck Admin Dashboard account.
      </Text>
      
      <Text className="text-[15px] sm:text-[16px] leading-[26px] text-text m-0 mb-[28px]" style={{ color: '#F5F5F5' }}>
        Click the button below to securely set a new password. This link will safely expire in exactly 30 minutes.
      </Text>

      {/* Button — Left-Aligned */}
      <Section className="text-left mb-[32px]">
        <div>
          <Button
            href={resetLink}
            className="bg-brand text-[#0A0A0A] font-black uppercase tracking-widest text-[13px] sm:text-[14px] rounded-[6px] px-[28px] py-[15px] text-center inline-block"
            style={{ display: 'inline-block', textAlign: 'center', backgroundColor: '#D4AF37', color: '#0A0A0A' }}
          >
            Reset Password →
          </Button>
        </div>
      </Section>
      
      <Hr className="border border-[#222222] my-[24px]" />
      
      <Text className="text-dimText text-[13px] leading-[20px] italic m-0" style={{ color: '#B5B5B5' }}>
        If you did not request this password reset, please ignore this email or contact your system administrator immediately.
      </Text>
    </XinteckEmailLayout>
  );
};

export default PasswordResetEmail;
