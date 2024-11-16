import CourseEnrolmentEmail from "@/components/Email/CourseRegistrationEmail";
import WelcomeEmailPage from "@/components/Email/WelcomeEmail";

const EmailTemplatePage = () => {
  const signUp = (
    <WelcomeEmailPage
      configData={{
        name: "mehrab",
        url: `/courses`,
        email: "",
      }}
    />
  );

  const enrollment = (
    <CourseEnrolmentEmail
      configData={{
        name: "Mehrab",
        url: "/dash",
        email: "/",
        course: {
          name: "Git Branch",
          thumbnail: "https://cdn.torqbit.com/static//courses/banners/Git-Intro_banner-1717674874299.jpg",
        },
      }}
    />
  );
  return <></>;
};

export default EmailTemplatePage;
