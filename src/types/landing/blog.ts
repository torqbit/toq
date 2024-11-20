export interface IBlogInfo {
  title: string;
  description: string;
  blogList: IBlogCard[];
}

export interface IBlogCard {
  img: string;
  title: string;
  date: string;
  slug: string;
  author: { name: string; picture: string };
  cardClass?: string;
}
