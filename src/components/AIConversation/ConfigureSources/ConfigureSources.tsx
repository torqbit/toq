import { Button, Flex, Input, message, Modal, Popconfirm, Segmented, Space, Table, Tabs, Tag, Tooltip } from "antd";
import React, { FC, useEffect, useState } from "react";
import styles from "@/styles/AIChat.module.scss";
import aiKhowledgeService, { IAddSources } from "@/services/KnowledgeService";
import DocumentAndSiteUrl from "./DocumentAndSiteUrl";
import { PlusOutlined } from "@ant-design/icons";
import { KnowledgeSource, KnowledgeSourceType } from "@prisma/client";
import SvgIcons from "@/components/SvgIcons";
import { bytesToSize } from "@/services/helper";

function flattenObjectArrays(obj: Record<string, IAddSources[]>): IAddSources[] {
  return Object.values(obj).flat();
}

const getSourcePlaceholer = (sourceType: KnowledgeSourceType) => {
  switch (sourceType) {
    case KnowledgeSourceType.SITEMAP:
      return "https://mysite.com/sitemap.xml";
    case KnowledgeSourceType.URL:
      return "https://mysite.com/";
    case KnowledgeSourceType.DOCS_WEB_URL:
      return "https://docs.mysite.com";
    default:
      return "Enter link";
  }
};

const messageDeleteKey = "deleting";

const ConfigureSources: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [docsUrl, setDocsUrl] = useState<string>("");
  const [messageAPI, contextHolder] = message.useMessage();
  const [modalAPI, contextModalHolder] = Modal.useModal();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [addSourceLoading, setAddSourceLoading] = React.useState<boolean>(false);
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [sourceType, setSourceType] = React.useState<KnowledgeSourceType>(KnowledgeSourceType.URL);
  const [sourceId, setSourceId] = useState<string>("");
  const [selectedSource, setSelectedSource] = React.useState<any>({}); // Add this state variable
  const [planUsage, setPlanUsage] = React.useState<{ allowed: number; used: number }>();
  const [sourceList, setSourceList] = React.useState<KnowledgeSource[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [total, setTotal] = React.useState<number>(0);

  const deleteKnowledgeSource = async (sourceId: string) => {
    messageAPI.open({
      key: messageDeleteKey,
      type: "loading",
      content: "Deleting please wait...",
    });
    aiKhowledgeService.deleteKnowledgeSource(
      sourceId,
      (res) => {
        messageAPI.open({
          key: messageDeleteKey,
          type: "success",
          content: "Source deleted successfully",
          duration: 2,
        });
        setRefresh(!refresh);
      },
      (error) => {
        messageAPI.open({
          key: messageDeleteKey,
          type: "error",
          content: "Failed to delete source",
          duration: 2,
        });
      }
    );
  };
  const getKnowledgeSourceList = async (id: string) => {
    aiKhowledgeService.getSourceById(
      id,
      pageSize,
      page,
      (res) => {
        setSourceList(res);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        messageAPI.error(error);
      }
    );
  };

  useEffect(() => {
    if (sourceId) {
      getKnowledgeSourceList(sourceId);
    }
  }, [page, pageSize, sourceId]);

  const onStartCrawlingUrl = async () => {
    if (!docsUrl) {
      return messageAPI.open({
        type: "error",
        content: "Please enter a valid URL",
      });
    }
    // Validate URL
    try {
      new URL(docsUrl);
    } catch {
      return messageAPI.open({
        type: "error",
        content: "Invalid URL format. Please enter a valid URL",
      });
    }
    setLoading(true);
    aiKhowledgeService.addKnowledgeSource(
      { sourceUrl: docsUrl, sourceType: sourceType },
      (res) => {
        setSourceId(res.sourceId);
        setTotal(res.urlsCount);
        setLoading(false);
        if (
          (res.sourceId && sourceType === KnowledgeSourceType.SITEMAP) ||
          sourceType === KnowledgeSourceType.DOCS_WEB_URL
        ) {
          getKnowledgeSourceList(res.sourceId);
          messageAPI.open({
            type: "success",
            content: "URLs extracted from the source URL.",
          });
        } else if (sourceType === KnowledgeSourceType.URL) {
          handleCancel();
        }
        setRefresh(!refresh);
      },
      (error) => {
        setLoading(false);
        messageAPI.open({
          type: "error",
          content: error,
        });
      }
    );
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSourceId("");
    setSourceList([]);
    setDocsUrl("");
  };

  useEffect(() => {
    console.log(planUsage);
  }, [planUsage]);

  const onReEmbedding = async (sourceUrl: string) => {
    setLoading(true);
    aiKhowledgeService.addSingleSourceKnowlede(
      sourceUrl,
      (res) => {
        messageAPI.open({
          type: "success",
          content: "Extracting data from the source URL. Please wait and refresh after a few minutes.",
        });

        setIsFetching(true);
      },
      (error) => {
        setLoading(false);
        messageAPI.open({
          type: "error",
          content: "Error extracting data from the source URL",
        });
      }
    );
  };

  const optionUrlType = [
    {
      label: "Single link",
      value: "URL",
    },
    {
      label: "Sitemap",
      value: "SITEMAP",
    },
    {
      label: "Docs website",
      value: "DOCS_WEB_URL",
    },
  ];

  const columns: any = [
    {
      title: "Links Discovered",
      dataIndex: "sourceUrl",
      key: "createdAt",
    },
  ];

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    const selectedUrls = sourceList.filter((item) => newSelectedRowKeys?.includes(item.id));
    const sourceLinks = selectedUrls.map((item) => ({ url: item?.sourceUrl as string, sourceId: item.id }));
    setSelectedSource({ ...selectedSource, [`${page}`]: sourceLinks });
  };

  const onClickAddSource = () => {
    if (flattenObjectArrays(selectedSource).length > 0) {
      setAddSourceLoading(true);
      aiKhowledgeService.addSources(
        sourceId,
        flattenObjectArrays(selectedSource),
        (res) => {
          messageAPI.open({
            type: "success",
            content: "Source added successfully",
          });
          setRefresh(!refresh);
          setIsModalOpen(false);
          setSelectedSource({});
          setAddSourceLoading(false);
          setSourceId("");
          setSourceList([]);
          setLoading(false);
        },
        (error) => {
          setAddSourceLoading(false);
          messageAPI.open({
            type: "error",
            content: "Error adding source",
          });
        }
      );
    }
  };

  const updatePlan = (allowed: number, used: number) => {
    setPlanUsage({ allowed, used });
  };

  const onDiscardSrouces = () => {
    aiKhowledgeService.discardDiscoveredSrouces(
      sourceId,
      (res) => {
        messageAPI.open({
          type: "success",
          content: "Source discarded successfully",
        });
        setRefresh(!refresh);
        setSelectedSource({});
        setSourceId("");
        setSourceList([]);
        setDocsUrl("");
      },
      (error) => {
        messageAPI.open({
          type: "error",
          content: "Error discarding source",
        });
      }
    );
  };

  return (
    <section>
      {contextHolder}
      {contextModalHolder}
      <Tabs
        tabBarGutter={30}
        tabBarStyle={{ marginBottom: 10 }}
        items={[
          {
            label: "Websites",
            key: "1",
            children: (
              <DocumentAndSiteUrl
                isFetching={isFetching}
                refresh={refresh}
                deleteKnowledgeSource={deleteKnowledgeSource}
                onUpdatePlanUsage={updatePlan}
                onReEmbedding={onReEmbedding}
                onFetching={(value) => {
                  setIsFetching(value);
                  setDocsUrl("");
                }}
                onModalClose={() => setIsModalOpen(false)}
              />
            ),
          },
          {
            label: "Files",
            key: "2",
            disabled: true,
          },
        ]}
        tabBarExtraContent={
          <Space size="small">
            <div>
              {planUsage && planUsage.allowed > 0 && (
                <>
                  {bytesToSize(planUsage.used)} of {bytesToSize(planUsage.allowed)} used
                </>
              )}
            </div>
            <Button size="middle" type="default" onClick={() => setRefresh(!refresh)}>
              Refresh
            </Button>
            <Button size="middle" type="primary" onClick={showModal}>
              Add a Source
            </Button>
          </Space>
        }
        onChange={() => {}}
      />

      <Modal
        style={{
          padding: "10px 24px",
        }}
        width={700}
        closeIcon={null}
        styles={{
          header: {
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600,
          },
        }}
        title={
          !sourceId ? (
            <Flex
              style={{
                borderBottom: "1px solid var(--border-color)",
                padding: "0px 10px 10px 10px",
                margin: "-10px -20px 0px -20px",
              }}
              align="center"
              justify="space-between"
            >
              <div></div>
              Add Source
              <i
                onClick={handleCancel}
                style={{ fontSize: 18, lineHeight: 0, color: "var(--font-primary)", cursor: "pointer" }}
              >
                {SvgIcons.xMark}
              </i>
            </Flex>
          ) : (
            <Flex
              style={{
                borderBottom: "1px solid var(--border-color)",
                padding: "0px 10px 10px 10px",
                margin: "-10px -20px 0px -20px",
              }}
              align="center"
              justify="space-between"
            >
              <i
                onClick={() => {
                  modalAPI.confirm({
                    title: "Are you sure want to discard the discovered links?",
                    okText: "Discard",
                    cancelText: "Cancel",
                    onOk: () => onDiscardSrouces(),
                    footer: (_, { OkBtn, CancelBtn }) => (
                      <>
                        <CancelBtn />
                        <OkBtn />
                      </>
                    ),
                  });
                }}
                style={{ lineHeight: 0, fontSize: 18, color: "var(--font-primary)", cursor: "pointer" }}
              >
                {SvgIcons.arrowLeft}
              </i>

              <span>Choose Links</span>

              <Button
                styles={{ icon: { lineHeight: 0 } }}
                loading={addSourceLoading}
                disabled={flattenObjectArrays(selectedSource)?.length === 0}
                onClick={onClickAddSource}
                type="primary"
              >
                Add{" "}
                {flattenObjectArrays(selectedSource)?.length > 0 && (
                  <span>{flattenObjectArrays(selectedSource)?.length} links</span>
                )}
              </Button>
            </Flex>
          )
        }
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        centered
        maskClosable={false}
      >
        {!sourceId && sourceList?.length === 0 ? (
          <Flex align="center" vertical>
            <div className={styles.document_process_container}>
              <Space direction="vertical" style={{ width: "100%" }} size="large">
                <Segmented
                  value={sourceType}
                  onChange={(v) => {
                    setDocsUrl("");
                    setSourceType(v as KnowledgeSourceType);
                  }}
                  options={optionUrlType}
                  block
                />
                <div>
                  <div style={{ marginBottom: 8, fontSize: 16 }}>
                    Enter the {optionUrlType.find((u) => u.value === sourceType)?.label}
                  </div>
                  <Input
                    placeholder={getSourcePlaceholer(sourceType)}
                    value={docsUrl}
                    onChange={(e) => setDocsUrl(e.target.value)}
                    className={styles.input_url}
                    disabled={loading}
                  />
                </div>
                <Button
                  type="primary"
                  className={styles.start_process_btn}
                  loading={loading}
                  onClick={onStartCrawlingUrl}
                >
                  {sourceType === KnowledgeSourceType.URL ? " Add Link" : "Extract Links"}
                </Button>
              </Space>
            </div>
          </Flex>
        ) : (
          <Flex vertical>
            <Table
              columns={columns}
              size="small"
              dataSource={sourceList}
              showHeader
              rowSelection={{
                selectedRowKeys: selectedSource[`${page}`]?.map((item: IAddSources) => item.sourceId),
                onChange: onSelectChange,
              }}
              pagination={{
                current: page,
                pageSize: pageSize,
                total: total,

                showTotal: (total, range) => (
                  <Space>
                    <div>
                      {range[0]}-{range[1]} of {total} items
                    </div>
                  </Space>
                ),
                showSizeChanger: false,

                onChange: (page, pageSize) => {
                  setPage(page);
                  setPageSize(pageSize);
                },
              }}
              rowKey="id"
              loading={loading}
              style={{ marginTop: 16 }}
            />
          </Flex>
        )}
      </Modal>
    </section>
  );
};

export default ConfigureSources;
