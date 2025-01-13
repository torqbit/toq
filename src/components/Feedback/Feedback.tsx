import { postFetch } from "@/services/request";
import { Button, Flex, Form, Input, message, Popover, Tooltip } from "antd";
import { useState } from "react";
import styles from "@/styles/Sidebar.module.scss";
import SvgIcons from "../SvgIcons";
import { useAppContext } from "../ContextApi/AppContext";

const Feedback = () => {
  const [form] = Form.useForm();
  const { globalState } = useAppContext();

  const [feedback, setfeedback] = useState<{
    laoding: boolean;
    mailSent: boolean;
    chat: boolean;
  }>({
    laoding: false,
    mailSent: false,
    chat: false,
  });
  const onPostFeedback = async () => {
    setfeedback({ ...feedback, laoding: true });
    const sendMail = await postFetch({ feedback: form.getFieldsValue().feedback }, "/api/v1/conversation/send-mail");
    const res = await sendMail.json();

    if (res.success) {
      setfeedback({ ...feedback, laoding: false, mailSent: true });
    } else {
      message.error(res.error);
      setfeedback({ ...feedback, laoding: false, mailSent: false });
    }
  };
  return (
    <Tooltip className={styles.actionTooltip} title={"Send a feedback"}>
      <div>
        <Popover
          placement="topRight"
          title={<div className={styles.feedback_title}>Feedback</div>}
          trigger={"click"}
          content={
            <>
              {feedback.mailSent ? (
                <div className={styles.feedbackSentMessage}>
                  <i style={{ lineHeight: 0, fontSize: 18, color: "var(--font-secondary)" }}>{SvgIcons.check}</i>
                  <p>Your feedback has been received!</p>
                </div>
              ) : (
                <Form form={form} onFinish={onPostFeedback} className={styles.feedbackForm}>
                  <Form.Item noStyle name={"feedback"} rules={[{ required: true, message: "Please Enter feedback" }]}>
                    <Input.TextArea rows={4} placeholder="Your feedback..." />
                  </Form.Item>
                  <Flex align="center" justify="right">
                    <Button loading={feedback.laoding} htmlType="submit" type="primary">
                      Send
                    </Button>
                  </Flex>
                </Form>
              )}
            </>
          }
          open={feedback.chat}
          onOpenChange={() => {
            if (!feedback.laoding) {
              if (feedback.chat) {
                form.resetFields();
              }
              setfeedback({ ...feedback, chat: !feedback.chat, mailSent: false });
            }
          }}
        >
          {<i style={{ cursor: "pointer" }}>{SvgIcons.chat}</i>}
        </Popover>
      </div>
    </Tooltip>
  );
};

export default Feedback;
