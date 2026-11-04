import { Button, Column, Heading, Row, Section, Text } from '@react-email/components';
import { XinteckEmailLayout } from './XinteckEmailLayout';
import { formatKESFull } from '@/lib/roi-calculator';

export interface RoiBreakdownEmailProps {
  name: string;
  email: string;
  phone: string;
  company?: string;
  mode: "efficiency" | "revenue";
  investmentTier: string;
  investmentAmount: number;
  annualValue: number;
  paybackMonths: number;
  roiPercentage: number;
}

export const RoiBreakdownEmail = ({
  name = "John Doe",
  email = "john@example.com",
  phone = "+254 700 000 000",
  company,
  mode = "efficiency",
  investmentTier = "Core Business System",
  investmentAmount = 700000,
  annualValue = 1872000,
  paybackMonths = 5,
  roiPercentage = 702,
}: RoiBreakdownEmailProps) => {
  const isEfficiency = mode === "efficiency";
  const modeTitle = isEfficiency ? "Operational Efficiency & Automation" : "Revenue & Conversion Lift";
  const annualLabel = isEfficiency ? "Projected Annual Savings" : "Projected Annual New Revenue";
  const roiLabel = isEfficiency ? "3-Year Projected ROI" : "Year 1 Projected ROI";

  return (
    <XinteckEmailLayout
      previewText={`Your Customized ROI Calculation — Xinteck Technologies`}
      showSignature={true}
    >
      <Heading className="text-[20px] font-black tracking-tight text-brand m-0 mb-[12px]">
        Your Custom Software ROI Breakdown
      </Heading>

      <Text className="text-[14px] leading-[22px] text-text m-0 mb-[24px]">
        Hi {name.split(" ")[0]}, thank you for analyzing your software investment with Xinteck. Below is the tailored financial projection based on your inputs.
      </Text>

      {/* Primary Highlights Card */}
      <Section className="bg-[#0A0A0A] border border-[#222222] rounded-[8px] p-[20px] mb-[24px]">
        <Text className="text-[11px] font-black text-brand uppercase tracking-widest m-0 mb-[16px]">
          {modeTitle} Analysis
        </Text>

        {company && (
          <Row className="mb-[12px]">
            <Column style={{ width: '160px' }}>
              <Text className="text-dimText text-[13px] m-0" style={{ color: '#C0C0C0' }}>Prepared For:</Text>
            </Column>
            <Column>
              <Text className="text-white font-bold text-[13px] m-0">{company}</Text>
            </Column>
          </Row>
        )}

        <Row className="mb-[12px]">
          <Column style={{ width: '160px' }}>
            <Text className="text-dimText text-[13px] m-0" style={{ color: '#C0C0C0' }}>Investment Tier:</Text>
          </Column>
          <Column>
            <Text className="text-white font-bold text-[13px] m-0">{investmentTier} ({formatKESFull(investmentAmount)})</Text>
          </Column>
        </Row>

        <Row className="mb-[12px]">
          <Column style={{ width: '160px' }}>
            <Text className="text-dimText text-[13px] m-0" style={{ color: '#C0C0C0' }}>{annualLabel}:</Text>
          </Column>
          <Column>
            <Text className="text-brand font-black text-[15px] m-0" style={{ color: '#D4AF37' }}>{formatKESFull(annualValue)}</Text>
          </Column>
        </Row>

        <Row className="mb-[12px]">
          <Column style={{ width: '160px' }}>
            <Text className="text-dimText text-[13px] m-0" style={{ color: '#C0C0C0' }}>Payback Period:</Text>
          </Column>
          <Column>
            <Text className="text-white font-bold text-[13px] m-0">{paybackMonths} {paybackMonths === 1 ? "month" : "months"}</Text>
          </Column>
        </Row>

        <Row className="mb-[12px]">
          <Column style={{ width: '160px' }}>
            <Text className="text-dimText text-[13px] m-0" style={{ color: '#C0C0C0' }}>{roiLabel}:</Text>
          </Column>
          <Column>
            <Text className="text-brand font-black text-[15px] m-0" style={{ color: '#D4AF37' }}>+{Math.round(roiPercentage)}%</Text>
          </Column>
        </Row>

        <Row>
          <Column style={{ width: '160px' }}>
            <Text className="text-dimText text-[13px] m-0" style={{ color: '#C0C0C0' }}>Recipient Contact:</Text>
          </Column>
          <Column>
            <Text className="text-dimText text-[12px] m-0" style={{ color: '#A0A0A0' }}>{email} {phone ? `• ${phone}` : ''}</Text>
          </Column>
        </Row>
      </Section>

      {/* Advisory Note */}
      <Section className="bg-[#111111] border border-[#222222] rounded-[8px] p-[16px] mb-[28px]">
        <Text className="text-[13px] leading-[20px] text-dimText m-0" style={{ color: '#C0C0C0' }}>
          💡 <strong style={{ color: '#FFFFFF' }}>Engineering Insight:</strong> These projections assume engineering best practices, reliable cloud architecture, and tailored workflows built specifically for your Kenyan operational context.
        </Text>
      </Section>

      {/* Next Step CTA */}
      <Section className="text-center mb-[20px]">
        <Button
          href="https://xinteck.co.ke/book"
          className="bg-brand text-[#0A0A0A] font-black uppercase tracking-widest text-[13px] rounded-[6px] px-[28px] py-[14px] text-center inline-block"
          style={{ display: 'inline-block', textAlign: 'center', backgroundColor: '#D4AF37', color: '#0A0A0A' }}
        >
          Schedule Free Strategy Call →
        </Button>
      </Section>
    </XinteckEmailLayout>
  );
};

export default RoiBreakdownEmail;

