export interface IBlogInfo {
  title: string;
  description: string;

  blogList: IBlogCard[];
  previewMode?: boolean;
}

export interface IBlogCard {
  img: string;
  title: string;
  date: string;
  link: string;
  author: { name: string; picture: string };
  cardClass?: string;
}
