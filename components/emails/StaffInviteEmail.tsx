import {
  Button,
  Column,
  Heading,
  Hr,
  Row,
  Section,
  Text
} from '@react-email/components';
import { XinteckEmailLayout } from './XinteckEmailLayout';

export interface StaffInviteEmailProps {
  name: string;
  email: string;
  role: string;
  tempPassword: string;
}

export const StaffInviteEmail = ({
  name = "Team Member",
  email = "staff@xinteck.co.ke",
  role = "Support Staff",
  tempPassword = "temp_password_123"
}: StaffInviteEmailProps) => {
  return (
    <XinteckEmailLayout previewText={`You have been invited to Xinteck as ${role}`}>
      <Heading className="text-[24px] font-black tracking-tight text-center text-white m-0 mb-[24px]">
        Welcome to the Team
      </Heading>
      
      <Text className="text-[16px] leading-[26px] text-text m-0 mb-[16px]">
        Hi <strong>{name}</strong>,
      </Text>
      
      <Text className="text-[16px] leading-[26px] text-text m-0 mb-[32px]">
        You have been formally invited to join the Xinteck Administration platform. You have been assigned the role of <strong className="text-brand uppercase tracking-wider text-[14px]">{role}</strong>.
      </Text>

      {/* Security Credentials Card */}
      <Section className="bg-[#0A0A0A] border border-[#222222] rounded-[8px] p-[24px] mb-[32px]">
        <Text className="text-[12px] font-black text-brand uppercase tracking-widest m-0 mb-[20px]">
          Your Temporary Credentials
        </Text>
        
        <Row className="mb-[12px]">
          <Column style={{ width: '80px' }}>
            <Text className="text-dimText text-[14px] font-medium m-0">Email:</Text>
          </Column>
          <Column>
            <Text className="text-white font-mono text-[14px] font-medium m-0">{email}</Text>
          </Column>
        </Row>
        
        <Row>
          <Column style={{ width: '80px' }}>
            <Text className="text-dimText text-[14px] font-medium m-0">Password:</Text>
          </Column>
          <Column>
            <Text className="text-white font-mono text-[14px] font-medium m-0">{tempPassword}</Text>
          </Column>
        </Row>
      </Section>

      <Section className="text-center mb-[40px]">
        <Button
          href="https://xinteck.co.ke/admin/login"
          className="bg-brand text-[#0A0A0A] font-black uppercase tracking-widest text-[14px] rounded-[6px] px-[32px] py-[16px] text-center inline-block"
        >
          Log In to Dashboard
        </Button>
      </Section>
      
      <Hr className="border border-[#222222] my-[24px]" />
      
      <Text className="text-dimText text-[13px] leading-[20px] italic m-0">
        For security purposes, you are required to navigate to the "Security" tab and change your password immediately upon your first login.
      </Text>
    </XinteckEmailLayout>
  );
};
