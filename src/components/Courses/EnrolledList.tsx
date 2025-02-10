import ProgramService from "@/services/ProgramService";
import { IEnrolledListResponse } from "@/types/courses/Course";
import { Dropdown, message, Progress, Skeleton, Table } from "antd";
import { FC, useEffect, useState } from "react";
import SvgIcons from "../SvgIcons";

const EnrolledList: FC<{ courseId: number }> = ({ courseId }) => {
  const [list, setList] = useState<IEnrolledListResponse[]>([]);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  const [messagApi, contextHolder] = message.useMessage();
  const columns: any[] = [
    {
      title: "NAME",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "DATE ENROLLED",
      dataIndex: "dateJoined",
      key: "dateJoined",
    },
    {
      title: "LAST ACTIVITY",
      dataIndex: "lastActivity",
      key: "lastActivity",
    },
    {
      title: "COURSE PROGRESS",
      dataIndex: "progress",
      align: "center",
      key: "progress",
      render: (u: number) => {
        return <Progress status="normal" trailColor="var(--bg-secondary)" percent={u} />;
      },
    },

    // {
    //   title: "Action",
    //   align: "center",
    //   render: (u: IEnrolledListResponse) => {
    //     return (
    //       <Dropdown
    //         menu={{
    //           items: [
    //             {
    //               key: "1",
    //               label: "Edit",
    //               onClick: () => {},
    //             },
    //             {
    //               key: "2",
    //               label: "Delete",
    //             },
    //           ],
    //         }}
    //         placement="bottomRight"
    //       >
    //         <i style={{ fontSize: 18, lineHeight: 0, color: "var(--font-secondary)" }}>{SvgIcons.threeDots}</i>
    //       </Dropdown>
    //     );
    //   },
    //   key: "action",
    // },
  ];

  const getEnrollList = (courseId: number, limit: number, offSet: number) => {
    setListLoading(true);
    ProgramService.getEnrolledList(courseId, limit, offSet, (result) => {
      if (result.success && result.body) {
        setList(result.body.list);
        setListLoading(false);
        setTotal(result.body.total);
      } else {
        setList([]);
        messagApi.error(result.error);
        setListLoading(false);
        setTotal(0);
      }
    });
  };
  useEffect(() => {
    getEnrollList(courseId, 10, 0);
  }, []);

  return (
    <>
      {contextHolder}
      {listLoading ? (
        <Skeleton.Button />
      ) : (
        <div
          style={{
            backgroundColor: "var(--bg-primary)",
            width: "100%",
            padding: 10,
            display: "flex",
            alignItems: "center",
            gap: 5,
            borderTopRightRadius: 4,
            borderTopLeftRadius: 4,
          }}
        >
          {total} <h4 style={{ margin: 0 }}>{total > 1 ? "Members" : "Member"}</h4>
        </div>
      )}
      <Table
        pagination={{
          onChange: (pageNumber) => {
            return getEnrollList(courseId, 10, pageNumber * 5 - 5);
          },

          total: 10,
        }}
        style={{ borderTopRightRadius: 0, borderTopLeftRadius: 0 }}
        dataSource={list}
        columns={columns}
        loading={listLoading}
      />
    </>
  );
};
export default EnrolledList;
