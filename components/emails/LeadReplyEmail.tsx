import { Hr, Img, Section, Text } from '@react-email/components';
import * as React from 'react';
import { XinteckEmailLayout } from './XinteckEmailLayout';

export interface LeadReplyEmailProps {
  content: string;
  sentBy: string;
}

export const LeadReplyEmail = ({
  content = "Thank you for reaching out to us. We will get back to you in due time.",
  sentBy = "Xinteck Support",
}: LeadReplyEmailProps) => {
  // Convert newlines to breaks for safe rendering
  const formattedContent = content.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <XinteckEmailLayout previewText={`Reply from ${sentBy}`}>
      <Section className="text-left mb-[40px]">
        <Img
          src="https://xinteck.co.ke/logos/logo-dark-full.webp"
          height="200"
          alt="Xinteck Logo"
          className="mx-auto block"
          style={{ objectFit: 'contain' }}
        />
      </Section>
      <Section className="bg-[#0A0A0A] border border-[#222222] rounded-[8px] p-[24px] mb-[32px]">
        <Text className="text-[16px] leading-[26px] text-text m-0 mb-[16px]">
          Thank you for reaching out to Xinteck. We have successfully received your inquiry and our engineering team is actively reviewing your requirements.
        </Text>
        <Text className="text-[16px] leading-[26px] text-text m-0 mb-[24px]">
          We take pride in delivering highly scalable, performant, and secure solutions tailored exactly to your business logic. Our team is fully committed to ensuring your project's success.
        </Text>
        <Hr className="border border-[#222222] my-[16px]" />
        <Text className="text-[16px] leading-[26px] text-text m-0 italic">
          {formattedContent}
        </Text>
      </Section>
      
      <Hr className="border border-[#222222] my-[24px]" />
      
      <Text className="text-dimText text-[13px] leading-[20px] italic m-0">
        This is a formal reply to the inquiry you submitted via our website. Our engineers are standing by if you have any further questions.
      </Text>
    </XinteckEmailLayout>
  );
};

export default LeadReplyEmail;
