import React, { FC } from "react";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { Theme, User } from "@prisma/client";
import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect } from "react";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { useMediaQuery } from "react-responsive";
import appConstant from "@/services/appConstant";
import Link from "next/link";

import DefaulttHero from "@/components/Marketing/Blog/DefaultHero";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import LegalAgreement from "@/components/Marketing/LegalAgreement";

const TermAndConditonPage: FC<{ user: User }> = ({ user }) => {
  const { dispatch } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  const termAndCondionList = [
    {
      title: "INTRODUCTION",
      label: "",
      description: [
        `${appConstant.platformName}  provides online courses and conducts online classes, live demo, doubt clearing sessions for the students seeking to enroll for such courses (the " Services"), which Services are accessible at ${process.env.NEXTAUTH_URL} and any other websites through which ${appConstant.platformName} makes the Services available (collectively, the "Site ") and as applications for mobile, tablet and other smart devices and application program interfaces (collectively, the "Applications").`,
        " By accessing or using the Site, Application or Services or by downloading or posting any content from or on the Site, via the Applications, you would be indicating that you have read, and that you understand and agree to be bound by these terms and receive our Services (“ Terms of Services” or “Terms”), whether or not you have registered with the Site and/or Application.",
        "Therefore, kindly read these Terms of service before accessing or using the Site, Application or Services or downloading or posting any content from or on the Site, via the Application or through the Services, carefully as they contain important information regarding your legal rights, remedies and obligations",
        "If you do not agree to these Terms, then you have no right to access or use the Site, Application, Services, or Collective Content (as defined below).",
        `If you are using the Site, Application or Services then these Terms of Service are binding between you and ${appConstant.platformName}`,
      ],
    },
    {
      label:
        "In Addition To Other Words And Expressions That May Be Defined Elsewhere In These Terms, Unless The Context Otherwise Requires, The Following Capitalized Terms Wherever Used In The Agreement Shall Have The Meanings As Ascribed Here under:",
      title: "DEFINITION",
      description: [
        "Courses means educational courses listed on the Site or Application",
        "Course Fees means the fee or amount that are due and payable by a Student for enrolment of Course",
        `Collective Content means Member Content and ${appConstant.platformName} Content`,
        "Content means text, graphics, images, music, software (excluding the Application), audio, video, information or other materials.",
        `Listing means Courses that are listed by ${appConstant.platformName} as available via the Site, Application, and Services.`,
        ` Member means a person, who completes ${appConstant.platformName} account registration process, including but not limited to Teachers and Students, as described under Account Registration in Clause 7 below`,
        `Member Content" means all Content that a Member posts, uploads, publishes, submits, transmits, or includes in their Listing, Member profile or ${appConstant.platformName} promotional campaign to be made available through the Site, Application or Services.`,
        `Payment Method" means a payment method that you have added to your ${appConstant.platformName} Account, such as a credit card, debit card or net banking.`,
        "Student means a Member who enrols for Courses on Application or Site, in case of minor student the parent or guardian who enrol their child or ward for the Courses on Application or Site.",
        `Tax or Taxes mean any sales taxes, value added taxes (VAT), goods and services taxes (GST), service tax, that ${appConstant.platformName} may be required by law to collect and remit to governmental agencies, and other similar municipal, state, federal and national indirect or other withholding and personal or corporate income taxes.`,
        `Teacher means a Member who has been selected by ${appConstant.platformName} in order to provide services through the Site or Application`,
        `${appConstant.platformName} Content" means all Content that ${appConstant.platformName} makes available through the Site, Application, Services, or its related promotional campaigns and official social media channels, including any Content licensed from a third party, but excluding Student Content.`,
      ],
    },
    {
      label: "",
      title: "Refund & Cancellation Policy",
      id: "refund",
      description: [
        `There is a Strict no refund & no cancellation policy. You are entitled to a refund only in the case where you have not been allotted the course after payment.`,
      ],
    },
    {
      label: `${appConstant.platformName} Respects And Complies With The EU General Data Protection Regulations (GDPR). Some Of The Key Ways We Comply With These Regulations Are:`,

      title: "GDPR COMPLIANCE STATEMENT",
      description: [
        `Consent : We explain what you are consenting to clearly and without legalese, and ask that you explicitly consent to contact from us.`,
        `Breach Notification : In the event of a breach, we will notify affected users within 72 hours of first having become aware of the breach.`,
        `Right to Access : Users can request confirmation as to whether or not personal data concerning them is being processed, where and for what purpose. Further, we shall provide a copy of the personal data, in an electronic format.`,
        `Right to be Forgotten : Once we have compared your rights to the public interest in the availability of the data, we may delete your personal data where you have requested this.`,
        ` Listing means Courses that are listed by ${appConstant.platformName} as available via the Site, Application, and Services.`,
        `Data Portability : We allow you to receive the personal data concerning you, which we will provide in a 'commonly used and machine readable format' and you have the right to transmit that data to another controller`,
        `Privacy by Design : We implement appropriate measures, in an effective way and protect the rights of data subjects. We hold and process only the data absolutely necessary for the completion of our duties, as well as limiting the access to personal data to those needing to act out the processing.`,
        ` Eligibility :Use of the Site, Application and Services is available only to persons who can form legally binding contracts under Indian laws. The Website is intended solely for persons who are 18 years of age or older. If you are below 18, then your parent or guardian can open an account and help you enrol in courses that are appropriate for you.`,
      ],
    },
    {
      label: "",

      title: "COMMUNITY",
      description: [
        `${appConstant.platformName} will create Listing of various Courses and the details about the Course will be listed on the Website. Listings will be made publicly available on the Website.`,
        `Kindly note that ${appConstant.platformName} assumes no responsibility for a Student's compliance with any agreements with or duties to third parties, applicable laws, rules and regulations. ${appConstant.platformName} reserves the right, at any time and without prior notice, to remove or disable access to any Student for any reason, that ${appConstant.platformName}, in its sole discretion, considers to be objectionable for any reason, in violation of these Terms`,
      ],
    },
    {
      label: `By Using The Website, You Accept That Any Legal Liability That You Seek To Obtain For Actions Of Other Members Or Other Third Parties Will Be Limited To A Claim Against The Particular Members Or Other Third Parties Who Caused You Harm. You Agree Not To Attempt To Impose Liability On Or Seek Any Legal Remedy From ${appConstant.platformName} With Respect To Such Actions.`,

      title: "NO ENDORSEMENT",
      description: [],
    },
    {
      label:
        "You understand and agree that you are solely responsible for compliance with any and all laws, rules, regulations, and Tax obligations that may apply to your use of the Website. In connection with your use of the Website, you agree that you will not:",

      title: "USER CONDUCT",
      description: [
        `Violate Any Local, State, National, Or Other Law Or Regulation, Or Any Order Of A Court, Including, Without Limitation, Tax Regulations;`,
        `Use Manual Or Automated Software, Devices, Scripts, Robots, Backdoors Or Other Means Or Processes To Access, "Scrape," "Crawl" Or "Spider" Any Web Pages Or Other Services Contained In The Website;`,
        `Use The Website For Any Commercial Or Other Purposes That Are Not Expressly Permitted By These Terms Or In A Manner That Falsely Implies ${appConstant.platformName} Endorsement;`,
        `Copy, Store Or Otherwise Access Or Use Any Information Contained On The Website For Purposes Not Expressly Permitted By These Terms;`,
        `Infringe The Rights Of ${appConstant.platformName} Or The Rights Of Any Other Person Or Entity, Including Without Limitation, Their Intellectual Property, Privacy, Publicity Or Contractual Right`,
        `Interfere With Or Damage Our Website Through The Use Of Viruses Or Similar Methods Or Technology;`,
        `Use Our Website To Transmit, Distribute, Post Or Submit Any Information Concerning Any Other Person Or Entity, Including Without Limitation, Photographs Of Others Without Their Permission, Personal Contact Information Or Credit, Debit, Calling Card Or Account Numbers`,
        `Use Our Website In Connection With The Distribution Of Unsolicited Spam Emails Or Advertisements`,
        `Recruit Or Otherwise Solicit Any Member To Join Third-Party Services Or Websites That Are Competitive To ${appConstant.platformName}, Without ${appConstant.platformName}'s Prior Written Approval;`,
        `Impersonate Any Person Or Entity, Or Falsify Or Otherwise Misrepresent Yourself Or Your Affiliation With Any Person Or Entity;`,
        `Use Automated Scripts To Collect Information From Or Otherwise Interact With The Website;
Violate These Terms Or ${appConstant.platformName}'s Then-Current Policies And Or Standards;`,
        `Engage In Disruptive, Circumventive, Abusive Or Harassing Behaviour In Any Area Or Aspect Of Our Website`,
        `Systematically Retrieve Data Or Other Content From Our Website To Create A Collection, Compilation, Database, Directory Or The Like, Whether By Manual Methods, Through The Use Of Bots, Crawlers, Or Spiders, Or Otherwise;`,
        `Use Or Display Website Or Any Individual Element Within The Website, ${appConstant.platformName}'s Name, Any ${appConstant.platformName} Trademark, Logo Or Other Proprietary Information, Or The Layout And Design Of Any Page Or Form Contained On A Page In The Website Without ${appConstant.platformName}'s Express Written Consent`,
        `Access, Tamper With, Or Use Non-Public Areas Of The Website, ${appConstant.platformName}'s Computer Systems, Or The Technical Delivery Systems Or ${appConstant.platformName}'s Providers`,
        `Attempt To Probe, Scan, Or Test The Vulnerability Of Any ${appConstant.platformName} System Or Network Or Breach Any Security Or Authentication Measures`,
        `Forge Any TCP/IP Packet Header Or Any Part Of The Header Information In Any Email Or Newsgroup Posting, Or In Any Way Use The Website To Send Altered, Deceptive Or False Source-Identifying Information`,
        `Attempt To Decipher Or Reverse Engineer Any Of The Software Used To Provide The Website`,
        `Advocate, Encourage, Or Assist Any Third Party In Doing Any Of The Foregoing`,
      ],
    },
    {
      label: "",

      title: "COMMUNITY RIGHTS",
      description: [
        `${appConstant.platformName} has the right to investigate and prosecute violations of any of the above to the fullest extent of the law. In addition, and as set in these Terms, ${appConstant.platformName} may take a range of actions against you for a violation of this Section or these Terms`,
        `${appConstant.platformName} may access, preserve and disclose any of your information if we are required to do so by law, or if we believe in good faith that it is reasonably necessary to (i) respond to claims asserted against ${appConstant.platformName}(ii) comply with legal process, (iii) enforce our agreements with users, (iii) for fraud prevention, or (iv) protect the rights, property or safety of ${appConstant.platformName} and its users.`,
        `You acknowledge that ${appConstant.platformName} has no obligation to monitor your access to or use of the Website, or to review or edit any Member Content, but has the right to do so for the purpose of operating and improving the Website. `,
      ],
    },
    {
      label: `This policy is applicable to all persons and organizations associated with ${appConstant.platformName}, referred to as ${appConstant.platformName}’s Stakeholders, including:`,

      title: "COMMUNITY SAFETY POLICY",
      description: [
        `Employees Of ${appConstant.platformName}, Who Maybe Full-Time Or Part-Time Employees, Permanent Or Temporary Employee, Regular Permanent Employee Or Employed On Contract`,
        `Organizations And Persons Belonging To That Organization, Who May Partner And/ Or Work With ${appConstant.platformName} In Any Capacity, Even For A Limited Time Period Or Job`,
        `Volunteers Who May Work With ${appConstant.platformName} Even For A Limited Period Of Time`,
        `Children Enrolled As Students Of ${appConstant.platformName} And Their Parents Or Guardians Who Associate With The Child In The Official Records Of ${appConstant.platformName}`,
        `Children Who May Not Be Enrolled But Are Reached Out Through Marketing Or Sales Of The Product And Their Parents Or Guardians Who Associate With The Child`,
        `Any Other Person Or Organisations Who May Be Officially Associated With ${appConstant.platformName} And Its Ambit Of Work And Activity`,
      ],
    },

    {
      label: "",

      title: "EXPECTED BEHAVIOUR AND ACTIONS",
      description: [
        "Listen To The Child",
        "Treat Every Child With Empathy And Respect Regardless Of His/Her Race, Colour, Gender, Sexuality, Religion, Language, Heritage, Religious Belief, Social Origin, Or Any Point That Discriminated A Child",
        "Use Appropriate Language While Interacting With The Child",
        "Create A Conducive Environment That Enables Children To Share And Express Freely",
        "Always Take Permission From Guardian Before Taking Photos Or Videos Of A Child",
        "Keep All Personal Information Of Children, Their Parents And Guardians Confidential And Secure, Such Information Shall Only Be Shared With Authorised Individuals",
        "The Live Online Classes And The Content, Including But Not Limited To Audio Visual Content Is Age Appropriate And Culturally Appropriate",
      ],
    },
    {
      label: "",

      title: "PROHIBITED BEHAVIOURS AND ACTIONS",
      description: [
        "Do Not Develop Any Emotional, Online/Offline Physical Abuse Or Sexual Relationship With Children In Any Way",
        "Do Not Use Or Encourage The Use Of Alcohol, Drugs, Cigarettes Or Other Intoxicating Substance In Any Of Your Interaction With Children",
        "Do Not Develop Any Form Of Relationship Or Arrangement With Children Including But Not Limited To Financial, Which Could Be Deemed To Be Exploitative Or Abusive",
        "Do Not Share With Or Show Children Online/Offline Any Inappropriate Content Including Pornographic Material Or Material That Encourages Crime, Violence, Racism, Sexism, Self-Harm, Suicide, Cruelty",
        "Always Take Permission From Guardian Before Taking Photos Or Videos Of A Child",
        "Do Not Use Language Or Behaviour Towards Children That Is Inappropriate, Harassing, Abusive, Sexually Provocative, Demeaning, Intimidating, Discriminatory, Or Culturally Insensitive",
      ],
    },
    {
      label: `If Anyone Is Acting Improperly And (I) Engages In Offensive or Sexually Improper Behaviour, Or (Ii) Engages In Misconduct, You Should Instantly Report It To Concerned Authorities And Then To ${appConstant.platformName} By Contacting Us With Your Police Station And Report Number; Provided That Your Report Will Not Obligate Us To Take Any Action Beyond That Required By Law`,

      title: "CHILD SAFETY POLICY",
      description: [],
    },
    {
      label: `In Order To Provide You Services We Gather Your Personal Information. We Describe This Collection And Use Of Personal Information In Our Privacy Policy. Kindly Review This Policy. You Must Agree To The Processing Of Your Personal Information As Mentioned In ${appConstant.platformName}'s Privacy Policy. You Accept That ${appConstant.platformName} May Disclose Personal Information Provided To Us, Including The Data Entered Into The Website, If Required To By Law Or Government Request Such As A Warrant, Or As Specified In The Privacy Policy . You Must Be 18 Years Or Older To Use This Service. You Yourself Are Responsible For Preventing Unauthorized Access To Your Account`,

      title: "PRIVACY",
      description: [],
    },
    {
      label: `The Website Is Protected By Intellectual Property Rights Like Copyright, Trademark, And Other Laws Of India. You Acknowledge And Agree That The Website, Including All Associated Intellectual Property Rights, Are The Exclusive Property Of 4 ${appConstant.platformName} And Its Licensors. You Will Not Change Any Copyright, Trademark, Service Mark Or Other Proprietary Rights Notices Incorporated In The Website. All Trademarks, Service Marks, Logos, Trade Names, And Any Other Proprietary Designations Of ${appConstant.platformName} Used On Or In Connection With The Website, And ${appConstant.platformName} Content Are Trademarks Or Registered Trademarks Of ${appConstant.platformName} In India And Abroad. Trademarks, Service Marks, Logos, Trade Names And Any Other Proprietary Designations Of Third Parties Used On Or In Connection With The Website And ${appConstant.platformName} Content Are Used For Identification Purposes Only And May Be The Property Of Their Respective Owners. As A Member, You Understand And Agree That You Are Bound By The Additional Terms, Guidelines And Policies That Apply To Your Use Of The Website, Including ${appConstant.platformName}'s Trademark & Branding Guidelines`,

      title: "INTELLECTUAL PROPERTY OWNERSHIP AND RIGHTS NOTICES",
      description: [],
    },

    {
      label: `Our Site, Application And Services Have Different Products, Features And Offerings, So Sometimes Additional Terms Or Product Requirements May Apply To Your Use Of Those Products, Features Or Offerings. If Additional Terms Are Available For The Relevant Product Or Services You Use, Those Additional Terms Become Part Of These Terms.`,

      title: "ADDITIONAL TERMS",
      description: [],
    },
    {
      label: `Subject To Your Compliance With These Terms, ${appConstant.platformName} Grants You A Limited, Non-Exclusive, Non-Transferable License, To (A) Access And View Any ${appConstant.platformName} Content Solely For Your Personal And Non-Commercial Purposes And (B) Access And View Any Member Content To Which You Are Permitted Access, Solely For Your Personal And Non-Commercial Purposes. You Have No Right To Sublicense The License Rights Granted In This Section.`,

      title: `${appConstant.platformName.toUpperCase()} CONTENT AND MEMBER CONTENT LICENSE`,
      description: [],
    },
    {
      label: `The Site, Application And Services May Contain Links To Third-Party Websites Or Resources. You Acknowledge And Agree That ${appConstant.platformName} Is Not Responsible Or Liable For: (I) The Availability Or Accuracy Of Such Websites Or Resources; Or (Ii) The Content, Products, Or Services On Or Available From Such Websites Or Resources. Links To Such Websites Or Resources Do Not Imply Any Endorsement By ${appConstant.platformName} Of Such Websites Or Resources Or The Content, Products, Or Services Available From Such Websites Or Resources. You Acknowledge Sole Responsibility For Use Of Any Such Websites.`,

      title: "HYPERLINKS",
      description: [],
    },
    {
      label: `${appConstant.platformName} Respects Copyright Law And Expects Its Users To Do The Same. It Is ${appConstant.platformName}'s Policy To Terminate In Appropriate Circumstances The ${appConstant.platformName} Accounts Of Members Or Other Account Holders Who Repeatedly Infringe Or Are Believed To Be Repeatedly Infringing The Rights Of Copyright Holders.`,

      title: "COPYRIGHT POLICY",
      description: [],
    },
    {
      label: `This Agreement shall be effective for till the time Members access or use the Website or by downloading or posting any content from or on the Website, through the Services Until such time when you or ${appConstant.platformName} terminate the Agreement as described below.`,

      title: "TERM AND TERMINATION, SUSPENSION AND OTHER MEASURES",
      description: [
        `${appConstant.platformName} may instantly, without notice terminate this Agreement if (i) you have materially breached these Terms or our Policies, (ii) you have provided incorrect information during the ${appConstant.platformName} Account registration, (iii) you have violated applicable laws and regulations, or (iv) ${appConstant.platformName} believes in good faith that such action is important to protect the safety or property of other Members, ${appConstant.platformName} or third parties, for fraud prevention and security purposes`,
        `In case of non-material breaches and where appropriate, you will be given notice of any measure by ${appConstant.platformName} and an opportunity to resolve the issue to ${appConstant.platformName}'s reasonable satisfaction.`,
      ],
    },
    {
      label: `${appConstant.platformName} Respects Copyright Law And Expects Its Users To Do The Same. It Is ${appConstant.platformName}'s Policy To Terminate In Appropriate Circumstances The ${appConstant.platformName} Accounts Of Members Or Other Account Holders Who Repeatedly Infringe Or Are Believed To Be Repeatedly Infringing The Rights Of Copyright Holders`,

      title: "SURVIVAL",
      description: [],
    },
    {
      label: "",

      title: "DISCLAIMERS",
      description: [
        `If you choose to use the Website, you do so at your sole risk. You acknowledge and agree that ${appConstant.platformName} does not have an obligation to conduct background checks on any Member, but may conduct such background checks in its sole discretion. If we choose to conduct such checks, to the extent permitted by applicable law, we disclaim warranties of any kind that such checks will identify prior misconduct by a user or guarantee that a user will not engage in misconduct in the future.`,
        `The Website is provided "as is", without warranty of any kind. Without limiting the foregoing, ${appConstant.platformName} explicitly disclaims any warranties of merchantability, fitness for a particular purpose, quiet enjoyment or non-infringement, and any warranties arising out of course of dealing or usage of trade. ${appConstant.platformName} makes no warranty that the Website will meet your requirements or be available on an uninterrupted or secure basis. ${appConstant.platformName} makes no warranty regarding the Courses, teachers, Students or the Services obtained through the Website.`,
        `No advice or information, whether oral or written, obtained from ${appConstant.platformName} or through the Website will create any warranty not expressly made herein.`,
        `You are solely responsible for all of your communications and interactions with other users of the Website and with other persons with whom you interact as a result of your use of the Website. You understand that ${appConstant.platformName} does not make any attempt to verify the statements of users of the Website or to review any Course. v makes no representations or warranties as to the conduct of users of the Website or their compatibility with any users of the Website. You agree to take reasonable precautions in all communications and interactions with other users of the site, application or services and with other persons with whom you communicate or interact as a result of your use of the Website, particularly if you decide to meet offline or in person regardless of whether such meetings are organized by ${appConstant.platformName}. ${appConstant.platformName} explicitly disclaims all liability for any act or omission of any Student or other third party`,
      ],
    },
    {
      label: `You Acknowledge And Agree That, To The Maximum Extent Permitted By Law, The Entire Risk Arising Out Of Your Access To And Use Of The Website and Any Contact You Have With Other Users Of ${appConstant.platformName} Whether In Person Or Online Remains With You. Neither ${appConstant.platformName} Nor Any Other Party Involved In Creating, Producing, Or Delivering The Website Will Be Liable For Any Damages.`,

      title: "LIMITATION OF LIABILITY",
      description: [],
    },
    {
      label: `You Agree To Indemnify ${appConstant.platformName} And Its Affiliates And Subsidiaries, And Their Officers, Directors, Employees And Agents, Harmless From And Against Any Claims, Liabilities, Damages, Losses, And Expenses, Including, Without Limitation, Reasonable Legal And Accounting Fees, Arising Out Of Or In Any Way Connected With (A) Your Access To Or Use Of The Website Or Your Violation Of These Terms; (B) Your Member Content; (C) Your Interaction With Any Member.`,

      title: "INDEMNIFICATION",
      description: [],
    },
    {
      label: `Except As They May Be Supplemented By Additional ${appConstant.platformName} Policies, These Terms Constitute The Entire Agreement Between ${appConstant.platformName} And You Regarding The Website And These Terms Supersede And Replace Any And All Prior Oral Or Written Understandings Or Agreements Between ${appConstant.platformName} And You Regarding The Website.`,

      title: "ENTIRE AGREEMENT",
      description: [],
    },
    {
      label: `Any Notices Or Other Communications Permitted Or Required Hereunder, Including Those Regarding Modifications To These Terms, Will Be In Writing And Given By ${appConstant.platformName} (I) Via Email Or (Ii) By Posting To The Website. For Notices Made By E-Mail, The Date Of Receipt Will Be Deemed The Date On Which Such Notice Is Transmitted`,

      title: "NOTICES",
      description: [],
    },
    {
      label: "",

      title: "GOVERNING LAW AND JURISDICTION",
      description: [
        `These Terms and your use of the Services will be interpreted in accordance with the laws of India excluding its rules on conflicts of laws. You and we agree to submit any dispute arising under these Terms to the personal jurisdiction of a court located in New Delhi for any actions for which the parties retain the right to seek injunctive or other equitable relief in a court of competent jurisdiction to prevent the actual or threatened infringement, misappropriation or violation of a party's copyrights, trademarks, trade secrets, patents, or other intellectual property rights.`,
        `Any dispute, claim or controversy arising out of or relating to this Terms including the determination of the scope or applicability of this Terms to arbitrate, or your use of the Application or information to which it gives access, shall be determined by arbitration in India, before a sole arbitrator mutually appointed by Members and ${appConstant.platformName}. Arbitration shall be conducted in accordance with the Arbitration and Conciliation Act, 1996. The seat of such arbitration shall be New Delhi. All proceedings of such arbitration, including, without limitation, any awards, shall be in the English language. The award shall be final and binding on the parties to the dispute.`,
        `If you are a resident of the European Economic Area (EEA) you have the right to complain to a Data Protection Authority about our collection and use of your personal information. For more information, please contact your local data protection authority in the EEA.`,
      ],
    },
    {
      label: `The Failure Of ${appConstant.platformName} To Enforce Any Right Or Provision Of These Terms Will Not Constitute A Waiver Of Future Enforcement Of That Right Or Provision. The Waiver Of Any Such Right Or Provision Will Be Effective Only If In Writing And Signed By A Duly Authorized Representative Of ${appConstant.platformName}. Except As Expressly Set Forth In These Terms, The Exercise By Either Party Of Any Of Its Remedies Under These Terms Will Be Without Prejudice To Its Other Remedies Under These Terms Or Otherwise. If For Any Reason A Court Of Competent Jurisdiction Finds Any Provision Of These Terms Invalid Or Unenforceable, That Provision Will Be Enforced To The Maximum Extent Permissible And The Other Provisions Of These Terms Will Remain In Full Force And Effect`,

      title: "NO WAIVER",
      description: [],
    },
    {
      label: "",

      title: "MISCELLANEOUS",
      description: [
        `${appConstant.platformName} shall have no liability of any nature, whether in contract, or otherwise, for any losses whatsoever and howsoever caused, from or in any manner connected with any of the Services provided by Us.`,
        `${appConstant.platformName} is not liable for any failure or delay of performance (or otherwise) arising out of a cause beyond ${appConstant.platformName}'s reasonable control.`,
        `You may not assign or transfer these Terms without ${appConstant.platformName}'s prior written consent. Any attempt by you to assign or transfer these Terms, without such consent, will be of no effect. ${appConstant.platformName} may assign or transfer these Terms, at its sole discretion, without restriction. Subject to the foregoing, these Terms will bind and inure to the benefit of the parties, their successors and permitted assigns`,
        `${appConstant.platformName} reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Services provided by us with or without notice. You accept that ${appConstant.platformName} shall not be liable to You or to any third party for any modification of such Services. It is your responsibility to review these Terms periodically for updates and changes`,
        `You agree not to reproduce, duplicate, copy, sell, resell or exploit for any commercial purposes, any portion of the information provided by us, including any intellectual property rights of ${appConstant.platformName} or any person firm or corporation having posted information for availability through the Services provided by us.`,
        `You agree that in the event your post or your information violates any provision of this Terms, We shall have the right to refuse to provide you or any person acting on your behalf, access to the Website, terminate and/ or suspend your access if applicable in the future.`,
      ],
    },
    {
      label: "",

      title: "CONTACT US",
      description: [
        `Address: 3rd Floor, RamaJee Complex, Memco More, Bhuli Hirak Rd, Satyam Nagar, Dhanbad, Susnilewa, Jharkhand 826004`,
        <div>
          Email:<Link href={`mailto:${appConstant.supportEmail}`}> {appConstant.supportEmail}</Link>
        </div>,
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
          title="Term & Conditions"
          description="Explore our comprehensive Terms and Conditions, where we outline the rules, policies, and agreements that govern your use of our services."
        />
      }
    >
      <LegalAgreement content={termAndCondionList} isMobile={isMobile} />
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
