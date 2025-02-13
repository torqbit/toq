import { IEventEmailConfig } from "@/lib/emailConfig";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import { Flex } from "antd";
import * as React from "react";

interface IProps {
  configData: IEventEmailConfig;
}

export const EventCompletionEmail = ({ configData }: IProps) => {
  const { site }: { site: PageSiteConfig } = getSiteConfig();
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>{`${site.brand?.name}`}</Preview>
        <Head>
          <style></style>
        </Head>
        <Body className="bg-[#f5f5f5] my-auto mx-auto font-sans ">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto    max-w-[465px]">
            <Heading className="text-black   w-full  text-[20px] font-normal  my-0  py-2 px-[20px]  mx-0 ">
              <Img
                height={50}
                width={50}
                style={{ display: "unset" }}
                src={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/${site.brand?.icon}`}
              />
            </Heading>
            <Hr className="border border-solid border-[#eaeaea]  mx-0 w-full" />
            <Section className="px-[20px]">
              <Text className="text-black text-[20px] leading-[20px]">Hey, {configData.name}!</Text>
              <Text className="text-[#888] text-[14px] leading-[20px]">
                Great to see and meet you at the event titled - {configData.eventName}. We are delighted to send you the
                participation digital certificate, attached in this email.
              </Text>
              <Text className="text-[#888] text-[14px] leading-[20px]">
                Hope you had some learnings from this event. See you in the next event soon.
              </Text>

              <Text className="text-[#888] text-[14px] leading-[20px]">
                If you have any questions, feel free to email our support team, or even send a reply to this email. We
                wouuld be happy to answer any queries.
              </Text>
              <Text className="text-[#000] text-[15px] m-0 ">
                Thanks & Regards <br />
              </Text>
              <Text className="text-black text-[15px] my-2">{`${site.brand?.name}`} team</Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default EventCompletionEmail;
