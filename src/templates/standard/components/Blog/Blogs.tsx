import { FC } from "react";
import styles from "./Blog.module.scss";
import { IBlogCard, IBlogInfo } from "@/types/landing/blog";
import Link from "next/link";
import Avatar from "../Avatar/Avatar";
import { Button } from "antd";
import SvgIcons from "@/components/SvgIcons";
import BlogSkeleton from "./BlogSkeleton";

const BlogCard: FC<IBlogCard> = ({ img, title, date, link, cardClass, author }) => (
  <Link href={`${link}`} className={`${styles.blogs__card} ${cardClass}`}>
    <img className={styles.banner__img} alt={title} aria-label={`icon for ${title.toLowerCase()}`} src={img} />
    <div className={styles.blogs__card__footer}>
      <h4>{title}</h4>
      <Avatar name={author.name} picture={author.picture} date={date} />
    </div>
  </Link>
);

const Blogs: FC<IBlogInfo> = ({ blogList, title, description, previewMode }) => {
  return (
    <section className={styles.blog__list__container}>
      <div>
        <div className={styles.blog__title}>
          <div>
            <h2>{title}</h2>
          </div>
          {blogList.length > 3 && (
            <Button type="link">
              View all <i style={{ fontSize: 18, lineHeight: 0 }}> {SvgIcons.arrowRight}</i>
            </Button>
          )}
        </div>
        <p className="landingPagePara">{description}</p>

        <div className={`${styles.blogs} ${blogList.length <= 2 ? styles.blogs__double : styles.blogs__triple}`}>
          {previewMode && blogList.length === 0 ? (
            <BlogSkeleton size={3} />
          ) : (
            <>
              {blogList.length > 0 &&
                blogList.map((blogInfo, i) => {
                  return (
                    <BlogCard
                      key={i}
                      img={blogInfo.img}
                      title={blogInfo.title}
                      date={blogInfo.date}
                      link={blogInfo.link}
                      cardClass={`${styles[blogList.length <= 2 ? "blog__card__large" : `"blog__card__small"`]} ${
                        blogInfo.cardClass
                      }`}
                      author={blogInfo.author}
                    />
                  );
                })}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Blogs;
