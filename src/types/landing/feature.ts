export interface IFeatureCard {
  img: string;
  title: string;
  description: string;
  link: string;
  cardClass?: string;
}
export interface IFeatureInfo {
  title: string;
  description: string;
  items: IFeatureCard[];
}
