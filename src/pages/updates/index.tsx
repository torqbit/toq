import React, { FC } from "react";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { Theme, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { useEffect } from "react";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import HeroBlog from "@/components/Marketing/Blog/DefaultHero";
import { useMediaQuery } from "react-responsive";
import { getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import styles from "@/styles/Marketing/Updates/Updates.module.scss";
import UpdateCard from "@/components/Marketing/Updates/UpdateCard";
interface IProps {
  user: User;
  updateData: {
    title: string;
    id: string;
    banner: string;
    authorName: string;
    description: string;
    authorImage: string;
    slug: string;
    updatedAt: string;
  }[];
}

const updatePage: FC<IProps> = ({ user, updateData }) => {
  const { dispatch, globalState } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

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
      heroSection={<HeroBlog title="Updates" description="New changes to our learning platform & courses" />}
    >
      {!updateData ? (
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
            There are no updates currently. Visit here later again
          </p>
        </div>
      ) : (
        <div className={styles.updateListPageWrapper}>
          {updateData.map((data, i) => {
            return (
              <div key={i}>
                <UpdateCard
                  date={data.updatedAt}
                  title={data.title}
                  img={data.banner}
                  description={data.description}
                  href={`/updates/${data.slug}`}
                  slug={data.slug}
                  link={"Read more"}
                />
              </div>
            );
          })}
        </div>
      )}
    </MarketingLayout>
  );
};
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;

  let cookieName = getCookieName();

  const update = (await prisma.blog.findMany({
    where: {
      contentType: "UPDATE",
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
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })) as any;

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  if (update.length > 0) {
    return {
      props: {
        user,
        updateData: update.map((b: any) => {
          return {
            title: b.title,
            id: b.id,
            banner: b.banner,
            authorName: b.user.name,
            authorImage: b.user.image,
            slug: b.slug,
            updatedAt: b.updatedAt.toISOString(),
          };
        }),
      },
    };
  } else {
    return {
      props: {
        user,
        blogData: [],
      },
    };
  }
};

export default updatePage;
