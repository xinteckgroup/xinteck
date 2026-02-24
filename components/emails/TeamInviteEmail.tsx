import { Button, Heading, Hr, Img, Link, Section, Text } from '@react-email/components';
import { XinteckEmailLayout } from './XinteckEmailLayout';

export interface TeamInviteEmailProps {
  inviteLink: string;
  role: string;
  invitedBy: string;
}

export const TeamInviteEmail = ({
  inviteLink = "https://xinteck.co.ke/admin/register",
  role = "SUPPORT_STAFF",
  invitedBy = "SUPER_ADMIN",
}: TeamInviteEmailProps) => {
  return (
    <XinteckEmailLayout previewText="You have been invited to Xinteck">
      <Section className="text-left mb-[40px]">
        <Link href="https://xinteck.co.ke">
          <Img
            src="https://xinteck.co.ke/logos/logo-dark-full.png"
            width="200"
            height="200"
            alt="Xinteck Logo"
            className="mx-auto block"
            style={{ objectFit: 'contain' }}
          />
        </Link>
      </Section>
      <Heading className="text-[24px] font-black tracking-tight text-center text-white m-0 mb-[24px]">
        You've Been Invited!
      </Heading>
      
      <Text className="text-[16px] leading-[26px] text-text m-0 mb-[16px]">
        You have been formally invited by {invitedBy === 'ADMIN' ? 'an' : 'a'} <strong>{invitedBy.replace('_', ' ')}</strong> to join the Xinteck Administration Dashboard.
      </Text>
      
      <Text className="text-[16px] leading-[26px] text-text m-0 mb-[32px]">
        You have been assigned the role of <strong className="text-brand uppercase tracking-wider text-[14px]">{role.replace('_', ' ')}</strong>. 
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

export default TeamInviteEmail;
