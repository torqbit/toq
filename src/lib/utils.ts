import appConstant from "@/services/appConstant";
import { TenantRole } from "@prisma/client";
import { parse } from "node-html-parser";

import md5 from "md5";
import { Serie } from "@nivo/line";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IncomingMessage, ServerResponse } from "http";
import { AnalyticsDuration } from "@/types/courses/analytics";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCountryCodeFromPhone(phoneNumber: string) {
  const parts = phoneNumber.split("-");
  return {
    code: parts[0],
    phone: parts[1],
  };
}

export const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const authConstants = {
  CREDENTIALS_AUTH_PROVIDER: "credentials",
  GOOGLE_AUTH_PROVIDER: "google",
  GITHUB_AUTH_PROVIDER: "github",
  EMAIL_AUTH_PROVIDER: "email",
  ENV_GOOGLE_ID: "GOOGLE_ID",
  ENV_GOOGLE_SECRET: "GOOGLE_SECRET",
  ENV_GITHUB_ID: "GITHUB_ID",
  ENV_GITHUB_SECRET: "GITHUB_SECRET",
};
export function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function compareObject(obj1: any, obj2: any) {
  // Check if both are the same reference
  if (obj1 === obj2) return true;

  // Check if both are objects and not null
  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
    return false;
  }

  // Get object keys
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check number of keys
  if (keys1.length !== keys2.length) return false;

  // Recursively check each key
  for (let key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!compareObject(obj1[key], obj2[key])) return false;
  }

  return true;
}

export function isValidImagePath(path: string): boolean {
  const allowedImagePathPattern = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`.includes("localhost")
    ? /^(https?:\/\/)?(localhost|[\w-]+(\.[\w-]+)*)(:\d+)?(\/[\w-]+)*\/?[\w-]+\.(jpg|jpeg|png|gif|ico|bmp|webp|svg|tiff)$/i
    : /^(https?:\/\/)?([\w-]+(\.[\w-]+)*\/)*[\w-]+\.(jpg|jpeg|png|gif|ico|bmp|webp|svg|tiff)$/i;
  const isValid = allowedImagePathPattern.test(path);
  return isValid;
}

export function isValidFilePath(path: string): boolean {
  const allowedFilePathPattern =
    /^(https?:\/\/)?([\w-]+(\.[\w-]+)*\/)*[\w-]+\.(pdf|zip|txt|docx|xlsx|pptx|rar|tar|csv|json)$/i;
  return allowedFilePathPattern.test(path);
}
export function isValidVideoPath(path: string): boolean {
  const allowedVideoPathPattern =
    /^(https?:\/\/)?([\w-]+(\.[\w-]+)*\/)*[\w-]+\.(mp4|webm|mov|avi|mkv|flv|wmv|mpeg|ogv)$/i;
  return allowedVideoPathPattern.test(path);
}

export function convertSize(size: number) {
  // If the size is less than 1024 bytes, show it in bytes
  if (size < 1024) {
    return `${size} bytes`;
  }
  // If the size is less than 1024 KB, show it in KB
  else if (size < 1024 * 1024) {
    let kb = Math.round(size / 1024); // Round to the nearest KB
    return `${kb} KB`;
  }
  // If the size is less than 1024 MB, show it in MB
  else if (size < 1024 * 1024 * 1024) {
    let mb = Math.round(size / (1024 * 1024)); // Round to the nearest MB
    return `${mb} MB`;
  }
  // If the size is less than 1024 GB, show it in GB
  else if (size < 1024 * 1024 * 1024 * 1024) {
    let gb = Math.round(size / (1024 * 1024 * 1024)); // Round to the nearest GB
    return `${gb} GB`;
  }
  // If the size is more than 1024 GB, show it in TB
  else {
    let tb = Math.round(size / (1024 * 1024 * 1024 * 1024));
    return `${tb} TB`;
  }
}

export function isValidGeneralLink(path: string): boolean {
  // Check if it's a mailto link
  if (!path) {
    return false;
  }
  if (path.startsWith("mailto:")) {
    const mailtoPattern = /^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
    return mailtoPattern.test(path);
  }

  // Check if it's a tel link
  if (path.startsWith("tel:")) {
    const telPattern = /^tel:\+?\d+$/i;
    return telPattern.test(path);
  }

  // General link validation (for relative routes or external URLs)
  const allowedLinkPattern = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`.includes("localhost")
    ? /^(https?:\/\/(localhost|[\w-]+(\.[\w-]+)+(?:\/[\w-]+)*\/?)|\/[\w-]+(?:\/[\w-]+)*\/?)$/i
    : /^(https?:\/\/[\w-]+(\.[\w-]+)+(?:\/[\w-]+)*\/?|\/[\w-]+(?:\/[\w-]+)*\/?)$/i;
  return allowedLinkPattern.test(path);
}

export function convertArrayToString(arr: string[]): string {
  return arr.sort().join(", ");
}
export const getCookieName = (): string => {
  let cookieName = appConstant.development.cookieName;
  if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
    cookieName = appConstant.production.cookieName;
  }
  return cookieName;
};

export const addDays = function (days: number) {
  let date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

//create a function to get the size of string in bytes
export function getSizeInBytes(str: string) {
  return new Blob([str]).size;
}

export const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export function createSlug(title: string) {
  return title
    .trim() // Trim whitespace from both sides
    .toLowerCase() // Convert the title to lowercase
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "-") // Remove all non-word chars with hyphen
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

// Example usage:

export const generateDayAndYear = (date: Date) => {
  const year = date.getFullYear();
  const monthNumber = date.getMonth();
  const day = date.getDate();
  const currentDate = new Date(year, monthNumber, day); // 2009-11-10
  const monthName = date.toLocaleString("default", { month: "long" });
  return `${monthName} ${day}, ${year}`;
};

export function getPlanTotalDays(start: string, end: string) {
  // Replace space with 'T' to make it ISO 8601 compliant for JS Date
  const startDate = new Date(start.replace(" ", "T"));
  const endDate = new Date(end.replace(" ", "T"));

  const diffTime = endDate.getTime() - startDate.getTime(); // in milliseconds
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // full days

  return diffDays;
}
export const formatVideoDuration = (minutes: number) => {
  if (minutes >= 60) {
    let hours = minutes / 60;
    let rounded = Math.round(hours * 10) / 10; // one decimal max
    return `${rounded} ${rounded === 1 ? "hour" : "hours"}`;
  } else {
    return `${minutes.toFixed(0)} ${minutes === 1 ? "min" : "mins"}`;
  }
};
export const generateMonthAndYear = (date: Date) => {
  const year = date.getFullYear();
  const monthNumber = date.getMonth();
  const day = date.getDate();
  const monthName = date.toLocaleString("default", { month: "long" });
  return `${monthName} , ${year}`;
};

export const countAlphabets = (str: string) => {
  return str.split("").filter((char) => /[a-zA-Z]/.test(char)).length;
};

export async function getVimeoThumbnail(url: string) {
  const videoId = url.split("/").pop();
  const response = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`);
  const data = await response.json();
  return data[0].thumbnail_large;
}

export function getYouTubeThumbnail(url: string) {
  let videoId = "";

  if (url.includes("youtube.com/watch")) {
    videoId = url.split("v=")[1]?.split("&")[0] || "";
  } else if (url.includes("youtube.com/shorts/")) {
    videoId = url.split("/shorts/")[1]?.split("?")[0] || "";
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
  } else if (url.includes("youtube.com/embed/")) {
    videoId = url.split("/embed/")[1]?.split("?")[0] || "";
  }

  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
}

export function isValidVideoUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url); // This will throw if URL is invalid

    const hostname = parsedUrl.hostname.toLowerCase();

    return hostname.includes("youtube.com") || hostname.includes("youtu.be") || hostname.includes("vimeo.com");
  } catch (error) {
    // Invalid URL
    return false;
  }
}

export function getFirstTextFromHTML(html: string, charCount = 150) {
  const root = parse(html);
  const firstParagraph = root.querySelectorAll("p").find((p) => p.text.trim().length > 0);

  let firstParagraphText = firstParagraph ? firstParagraph.text.trim() : "";

  if (firstParagraphText.length > 150) {
    firstParagraphText = firstParagraphText.substring(0, charCount); // Truncate to 150 characters
  }
  return firstParagraphText;
}

export function detectVideoSource(url: string) {
  const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^\s&?/]+)/;
  const vimeoRegex = /(?:vimeo\.com\/(?:video\/)?)(\d+)/;

  if (youtubeRegex.test(url)) {
    return "youtube";
  } else if (vimeoRegex.test(url)) {
    return "vimeo";
  } else if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/)) {
    return "local";
  } else {
    return "unknown";
  }
}
export function getEmbedUrl(url: string) {
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&?/]+)/);
  const vimeoMatch = url.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/);

  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    return `https://player.vimeo.com/video/${videoId}`;
  }

  if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/)) {
    // Just return the URL itself for local videos (can be used in <video>)
    return url;
  }

  return null; // Unknown source
}

export async function getVideoThumbnail(url: string) {
  const source = detectVideoSource(url);

  switch (source) {
    case "youtube":
      return getYouTubeThumbnail(url);
    case "vimeo":
      let parsed = new URL(url);

      return await getVimeoThumbnail(`${parsed.origin}${parsed.pathname}`);
    default:
      throw new Error("Unsupported video source or invalid URL.");
  }
}

export function removeExtension(filename: string) {
  // Find the position of the last dot in the filename
  const dotIndex = filename.lastIndexOf(".");

  // If there is no dot, return the filename as is
  if (dotIndex === -1) return filename;

  // Extract the part of the filename before the dot
  return filename.substring(0, dotIndex);
}

export function getExtension(filename: string) {
  // Find the position of the last dot in the filename
  const dotIndex = filename.lastIndexOf(".");

  // If there is no dot or the dot is at the beginning, return an empty string
  if (dotIndex === -1 || dotIndex === 0) return "";

  // Extract the part of the filename after the dot
  return filename.substring(dotIndex + 1);
}

export const getIcon = (extension: string) => {
  switch (extension) {
    case "html":
      return "<>";
    case "css":
      return "#";
    case "js":
      return "JS";

    default:
      break;
  }
};

export const getCodeDefaultValue = (extension: string, stylesPath?: string) => {
  switch (extension) {
    case "html":
      return `<!DOCTYPE html>
    <html>
    <head>
    <link rel="stylesheet" href="${stylesPath}"/>
    </head>
    <body></body> 
    </html>
              `;
    case "css":
      return `body{}`;
    case "js":
      return `console.log("hello world")`;

    default:
      break;
  }
};

export const getCodeLanguage = (extension: string) => {
  switch (extension) {
    case "html":
      return "html";
    case "css":
      return `css`;
    case "js":
      return "javascript";
    default:
      break;
  }
};

export const mapToArray = (map: Map<string, string>): [string, string][] => {
  return Array.from(map.entries());
};

export const compareByHash = (existingValue: [string, string][], currentValue: [string, string][]): boolean => {
  const cleanedMap = (map: [string, string][]) =>
    new Map(Array.from(map, ([key, value]) => [key, value.replace(/\n/g, " ").trim()]));

  const map1Json = mapToArray(cleanedMap(existingValue)).flat().join("").replace(/\s+/g, "").trim();
  const map2Json = mapToArray(cleanedMap(currentValue)).flat().join("").replace(/\s+/g, "").trim();

  const map1Hash = md5(map1Json.trim());

  const map2Hash = md5(map2Json.trim());

  return map1Hash === map2Hash;
};

export function replaceEmptyParagraphs(htmlString: string) {
  return htmlString.replace(/<p>\s*<\/p>/g, "").replace(/<p><br\s*\/?>s*\<\/p>/gi, "");
}

export const getBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export function calculateBase64Size(base64Str: string) {
  // Calculate size in bytes
  const byteString = atob(base64Str.split(",")[1]); // Decode Base64
  const sizeInBytes = byteString.length; // Length of the decoded string

  // Convert to kilobytes
  const sizeInMB = sizeInBytes / (1024 * 1024);
  return sizeInMB.toFixed(1);
}

export const compressBase64Image = (base64Str: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    let maxWidth = 1000;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (img.width && img.height) {
          const aspectRatio = img.width / img.height;
          let maxHeight = maxWidth / aspectRatio;

          // Resize the image
          // const { newWidth, newHeight } = resizeImage(img.width, img.height, 1000);
          canvas.width = maxWidth;
          canvas.height = maxHeight;
          ctx.drawImage(img, 0, 0, maxWidth, maxHeight);
        } else {
          ctx.drawImage(img, 0, 0);
        }

        // Convert canvas to Base64 with specified quality
        const compressedBase64 = canvas.toDataURL("image/png");
        resolve(compressedBase64);
      }
    };

    img.onerror = (error) => {
      console.log(error);
      reject(error);
    };
  });
};

export async function getVideoURLDuration(url: string) {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const VIMEO_ACCESS_TOKEN = process.env.VIMEO_ACCESS_TOKEN;

  let videoId,
    apiUrl,
    headers = {};
  let platform;

  // Detect platform
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    platform = "youtube";
  } else if (url.includes("vimeo.com")) {
    platform = "vimeo";
  } else {
    throw new Error("Unsupported video platform");
  }

  // Extract ID and set API details
  switch (platform) {
    case "youtube":
      videoId = url.split("v=")[1] || url.split("/").pop();
      videoId = videoId?.split("&")[0];
      apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`;
      break;

    case "vimeo":
      videoId = url.split("/").pop();
      apiUrl = `https://api.vimeo.com/videos/${videoId}`;
      headers = { Authorization: `Bearer ${VIMEO_ACCESS_TOKEN}` };
      break;
  }

  // Fetch and parse duration
  const res = await fetch(`${apiUrl}`, { headers });
  const data = await res.json();

  switch (platform) {
    case "youtube":
      const isoDuration = data.items[0].contentDetails.duration;
      return iso8601ToSeconds(isoDuration);

    case "vimeo":
      return data.duration; // already in seconds
  }
}

export function iso8601ToSeconds(duration: any) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
}

export const convertToDayMonthTime = (dateString: Date) => {
  const date = new Date(dateString);

  const options = {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };

  const localTime = date.toLocaleString("en-IN", options as any);

  return localTime;
};

export const capsToPascalCase = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const getBriefText = (text: string, wordCount: number) => {
  let totalWords = text.split(" ").length;
  if (totalWords <= wordCount) {
    return text;
  } else {
    const words = text.trim().split(/\s+/);

    const briefText = words.slice(0, wordCount);

    return `${briefText.join(" ")}...`;
  }
};

export const getChunkPercentage = (uploadedChunks: number, totalChunks: number) => {
  // Calculate percentage of uploaded chunks and round to nearest whole number
  let percentageUploaded = Math.round((uploadedChunks / totalChunks) * 100);

  return percentageUploaded;
};

export const convertMillisecondsToDay = (ms: number) => {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (hours < 24 && days === 0) {
    return hours > 1 ? `${hours} hours` : `${hours} hour`;
  }
  if (days > 0 && hours === 0) {
    return days > 1 ? `${days} days` : `${days} day`;
  } else {
    return `${days} ${days > 1 ? "days" : "day"} ${hours} ${hours > 1 ? "hours" : "hour"}`;
  }
};

export const convertToMilliseconds = (dateString: string) => {
  const formattedString = dateString.replace(" at ", " ").trim();

  const dateInMillis = new Date(formattedString + " GMT+0530").getTime();

  return dateInMillis;
};

export const checkDateExpired = (endDate: Date) => {
  let end = new Date(endDate).getTime();
  return new Date().getTime() > end;
};

export const generateYearAndDayName = (dateStr: Date) => {
  const date = new Date(dateStr);

  const options = { weekday: "short", month: "long", day: "numeric" };
  const dayMonth = date.toLocaleDateString("en-US", options as any);

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "pm" : "am";
  const formattedTime = `${hours % 12 || 12}:${minutes} ${period}`;

  return `${dayMonth}  ${formattedTime}`;
};

export const deepMerge = (defaultObj: any, userObj: any): any => {
  if (userObj === null || userObj === undefined) return defaultObj;

  if (typeof userObj === "object" && !Array.isArray(userObj) && userObj !== null) {
    return Object.entries(userObj).reduce(
      (acc, [key, value]) => {
        acc[key] = key in defaultObj ? deepMerge(defaultObj[key], value) : value;
        return acc;
      },
      { ...defaultObj }
    );
  }

  return userObj;
};

export function getFileExtension(fileName: string) {
  const parts = fileName.split(".");

  const extension = parts[parts.length - 1];

  return extension.toLowerCase();
}

export const getDateAndYear = (dateInfo?: Date) => {
  const currentDate = dateInfo ? dateInfo : new Date();
  const year = currentDate.getFullYear();
  const monthNumber = currentDate.getMonth();
  const day = currentDate.getDate();
  const date = new Date(year, monthNumber, day); // 2009-11-10
  const monthName = date.toLocaleString("default", { month: "long" });
  return `${monthName} ${day}, ${year}`;
};

export const checkIfImageIsSquare = (file: File) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectURL = URL.createObjectURL(file);

    img.onload = () => {
      const { width, height } = img;
      URL.revokeObjectURL(objectURL); // Cleanup the object URL
      resolve(width === height);
    };

    img.onerror = (error) => {
      URL.revokeObjectURL(objectURL); // Cleanup the object URL
      reject(error);
    };

    img.src = objectURL; // Trigger the load
  });
};

export const regex = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9\-._~:\/?#[\]@!$&'()*+,;=]*)?$/;
export const mailtoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const telRegex = /^\+?[0-9-]+$/;

export function extractLinkKey(link: string, hostUrl: string) {
  if (link.startsWith("tel:")) {
    return `tel:`;
  } else if (link.startsWith(`https://`)) {
    return "https://";
  } else if (link.startsWith(`mailto:`)) {
    return "mailto:";
  } else {
    return `${hostUrl}/`;
  }
}
export function extractValue(link: string, hostUrl: string) {
  if (link.startsWith("mailto:")) {
    return link.slice("mailto:".length);
  } else if (link.startsWith("tel:")) {
    return link.slice("tel:".length);
  } else if (link.startsWith("https://") || link.startsWith(`${hostUrl}`)) {
    return link.slice(link.indexOf("://") + 3);
  } else if (link.startsWith("/")) {
    return link.slice(1);
  }
}

export function areAnswersEqualForKey(arr1: (string | number)[], arr2: (string | number)[]): boolean {
  if (!arr1 || arr1.length === 0) {
    return false;
  }
  // Compare the length of the arrays
  if (arr1?.length !== arr2?.length) {
    return false;
  }

  // Compare each element index-wise
  for (let i = 0; i < arr1?.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false; // Mismatch at any index
    }
  }

  return true; // Arrays match index-wise
}

export const compareByPercentage = (current: number, previous: number) => {
  if (previous == 0) {
    return current == 0 ? 0 : 100;
  }
  return Math.floor(((current - previous) / previous) * 100);
};

export const validateImage = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      cache: "no-cache",
    });

    if (response.ok && response.headers.get("content-type")?.includes("image")) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export function generateTickValues(data: Serie[]): number[] {
  let maxValue = Math.max(...data.flatMap((serie) => serie.data.map((point) => Number(point.y))));
  if (maxValue === 0) return [0];

  const getBestStep = (max: number): number => {
    for (let ticks = 7; ticks >= 5; ticks--) {
      if (max % ticks === 0) {
        return max / ticks;
      }
    }
    return Math.ceil(max / 6); // fallback
  };

  const step = getBestStep(maxValue);
  const roundedMax = Math.floor(maxValue / step) * step;

  const ticks: number[] = [];
  for (let i = 0; i <= roundedMax; i += step) {
    ticks.push(i);
  }

  return ticks;
}
export function getStepSize(max: number): number {
  if (max <= 10) return 1;
  if (max <= 20) return 2;
  if (max <= 50) return 5;
  if (max <= 100) return 10;

  // For values > 100, determine a step based on magnitude
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
  const fraction = max / magnitude;

  if (fraction <= 2) return magnitude / 5;
  if (fraction <= 5) return magnitude / 2;
  return magnitude;
}

export function generateYSteps(data: Serie[]): number[] {
  const allY = data.flatMap((serie) => serie.data.map((point) => point.y));
  const maxY = Math.max(...(allY as any));

  const getStepSize = (max: number): number => {
    if (max <= 1) return 1;
    if (max <= 10) return 1;
    if (max <= 20) return 2;
    if (max <= 50) return 5;
    if (max <= 100) return 10;
    const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
    const fraction = max / magnitude;
    if (fraction <= 2) return Math.ceil(magnitude / 5);
    if (fraction <= 5) return Math.ceil(magnitude / 2);
    return Math.ceil(magnitude);
  };

  const step = getStepSize(maxY);
  const ticks: number[] = [];

  for (let i = 0; i <= maxY; i += step) {
    ticks.push(i);
  }
  if (ticks[ticks.length - 1] < maxY) {
    ticks.push(Math.ceil(maxY));
  }

  return ticks;
}
// Main function to generate Y values
export function getMaxLineChatY(data: Serie[]): number {
  const allY = data.flatMap((serie) => serie.data.map((point) => point.y));
  const maxY = Math.max(...(allY as any));
  return maxY;
}

export function getFormattedDate(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based, so add 1
  const day = date.getDate().toString().padStart(2, "0"); // Ensure day is always two digits

  return `${year}-${month}-${day}`;
}

export function setLocalStorage(name: string, data: any) {
  localStorage.setItem(name, JSON.stringify(data));
}

export function getLocalStorage(name: string) {
  JSON.parse(localStorage.getItem(name) as any);
}

export function getDateCondition(duration: AnalyticsDuration) {
  const currentDate = new Date();

  // Switch case to handle different durations
  switch (duration) {
    case "month":
      // For monthly, get the current month
      return {
        startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),

        // For previous month
        previousStartDate: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
        previousEndDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 0),
      };

    case "quarter":
      const quarterStartMonth = Math.floor(currentDate.getMonth() / 3) * 3;
      const prevQuarterStartMonth = Math.floor((currentDate.getMonth() - 3) / 3) * 3;
      return {
        startDate: new Date(currentDate.getFullYear(), quarterStartMonth, 1),
        endDate: new Date(currentDate.getFullYear(), quarterStartMonth + 3, 0),

        // For previous month
        previousStartDate: new Date(currentDate.getFullYear(), prevQuarterStartMonth, 1),
        previousEndDate: new Date(currentDate.getFullYear(), prevQuarterStartMonth + 3, 0),
      };

    case "year":
      // For yearly, get the current year

      return {
        startDate: new Date(currentDate.getFullYear(), 0, 1),
        endDate: new Date(currentDate.getFullYear(), 12, 0),

        // For previous month
        previousStartDate: new Date(currentDate.getFullYear() - 1, 0, 1),
        previousEndDate: new Date(currentDate.getFullYear() - 1, 12, 0),
      };

    default:
      return {
        startDate: "",
        endDate: "",

        // For previous month
        previousStartDate: "",
        previousEndDate: "",
      };
  }
}

export async function generateMonthlyData(transactions: { amount: number; createdAt: Date }[]) {
  const totalDaysInMonth = new Date(
    new Date(getDateCondition("month").startDate).getFullYear(),
    new Date(getDateCondition("month").startDate).getMonth() + 1,
    0
  ).getDate();

  const allDaysArray = Array.from({ length: totalDaysInMonth }, (_, i) => ({
    date: (i + 1).toString(),
    amount: 0,
  }));

  transactions.forEach((transaction) => {
    const day = transaction.createdAt.getDate().toString();
    const amount = transaction.amount;
    const dayIndex = allDaysArray.findIndex((item) => item.date === day);
    if (dayIndex !== -1) {
      allDaysArray[dayIndex].amount += Number(amount);
    }
  });

  return allDaysArray.map((item) => ({
    x: item.date,
    y: item.amount,
  }));
}

export async function generateQuarterlyData(transactions: { amount: number; createdAt: Date }[]) {
  const currentQuarterMonths = getQuarterMonths(new Date(getDateCondition("quarter").startDate));

  // Initialize the result array for the quarter
  const result = currentQuarterMonths.map((month) => {
    const monthTransactions = transactions.filter((transaction) => transaction.createdAt.getMonth() === month.index);

    const totalAmount = monthTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      x: month.name,
      y: totalAmount,
    };
  });

  return result;
}

export async function generateYearlyData(transactions: { amount: number; createdAt: Date }[]) {
  const result = Array.from({ length: 12 }, (_, i) => {
    const monthTransactions = transactions.filter((transaction) => transaction.createdAt.getMonth() === i);

    const totalAmount = monthTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      x: new Date(0, i).toLocaleString("default", { month: "short" }),
      y: totalAmount,
    };
  });

  return result;
}

export function getQuarterMonths(startDate: Date) {
  const month = startDate.getMonth();
  let quarterStartMonth = Math.floor(month / 3) * 3;

  return [
    { name: new Date(0, quarterStartMonth).toLocaleString("default", { month: "long" }), index: quarterStartMonth },
    {
      name: new Date(0, quarterStartMonth + 1).toLocaleString("default", { month: "long" }),
      index: quarterStartMonth + 1,
    },
    {
      name: new Date(0, quarterStartMonth + 2).toLocaleString("default", { month: "long" }),
      index: quarterStartMonth + 2,
    },
  ];
}

export const bytesToGB = (bytes: number): number => {
  const bytesInGB = 1024 * 1024 * 1024; // 1 GB = 1024^3 bytes
  const gb = bytes / bytesInGB;
  return parseFloat(gb.toFixed(2)); // Round to 1 decimal place
};

export function bytesToMB(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return Number(mb.toFixed(1));
}
export function mbToBytes(mb: number) {
  return mb * 1024 * 1024;
}

export function getDaysDifference(todayMs: number, endDateMs: number): number {
  const msInOneDay = 1000 * 60 * 60 * 24;

  // Calculate the difference in milliseconds
  const diffInMs = endDateMs - todayMs;

  // Convert to days and round down to ignore partial days
  const diffInDays = Math.floor(diffInMs / msInOneDay);

  return diffInDays;
}

export const showPlanAlertBar = (user: any) => {
  return user?.tenant && user.tenant.role == TenantRole.OWNER && user?.tenant.subscription;
};

export const hasAdminAccess = (res: ServerResponse<IncomingMessage>, session?: any) => {
  if (!session || (session && session?.tenant?.role !== TenantRole.OWNER)) {
    res.writeHead(302, { Location: "/404" });
    res.end();
  }
};

export function formatUsedStorage(used: number): string | number {
  const KB = 1024;
  const MB = 1024 * KB;

  if (used < KB) {
    return `${used} Bytes`;
  } else if (used < MB) {
    return `${Number((used / KB).toFixed(2))} KB`;
  } else {
    return `${Number((used / MB).toFixed(2))} MB`;
  }
}

/**
 * Converts OKLCH color values to hexadecimal color code
 * @param {number} l - Lightness component (0 to 1)
 * @param {number} c - Chroma component (0 to ~0.4)
 * @param {number} h - Hue component in degrees (0 to 360)
 * @param {number} [alpha=1] - Alpha component (0 to 1)
 * @returns {string} Hexadecimal color code (#RRGGBB or #RRGGBBAA format)
 */
export function oklchToHex(l: number, c: number, h: number, alpha = 1) {
  // First convert OKLCH to OKLab
  const hRadians = (h * Math.PI) / 180; // Convert hue to radians
  const a = c * Math.cos(hRadians);
  const b = c * Math.sin(hRadians);

  // Then convert OKLab to linear RGB
  // OKLab to linear RGB conversion matrix
  const lRGB = oklabToLinearRGB(l, a, b);

  // Convert linear RGB to sRGB (0-255 range)
  const r = linearToSRGB(lRGB[0]);
  const g = linearToSRGB(lRGB[1]);
  const b_ = linearToSRGB(lRGB[2]);

  // Convert to hex
  let hex =
    "#" +
    Math.round(r * 255)
      .toString(16)
      .padStart(2, "0") +
    Math.round(g * 255)
      .toString(16)
      .padStart(2, "0") +
    Math.round(b_ * 255)
      .toString(16)
      .padStart(2, "0");

  // Add alpha channel if not 1
  if (alpha !== 1) {
    const alphaHex = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0");
    hex += alphaHex;
  }

  return hex;
}

/**
 * Converts OKLab color values to linear RGB
 * @param {number} l - Lightness component
 * @param {number} a - A component
 * @param {number} bc - B component
 * @returns {Array} Linear RGB values array [r, g, b]
 */
function oklabToLinearRGB(l: number, a: number, bc: number) {
  // OKLab to linear RGB conversion
  const l_ = l + 0.3963377774 * a + 0.2158037573 * bc;
  const m = l - 0.1055613458 * a - 0.0638541728 * bc;
  const s = l - 0.0894841775 * a - 1.291485548 * bc;

  const l_3 = Math.pow(l_, 3);
  const m_3 = Math.pow(m, 3);
  const s_3 = Math.pow(s, 3);

  // Linear RGB
  const r = +4.0767416621 * l_3 - 3.3077115913 * m_3 + 0.2309699292 * s_3;
  const g = -1.2684380046 * l_3 + 2.6097574011 * m_3 - 0.3413193965 * s_3;
  const b = -0.0041960863 * l_3 - 0.7034186147 * m_3 + 1.707614701 * s_3;

  // Clamp values to valid range
  return [Math.max(0, Math.min(1, r)), Math.max(0, Math.min(1, g)), Math.max(0, Math.min(1, b))];
}

/**
 * Converts linear RGB value to sRGB value
 * @param {number} c - Linear RGB component value
 * @returns {number} sRGB component value
 */
function linearToSRGB(c: number) {
  if (c <= 0.0031308) {
    return c * 12.92;
  } else {
    return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  }
}

// src/lib/stream-utils.ts

/**
 * Simulates a ReadableStream from an array of chunks with a delay.
 * @param chunks An array of strings to stream.
 * @param delay The delay in milliseconds between sending each chunk.
 * @returns A ReadableStream.
 */
export const simulateStream = (chunks: string[], delay: number = 50): ReadableStream<string> => {
  let i = 0;
  return new ReadableStream<string>({
    start(controller) {
      const sendChunk = () => {
        if (i < chunks.length) {
          controller.enqueue(chunks[i++]);
          setTimeout(sendChunk, delay);
        } else {
          controller.close();
        }
      };
      sendChunk();
    },
    // Optional: Add cancel method if needed for cleanup
    cancel() {
      console.log("Stream cancelled");
    },
  });
};
