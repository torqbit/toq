import React, { FC } from "react";
import styles from "../../styles/Sidebar.module.scss";
import { Flex, Layout, Menu, MenuProps, Progress } from "antd";
import SvgIcons from "../SvgIcons";
import { ISiderMenu, useAppContext } from "../ContextApi/AppContext";
import { CloseOutlined } from "@ant-design/icons";
import { Role } from "@prisma/client";

const { Sider } = Layout;

const LessonListSideBar: FC<{
  menu: MenuProps["items"];
  defaulSelectedKey: string;
  marketingLayout: boolean;
  progress: number;
  userRole?: Role;
}> = ({ menu, defaulSelectedKey, progress, marketingLayout, userRole }) => {
  const { globalState, dispatch } = useAppContext();
  return (
    <div style={{ position: "relative" }}>
      {!marketingLayout && (
        <div
          className={`${styles.lesson_collapsed_btn} ${
            globalState.lessonCollapsed ? styles.lesson_collapsed : styles.lesson_not_collapsed
          }`}
          onClick={() => {
            dispatch({ type: "SET_LESSON_COLLAPSED", payload: !globalState.lessonCollapsed });

            localStorage.setItem("lessonCollapsed", globalState.lessonCollapsed ? "uncollapsed" : "collapsed");
          }}
          style={{ top: marketingLayout ? 70 : 18 }}
        >
          <i> {!globalState.lessonCollapsed ? <CloseOutlined /> : SvgIcons.carretLeft}</i>
        </div>
      )}

      <Sider
        width={400}
        theme="light"
        reverseArrow={true}
        style={{
          position: "fixed",
          bottom: 0,
          right: !marketingLayout && globalState.lessonCollapsed ? -10 : 0,
          top: marketingLayout ? 75 : userRole == Role.STUDENT ? 0 : 22,
        }}
        className={`${styles.lesson_sider} ${
          !marketingLayout && globalState.lessonCollapsed ? "collapsed_lesson_sider" : "lesson_sider"
        }`}
        trigger={null}
        collapsible={marketingLayout ? false : globalState.lessonCollapsed}
      >
        <div
          className={styles.course_title}
          style={{ marginBottom: userRole === Role.STUDENT ? 20 : 0, paddingRight: userRole === Role.STUDENT ? 10 : 0 }}
        >
          {userRole === Role.STUDENT ? (
            <Flex align="center" justify="space-between">
              <h4>Course Progress</h4>
              <p>{Math.trunc(progress)}% Completed</p>
            </Flex>
          ) : (
            <h4>Course Content</h4>
          )}
          {userRole === Role.STUDENT && (
            <Progress
              size={{ height: 2, width: 400 }}
              style={{ marginLeft: -15 }}
              status={"active"}
              percent={Math.trunc(progress)}
              trailColor="var(--bg-secondary)"
              showInfo={false}
            />
          )}
        </div>

        <Menu
          mode="inline"
          rootClassName={styles.content__menu__wrapper}
          defaultSelectedKeys={[defaulSelectedKey]}
          className={styles.menu__item__wrapper}
          selectedKeys={[defaulSelectedKey]}
          style={{ width: "100%", borderInlineEnd: "none" }}
          items={menu}
        />
      </Sider>
    </div>
  );
};

export default LessonListSideBar;
