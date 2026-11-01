import { Button, Column, Heading, Hr, Img, Link, Row, Section, Text } from '@react-email/components';
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

/**
 * Ensures any budget string passed to the email is cleanly formatted in KES.
 * Converts legacy dollar strings ($10k+, $10k - $25k, etc.) to corresponding KES amounts.
 */
export function formatBudgetDisplay(budget?: string | null): string {
  if (!budget || budget === 'Not specified' || budget === 'Unspecified') {
    return 'Not specified';
  }

  const trimmed = budget.trim();

  // If already starts with or contains KES / Ksh, preserve it
  if (/kes|ksh/i.test(trimmed)) {
    return trimmed;
  }

  // Map legacy dollar ranges to correct Kenyan Shilling (KES) amounts
  const legacyDollarMap: Record<string, string> = {
    '$10k+': 'KES 150k+',
    '$10k - $25k': 'KES 80,000 – 200,000',
    '$25k - $50k': 'KES 200,000 – 600,000',
    '$50k - $100k': 'KES 600,000 – 2,000,000',
    '$100k+': 'KES 2,000,000+',
    '$15,000 – $25,000': 'KES 200,000 – 350,000',
    '$15k - $25k': 'KES 200,000 – 350,000',
    '$5,000 - $15,000': 'KES 50,000 – 150,000',
    '$5k - $15k': 'KES 50,000 – 150,000',
    '$1k - $5k': 'KES 15,000 – 50,000',
    '<$10k': '< KES 80,000',
    '<$5k': '< KES 50,000',
  };

  if (legacyDollarMap[trimmed]) {
    return legacyDollarMap[trimmed];
  }

  // If string contains a dollar symbol, replace $ with KES 
  if (trimmed.includes('$')) {
    return trimmed.replace(/\$/g, 'KES ');
  }

  return `KES ${trimmed}`;
}

export const AdminContactAlertEmail = ({
  name = "John Doe",
  email = "john@example.com",
  phone = "+123456789",
  projectType = "Web App",
  industry = "Tech",
  service = "Full Stack",
  budget = "KES 200k - 600k",
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
          <Column style={{ width: '100px' }}><Text className="text-dimText text-[14px] m-0" style={{ color: '#C0C0C0' }}>Name:</Text></Column>
          <Column><Text className="text-white font-medium text-[14px] m-0">{name}</Text></Column>
        </Row>
        <Row className="mb-[8px]">
          <Column style={{ width: '100px' }}><Text className="text-dimText text-[14px] m-0" style={{ color: '#C0C0C0' }}>Email:</Text></Column>
          <Column><a href={`mailto:${email}`} className="text-brand text-[14px] m-0" style={{ color: '#D4AF37', textDecoration: 'none' }}>{email}</a></Column>
        </Row>
        <Row>
          <Column style={{ width: '100px' }}><Text className="text-dimText text-[14px] m-0" style={{ color: '#C0C0C0' }}>Phone:</Text></Column>
          <Column><a href={`tel:${phone}`} className="text-white font-medium text-[14px] m-0" style={{ color: '#FFFFFF', textDecoration: 'none' }}>{phone || 'N/A'}</a></Column>
        </Row>
      </Section>

      <Section className="bg-[#0A0A0A] border border-[#222222] rounded-[8px] p-[24px] mb-[32px]">
        <Text className="text-[12px] font-black text-white uppercase tracking-widest m-0 mb-[16px]">
          Project Scope
        </Text>
        
        <Row className="mb-[8px]">
          <Column style={{ width: '100px' }}><Text className="text-dimText text-[14px] m-0" style={{ color: '#C0C0C0' }}>Objective:</Text></Column>
          <Column><Text className="text-white font-medium text-[14px] m-0">{projectType}</Text></Column>
        </Row>
        <Row className="mb-[8px]">
          <Column style={{ width: '100px' }}><Text className="text-dimText text-[14px] m-0" style={{ color: '#C0C0C0' }}>Industry:</Text></Column>
          <Column><Text className="text-white font-medium text-[14px] m-0">{industry}</Text></Column>
        </Row>
        <Row className="mb-[8px]">
          <Column style={{ width: '100px' }}><Text className="text-dimText text-[14px] m-0" style={{ color: '#C0C0C0' }}>Service:</Text></Column>
          <Column><Text className="text-white font-medium text-[14px] m-0">{service}</Text></Column>
        </Row>
        <Row className="mb-[8px]">
          <Column style={{ width: '100px' }}><Text className="text-dimText text-[14px] m-0" style={{ color: '#C0C0C0' }}>Budget:</Text></Column>
          <Column><Text className="text-brand font-black text-[14px] m-0" style={{ color: '#D4AF37' }}>{formatBudgetDisplay(budget)}</Text></Column>
        </Row>
        <Row className="mb-[16px]">
          <Column style={{ width: '100px' }}><Text className="text-dimText text-[14px] m-0" style={{ color: '#C0C0C0' }}>Received:</Text></Column>
          <Column><Text className="text-white font-medium text-[14px] m-0">{new Date().toLocaleString()}</Text></Column>
        </Row>

        <Hr className="border border-[#222222] my-[16px]" />

        <Text className="text-dimText text-[12px] uppercase tracking-wider mb-[8px] m-0" style={{ color: '#D4AF37' }}>Message Content</Text>
        <Text className="text-text text-[14px] leading-[24px] bg-[#111] p-[16px] rounded-[6px] border border-[#333] m-0 italic" style={{ color: '#FFFFFF' }}>
          "{message}"
        </Text>
      </Section>

      {/* Action Buttons — Stacked Vertically & Left-Aligned */}
      <Section className="text-left mb-[24px]">
        <div style={{ marginBottom: '12px' }}>
          <Button
            href="https://xinteck.co.ke/admin/leads"
            className="bg-brand text-[#0A0A0A] font-black uppercase tracking-widest text-[13px] rounded-[6px] px-[24px] py-[14px] text-center inline-block"
            style={{ display: 'inline-block', textAlign: 'center', backgroundColor: '#D4AF37', color: '#0A0A0A' }}
          >
            View inside CRM →
          </Button>
        </div>
        <div>
          <Button
            href={`mailto:${email}`}
            className="bg-[#222222] text-white border border-[#333333] font-black uppercase tracking-widest text-[13px] rounded-[6px] px-[24px] py-[14px] text-center inline-block"
            style={{ display: 'inline-block', textAlign: 'center', backgroundColor: '#222222', color: '#FFFFFF' }}
          >
            Reply to Client ({email}) ✉
          </Button>
        </div>
      </Section>
    </XinteckEmailLayout>
  );
};

export default AdminContactAlertEmail;
