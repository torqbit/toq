import { INewLessonConfig } from "@/lib/emailConfig";
import appConstant from "@/services/appConstant";
import { DEFAULT_THEME } from "@/services/siteConstant";

import {
  Body,
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
  Button,
} from "@react-email/components";

import * as React from "react";

interface IProps {
  configData: INewLessonConfig;
}

export const NewLessonEmail = ({ configData }: IProps) => {
  const siteConfig = DEFAULT_THEME;

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
              <Text className="text-[#888] text-[14px] leading-[20px]  ">
                A new lesson has been published in the course,{" "}
                <span style={{ fontWeight: "bold" }}>{configData.courseName}</span>
              </Text>

              <Text className="text-[#888] text-[14px] leading-[20px] font-bold text-black">
                {configData.lessonName}
              </Text>
              <Text className="text-[#888] text-[14px] leading-[20px] ">{configData.lessonDesription}</Text>

              <Button style={{ zIndex: 10 }} href={configData.url} className=" h-[250px] w-[465px]  ">
                <Img width={465} className="m-auto " src={configData.thumbnail} />
              </Button>
              <Button
                href={configData.url}
                className={`bg-[${siteConfig.brand?.brandColor}] px-5 mt-[10px] py-2 w-[100px] text-white text-center text-[12px]  rounded`}
              >
                Watch Lesson
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

export default NewLessonEmail;
