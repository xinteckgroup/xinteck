import { Button, Heading, Hr, Section, Text } from '@react-email/components';
import { XinteckEmailLayout } from './XinteckEmailLayout';

export interface TeamInviteEmailProps {
  inviteLink: string;
}

export const TeamInviteEmail = ({
  inviteLink = "https://xinteck.co.ke/admin/register",
}: TeamInviteEmailProps) => {
  return (
    <XinteckEmailLayout previewText="You have been invited to Xinteck">
      <Heading className="text-[24px] font-black tracking-tight text-center text-white m-0 mb-[24px]">
        You've Been Invited!
      </Heading>
      
      <Text className="text-[16px] leading-[26px] text-text m-0 mb-[16px]">
        You have been formally invited to join the Xinteck Administration Dashboard.
      </Text>
      
      <Text className="text-[16px] leading-[26px] text-text m-0 mb-[32px]">
        Click the button below to complete your registration and create your secure account credentials. This exclusive invitation will expire in 7 days.
      </Text>

      <Section className="text-center mb-[40px]">
        <Button
          href={inviteLink}
          className="bg-brand text-[#0A0A0A] font-black uppercase tracking-widest text-[14px] rounded-[6px] px-[32px] py-[16px] text-center inline-block"
        >
          Accept Invitation
        </Button>
      </Section>
      
      <Hr className="border border-[#222222] my-[24px]" />
      
      <Text className="text-dimText text-[13px] leading-[20px] italic m-0">
        This is a secure, private invitation intended only for your email address. Do not forward.
      </Text>
    </XinteckEmailLayout>
  );
};
