import { FC } from "react";
import styles from "./FallBack.module.scss";
import { Skeleton } from "antd";

const FallBackImage: FC<{
  imageSrc?: string | null;
  fallBackImg?: React.ReactNode;
  ariaLabel?: string;
  width: string | number;
  height: string | number;
}> = ({ imageSrc, fallBackImg, ariaLabel, width, height }) => {
  return (
    <div key={ariaLabel} className={styles.fall__back__wrapper}>
      {imageSrc && imageSrc != null ? (
        <object
          type="image/png"
          data={imageSrc}
          className={styles.card__img}
          aria-label={ariaLabel ? ariaLabel : `thumbnail`}
        >
          <div className={styles.invalid__img}>
            {fallBackImg ? fallBackImg : <Skeleton.Image style={{ width: width, height: height }} />}
          </div>
        </object>
      ) : (
        <div className={styles.invalid__img}>
          {fallBackImg ? fallBackImg : <Skeleton.Image style={{ width: width, height: height }} />}
        </div>
      )}
    </div>
  );
};

export default FallBackImage;
