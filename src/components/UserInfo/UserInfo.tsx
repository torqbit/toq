import { Avatar, Flex } from "antd";
import { FC } from "react";
import styles from "./UserInfo.module.scss";

const UserInfo: FC<{ name: string; image: string; extraInfo: string }> = ({ name, image, extraInfo }) => {
  return (
    <Flex align="center" gap={10} className={styles.user__info}>
      <Avatar src={image} className={styles.user__avatar} />
      <div>
        <div>{name}</div>
        <div>{extraInfo}</div>
      </div>
    </Flex>
  );
};

export default UserInfo;
