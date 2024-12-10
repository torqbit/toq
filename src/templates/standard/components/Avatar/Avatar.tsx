import { FC } from "react";
import styles from "./Avatar.module.scss";

const Avatar: FC<{ name: string; picture: string; date: string }> = ({ name, picture, date }) => {
  return (
    <div className={styles.avatar__container}>
      <div className={styles.avatar__profile}>
        <img src={picture} alt="profile picture" />
      </div>
      <div className={styles.avatar__name}>
        {name} <span>|</span> {date}
      </div>
    </div>
  );
};

export default Avatar;
