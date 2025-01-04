import { FormInstance } from "antd";

export interface ITestimonialItems {
  author: { name: string; img: string; designation: string };
  description: string;
}

export interface ITesimonialInfo {
  enabled?: boolean;
  items?: ITestimonialItems[];
}

export interface ITestimonialForm {
  handleTestimonial: () => void;
  extra: React.ReactNode;
  title: string;
  authorName: string;
  authorImg: string;
  form: FormInstance;
}
