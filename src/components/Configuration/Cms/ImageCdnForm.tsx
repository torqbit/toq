import { FC } from "react";

import styles from "./Cms.module.scss";
import { Form, Input, Segmented } from "antd";

const ImageCdnForm: FC<{}> = () => {
  return (
    <section className={styles.cms__container}>
      <div className={styles.cms__form__header}>
        <h3>Video on Demand</h3>
      </div>
      <div className={styles.cms__form}>
        <div>
          <h4>Video Platforms Details</h4>
          <p>
            Configure the video service provider that will be responsible for storing and streaming the video to the
            learners.
          </p>
        </div>
        <div>
          <Form layout="vertical">
            <Form.Item label="Choose video Platform">
              <Segmented
                className={styles.segment}
                options={[
                  { label: <div>Bunny.net</div>, value: "bunny" },
                  { label: <div>Mux.com</div>, value: "mux" },
                ]}
              />
            </Form.Item>
            <Form.Item label="API Access Key" name={"accessKey"}>
              <Input placeholder="Add access key" />
            </Form.Item>
            <Form.Item label="Video Library Id" name={"libraryId"}>
              <Input placeholder="Add library key" />
            </Form.Item>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default ImageCdnForm;
