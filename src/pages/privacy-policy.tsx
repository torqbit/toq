import React, { FC } from "react";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { Theme, User } from "@prisma/client";
import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect } from "react";
import MarketingLayout from "@/components/Layouts/MarketingLayout";

import { useMediaQuery } from "react-responsive";
import appConstant from "@/services/appConstant";
import Link from "next/link";
import LegalAgreement from "@/components/Marketing/LegalAgreement";

import DefaulttHero from "@/components/Marketing/Blog/DefaultHero";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";

const TermAndConditonPage: FC<{ user: User }> = ({ user }) => {
  const { dispatch, globalState } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  const privacyPoliciesList = [
    {
      title: "COLLECTION OF INFORMATION",
      label: "",
      description: [
        `As a visitor, you can browse through our Website to find out more about ${appConstant.platformName}. You are not required to provide us with
         any Personal Data if you are merely a visitor. When you visit the Site, we collect and store certain information in order to
          increase security, analyse developments and administer the Website with a view to help us in making customer experience better.
           We utilise this information to analyse traffic patterns on our Website so as to make it more beneficial for our visitors.
            We collect your Personal Data only when you register with us, when you are interested in obtaining information regarding our products and services, when you participate in activities on our Website or contact us. We will only collect your Personal Information if there is a proper and valid reason for doing so, for instance : to comply with our regulatory and legal obligations; for the performance of our contract with you or to take the required steps at your request before entering into a legal contract; for our legitimate interests or where you have given consent. A legitimate interest is when we have a valid commercial or business reason to use your information. In certain cases, we may also have a legal obligation to collect personal data from you or may otherwise need the personal information to protect your interests or those of another individual (for instance, in order to prevent payment fraud or confirm your identity).
         Our primary objective in collecting your Personal Information is to provide you a safe, effective, seamless and customized experience. This allows us to provide online courses, study material and tutorials that most likely meet your needs and to customize our Website to make your experience easier, better and safer. The information we gather from you helps us personalize and continually improve customer experience at our Website. We do not voluntarily make this information available to any third parties, nor do we use it for any other objective, except as set out herein. In order to register on our website or complete the purchase process of one of our courses, we may collect the following information that you will voluntarily provide to us through one of our contact forms, chat or phone session, such as:`,
        <ul style={{ marginLeft: -10, marginTop: 10, marginBottom: 10, listStyle: "initial" }}>
          <li>
            Information pertaining to personal details, like name, email id, photograph, contact address, contact
            number, IP address or geographic location
          </li>
          <li>Information pertaining to identity, like your mark-sheets, Aadhar /Voter ID/ Passport details;</li>
          <li>Information pertaining to billing, like credit/debit card number and billing address;</li>
          <li>Username or password;</li>
          <li> Ratings or reviews, syllabus/ course preferences, account settings; and</li>
          <li>Information provided to us through interaction with customer service, surveys or promotions</li>
        </ul>,
        `We collect data about your interactions with us and also the information regarding the device (Laptop, computer, mobile, etc) used
         to access our service. This information contains your activity on our Website, and search queries; your interactions details with customer service, and if you call us , your contact number and recordings of your calls; device IDs or other unique identifiers, device and software characteristics, connection information, statistics regarding page views, referral URLs, IP address, browser and web server log information, and information collected via the use of cookies. With the aid of back end applications, we strive to provide better services and quality interaction with teachers, depending on your interest. We may also seek this information at other instances, such as when you enter contests or other marketing promotions sponsored by us and/or our partners. If you use a functionality that requires fee payment, options will appear. In case of payments via credit or debit card, we will redirect you to registered payment gateway razorpay or paytm. You may store and save your payment details like card numbers with the gateway. We cannot access this data. All payment transactions are processed through secure payment gateway providers. When you access any of our paid products, we store information about the web pages on our servers. This helps us to track items that have been completed by you, and those that you need to see. The user’s full name and his/her display picture can be publicly displayed on the Website. ${appConstant.platformName} can seek more information regarding billing information, address, certificates, etc depending on what profile and what services they are seeking. ${appConstant.platformName} can use technologies like cookies,
         clear gifs, log files, etc to help understand how you interact with our site and services, so as to render a better experience.`,
      ],
    },
    {
      title: " USAGE AND RETENTION OF INFORMATION",
      label: "",

      description: [
        `We use the personal information we collect, including your Personal Data where it is necessary to render the services requested by you, where it is necessary to comply with legal obligations or rights or for normal business purposes of the kind set out in this Policy. We will use your personal information to provide, analyse and improve our offerings, to provide you with a customized experience on our Website, to contact you about your account and our services, to render customer service, to provide you with personalized marketing and to any fraudulent or illegal activities. In addition to this, we use your personal information to figure out your general geographic location, provide localized course content and classes, recommendations, determine your ISP, and help us quickly and efficiently respond to queries and enforcing our terms and communicate with you concerning our service (for example by email, push notifications, text messaging ,and online messaging channels), so that we can provide you details about latest features and content available on the Website, offers, and promotions, surveys, and to assist you with operational requests like password reset requests.`,
      ],
    },
    {
      title: "COMMUNITY",
      label: "",

      description: [
        `${appConstant.platformName} is a community, wherein we offer a number of features that allow members to connect and communicate in public or semi-public spaces, such as Forums and Teams. Please use your judgment before posting in these community spaces or sharing your personal information with others on ${appConstant.platformName}. You should be aware that any personal information you submit there can be read, collected, or used by others, or could be used to send you unsolicited messages.`,
      ],
    },
    {
      title: "SHARING AND DISCLOSING PERSONAL INFORMATION",
      label: "",

      description: [
        `We use other Service Providers to perform services on our behalf or to assist us with the provision of services to you. We engage these Service Providers to provide promotional, infrastructure and IT services, to personalize and optimize our service, to process payment transactions, to provide customer service, to analyze and enhance data, and to conduct consumer surveys. In the process of providing such services, these Service Providers may have access to your personal or other information. We do not authorize them to use or disclose your personal information except in relation to providing their services.`,
      ],
    },
    {
      title: "NOTE TO OUR USERS IN EUROPE:",
      label: "",

      description: [
        `We transfer your personal information from the European Economic Area and Switzerland to India. By submitting your data and/or using our services, you consent to the transfer, storing, and processing of your personal information in India.`,
      ],
    },
    {
      title: "SECURITY",
      label: "",

      description: [
        `We shall make an effort to take all precautions to shield the personal information both online and offline. We will try to protect your information using security measures to reduce the risks of loss and misuse of data. We have standard SSL certification which basically helps us create a secure connection between our server and user to render any information or action. Some of the protective measures we use are firewalls and data encryption, physical access controls to our data centres and information access authorization controls. Only user passwords are encrypted in 64-bit encryption and stored because generally users use the same password on multiple sites, to prevent any kind of theft, piracy or unauthorised access. If you think that your ${appConstant.platformName} account has been compromised`,
        <div>
          Email:<Link href={`mailto:${appConstant.supportEmail}`}> {appConstant.supportEmail}</Link>
        </div>,
      ],
    },
    {
      title: "CHANGES TO THIS POLICY",
      label: "",

      description: [
        `${appConstant.platformName} reserves the right to change this Privacy Policy as we may deem necessary from time to time or as may be required by law. Any changes will be immediately posted on the Web Site and you are deemed to have accepted the terms of the Policy on your first use of the Web Site following the alterations.`,
      ],
    },
  ];

  const setGlobalTheme = (theme: Theme) => {
    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };

  const onCheckTheme = () => {
    const currentTheme = localStorage.getItem("theme");
    if (!currentTheme || currentTheme === "dark") {
      localStorage.setItem("theme", "dark");
    } else if (currentTheme === "light") {
      localStorage.setItem("theme", "light");
    }
    setGlobalTheme(localStorage.getItem("theme") as Theme);

    dispatch({
      type: "SET_LOADER",
      payload: false,
    });
  };

  useEffect(() => {
    onCheckTheme();
  }, []);

  return (
    <MarketingLayout
      user={user}
      heroSection={
        <DefaulttHero
          title="Privacy Policy"
          description="Discover our Privacy Policy, designed to safeguard your information and outline our commitment to protecting your privacy."
        />
      }
    >
      <LegalAgreement
        content={privacyPoliciesList}
        isMobile={isMobile}
        titleDescription={
          <p>
            This Privacy Policy discloses the privacy practices for {appConstant.platformName} (“We/we” or “Us/us”) with
            regard to Your (“You/you” or “Your/your”) use of the online platform {process.env.NEXT_PUBLIC_NEXTAUTH_URL}
            (“Website”). This Privacy Policy and Terms of Use describes our current practices regarding, including your
            choices in relation to how we collect, compile, store, use, share and secure your personal information
            across our Website. It also describes your choices regarding access, use and correction of personal
            information and your rights in relation to your personal information and how you can contact us or
            authorities in the event you have a grievance or complaint. By visiting
            {process.env.NEXT_PUBLIC_NEXTAUTH_URL}, you agree to be bound by the terms and conditions of this Privacy
            Policy. Kindly go through this Privacy Policy carefully. By using the Website, you indicate that you
            understand and abide by this Policy. If you are not in agreement with the terms and conditions of this
            Privacy Policy, kindly do not access this Website. We ensure to review this Privacy Policy from time to time
            so that it is updated. If you are just a visitor, then kindly note that this Policy is subject to change at
            any time without notice. To ensure that you are aware of any changes in the Policy, please review this
            Policy from time to time. By Personal Data, we mean any information that can either itself identify you as
            an individual.
          </p>
        }
      />
    </MarketingLayout>
  );
};

export default TermAndConditonPage;
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;

  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  return { props: { user } };
};
