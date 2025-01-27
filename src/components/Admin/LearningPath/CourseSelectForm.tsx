import React, { FC } from "react";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Flex, Select } from "antd";
import styles from "@/styles/Curriculum.module.scss";
import { ILearningCourseList } from "@/types/learingPath";
import SvgIcons from "@/components/SvgIcons";
import Link from "next/link";

const SortableItem: FC<{
  name: string;

  id: number;
  onRemove: (value: number) => void;
}> = ({ name, id, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Flex
        align="center"
        justify="space-between"
        style={{ padding: "5px 10px", backgroundColor: "var(--bg-secondary)", width: "100%" }}
      >
        <Flex gap={10} align="center" {...listeners}>
          <i style={{ fontSize: 18, color: "var(--font-secondary)", lineHeight: 0, cursor: "grab" }}>
            {SvgIcons.verticalAdjustment}
          </i>

          {name}
        </Flex>
        <i
          onClick={() => onRemove(id)}
          style={{ fontSize: 18, color: "var(--font-secondary)", lineHeight: 0, cursor: "pointer" }}
        >
          {SvgIcons.xMark}
        </i>
      </Flex>
    </div>
  );
};

const CourseSelectForm: FC<{
  courseList: ILearningCourseList[];
  items: ILearningCourseList[];
  onSelect: (value: string) => void;
  handleDragEnd: (value: DragEndEvent) => void;
  onRemove: (value: number) => void;
}> = ({ items, courseList, onSelect, handleDragEnd, onRemove }) => {
  return (
    <Flex vertical gap={10}>
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.courseId)} strategy={verticalListSortingStrategy}>
          <Flex vertical gap={10}>
            {items.map((item, i) => (
              <div className={styles.resContainer} key={i}>
                <SortableItem onRemove={onRemove} key={item.courseId} name={item.name || ""} id={item.courseId} />
              </div>
            ))}
          </Flex>
        </SortableContext>
      </DndContext>
      <Select style={{ width: 350 }} placeholder="Choose Courses" onSelect={onSelect}>
        {courseList.map((c, i) => {
          return (
            <Select.Option key={i} value={`${c.courseId}`}>
              {c.name}
            </Select.Option>
          );
        })}
      </Select>
      {courseList.length < 2 && <Link href={"/academy"}>Add Course</Link>}
    </Flex>
  );
};

export default CourseSelectForm;
