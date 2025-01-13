import React, { FC, ReactNode, useEffect, useState } from "react";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IResourceDetail } from "@/lib/types/learn";
import { Dropdown, Flex, MenuProps, Modal, Popconfirm } from "antd";
import styles from "@/styles/Curriculum.module.scss";
import SvgIcons from "@/components/SvgIcons";
import { ResourceContentType, StateType } from "@prisma/client";
import { postFetch } from "@/services/request";

const SortableItem: FC<{
  title: string;
  icon: ReactNode;
  lesson: IResourceDetail;
  id: number;
  deleteRes: (id: number) => void;
  updateResState: (id: number, state: string, notifyStudent: boolean) => void;
  onEditResource: (id: number, contetn: ResourceContentType) => void;
  chapterId: number;
  state: string;
}> = ({ title, lesson, id, deleteRes, updateResState, onEditResource, chapterId, state, icon }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [modal, contextHolder] = Modal.useModal();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const dropdownMenu: MenuProps["items"] = [
    {
      key: "1",
      label: "Edit",
      onClick: () => {
        onEditResource(lesson.resourceId, lesson.contentType as ResourceContentType);
        setTimeout(() => {}, 500);
      },
    },

    {
      key: "2",

      label: (
        <Popconfirm
          title={`Delete the Lesson`}
          description={`Are you sure to delete this Lesson?`}
          onConfirm={() => {
            deleteRes(lesson.resourceId);
          }}
          okText="Yes"
          cancelText="No"
        >
          Delete
        </Popconfirm>
      ),
    },
  ];

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Flex justify="space-between" align="center">
        {contextHolder}
        <Flex align="center" gap={5}>
          <i
            {...listeners}
            onMouseOver={() => setDragActive(true)}
            onMouseLeave={() => setDragActive(false)}
            className={dragActive ? styles.activeDrag : styles.inActiveDrag}
          >
            {SvgIcons.verticalAdjustment}
          </i>

          <Flex gap={10} align="center">
            <i style={{ lineHeight: 0, color: "var(--font-secondary)", fontSize: 18 }}>{icon}</i>
            <div style={{ cursor: "pointer" }}> {title}</div>
          </Flex>
        </Flex>
        <div>
          <Flex align="center" gap={10}>
            <Dropdown.Button
              className={state === "Draft" ? styles.draft_btn : styles.publish_btn}
              icon={SvgIcons.chevronDown}
              menu={{
                items: [
                  {
                    key: 1,
                    label: state === "Published" ? "Draft" : "Published",
                    onClick: () => {
                      state === "Published" || lesson.contentType === ResourceContentType.Assignment
                        ? updateResState(
                            lesson.resourceId,
                            state === "Published" ? StateType.DRAFT : StateType.ACTIVE,
                            false
                          )
                        : modal[lesson.isStudentNotified ? "success" : "confirm"]({
                            title: "Email Notification",
                            content: lesson.isStudentNotified ? "Already notified" : "Do you want to Notify student",
                            okText: lesson.isStudentNotified ? "OK" : "Yes",
                            cancelText: "No",

                            onOk: () => {
                              updateResState(
                                lesson.resourceId,
                                state === "Published" ? StateType.DRAFT : StateType.ACTIVE,
                                lesson.contentType === ResourceContentType.Video && !lesson.isStudentNotified
                                  ? true
                                  : false
                              );
                            },

                            onCancel: () => {
                              updateResState(
                                lesson.resourceId,
                                state === "Published" ? StateType.DRAFT : StateType.ACTIVE,
                                lesson.isStudentNotified
                              );
                            },
                          });
                    },
                  },
                ],
              }}
            >
              {state}
            </Dropdown.Button>
            <div>
              <Dropdown menu={{ items: dropdownMenu }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
                <div style={{ rotate: "90deg" }}>{SvgIcons.threeDots}</div>
              </Dropdown>
            </div>
          </Flex>
        </div>
      </Flex>
    </div>
  );
};

const ChapterItem: FC<{
  lessons: IResourceDetail[];

  deleteRes: (id: number) => void;
  updateResState: (id: number, state: string, notifyStudent: boolean) => void;
  onEditResource: (id: number, contetn: ResourceContentType) => void;
  chapterId: number;
}> = ({ lessons, deleteRes, updateResState, onEditResource, chapterId }) => {
  const [items, setItems] = useState<IResourceDetail[]>(lessons);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.indexOf(prevItems.find((f) => f.sequenceId === active.id) as any);
        const newIndex = prevItems.indexOf(prevItems.find((f) => f.sequenceId === over?.id) as any);
        let newArray = arrayMove(prevItems, oldIndex, newIndex);
        postFetch(
          {
            data: newArray.map((l, i) => {
              return {
                resourceId: Number(l.resourceId),
                updatedSeq: Number(i + 1),
              };
            }),
          },
          "/api/v1/resource/updateSequenceId"
        );

        return newArray;
      });
    }
  };

  useEffect(() => {
    setItems(lessons);
  }, [lessons]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item.sequenceId)} strategy={verticalListSortingStrategy}>
        {items.map((item, i) => (
          <div className={styles.resContainer} key={i}>
            <SortableItem
              lesson={item}
              key={item.resourceId}
              title={item.name}
              id={item.sequenceId}
              onEditResource={onEditResource}
              chapterId={chapterId}
              updateResState={updateResState}
              deleteRes={deleteRes}
              state={item.state === "ACTIVE" ? "Published" : "Draft"}
              icon={item.contentType === "Video" ? SvgIcons.playBtn : SvgIcons.file}
            />
          </div>
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default ChapterItem;
