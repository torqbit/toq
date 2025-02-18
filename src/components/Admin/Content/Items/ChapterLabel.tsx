import SvgIcons from "@/components/SvgIcons";
import styles from "@/styles/Curriculum.module.scss";
import { AssignmentType } from "@/types/courses/assignment";
import { ResourceContentType } from "@prisma/client";
import { Dropdown, Flex, MenuProps, Popconfirm, Tag } from "antd";
import { FC, ReactNode } from "react";

const ChapterLabel: FC<{
  title: string;
  id: number;
  onChange: (key: string | string[]) => void;
  onAddResource: (id: number, content: ResourceContentType, assignmentType?: AssignmentType) => void;
  onEditChapter: (id: number, content: ResourceContentType) => void;
  icon: ReactNode;
  state: string;
  updateState: (id: number, state: string) => void;
  contentType?: ResourceContentType;
  keyValue: string;
  deleteItem: (id: number) => void;
}> = ({
  title,
  onChange,
  onEditChapter,
  icon,
  onAddResource,
  state,
  keyValue,
  deleteItem,
  id,
  updateState,
  contentType,
}) => {
  const dropdownMenu: MenuProps["items"] = [
    {
      key: "1",
      label: "Edit",
      onClick: () => {
        onEditChapter(id, contentType as ResourceContentType);
      },
    },

    {
      key: "2",
      label: state === "Published" ? "Move to Draft" : "Publish",
      onClick: () => {
        updateState(id, state === "Published" ? "DRAFT" : "ACTIVE");
      },
    },

    {
      key: "3",
      label: (
        <Popconfirm
          title={`Delete the Chapter`}
          description={`Are you sure to delete this Chapter?`}
          onConfirm={() => {
            deleteItem(id);
          }}
          okText="Yes"
          cancelText="No"
        >
          Delete
        </Popconfirm>
      ),
    },
  ];

  const lessonDropdownMenu: MenuProps["items"] = [
    {
      key: "1",
      label: "Video",
      onClick: () => {
        onAddResource(id, "Video");
      },
    },

    {
      key: "2",
      label: "Assignment",
      onClick: () => {
        onAddResource(id, ResourceContentType.Assignment, AssignmentType.SUBJECTIVE);
      },
    },

    {
      key: "3",
      label: "Quiz",
      onClick: () => {
        onAddResource(id, ResourceContentType.Assignment, AssignmentType.MCQ);
      },
    },
  ];
  return (
    <div className={styles.labelContainer}>
      <Flex justify="space-between" align="center">
        <div style={{ cursor: "pointer" }}>
          <Flex gap={10} align="center" onClick={() => onChange(keyValue)}>
            <i style={{ lineHeight: 0, fontSize: 18, color: "var(--font-secondary)" }}>{icon}</i>
            <div> {title == "" ? "Untitled" : title}</div>
          </Flex>
        </div>
        <div>
          <Flex align="center" gap={10}>
            <div>
              <Dropdown
                trigger={["click"]}
                menu={{ items: lessonDropdownMenu }}
                placement="bottomRight"
                arrow={{ pointAtCenter: true }}
              >
                <Flex
                  align="center"
                  gap={10}
                  style={{
                    border: "1px solid var(--border-color)",
                    padding: "5px 10px",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Add Lesson
                  <i style={{ fontSize: 18, lineHeight: 0 }}>{SvgIcons.chevronDownOutline}</i>
                </Flex>
              </Dropdown>
            </div>

            {state !== "Published" && (
              <Tag color={"warning"} style={{ padding: "5px 10px", backgroundColor: "var(--bg-secondary)" }}>
                Draft
              </Tag>
            )}
            <div>
              <Dropdown
                trigger={["click"]}
                menu={{ items: dropdownMenu }}
                placement="bottomRight"
                arrow={{ pointAtCenter: true }}
              >
                <div style={{ rotate: "90deg" }}>{SvgIcons.threeDots}</div>
              </Dropdown>
            </div>
          </Flex>
        </div>
      </Flex>
    </div>
  );
};

export default ChapterLabel;
