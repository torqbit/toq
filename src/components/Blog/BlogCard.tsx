import Link from 'next/link';
import Image from 'next/image';
import { UserOutlined } from '@ant-design/icons';
import { Space, Flex } from 'antd';
import styles from '@/styles/Marketing/Blog/BlogCard.module.scss';
import { FC } from 'react';

export interface IBlogCard {
  slug: string;
  banner: string;
  title: string;
  authorName: string;
  authorImage?: string;
  description?: string;
  category?: string;
  date?: string;
}

interface BlogCardProps{
  blog: BlogCardType;
  isMobile: boolean;
}

export const BlogCard: FC<BlogCardProps> = ({ blog, isMobile }) => {
  return (
    <Link href={`/blogs/${blog.slug}`} className={styles.card}>
    <div className={styles.contentWrap}>
      <div className={styles.imageWrapper}>
        <Image
          src={blog.banner}
          alt="blog-img"
          width={isMobile ? 340 : 400}
          height={isMobile ? 200 : 240}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        {blog.category && <span className={styles.category}>{blog.category}</span>}
        <div className={styles.title}>
        <h3 className={styles.titleContent}>{blog.title}</h3>
        <i>
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M8.25 6H18V15.75" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </i>
        </div>
        {blog.description && <p className={styles.description}>{blog.description}</p>}

        <Flex align="center" gap={10} className={styles.authorInfo}>
          {blog.authorImage ? (
            <Image
              src={blog.authorImage}
              alt={blog.authorName}
              width={32}
              height={32}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.userOutlineImage}>
              <UserOutlined style={{ fontSize: 20 }} />
            </div>
          )}
          <Space direction="vertical" size={0}>
            <span className={styles.authorName}>{blog.authorName}</span>
            {blog.date && <span className={styles.date}>{blog.date}</span>}
          </Space>
        </Flex>
      </div>
    </div>
</Link>
  );
};

export default BlogCard;
