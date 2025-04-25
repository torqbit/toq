import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserOutlined } from '@ant-design/icons';
import styles from '@/styles/Marketing/Blog/BlogPost.module.scss';

export interface BlogProps {
    slug: string;
    title: string;
    subtitle?: string;
    banner: string;
    authorImage?: string;
    authorName: string;
    date: string;
    readTime?: string;
  };

export const BlogPost: React.FC<{blog:BlogProps}> = ({ blog}) => {
  return (
    <Link href={`/blogs/${blog.slug}`} className={styles.blogCard}>
      <div className={styles.textSection}>
        <span className={styles.featureTag}>FEATURED</span>
        <h2 className={styles.blogTitle}>{blog.title}</h2>
        <p className={styles.blogSubtitle}>
          {blog.subtitle || 'A short description of the blog goes here...'}
        </p>

        <div className={styles.author}>
          {blog.authorImage ? (
            <Image
              src={blog.authorImage}
              alt="Author"
              width={40}
              height={40}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.userOutlineImage}>
              <UserOutlined style={{ fontSize: 24 }} />
            </div>
          )}

          <div className={styles.authorText}>
            <p>
              {blog.authorName} <button>Follow</button>
            </p>
            <span>
              {blog.date} · {blog.readTime || '5 min read'}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.imageWrapper}>
        <Image src={blog.banner} alt="blog-img" width={300} height={200} />
      </div>
    </Link>
  );
};

