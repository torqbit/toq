import { MultipleChoiceQA } from "@/types/courses/assignment";
import moment from "moment";

export const convertMinsToHrsMins = (mins: number) => {
  let h = Math.floor(mins / 60);
  let m = mins % 60;
  h = h < 10 ? 0 + h : h; // (or alternatively) h = String(h).padStart(2, '0')
  m = m < 10 ? 0 + m : m; // (or alternatively) m = String(m).padStart(2, '0')
  return `${h} : ${m}`;
};

export const secondsToTime = (e: number) => {
  const h = Math.floor(e / 3600)
      .toString()
      .padStart(2, "0"),
    m = Math.floor((e % 3600) / 60)
      .toString()
      .padStart(2, "0"),
    s = Math.floor(e % 60)
      .toString()
      .padStart(2, "0");

  return { hrs: h, mins: m };
};

export const getPercentage = (partialValue: number, totalValue: number) => {
  return (100 * partialValue) / totalValue;
};

export const truncateString = (string = "", maxLength: number) =>
  string.length > maxLength ? `${string.substring(0, maxLength)}…` : string;

export const bytesToSize = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 B";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10);
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

// export const scrollToTarget = (id: string, offset: number) => {
//   let element: any = document.getElementById(id);
//   let child = element.querySelector(".comment-card-body");
//   child.style.animation = "lightUp 2s forwards";
//   let headerOffset = offset;
//   let elementPosition: number = element?.getBoundingClientRect().top as number;
//   let offsetPosition = elementPosition + window.pageYOffset - headerOffset;
//   setTimeout(() => {
//     child.style.animation = "none";
//   }, 2000);
//   window.scrollTo({
//     top: offsetPosition,
//     behavior: "smooth",
//   });
// };

export const daysRemaining = (date: string) => {
  let eventdate = moment(date);
  let todaysdate = moment();
  let leftHours = eventdate.diff(todaysdate, "hours");

  if (leftHours > 0) {
    return leftHours;
  } else {
    return 0;
  }
};

export const createCourseExpiry = (time: number) => {
  return moment().add(time, "y").format("DD-MM-YYYY,h:mm:ss");
};

export const getCreatedDate = (time: number) => {
  return moment(time).format("MMMM  D  YYYY");
};

export const findEmptyCorrectOptions = (questions: MultipleChoiceQA[]): number[] => {
  return questions.reduce((indices: number[], question, index) => {
    if (!question.correctOptionIndex || question.correctOptionIndex.length === 0) {
      indices.push(index);
    }
    return indices;
  }, []);
};
export const findEmptyGivenOptions = (questions: MultipleChoiceQA[]): number[] => {
  return questions.reduce((indices: number[], question, index) => {
    if (!question.options || question.options.length === 0) {
      indices.push(index);
    }
    return indices;
  }, []);
};

export const cleanEmptyOptions = (questions: MultipleChoiceQA[]) => {
  return questions.map((question) => ({
    ...question,
    options: question.options.filter((option) => option.text.trim() !== ""),
  }));
};
