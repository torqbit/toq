import SvgIcons from "@/components/SvgIcons";
import { ChapterDetail } from "@/types/courses/Course";
import styles from "@/styles/Curriculum.module.scss";
import { ResourceContentType } from "@prisma/client";
import { Button, Collapse, Flex, Popconfirm, Space, message } from "antd";
import { FC, useState } from "react";
import ProgramService from "@/services/ProgramService";
import ChapterLabel from "./Items/ChapterLabel";
import ChapterItem from "./Items/ChapterItem";

const Curriculum: FC<{
  chapters: ChapterDetail[];
  onDiscard: () => void;
  onRefresh: () => void;
  onEditResource: (id: number, content: ResourceContentType) => void;
  handleNewChapter: () => void;
  onAddResource: (id: number, content: ResourceContentType) => void;
  handleEditChapter: (chapterId: number) => void;
  deleteRes: (id: number) => void;
  onSave: (value: string) => void;
}> = ({
  onSave,
  chapters,
  onRefresh,
  handleNewChapter,
  onAddResource,
  handleEditChapter,
  deleteRes,
  onEditResource,
  onDiscard,
}) => {
  const [collapse, setCollapse] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const updateChapterState = (id: number, state: string) => {
    ProgramService.updateChapterState(
      id,
      state,
      (result) => {
        messageApi.success(result.message);

        onRefresh();
      },
      (error) => {}
    );
  };
  const updateResState = (id: number, state: string, notifyStudent: boolean) => {
    ProgramService.updateResState(
      id,
      state,
      notifyStudent,
      (result) => {
        messageApi.success(result.message);

        onRefresh();
      },
      (error) => {}
    );
  };

  const deleteChapter = (id: number) => {
    ProgramService.deleteChapter(
      id,
      (result) => {
        messageApi.success(result.message);
        onRefresh();
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };
  const onChange = (key: string | string[]) => {
    if (typeof key === "string" && activeCollapseKey.includes(key)) {
      let activeKeys = activeCollapseKey;

      setActiveCollapseKey(activeKeys.filter((item) => item !== key));
    } else {
      typeof key === "string" && setActiveCollapseKey([key]);
    }

    if (key.length === items.length) {
      setCollapse(false);
    } else if (key.length === 0) {
      setCollapse(true);
    }
  };

  const items = chapters.map((content, i) => {
    return {
      key: `${i + 1}`,
      label: (
        <ChapterLabel
          title={content.name}
          icon={SvgIcons.folder}
          keyValue={`${i + 1}`}
          deleteItem={deleteChapter}
          onEditChapter={handleEditChapter}
          updateState={updateChapterState}
          onAddResource={onAddResource}
          onChange={onChange}
          id={content.chapterId}
          state={content.state === "ACTIVE" ? "Published" : "Draft"}
        />
      ),

      children: (
        <>
          <ChapterItem
            lessons={content.resource}
            deleteRes={deleteRes}
            onEditResource={onEditResource}
            chapterId={content.chapterId}
            updateResState={updateResState}
          />
        </>
      ),

      showArrow: true,
    };
  });
  const [activeCollapseKey, setActiveCollapseKey] = useState<string[]>(items.map((item, i) => `${i + 1}`));

  return (
    <section className={styles.curriculum}>
      {contextHolder}
      <div className={styles.curriculum_container}>
        <Flex justify="space-between" align="center">
          <h1>Curriculum</h1>

          {chapters.length > 0 && (
            <Space>
              <Popconfirm
                title={`Delete this course`}
                description={`Are you sure to delete this entire course?`}
                onConfirm={() => onDiscard()}
                okText="Yes"
                cancelText="No"
              >
                <Button>Discard</Button>
              </Popconfirm>

              <Button
                type="primary"
                onClick={() => {
                  onRefresh();
                  onSave("3");
                }}
              >
                Save Curriculum <img style={{ marginLeft: 5 }} src="/img/program/arrow-right.png" alt="arrow" />
              </Button>
            </Space>
          )}
        </Flex>
      </div>
      <div>
        {chapters.length > 0 && (
          <Flex justify="space-between" align="center">
            <h4>{chapters.length ? chapters.length : 0} Chapters</h4>
            <Space>
              <Button
                className={styles.add_btn}
                onClick={() => {
                  handleNewChapter();
                }}
              >
                <i style={{ fontSize: 18, lineHeight: 0 }}>{SvgIcons.plusBtn}</i>
                <div> Add Chapter</div>
              </Button>

              {collapse || activeCollapseKey.length === 0 ? (
                <Button
                  className={styles.add_btn}
                  onClick={() => {
                    setActiveCollapseKey(items.map((item, i) => `${i + 1}`));
                    setCollapse(false);
                  }}
                >
                  <Flex align="center" justify="center" gap={10}>
                    {SvgIcons.barsArrowDown} Expand all
                  </Flex>
                </Button>
              ) : (
                <Button
                  className={styles.add_btn}
                  onClick={() => {
                    setActiveCollapseKey([]);
                    setCollapse(true);
                  }}
                >
                  <Flex align="center" justify="center" gap={10}>
                    {SvgIcons.barUpIcon} Collapse All
                  </Flex>
                </Button>
              )}
            </Space>
          </Flex>
        )}
      </div>
      {chapters.length > 0 ? (
        <div className={styles.chapter_list}>
          <Collapse
            destroyInactivePanel
            collapsible={"icon"}
            onChange={onChange}
            size="small"
            activeKey={activeCollapseKey}
            accordion={false}
            items={items.map((item, i) => {
              return {
                key: item.key,
                label: item.label,
                children: item.children,
                showArrow: false,
              };
            })}
          />
        </div>
      ) : (
        <div className={styles.no_chapter_btn}>
          <img src="/img/common/empty.svg" alt="" />
          <h4>No chapters were found</h4>
          <p>Start creating chapters and lessons to build your course curriculum</p>
          <Button onClick={() => handleNewChapter()} type="primary">
            Add Chapter
          </Button>
        </div>
      )}
    </section>
  );
};

export default Curriculum;
