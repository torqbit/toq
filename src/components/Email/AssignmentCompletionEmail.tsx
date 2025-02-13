import { IAssignmentCompletionConfig } from "@/lib/emailConfig";
import appConstant from "@/services/appConstant";

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
import { getSiteConfig } from "@/services/getSiteConfig";

interface IProps {
  configData: IAssignmentCompletionConfig;
}

export const AssignmentCompletionEmail = ({ configData }: IProps) => {
  const { site } = getSiteConfig();
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>{`${site.brand.name}`}</Preview>
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
              <Text className="text-[#888] text-[14px] leading-[20px]  ">
                Your assignment - <span style={{ fontWeight: "bold" }}>{configData.assignmentName}</span> submitted on
                <span style={{ fontWeight: "bold" }}> {configData.submissionDate}</span> has been evaluated, with a
                score of{" "}
                <span style={{ fontWeight: "bold" }}>
                  {configData.score}/{appConstant.assignmentMaxScore}
                </span>
                .
              </Text>

              <Text className="text-[#888] text-[14px] leading-[20px]">
                To view the details of the evaluation, click the below button.
              </Text>

              <Button
                href={configData.url}
                className={`bg-[${site.brand?.brandColor}] px-5 py-2 text-white text-left text-[12px]  rounded`}
              >
                View Details
              </Button>

              <Text className="text-[#888] text-[14px] leading-[20px]">
                If you have any questions, feel free to email our support team, or even send a reply to this email. We
                wouuld be happy to answer any queries.
              </Text>
              <Text className="text-[#000] text-[15px] m-0 ">
                Thanks & Regards <br />
              </Text>
              <Text className="text-black text-[15px] my-2">{site.brand.name} team</Text>

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

export default AssignmentCompletionEmail;
