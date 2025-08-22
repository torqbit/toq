import { ExclamationCircleOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Badge,
  BadgeProps,
  Button,
  Flex,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Tooltip,
} from "antd";
import React, { FC, useState } from "react";
import styles from "@/styles/AIChat.module.scss";
import aiKhowledgeService, { IExtendedKnowledgeSource } from "@/services/KnowledgeService";
import { KnowledgeSourceType, SourceStatus } from "@prisma/client";
import moment from "moment";
import SvgIcons from "../../SvgIcons";
import { Dropdown, Menu } from "antd";
import { convertSize } from "@/lib/utils";
import { PresetStatusColorType } from "antd/es/_util/colors";

interface IDocumentAndSiteUrl {
  deleteKnowledgeSource: (sourceId: string) => void;
  onReEmbedding: (sourceUrl: string) => void;
  onFetching: (v: boolean) => void;
  onUpdatePlanUsage: (allowed: number, used: number) => void;
  refresh: boolean;
  isFetching: boolean;
  onModalClose: () => void;
}

const getSourceIcon = (source: KnowledgeSourceType) => {
  switch (source) {
    case KnowledgeSourceType.SITEMAP:
      return SvgIcons.globe;
    case KnowledgeSourceType.URL:
      return SvgIcons.link;
    case KnowledgeSourceType.DOCS_WEB_URL:
      return SvgIcons.docs;
    default:
      return SvgIcons.file;
  }
};

const getSourceStatus = (status: SourceStatus): { status: PresetStatusColorType; text: string } => {
  switch (status) {
    case SourceStatus.PROCESSING:
      return { status: "processing", text: "Processing" };
    case SourceStatus.ADDED:
      return { status: "success", text: "Added" };
    case SourceStatus.FAILED:
      return { status: "error", text: "Failed" };
    case SourceStatus.FETCHED:
      return { status: "warning", text: "Fetched" };
    case SourceStatus.NEW:
      return { status: "default", text: "New" };
    default:
      return { status: "default", text: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() };
  }
};

const DocumentAndSiteUrl: FC<IDocumentAndSiteUrl> = ({
  deleteKnowledgeSource,
  onReEmbedding,
  refresh,
  isFetching,
  onFetching,
  onUpdatePlanUsage,
  onModalClose,
}) => {
  const [messageAPI, contextHolder] = message.useMessage();
  const [chatSourcelist, setChatSourcelist] = React.useState<IExtendedKnowledgeSource[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [total, setTotal] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = React.useState<boolean>(false);
  const [statusFilter, setStatusFilter] = React.useState<string>("");
  const [modal, contextModalHolder] = Modal.useModal();
  const getKnowledgeSourceList = async () => {
    setFetchLoading(true);
    aiKhowledgeService.getChatSource(
      page,
      pageSize,
      statusFilter,
      (res) => {
        setChatSourcelist(res.sourceList);
        setTotal(res.totalSourceList);
        if (isFetching && res.sourceList.length > 0) {
          onFetching(false);
          onModalClose();
          setLoading(false);
        }
        setFetchLoading(false);
      },
      (error) => {
        messageAPI.error(error);
      }
    );
  };

  React.useEffect(() => {
    getKnowledgeSourceList();
  }, [page, pageSize, statusFilter, refresh]);

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let startTime = Date.now();
    const THREE_MINUTES = 3 * 60 * 1000; // 3 minutes in milliseconds

    const fetchData = () => {
      if (isFetching) {
        if (Date.now() - startTime < THREE_MINUTES) {
          getKnowledgeSourceList();
          timeoutId = setTimeout(fetchData, 5000); // Call every 5 seconds
        }
      }
    };

    if (isFetching) {
      fetchData();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isFetching]);

  const columns: any = [
    {
      title: "Source",
      dataIndex: "source",
      key: "sourceUrl",
      render: (text: string, record: IExtendedKnowledgeSource) => (
        <a href={record?.sourceUrl!} target="_blank" rel="noopener noreferrer" style={{ color: "unset" }}>
          <Space align="start" size={8}>
            <div>{getSourceIcon(record.sourceType)}</div>
            <Space direction="vertical" size={0}>
              <div>{record?.sourceUrl}</div>
              <Space align="center">
                <span>
                  {record.addedLinks}/{record.totalLinks} links
                </span>

                {record.status === SourceStatus.ADDED && (
                  <>
                    <span>{SvgIcons.dot}</span>
                    <span>{convertSize(record.sourceSize)}</span>
                  </>
                )}
              </Space>
            </Space>
          </Space>
        </a>
      ),
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text: string) => <span>{moment(text).fromNow()}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: SourceStatus, record: IExtendedKnowledgeSource) => {
        return (
          <div className={styles.source_status_badge}>
            <Tooltip title={status === SourceStatus.FAILED ? record?.errorMessage : ""}>
              <Badge
                className={styles.source_status_badge}
                status={getSourceStatus(record.status).status}
                text={getSourceStatus(status).text}
              />
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: string, record: IExtendedKnowledgeSource) => {
        return (
          <Dropdown
            menu={{
              items: [
                // {
                //   key: "retry",
                //   label: "Re-fetch",
                //   onClick: () => onReEmbedding(record.sourceUrl!),
                // },
                {
                  key: "delete",
                  label: (
                    <span
                      onClick={() => {
                        modal.confirm({
                          title: "Confirm",
                          icon: <ExclamationCircleOutlined />,
                          content: "Are you sure you want to delete this source ?",
                          onOk: () => deleteKnowledgeSource(record.id),
                          okText: "Yes",
                          cancelText: "No",
                        });
                      }}
                    >
                      Delete
                    </span>
                  ),
                  danger: true,
                },
              ],
            }}
            trigger={["click"]}
          >
            {SvgIcons.threeDots}
          </Dropdown>
        );
      },
    },
  ];

  return (
    <section>
      {contextHolder}
      {contextModalHolder}
      <Flex align="start" justify="space-between">
        <p className={styles.sub_heading}>
          Add or remove all sources of information about your product, in order to answer the queries of customers
        </p>
      </Flex>

      <div>
        <Table
          columns={columns}
          size="middle"
          dataSource={chatSourcelist}
          className={styles.table__sources}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          rowKey="id"
          loading={fetchLoading}
          style={{ marginTop: 16 }}
        />
      </div>
    </section>
  );
};

export default DocumentAndSiteUrl;
