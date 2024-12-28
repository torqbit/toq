import { Blog, StateType } from "@prisma/client";
import { getDelete, getFetch, postFetch, postWithFile } from "./request";
export interface latestBlogs extends Blog {
  user: {
    name: string;
  };
}
export type UserAnalyseData = {
  year: any;
  month: any;
  users: number;
};
export type ApiResponse = {
  success: boolean;
  error: string;
  message: string;
  latestBlogs: latestBlogs[];
  contentData: IContentData;
  blog: Blog;
};

export interface IContentData {
  htmlData: string;
  bannerImage: string;
  title: string;
  state: StateType;
}
type FailedApiResponse = {
  error: string;
};
class BlogService {
  updateBlog = (
    formData: FormData,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postWithFile(formData, `/api/v1/admin/blog/update`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      } else {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      }
    });
  };

  createBlog = (
    formData: FormData,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postWithFile(formData, `/api/v1/admin/blog/create`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      } else {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      }
    });
  };
  updateState = (
    data: { blogId: string; state: StateType },
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch(data, `/api/v1/admin/blog/updateState`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      } else {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      }
    });
  };
  getLatestDraftBlog = (
    contentType: string,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/admin/blog/latestDraftBlog?contentType=${contentType}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };

  getContentInfo = (id: string, onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    getFetch(`/api/v1/admin/blog/get/${id}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };

  deleteBlog = (blogId: string, onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    getDelete(`/api/v1/admin/blog/delete?blogId=${blogId}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };
  getLatestBlogs = (
    contentType: string,
    offSet: number,
    limit: number,
    filter: boolean,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(
      filter
        ? `/api/v1/admin/blog/latest-blog?offset=${offSet}&limit=${limit}&filter=${filter}&contentType=${contentType}`
        : `/api/v1/admin/blog/latest-blogs?contentType=${contentType}`
    ).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };
}

export default new BlogService();
