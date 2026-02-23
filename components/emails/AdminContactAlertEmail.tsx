import { Button, Column, Heading, Hr, Row, Section, Text } from '@react-email/components';
import { XinteckEmailLayout } from './XinteckEmailLayout';

export interface AdminContactAlertEmailProps {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  industry: string;
  service: string;
  budget: string;
  message: string;
}

export const AdminContactAlertEmail = ({
  name = "John Doe",
  email = "john@example.com",
  phone = "+123456789",
  projectType = "Web App",
  industry = "Tech",
  service = "Full Stack",
  budget = "$10k+",
  message = "I need a high performance web application."
}: AdminContactAlertEmailProps) => {
  return (
    <XinteckEmailLayout previewText={`New Lead: ${name} (${projectType})`}>
      <Heading className="text-[20px] font-black tracking-tight text-brand m-0 mb-[24px]">
        New Incoming Lead Alert
      </Heading>
      
      <Section className="bg-[#0A0A0A] border border-[#222222] rounded-[8px] p-[24px] mb-[24px]">
        <Text className="text-[12px] font-black text-white uppercase tracking-widest m-0 mb-[16px]">
          Client Details
        </Text>
        
        <Row className="mb-[8px]">
          <Column style={{ width: '100px' }}><Text className="text-dimText text-[14px] m-0">Name:</Text></Column>
          <Column><Text className="text-white font-medium text-[14px] m-0">{name}</Text></Column>
        </Row>
        <Row className="mb-[8px]">
          <Column style={{ width: '100px' }}><Text className="text-dimText text-[14px] m-0">Email:</Text></Column>
          <Column><a href={`mailto:${email}`} className="text-brand text-[14px] m-0">{email}</a></Column>
        </Row>
        <Row>
          <Column style={{ width: '100px' }}><Text className="text-dimText text-[14px] m-0">Phone:</Text></Column>
          <Column><Text className="text-white font-medium text-[14px] m-0">{phone || 'N/A'}</Text></Column>
        </Row>
      </Section>

      <Section className="bg-[#0A0A0A] border border-[#222222] rounded-[8px] p-[24px] mb-[32px]">
        <Text className="text-[12px] font-black text-white uppercase tracking-widest m-0 mb-[16px]">
          Project Scope
        </Text>
        
        <Row className="mb-[8px]">
          <Column style={{ width: '100px' }}><Text className="text-dimText text-[14px] m-0">Objective:</Text></Column>
          <Column><Text className="text-white font-medium text-[14px] m-0">{projectType}</Text></Column>
        </Row>
        <Row className="mb-[8px]">
          <Column style={{ width: '100px' }}><Text className="text-dimText text-[14px] m-0">Industry:</Text></Column>
          <Column><Text className="text-white font-medium text-[14px] m-0">{industry}</Text></Column>
        </Row>
        <Row className="mb-[8px]">
          <Column style={{ width: '100px' }}><Text className="text-dimText text-[14px] m-0">Service:</Text></Column>
          <Column><Text className="text-white font-medium text-[14px] m-0">{service}</Text></Column>
        </Row>
        <Row className="mb-[16px]">
          <Column style={{ width: '100px' }}><Text className="text-dimText text-[14px] m-0">Budget:</Text></Column>
          <Column><Text className="text-brand font-black text-[14px] m-0">{budget}</Text></Column>
        </Row>

        <Hr className="border border-[#222222] my-[16px]" />

        <Text className="text-dimText text-[12px] uppercase tracking-wider mb-[8px] m-0">Message Content</Text>
        <Text className="text-text text-[14px] leading-[24px] bg-[#111] p-[16px] rounded-[6px] border border-[#333] m-0 italic">
          "{message}"
        </Text>
      </Section>

      <Section className="text-center mb-[24px]">
        <Button
          href="https://xinteck.co.ke/admin/leads"
          className="bg-brand text-[#0A0A0A] font-black uppercase tracking-widest text-[14px] rounded-[6px] px-[32px] py-[16px] text-center inline-block"
        >
          View in CRM
        </Button>
      </Section>
    </XinteckEmailLayout>
  );
};
