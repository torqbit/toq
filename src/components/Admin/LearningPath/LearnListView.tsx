import { PageSiteConfig } from "@/services/siteConstant";
import { Theme } from "@/types/theme";
import { FC, ReactNode, useEffect, useState } from "react";
import styles from "@/components/Courses/CourseListView/CourseListView.module.scss";
import {
  Button,
  Card,
  Flex,
  Space,
  Tabs,
  TabsProps,
  Tag,
  Dropdown,
  MenuProps,
  Progress,
  Skeleton,
  Segmented,
} from "antd";
import { CourseType, Role, StateType } from "@prisma/client";
import { capsToPascalCase, validateImage } from "@/lib/utils";
import { useRouter } from "next/router";
import Link from "next/link";
import SvgIcons from "@/components/SvgIcons";
import { getDummyArray } from "@/lib/dummyData";
import { useMediaQuery } from "react-responsive";
import { ILearningPathDetail } from "@/types/learingPath";
const { Meta } = Card;
export const LearnViewItem: FC<{ learning: ILearningPathDetail; previewMode?: boolean; userRole?: Role }> = ({
  learning,
  previewMode,
  userRole,
}) => {
  const router = useRouter();
  const [showDummyPurchase, setDummyBtn] = useState(typeof previewMode !== "undefined" && previewMode);

  const handleEdit = (id: number) => {
    router.push(`admin/content/path/${id}/edit`);
  };

  const handlePurchase = (slug: string) => {
    router.push(`/pathList/${slug}`);
  };

  const items: MenuProps["items"] = [
    {
      label: <Link href={`/learning/${learning.slug}`}>View</Link>,
      key: "1",
    },
  ];

  return (
    <Card
      className={styles.course__card}
      cover={
        learning.banner != null ? (
          <object
            type="image/png"
            data={learning.banner}
            className={styles.card__img}
            aria-label={`thumbnail of ${learning.title}`}
          >
            <div className={styles.invalid__img}>
              <i>{SvgIcons.academicCap}</i>
            </div>
          </object>
        ) : (
          <div className={styles.invalid__img}>
            <i>{SvgIcons.academicCap}</i>
          </div>
        )
      }
    >
      <Meta
        className={styles.meta}
        title={
          <>
            <Flex align="center" justify="space-between" gap={5}>
              <Tag bordered={true} style={{ fontWeight: "normal" }}>
                {learning.learningPathCourses.length} courses
              </Tag>
              {learning.state === StateType.DRAFT && (
                <Tag bordered={true} color="warning" style={{ fontWeight: "normal" }}>
                  {capsToPascalCase(StateType.DRAFT)}
                </Tag>
              )}
            </Flex>

            <h4 style={{ marginTop: 5, marginBottom: 5 }}>{learning.title}</h4>
            <p style={{ fontWeight: "normal", marginBottom: 0, fontSize: 14 }}>
              A learning path by <b>{learning.author.name}</b>
            </p>
          </>
        }
        description={learning.description}
      />
      <Flex justify="space-between" align="center" className={styles.card__footer}>
        <div>{learning.price > 0 ? CourseType.PAID : CourseType.FREE}</div>

        {!showDummyPurchase &&
          userRole &&
          (userRole === Role.AUTHOR || userRole === Role.ADMIN) &&
          learning.state == StateType.DRAFT && (
            <Button onClick={(e) => handleEdit(learning.id)} type="default">
              Edit
            </Button>
          )}
        {!showDummyPurchase &&
          userRole &&
          (userRole === Role.AUTHOR || userRole === Role.ADMIN) &&
          learning.state == StateType.ACTIVE && (
            <Dropdown.Button
              type="default"
              trigger={["click"]}
              menu={{ items }}
              onClick={() => handleEdit(learning.id)}
              style={{ width: "auto" }}
            >
              Edit
            </Dropdown.Button>
          )}
        {!showDummyPurchase && userRole && userRole === Role.NOT_ENROLLED && (
          <Button type="default" onClick={(e) => handlePurchase(learning.slug)}>
            {learning.price > 0 ? "Buy Now" : "Enroll Now"}
          </Button>
        )}
        {!showDummyPurchase && userRole && userRole === Role.STUDENT && (
          <Button type="default" onClick={(e) => handlePurchase(learning.slug)}>
            Go to Learning
          </Button>
        )}
        {!showDummyPurchase && !userRole && (
          <Button type="default" onClick={(e) => handlePurchase(learning.slug)}>
            {learning.price > 0 ? "Buy Now" : "Enroll Now"}
          </Button>
        )}
      </Flex>
    </Card>
  );
};

export const LearnListView: FC<{
  pathList: ILearningPathDetail[];
  siteConfig: PageSiteConfig;
  currentTheme: Theme;
  emptyView: ReactNode;
  role?: Role;
  loading: boolean;
}> = ({ pathList, currentTheme, siteConfig, emptyView, role, loading }) => {
  const [tab, setTab] = useState("1");
  const [segmentValue, setSegmentValue] = useState<string>("all");

  const router = useRouter();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const handleLearningCreate = () => {
    return router.push("/admin/content/path/add");
  };
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Learning Paths",
      children: (
        <Flex vertical gap={10}>
          <Segmented
            style={{ width: "fit-content" }}
            onChange={setSegmentValue}
            options={[
              { value: "all", label: "All" },
              { value: StateType.ACTIVE, label: "Published" },
            ]}
          />
          <>
            {segmentValue === "all" ? (
              <div className={styles.course__grid}>
                {pathList.map((path, index) => (
                  <LearnViewItem userRole={role} learning={path} key={index} />
                ))}
              </div>
            ) : (
              <div className={styles.course__grid}>
                {pathList
                  .filter((p) => p.state === StateType.ACTIVE)
                  .map((path, index) => (
                    <LearnViewItem userRole={role} learning={path} key={index} />
                  ))}
              </div>
            )}
          </>
        </Flex>
      ),
    },
  ];
  return (
    <div className={styles.courses__list}>
      {loading && (
        <>
          <h4>Academy </h4>
          <div className={styles.course__grid}>
            {getDummyArray(3).map((t, i) => {
              return (
                <Card
                  key={i}
                  className={styles.course__card}
                  cover={
                    <Skeleton.Image style={{ width: isMobile ? "Calc(100vw - 40px)" : "300px", height: "168px" }} />
                  }
                >
                  <Skeleton />
                </Card>
              );
            })}
          </div>
        </>
      )}
      {role && role !== Role.STUDENT && !loading && (
        <>
          <h4>Academy</h4>

          <Tabs
            tabBarGutter={40}
            items={items}
            activeKey={tab}
            onChange={(k) => setTab(k)}
            tabBarExtraContent={
              <Button type="primary" onClick={handleLearningCreate}>
                Add Learning Path
              </Button>
            }
          />
        </>
      )}

      {role && role === Role.STUDENT && !loading && (
        <>
          {isMobile && <h4>Academy</h4>}
          <div className={styles.course__grid}>
            {pathList
              .filter((c) => c.state === StateType.ACTIVE)
              .map((c, index) => (
                <LearnViewItem userRole={role} learning={c} key={index} />
              ))}
          </div>
        </>
      )}

      {typeof role === "undefined" && pathList.length > 0 && !loading && (
        <div className={styles.course__grid}>
          {pathList.map((c, index) => (
            <LearnViewItem learning={c} key={index} />
          ))}
        </div>
      )}

      {typeof role === "undefined" && pathList.length == 0 && !loading && (
        <Flex justify="center" align="center">
          {emptyView}
        </Flex>
      )}
    </div>
  );
};
