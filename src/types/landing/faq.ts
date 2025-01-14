export interface IFaqInfo {
  title?: string;
  description?: string;
  enabled?: boolean;
  items: { question: string; answer: string }[];
}
