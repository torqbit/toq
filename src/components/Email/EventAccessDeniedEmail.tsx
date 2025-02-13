import { IEnrolmentEmailConfig, IEventAccessDeniedMailConfig, IEventAccessMailConfig } from "@/lib/emailConfig";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  TailwindConfig,
} from "@react-email/components";
import { Flex } from "antd";
import * as React from "react";
import PurifyContent from "../PurifyContent/PurifyContent";
import { PageSiteConfig } from "@/services/siteConstant";
import { getSiteConfig } from "@/services/getSiteConfig";
interface IProps {
  configData: IEventAccessDeniedMailConfig;
}

export const EventAccessDeniedEmail = ({ configData }: IProps) => {
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
                Your booking request for the event -{" "}
                <span className="text-black text-[14px] ">{configData.eventName}</span> has been denied due to below
                reason
              </Text>
              <Text className="text-[#000]  text-[14px] leading-[20px]">
                <PurifyContent content={configData.reason} />
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

export default EventAccessDeniedEmail;
