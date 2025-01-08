import { FormInstance } from "antd";
import { RcFile } from "antd/es/upload";

export interface ITestimonialItems {
  author: { name: string; img: string; designation: string };
  description: string;
}

export interface ITestimonialInfo {
  enabled: boolean;
  title: string;
  description: string;
  items?: ITestimonialItems[];
}

export interface ITestimonialForm {
  handleTestimonial: (file: RcFile) => void;
  onClose: () => void;
  form: FormInstance;
  open: boolean;
  index?: number;
  edit?: boolean;
}
