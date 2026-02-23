import { Hr, Section, Text } from '@react-email/components';
import * as React from 'react';
import { XinteckEmailLayout } from './XinteckEmailLayout';

export interface LeadReplyEmailProps {
  content: string;
  sentBy: string;
}

export const LeadReplyEmail = ({
  content = "Thank you for reaching out to us.",
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
      <Section className="bg-[#0A0A0A] border border-[#222222] rounded-[8px] p-[24px] mb-[32px]">
        <Text className="text-[16px] leading-[26px] text-text m-0">
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
