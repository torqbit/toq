import appConstant from "@/services/appConstant";

import md5 from "md5";

export const authConstants = {
  CREDENTIALS_AUTH_PROVIDER: "credentials",
  GOOGLE_AUTH_PROVIDER: "google",
  GITHUB_AUTH_PROVIDER: "github",
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
export const getCookieName = () => {
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

export function createSlug(title: string) {
  return title
    .trim() // Trim whitespace from both sides
    .toLowerCase() // Convert the title to lowercase
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
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

export const countAlphabets = (str: string) => {
  return str.split("").filter((char) => /[a-zA-Z]/.test(char)).length;
};

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

export function arrangeAssignmentFiles(array: string[]) {
  // Separate items with slashes from those without
  const withSlashes = array.filter((item) => item.includes("/"));
  const withoutSlashes = array.filter((item) => !item.includes("/"));

  // Sort items with slashes and those without (optional)
  const sortedWithSlashes = withSlashes.sort();
  const sortedWithoutSlashes = withoutSlashes.sort();

  // Combine the sorted arrays: slashes first, then non-slashes
  return [...sortedWithSlashes, ...sortedWithoutSlashes];
}

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

export const getCertificateDescripiton1 = (objectType: string, objectTitle: string) => {
  switch (objectType) {
    case "COURSE":
      return `who has successfully completed the course ${objectTitle} `;

    case "EVENT":
      return `who has successfully attended the workshop, ${objectTitle}`;

    default:
      return "";
  }
};

export const getCertificateDescripiton2 = (objectType: string, authorName: string) => {
  switch (objectType) {
    case "COURSE":
      return ` authored by ${authorName} and offered by Torqbit`;

    case "EVENT":
      return ` lead by ${authorName} and organized by ${appConstant.platformName} `;

    default:
      return "";
  }
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

export function extractLinkKey(link: string) {
  if (link.startsWith("tel:")) {
    return `tel:`;
  } else if (link.startsWith(`https://`)) {
    return "https://";
  } else if (link.startsWith(`mailto:`)) {
    return "mailto:";
  } else {
    return `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/`;
  }
}
export function extractValue(link: string) {
  if (link.startsWith("mailto:")) {
    return link.slice("mailto:".length);
  } else if (link.startsWith("tel:")) {
    return link.slice("tel:".length);
  } else if (link.startsWith("https://") || link.startsWith(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`)) {
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
  if (previous === 0) {
    return current === 0 ? 0 : 100;
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
