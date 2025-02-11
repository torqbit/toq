export const defaultBodyHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const postFetch = async (body: any, path: string, headers?: any) => {
  const res = await fetch(path, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      ...defaultBodyHeaders,
      ...(headers && headers),
    },
  });

  return res;
};
export const postWithFile = async (body: any, path: string, headers?: any) => {
  const res = await fetch(path, {
    method: "POST",
    body,
  });

  return res;
};
export const getFetch = async (path: string) => {
  try {
    // Validate path format
    if (path.startsWith("http://") || path.startsWith("https://")) {
      throw new Error("Absolute URLs are not allowed. Use relative paths instead.");
    }

    // Remove leading slash if exists
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;

    // Validate path characters and structure
    // Updated regex to better handle query parameters and URL-safe characters
    const pathRegex = /^[a-zA-Z0-9\-._~!$&'()*+,;=:@\/%?=&\[\]]+$/;
    if (!pathRegex.test(cleanPath)) {
      throw new Error("Invalid characters in path");
    }

    // Prevent path traversal
    if (cleanPath.includes("..") || cleanPath.includes("./")) {
      throw new Error("Path traversal detected");
    }

    const res = await fetch(`/${cleanPath}`, {
      method: "GET",
      credentials: "same-origin",
    });

    return res;
  } catch (error: any) {
    throw new Error(`Invalid path: ${error.message}`);
  }
};
export const getDelete = async (path: string) => {
  const res = await fetch(path, {
    method: "DELETE",
  });

  return res;
};

export interface IResponse {
  updateProgram: {
    id: number;
    banner: string;
  };
  message?: string;
  success: boolean;
  error?: string;
  [type: string]: any;
}
