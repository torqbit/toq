import { IWelcomeEmailConfig, IWelcomeTenantConfig } from "@/lib/emailConfig";
import appConstant from "@/services/appConstant";
import { DEFAULT_THEME } from "@/services/siteConstant";

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

export interface IEmailProps {
  configData: IWelcomeTenantConfig;
}

const WelcomeTenantEmailPage = ({ configData }: IEmailProps) => {
  return (
    <Tailwind>
      <Html>
        <Head />

        <Preview>{`${configData.brandName}`}</Preview>

        <Head>
          <style></style>
        </Head>
        <Body className="bg-[#f5f5f5] my-auto mx-auto font-sans ">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto    max-w-[465px]">
            <Heading className="text-black   w-full  text-[20px] font-normal  my-0  py-2 px-[20px]  mx-0 ">
              <Img height={40} width={180} style={{ display: "unset" }} src={appConstant.platformLogo} />
            </Heading>
            <Hr className="border border-solid border-[#eaeaea]  mx-0 w-full" />

            <Section className="px-[20px]">
              <Text className="text-black text-[20px] px-[20px] leading-[20px]">Hey, {configData.name}!</Text>
              <Text className="text-[#888] text-[14px] px-[20px] leading-[20px]">
                Welcome to {appConstant.platformName}! We’re thrilled to have you on board. Your journey toward seamless
                business learning and growth starts here.
              </Text>

              <Text className="text-[#888] text-[14px] leading-[20px] px-[20px]">
                With Torqbit, you have access to a powerful and intuitive Learning Management System designed to help
                you train customers, improve the speed of onboarding, and drive business success.
              </Text>

              <Button
                href={configData.url}
                className={`bg-[${DEFAULT_THEME.brand.brandColor}] ml-[20px] py-2 px-[20px] text-white text-left text-[12px]  rounded`}
              >
                Visit Dashboard
              </Button>

              <Text className="text-[#888] text-[14px] leading-[20px] px-[20px]">
                If you have any questions, feel free to email our support team, or even send a reply to this email. We
                would be happy to answer any queries.
              </Text>
              <Text className="text-[#000] text-[15px] m-0 px-[20px]">
                Thanks & Regards <br />
              </Text>
              <Text className="text-black text-[15px] my-2 px-[20px]">{appConstant.platformName} team</Text>

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

export default WelcomeTenantEmailPage;
