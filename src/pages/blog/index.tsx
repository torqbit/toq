import React, { FC } from "react";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import HeroBlog from "@/components/Marketing/Blog/DefaultHero";
import { useMediaQuery } from "react-responsive";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { Flex, Space } from "antd";
import Image from "next/image";
import prisma from "@/lib/prisma";
import styles from "@/styles/Marketing/Blog/Blog.module.scss";

import Link from "next/link";
import { UserOutlined } from "@ant-design/icons";
import { useSiteConfig } from "@/components/ContextApi/SiteConfigContext";
import { PageSiteConfig } from "@/services/siteConstant";
interface IProps {
  user: User;
  siteConfig: PageSiteConfig;
  blogData: {
    title: string;
    id: string;
    banner: string;
    authorName: string;
    authorImage: string;
    slug: string;
  }[];
}

const BlogPage: FC<IProps> = ({ user, blogData, siteConfig }) => {
  const { dispatch, globalState } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  return (
    <MarketingLayout
      siteConfig={siteConfig}
      user={user}
      heroSection={<HeroBlog title="Blog" description="Our engineering experience, explained in detail" />}
    >
      {blogData.length === 0 ? (
        <div
          style={{
            height: 400,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: globalState.theme === "dark" ? "#283040" : "#eee",
            color: globalState.theme === "dark" ? "#fff" : "#000",
          }}
        >
          <p
            style={{
              maxWidth: isMobile ? 300 : 400,
              lineHeight: 1.5,
            }}
          >
            There are no blogs currently. Visit here later again
          </p>
        </div>
      ) : (
        <div className={styles.blogListPageWrapper}>
          <div className={styles.primaryBlog}>
            {blogData.slice(0, 2).map((blog, i) => {
              return (
                <Link href={`/blogs/${blog.slug}`} key={i} onClick={() => {}} className={styles.blogCard}>
                  <Image src={blog.banner} alt="blog-img" height={isMobile ? 175 : 250} width={isMobile ? 350 : 500} />
                  <div>
                    <Flex className={styles.authorInfo} align="center" gap={10}>
                      {blog.authorImage ? (
                        <Image src={blog.authorImage} alt="blog-img" height={40} width={40} />
                      ) : (
                        <div className={styles.userOutlineImage}>
                          <i>
                            <UserOutlined style={{ fontSize: 20 }} />
                          </i>
                        </div>
                      )}
                      <Space direction="vertical" size={5}>
                        <span>A blog by </span>
                        <div>{blog.authorName}</div>
                      </Space>
                    </Flex>
                    <h1>{blog.title}</h1>
                  </div>
                </Link>
              );
            })}
          </div>
          <div>
            <div
              className={
                blogData.slice(2).length > 2
                  ? styles.secondaryBlog
                  : `${blogData.slice(2).length === 1 ? styles.singleSecondaryBlog : styles.doubleSecondaryBlog}`
              }
            >
              {blogData.slice(2).map((blog, i) => {
                return (
                  <Link href={`/blogs/${blog.slug}`} key={i} onClick={() => {}} className={styles.blogCard}>
                    <Image src={blog.banner} alt="blog-img" height={175} width={350} />
                    <div className={styles.infoWrapper}>
                      <Flex className={styles.authorInfo} align="center" gap={10}>
                        {blog.authorImage ? (
                          <Image src={blog.authorImage} alt="blog-img" height={40} width={40} />
                        ) : (
                          <div className={styles.userOutlineImage}>
                            <UserOutlined style={{ fontSize: 24 }} height={40} width={40} />
                          </div>
                        )}
                        <Space direction="vertical" size={5}>
                          <span>A blog by a</span>
                          <div>{blog.authorName}</div>
                        </Space>
                      </Flex>
                      <h2>{blog.title}</h2>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </MarketingLayout>
  );
};
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;

  let cookieName = getCookieName();

  const blog = await prisma.blog.findMany({
    where: {
      contentType: "BLOG",
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  const siteConfig = useSiteConfig();
  if (blog.length > 0) {
    return {
      props: {
        user,
        blogData: blog.map((b) => {
          return {
            title: b.title,
            id: b.id,
            banner: b.banner,
            authorName: b.user.name,
            authorImage: b.user.image,
            slug: b.slug,
          };
        }),
        siteConfig: {
          ...siteConfig,
          navBar: {
            ...siteConfig.navBar,
            component: siteConfig.navBar?.component?.name as any,
          },
          sections: {
            ...siteConfig.sections,
            feature: {
              ...siteConfig.sections.feature,
              component: siteConfig.sections.feature?.component?.name || null,
            },
          },
        },
      },
    };
  } else {
    return {
      props: {
        user,
        blogData: [],
        siteConfig: {
          ...siteConfig,
          navBar: {
            ...siteConfig.navBar,
            component: siteConfig.navBar?.component?.name as any,
          },
          sections: {
            ...siteConfig.sections,
            feature: {
              ...siteConfig.sections.feature,
              component: siteConfig.sections.feature?.component?.name || null,
            },
          },
        },
      },
    };
  }
};

export default BlogPage;
