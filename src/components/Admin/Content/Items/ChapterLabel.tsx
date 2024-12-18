import SvgIcons from "@/components/SvgIcons";
import styles from "@/styles/Curriculum.module.scss";
import { ResourceContentType } from "@prisma/client";
import { Dropdown, Flex, MenuProps, Popconfirm } from "antd";
import { FC, ReactNode } from "react";

const ChapterLabel: FC<{
  title: string;
  id: number;
  onChange: (key: string | string[]) => void;
  onAddResource: (id: number, content: ResourceContentType) => void;
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
  return (
    <div className={styles.labelContainer}>
      <Flex justify="space-between" align="center">
        <div style={{ cursor: "pointer" }}>
          <Flex gap={10} align="center" onClick={() => onChange(keyValue)}>
            {icon}
            <div> {title}</div>
          </Flex>
        </div>
        <div>
          <Flex align="center" gap={10}>
            <div>
              <Dropdown.Button
                icon={SvgIcons.chevronDown}
                menu={{
                  items: [
                    {
                      key: 1,
                      label: "Video",
                      onClick: () => {
                        onAddResource(id, "Video");
                      },
                    },
                    {
                      key: 2,
                      label: "Assignment",
                      onClick: () => {
                        onAddResource(id, "Assignment");
                      },
                    },
                  ],
                }}
              >
                Add Lesson
              </Dropdown.Button>
            </div>
            <Dropdown.Button
              className={state === "Draft" ? styles.draft_btn : styles.publish_btn}
              icon={SvgIcons.chevronDown}
              menu={{
                items: [
                  {
                    key: 1,
                    label: state === "Published" ? "Draft" : "Published",
                    onClick: () => {
                      updateState(id, state === "Published" ? "DRAFT" : "ACTIVE");
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

export default ChapterLabel;
