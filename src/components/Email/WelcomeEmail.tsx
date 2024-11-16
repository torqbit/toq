import { IWelcomeEmailConfig } from "@/lib/emailConfig";

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
} from "@react-email/components";
import { Flex } from "antd";
import * as React from "react";
import { useThemeConfig } from "../ContextApi/ThemeConfigContext";
interface IProps {
  configData: IWelcomeEmailConfig;
}

const WelcomeEmailPage = ({ configData }: IProps) => {
  const themeConfig = useThemeConfig();

  return (
    <Tailwind>
      <Html>
        <Head />

        <Preview>{`${process.env.NEXT_PUBLIC_PLATFORM_NAME}`}</Preview>

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
                src={`https://cdn.torqbit.com/static/torq.png`}
              />
            </Heading>
            <Hr className="border border-solid border-[#eaeaea]  mx-0 w-full" />

            <Section className="px-[20px]">
              <Text className="text-black text-[20px] leading-[20px]">Hey, {configData.name}!</Text>
              <Text className="text-[#888] text-[14px] leading-[20px]">
                Welcome to the {`${process.env.NEXT_PUBLIC_PLATFORM_NAME}`} Platform. we&apos;re excited to have you
                join our community. You can now excel in the field of software development, connect with fellow learners
                and help each other to move forward.
              </Text>

              <Text className="text-[#888] text-[14px] leading-[20px]">
                Visit your dashboard and browse all the courses to start learning.
              </Text>

              <Button
                href={configData.url}
                className={`bg-[${themeConfig.brand?.brandColor}] px-5 py-2 text-white text-left text-[12px]  rounded`}
              >
                Visit Dashboard
              </Button>

              <Text className="text-[#888] text-[14px] leading-[20px]">
                If you have any questions, feel free to email our support team, or even send a reply to this email. We
                wouuld be happy to answer any queries.
              </Text>
              <Text className="text-[#000] text-[15px] m-0 ">
                Thanks & Regards <br />
              </Text>
              <Text className="text-black text-[15px] my-2">{process.env.NEXT_PUBLIC_PLATFORM_NAME} team</Text>

              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
              <Text className="text-[#888] text-[14px] leading-[20px]">
                If you're having trouble with the button above, copy and paste the URL below into your web browser.
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

export default WelcomeEmailPage;
