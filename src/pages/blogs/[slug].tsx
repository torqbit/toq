import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { getCookieName } from "@/lib/utils";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

import { FC } from "react";
import { useMediaQuery } from "react-responsive";
import styles from "@/styles/Marketing/Blog/Blog.module.scss";

import { Flex, Space } from "antd";
import Image from "next/image";

import { UserOutlined } from "@ant-design/icons";
import Head from "next/head";
import { truncateString } from "@/services/helper";
import PurifyContent from "@/components/PurifyContent/PurifyContent";
import { PageSiteConfig } from "@/services/siteConstant";
import { getSiteConfig } from "@/services/getSiteConfig";

interface IProps {
  user: User;
  htmlData: string;
  description: string;
  currentUrl: string;
  hostName: string;
  siteConfig: PageSiteConfig;
  blogData: {
    title: string;
    id: string;
    banner: string;
    authorName: string;
    authorImage: string;
    slug: string;
    contentType: string;
  };
}

const BlogPage: FC<IProps> = ({ user, htmlData, blogData, description, currentUrl, hostName, siteConfig }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  return (
    <MarketingLayout
      mobileHeroMinHeight={60}
      siteConfig={siteConfig}
      showFooter={!isMobile}
      user={user}
      heroSection={
        <section className={styles.blogPageWrapper}>
          <Flex vertical gap={20}>
            <h1>{blogData.title}</h1>

            <Flex align="center" gap={10} className={styles.authorInfo}>
              {blogData.authorImage ? (
                <Image
                  src={blogData.authorImage}
                  alt=""
                  height={isMobile ? 40 : 50}
                  width={isMobile ? 40 : 50}
                  loading="lazy"
                />
              ) : (
                <div className={styles.userOutlineContainer}>
                  <UserOutlined height={isMobile ? 40 : 50} width={isMobile ? 40 : 50} />
                </div>
              )}
              <Space direction="vertical" size={"small"}>
                <span>A Blog by</span>
                <div>{blogData.authorName}</div>
              </Space>
            </Flex>
            <Image
              src={blogData.banner}
              height={isMobile ? 175 : 400}
              width={isMobile ? 350 : 800}
              alt={"blog-banner"}
            />
          </Flex>
        </section>
      }
    >
      <Head>
        <meta name="description" content={truncateString(description, 50)} />
        <link rel="icon" href="/favicon.ico" />

        {<meta property="og:url" content={currentUrl} />}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={blogData.title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={blogData.banner} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content={hostName} />
        <meta property="twitter:url" content={currentUrl} />
        <meta name="twitter:title" content={blogData.title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={blogData.banner} />
      </Head>

      <div className={styles.blog_info}>
        <PurifyContent content={htmlData} />
      </div>
    </MarketingLayout>
  );
};
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const params = ctx?.params;
  let cookieName = getCookieName();

  const { site } = getSiteConfig();
  const siteConfig = site;

  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const currentUrl = `${protocol}://${host}${req.url}`;
  const blog = await prisma.blog.findUnique({
    where: {
      slug: String(params?.slug),
      state: "ACTIVE",
    },
    select: {
      user: {
        select: {
          image: true,
          name: true,
        },
      },
      content: true,
      title: true,
      id: true,
      banner: true,
      slug: true,
      contentType: true,
    },
  });

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  if (blog) {
    return {
      props: {
        user,
        htmlData: blog?.content,

        currentUrl,
        hostName: `${host}`,
        blogData: {
          title: blog?.title,
          id: blog?.id,
          banner: blog?.banner,
          authorName: blog?.user.name,
          authorImage: blog?.user.image,
          slug: blog.slug,
          contentType: blog.contentType,
        },
        siteConfig,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,

        destination: "/blog",
      },
    };
  }
};
export default BlogPage;
