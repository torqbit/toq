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
  const res = await fetch(path, {
    method: "GET",
  });

  return res;
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
