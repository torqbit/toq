import { FC, useEffect, useState } from "react";
import styles from "@/styles/Marketing/Blog/Blog.module.scss";
import {
  Button,
  Checkbox,
  DatePicker,
  Dropdown,
  Flex,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Radio,
  Select,
  Space,
  Tooltip,
  Upload,
  UploadProps,
  message,
} from "antd";
import ImgCrop from "antd-img-crop";
import { CaretDownOutlined, LoadingOutlined } from "@ant-design/icons";
import SvgIcons from "@/components/SvgIcons";
import { createSlug, getBase64 } from "@/lib/utils";
import { useRouter } from "next/router";
import { EventMode, Events, EventType, StateType } from "@prisma/client";
import TextEditor from "@/components/Editor/Quilljs/Editor";
import EventService, { IEventUpdate } from "@/services/EventService";
import { certificateConfig } from "@/lib/certificatesConfig";
import dayjs from "dayjs";
import { RangePickerProps } from "antd/es/date-picker";
const EventForm: FC<{ details?: Events }> = ({ details }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const router = useRouter();
  const [eventDetail, setEventDetail] = useState<Events | undefined>(details);
  const [eventBanner, setEventBanner] = useState<string | null | undefined>(details?.banner);
  const [state, setState] = useState<StateType>();
  const [eventBannerUploading, setEventBannerUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File>();
  const [loader, setLoader] = useState<{ discard: boolean; publish: boolean }>({
    discard: false,
    publish: false,
  });

  let eventTypeList = [EventType.WORKSHOP, EventType.TALK];
  let eventModeList = [EventMode.OFFLINE, EventMode.ONLINE];

  const initialValues = {
    title: eventDetail?.title,
    eventType: eventDetail?.eventType,
    eventMode: eventDetail?.eventMode,
    location: eventDetail?.location,
    startTime: eventDetail?.startTime === ("null" as any) ? null : dayjs(eventDetail?.startTime),
    endTime: eventDetail?.endTime === ("null" as any) ? null : dayjs(eventDetail?.endTime),
    registrationEndDate:
      eventDetail?.registrationEndDate === ("null" as any) ? null : dayjs(eventDetail?.registrationEndDate),
    certificate: eventDetail?.certificate,
    certificateTemplate: eventDetail?.certificateTemplate,
    eventLink: eventDetail?.eventLink,
    price: eventDetail?.price,
  };

  const handleEditorValue = (value: string) => {
    setEventDetail({ ...eventDetail, description: value } as Events);
  };
  const handleInstructionValue = (value: string) => {
    setEventDetail({ ...eventDetail, eventInstructions: value } as Events);
  };

  const uploadFile = async (file: any, title: string) => {
    if (file) {
      setFile(file);
      const base64 = await getBase64(file);
      setEventBannerUploading(true);
      setEventBanner(base64 as string);
      setEventBannerUploading(false);
    }
  };
  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      // setLoading(false);
    }
  };

  const onPostEvent = (state: StateType, exit?: boolean) => {
    setLoader({ ...loader, publish: true });

    let data: IEventUpdate = {
      ...form.getFieldsValue(),
      endTime: form.getFieldsValue().endTime.toISOString(),
      startTime: form.getFieldsValue().startTime.toISOString(),
      banner: eventDetail?.banner,
      description: eventDetail?.description,
      eventInstructions: eventDetail?.eventInstructions,
      certificate: eventDetail?.certificate,
      id: Number(router.query.eventId),
      state,
      slug: createSlug(form.getFieldsValue().title),
    };

    const formData = new FormData();
    formData.append("event", JSON.stringify(data));
    file && formData.append("file", file);

    EventService.updateEvent(
      formData,
      (result) => {
        messageApi.success(result.message);
        if (exit) {
          router.push("/admin/content");
        }
        setLoader({ ...loader, publish: false });
      },
      (error) => {
        messageApi.error(error);
        setLoader({ ...loader, publish: false });
      }
    );
  };

  const onDelete = (id: number) => {
    setLoader({ ...loader, discard: true });

    EventService.deleteEvent(
      id,
      (result) => {
        messageApi.success(result.message);
        router.push("/admin/content");
        setLoader({ ...loader, discard: false });
      },
      (error) => {
        messageApi.error(error);
        setLoader({ ...loader, discard: false });
      }
    );
  };

  const onCreateEvent = (state: StateType) => {
    setLoader({ ...loader, publish: true });

    let data: IEventUpdate = {
      ...form.getFieldsValue(),
      endTime: form.getFieldsValue().endTime.toISOString(),
      startTime: form.getFieldsValue().startTime.toISOString(),
      banner: eventDetail?.banner,
      description: eventDetail?.description,
      eventInstructions: eventDetail?.eventInstructions,
      certificate: eventDetail?.certificate,
      state,
      slug: createSlug(form.getFieldsValue().title),
    };

    const formData = new FormData();
    formData.append("event", JSON.stringify(data));
    file && formData.append("file", file);
    EventService.createEvent(
      formData,
      (result) => {
        messageApi.success(result.message);
        router.push(`/admin/content/`);
        setLoader({ ...loader, publish: false });
      },
      (error) => {
        messageApi.error(error);
        setLoader({ ...loader, publish: false });
      }
    );
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const disabledEndDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current.isBefore(form.getFieldsValue().startTime, "day");
  };

  return (
    <section className={styles.blogFormConatiner}>
      <Form
        form={form}
        layout="vertical"
        initialValues={router.query.eventId ? initialValues : {}}
        requiredMark={false}
        onFinish={() => {
          router.query.eventId ? onPostEvent(state as StateType, true) : onCreateEvent(state as StateType);
        }}
      >
        {contextHolder}

        <Flex className={styles.publishBtn} align="center" gap={10}>
          <Popconfirm
            title={router.query.eventId ? `Delete the event` : `Discard event`}
            description={
              router.query.eventId ? `Are you sure to delete this event?` : `Are you sure to discard this event?`
            }
            onConfirm={() =>
              router.query.eventId ? onDelete(Number(router.query.eventId)) : router.push("/admin/content")
            }
            okText="Yes"
            cancelText="No"
          >
            <Button loading={loader.discard}>Discard</Button>
          </Popconfirm>

          <Dropdown.Button
            loading={loader.publish}
            type="primary"
            onClick={() => {
              setState(StateType.DRAFT);
              form.submit();
            }}
            icon={SvgIcons.chevronDown}
            menu={{
              items: [
                {
                  key: 1,

                  label: "Publish",
                  onClick: () => {
                    setState(StateType.ACTIVE);
                    form.submit();
                  },
                },
              ],
            }}
          >
            Save as Draft
          </Dropdown.Button>
        </Flex>
        <Space direction="vertical" size={20}>
          <div className={styles.formContainer}>
            <Form.Item
              name="title"
              label={<span>Title</span>}
              rules={[
                {
                  required: true,
                  message: "Required title",
                },
              ]}
            >
              <Input
                onChange={(e) => setEventDetail({ ...eventDetail, title: e.target.value } as Events)}
                placeholder={"Set the title of the Event"}
              />
            </Form.Item>
            <Form.Item className={styles.video_container} label="Add  banner">
              <ImgCrop fillColor={"transparent"} rotationSlider aspect={16 / 9}>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className={styles.upload__thumbnail}
                  showUploadList={false}
                  style={{ width: 800, height: 400 }}
                  beforeUpload={(file) => {
                    const bannerName = createSlug(String(eventDetail?.title));
                    uploadFile(file, `${bannerName}_blog_banner`);
                  }}
                  onChange={handleChange}
                >
                  {eventBanner ? (
                    <>
                      <img style={{ borderRadius: 4, objectFit: "cover" }} src={eventBanner} />
                      <Tooltip title={`Upload event banner`}>
                        <div className={styles.camera_btn_img}>
                          {eventBannerUploading && eventBanner ? <LoadingOutlined /> : SvgIcons.camera}
                        </div>
                      </Tooltip>
                      <div className={styles.bannerStatus}>{eventBannerUploading && "Uploading"}</div>
                    </>
                  ) : (
                    <button
                      className={styles.upload_img_button}
                      style={{ border: 0, background: "none", width: 800, height: 400 }}
                      type="button"
                    >
                      {eventBannerUploading ? <LoadingOutlined /> : SvgIcons.uploadIcon}
                      {!eventBannerUploading ? (
                        <div style={{ marginTop: 8 }}>Upload banner</div>
                      ) : (
                        <div style={{ color: "#000" }}>{eventBannerUploading && "Uploading"}</div>
                      )}
                    </button>
                  )}
                </Upload>
              </ImgCrop>
            </Form.Item>
          </div>

          <Flex align="center" gap={40}>
            <Form.Item
              name="eventType"
              label={<span>Event Type</span>}
              rules={[
                {
                  required: true,
                  message: "Required event type",
                },
              ]}
            >
              <Select
                suffixIcon={<CaretDownOutlined />}
                style={{ width: 170 }}
                allowClear={{ clearIcon: <i>{SvgIcons.cross}</i> }}
                placeholder="Select event type"
                defaultValue={eventDetail?.eventType}
              >
                {eventTypeList.map((type, i) => {
                  return (
                    <Select.Option key={i} value={type}>
                      {type}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item
              name="eventMode"
              label={<span>Event Mode</span>}
              rules={[
                {
                  required: true,
                  message: "Required event mode",
                },
              ]}
            >
              <Select
                suffixIcon={<CaretDownOutlined />}
                style={{ width: 170 }}
                allowClear={{ clearIcon: <i>{SvgIcons.cross}</i> }}
                placeholder="Select event mode"
                defaultValue={eventDetail?.eventMode}
                onChange={(value) => {
                  //   setEventMode(value);
                  setEventDetail({ ...eventDetail, eventMode: value } as Events);
                }}
              >
                {eventModeList.map((mode, i) => {
                  return (
                    <Select.Option key={i} value={mode}>
                      {mode}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Flex>

          <Flex align="center" gap={40}>
            <Form.Item
              name="startTime"
              label={<span>Start Time</span>}
              rules={[
                {
                  required: true,
                  message: "Required start time",
                },
              ]}
            >
              <DatePicker disabledDate={disabledDate} format={"YY/MM/DD HH:mm"} style={{ width: 170 }} showTime />
            </Form.Item>

            <Form.Item
              name="endTime"
              label="End Time"
              rules={[
                {
                  required: true,
                  message: "Required end time",
                },
              ]}
            >
              <DatePicker disabledDate={disabledEndDate} format={"YY/MM/DD HH:mm"} style={{ width: 170 }} showTime />
            </Form.Item>
          </Flex>

          <Flex align="" gap={40}>
            <Form.Item name="certificate">
              <Checkbox
                style={{ width: 170 }}
                title=" Certificate"
                checked={eventDetail?.certificate}
                onClick={(value) => {
                  setEventDetail({ ...eventDetail, certificate: !eventDetail?.certificate } as Events);
                }}
              >
                Issue Certificate
              </Checkbox>
            </Form.Item>

            <Form.Item name="certificateTemplate" label={<span>Certificate Template</span>}>
              <Select
                disabled={!eventDetail?.certificate}
                suffixIcon={<CaretDownOutlined />}
                style={{ width: 170 }}
                allowClear={{ clearIcon: <i>{SvgIcons.cross}</i> }}
                placeholder="Select certificate template"
                defaultValue={eventDetail?.certificateTemplate}
              >
                {certificateConfig.map((certificate, i) => {
                  return (
                    <Select.Option key={i} value={`${certificate.id}`}>
                      {certificate.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Flex>
          <Flex align="center" gap={40}>
            <Form.Item required name="price" label={<span>Price (in Rupee)</span>}>
              <InputNumber style={{ width: 170 }} type="number" placeholder={"Add price"} />
            </Form.Item>
            <Form.Item required name="location" label={<span>Location</span>}>
              <Input placeholder={"Add location"} />
            </Form.Item>
          </Flex>

          <Form.Item
            name="registrationEndDate"
            label="Registration end date"
            rules={[
              {
                required: true,
                message: "Required end time",
              },
            ]}
          >
            <DatePicker disabledDate={disabledDate} format={"YY/MM/DD HH:mm"} style={{ width: 170 }} showTime />
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: "Required event link",
              },
            ]}
            name={"eventLink"}
            label={<span>Link</span>}
          >
            <Input
              type="url"
              disabled={eventDetail?.eventMode === undefined}
              placeholder={`Add ${
                eventDetail?.eventMode === EventMode.ONLINE ? "Event Link" : " Location link"
              } for event`}
            />
          </Form.Item>
          <Form.Item label="Event Instructions">
            <div className={styles.instruction_editor}>
              <TextEditor
                defaultValue={eventDetail?.eventInstructions ? eventDetail.eventInstructions : ""}
                handleDefaultValue={handleInstructionValue}
                readOnly={false}
                width={800}
                borderRadius={8}
                height={150}
                theme="bubble"
                placeholder={`Start writing your event instructions`}
              />
            </div>
          </Form.Item>

          <Form.Item label="Description">
            <div className={styles.editorContainer}>
              <TextEditor
                defaultValue={eventDetail?.description ? eventDetail.description : ""}
                handleDefaultValue={handleEditorValue}
                readOnly={false}
                width={800}
                height={400}
                theme="snow"
                placeholder={`Start writing your event description`}
              />
            </div>
          </Form.Item>
        </Space>
      </Form>
    </section>
  );
};

export default EventForm;
