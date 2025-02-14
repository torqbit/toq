import { IEnrolmentEmailConfig } from "@/lib/emailConfig";

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
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";

interface IProps {
  configData: IEnrolmentEmailConfig;
}

export const CourseEnrolmentEmail = ({ configData }: IProps) => {
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
                We&apos;re excited to let you know that you've successfully enrolled in {configData.course.name}!
                Welcome abroad, and congratulations on taking this important step towards enhancing your skills.
              </Text>
              <Text className="text-[#888] text-[14px] leading-[20px]">
                It&apos;s time to move forward. Click on the link below to get Start
              </Text>
              <Section className=" item-center   gap-5">
                <div className="text-center bg-[#fff] min-h-[150px] p-2 mt-[32px] mb-[32px]">
                  <Img src={configData.course.thumbnail} height={150} width={"auto"} alt="course" />
                  <Flex vertical justify="space-between" className=" mt-2 ">
                    <div>
                      <Heading className="text-[#000] text-left text-[15px] mb-1 ">{configData.course.name}</Heading>
                      <Text className="leading-[20px] text-[#888] text-[14px] text-left m-0 mb-4">
                        If you have any questions, feel free to email our support team, or even send a reply .
                      </Text>
                    </div>
                    <div className="flex item-center justify-start">
                      <Button
                        href={`${configData.url}`}
                        className={`bg-[${site.brand?.brandColor}] px-5 py-2 text-white text-left text-[12px]  rounded`}
                      >
                        Start Course
                      </Button>
                    </div>
                  </Flex>
                </div>
              </Section>

              <Text className="text-[#888] text-[14px] leading-[20px]">
                If you have any questions, feel free to email our support team, or even send a reply to this email. We
                wouuld be happy to answer any queries.
              </Text>
              <Text className="text-[#000] text-[15px] m-0 ">
                Thanks & Regards <br />
              </Text>
              <Text className="text-black text-[15px] my-2">{`${site.brand?.name}`} team</Text>

              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
              <Text className="text-[#888] text-[14px] leading-[20px]">
                If you&apos;re having trouble with the button above, copy and paste the URL below into your web browser.
              </Text>
              <Link href={configData.url} className="text-blue-600 cursor-pointer">
                {configData.url}
              </Link>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default CourseEnrolmentEmail;
