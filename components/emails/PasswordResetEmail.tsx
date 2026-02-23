import { Button, Heading, Hr, Section, Text } from '@react-email/components';
import { XinteckEmailLayout } from './XinteckEmailLayout';

export interface PasswordResetEmailProps {
  resetLink: string;
}

export const PasswordResetEmail = ({
  resetLink = "https://xinteck.co.ke/admin/reset-password",
}: PasswordResetEmailProps) => {
  return (
    <XinteckEmailLayout previewText="Reset your Xinteck password">
      <Heading className="text-[24px] font-black tracking-tight text-center text-white m-0 mb-[24px]">
        Password Reset Request
      </Heading>
      
      <Text className="text-[16px] leading-[26px] text-text m-0 mb-[16px]">
        You requested a password reset for your Xinteck Admin Dashboard account.
      </Text>
      
      <Text className="text-[16px] leading-[26px] text-text m-0 mb-[32px]">
        Click the button below to securely set a new password. This link will safely expire in exactly 1 hour.
      </Text>

      <Section className="text-center mb-[40px]">
        <Button
          href={resetLink}
          className="bg-brand text-[#0A0A0A] font-black uppercase tracking-widest text-[14px] rounded-[6px] px-[32px] py-[16px] text-center inline-block"
        >
          Reset Password
        </Button>
      </Section>
      
      <Hr className="border border-[#222222] my-[24px]" />
      
      <Text className="text-dimText text-[13px] leading-[20px] italic m-0">
        If you did not request this password reset, please ignore this email or contact your system administrator immediately.
      </Text>
    </XinteckEmailLayout>
  );
};
