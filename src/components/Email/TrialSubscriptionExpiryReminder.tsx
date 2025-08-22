import { ISendSubscriptionExpireNotify } from "@/lib/emailConfig";
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

interface IProps {
  configData: ISendSubscriptionExpireNotify;
}

const TrialSubscriptionExpireEmail = ({ configData }: IProps) => {
  const site = configData.site;

  return (
    <Tailwind>
      <Html>
        <Head />

        <Preview>{`${site.brand?.name} - Subscription Expiration Notice`}</Preview>

        <Head>
          <style></style>
        </Head>
        <Body className="bg-[#f5f5f5] my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto max-w-[465px]">
            <Heading className="text-black w-full text-[20px] font-normal my-0 py-2 px-[20px] mx-0">
              <Img height={50} width={50} style={{ display: "unset" }} src={`${site.brand?.icon}`} />
            </Heading>
            <Hr className="border border-solid border-[#eaeaea] mx-0 w-full" />

            <Section className="px-[20px]">
              <Text className="text-black text-[20px] leading-[20px]">Hello, {configData.name}!</Text>
              <Text className="text-[#888] text-[14px] leading-[20px]">
                We wanted to let you know that your subscription to {`${configData.site.brand?.name}`} is set to expire
                in
                <strong>
                  {" "}
                  {configData.daysRemaining} {Number(configData?.daysRemaining) > 1 ? "days" : "day"}
                </strong>
                .
              </Text>

              <Text className="text-[#888] text-[14px] leading-[20px]">
                To continue enjoying uninterrupted access to our platform, please upgrade your subscription before the
                expiration date.
              </Text>

              <Button
                href={configData.url}
                className={`bg-[${site.brand?.brandColor}] px-5 py-2 text-white text-left text-[12px] rounded`}
              >
                Upgrade Subscription
              </Button>

              <Text className="text-[#888] text-[14px] leading-[20px]">
                If you have any questions or need assistance, feel free to contact our support team. We're here to help!
              </Text>
              <Text className="text-[#000] text-[15px] m-0">
                Thanks & Regards <br />
              </Text>
              <Text className="text-black text-[15px] my-2">{site.brand?.name} team</Text>

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

export default TrialSubscriptionExpireEmail;
