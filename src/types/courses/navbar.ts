import { User } from "next-auth";

export interface INavBarProps {
  user: User | undefined;
  items: {
    label: string;
    icon: string;
    href: string;
  }[];
}
