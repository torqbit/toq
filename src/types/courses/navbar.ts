import { User } from "next-auth";

export interface INavBarProps {
  user: User | undefined;
  items: {
    title: string;
    link: string;
  }[];
}
