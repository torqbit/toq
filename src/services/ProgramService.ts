import { IRegisteredCourses, IResourceDetail, VideoDetails } from "@/lib/types/learn";
import { ICourseDetial, IProgramDetail, ResourceDetails } from "@/lib/types/program";
import ChapterId from "@/pages/api/chapter/delete/[chapterId]";

import { ChapterDetail, CourseAPIResponse, CourseInfo } from "@/types/courses/Course";
import { AssignmentAndTask, Chapter, Course, CourseProgress, Resource } from "@prisma/client";
import { UploadFile } from "antd";
import { number } from "zod";
export interface ICourseList extends Course {
  courseId: number;
  tags: string[];
  enrollCourses: string[];
}

export type ApiResponse = {
  success: boolean;
  error: string;
  completed: boolean;
  message: string;
  registerCourses: IRegisteredCourses[];
  courseDetails: CourseInfo;
  latestProgress: {
    nextChap: ChapterDetail;
    nextLesson: IResourceDetail;
    completed: boolean;
  };
  progress: {
    courseName: string;
    progress: string;
    courseId: number;
  }[];
  program: {
    aboutProgram: string;
    banner: string;
    description: string;

    durationInMonths: number;
    id: number;
  };
  newChapter: {
    ChapterId: number;
  };
  deadline: number;
  resource: IResourceDetail;
  allResource: Resource[];
  getProgram: IProgramDetail;
  courses: Course[];
  getCourse: {
    about: string;
    authorId: string;
    sequenceId: number;
    skills: string[];
    thumbnailId: string;
    videoId: string;
    thumbnail: string;
    videoUrl: string;
    chapters: ChapterDetail[];

    courseId: number;
    coursePrice: number;
    courseType: string;
    createdAt: string;
    description: string;
    durationInMonths: number;
    name: string;
    programId: number;
    state: string;
    tags: string[];
  };
  chapter: Chapter;
  getChapter: [
    {
      chapterId: number;

      courseId: number;
      createdAt: string;
      description: string;
      isActive: boolean;
      name: string;
      resource: [
        {
          resourceId: number;
          resourceTitle: string;
          resourceDescripton: string;
          contentType: string;
          videoDuration: number;
          videoUrl: string;
          submitDay: number;
          languages: string[];
        }
      ];
    }
  ];
  credentials: any;
  allCourse: ICourseDetial[];
  course: Course;
};

type FailedApiResponse = {
  error: string;
};
class ProgramService {
  /**
   * fetching all program
   */
  fetchAllProgram = (onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    fetch(`/api/program/getAllProgram`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
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

  /**
   * get one Program
   */
  getProgram = (
    programId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/program/${programId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
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
  /**
   * Add New Program
   */

  addNewProgram = (
    title: string,
    description: string,
    durationInMonths: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/program/addProgram`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
        durationInMonths: durationInMonths,
      }),
    }).then((result) => {
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

  /**
   * Image Upload
   */
  imageUpload = (
    fileList: UploadFile[],
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/program/upload`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileList: fileList,
      }),
    }).then((result) => {
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

  /**
   * update program
   */

  updateProgarm = (
    aboutProgram: string,
    programId: number,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/program/updateProgram`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aboutProgram: aboutProgram,
        programId: programId,
      }),
    }).then((result) => {
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

  createDraftCourses = (
    courseId: number | undefined,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/course/draftCourse`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: courseId,
      }),
    }).then((result: any) => {
      if (result.status == 400) {
        result.json().then((r: any) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 201) {
        result.json().then((r: any) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };

  createCourses = (
    courses: ICourseList[],
    programId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/course/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courses: courses,
        programId: programId,
      }),
    }).then((result) => {
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

  getCourses = (
    courseId: number,
    onSuccess: (response: CourseAPIResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/course/${courseId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as CourseAPIResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };

  getAllCourse = (
    programId: number,
    state: string,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/course/list/${programId}?state=${state}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
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
  getAllCourseWithUserID = (onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    fetch(`/api/v1/course/list/allCourse`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
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

  getCoursesByAuthor = (onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    fetch(`/api/v1/course/list/coursesByAuthor`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
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

  getRegisterCourses = (onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    fetch(`/api/v1/course/list/registerCourses`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
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

  getLatesDraftCourse = (onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    fetch(`/api/v1/course/list/latestDraftCourse`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
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

  createChapter = (
    chapterData: {
      name: string;
      duration: number;
      description: string;
      courseId: number;
      sequenceId: number;
    },

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/chapter/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chapterData),
    }).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200 || result.status == 403) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };
  getChapter = (
    chapterId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/chapter/${chapterId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
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
  updateChapter = (
    chapterId: number | undefined,
    name: string | undefined,
    description: string | undefined,
    sequenceId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/chapter/update`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chapterId, name, description, sequenceId }),
    }).then((result) => {
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
  updateState = (
    programId: number | undefined,
    state: string | undefined,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/program/updateState/update`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ programId, state }),
    }).then((result) => {
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
  deleteProgram = (
    programId: number | undefined,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/program/delete/${programId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
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

  updateCourse = (
    courseData: {
      name?: string;
      duration?: number;
      state?: string | undefined;
      skills?: string[];
      description?: string;
      thumbnail?: string;
      thumbnailId?: string;
      videoUrl?: string;
      expiryInDays?: number;
      videoId?: string;
      programId?: number;
      authorId?: string | undefined;
      sequenceId?: number | undefined;
      courseId: number;
    },

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/course/update`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
    }).then((result) => {
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

  deleteCourse = (
    courseId: number,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/course/delete/${courseId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
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
  deleteChapter = (
    chapterId: number,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/chapter/delete/${chapterId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
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

  updateCourseState = (
    courseId: number,
    state: string,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/course/updateState`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseId, state }),
    }).then((result) => {
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
  updateChapterState = (
    chapterId: number,
    state: string,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/chapter/updateState`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chapterId, state }),
    }).then((result) => {
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
  updateResState = (
    resourceId: number,
    state: string,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/resource/updateState`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resourceId, state }),
    }).then((result) => {
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

  getResources = (
    chapterId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/resource/list/${chapterId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
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

  createResource = (
    resData: ResourceDetails,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/resource/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resData),
    }).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 201) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };
  addResourceVideo = (
    videoData: VideoDetails,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/resource/addVideo`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(videoData),
    }).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200 || result.status == 403) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };

  deleteResource = (
    resourceId: number,
    courseId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/resource/delete/${resourceId}?courseId=${courseId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
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
  uploadVideo = (
    formData: FormData,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/upload/video/upload`, {
      method: "POST",

      body: formData,
    }).then((result) => {
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
  deleteVideo = (
    videoId: string,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/upload/video/delete`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoId }),
    }).then((result) => {
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
  deleteFile = (
    name: string,
    dir: string,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/upload/file/delete`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, dir }),
    }).then((result) => {
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
  updateResource = (resData: any, onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    fetch(`/api/v1/resource/update`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resData),
    }).then((result) => {
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
  getResource = (
    resourceId: number,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/resource/${resourceId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
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

  getProgress = (
    courseId: number,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/course/getProgress/${courseId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
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
  checkProgress = (
    resourceId: number,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/resource/checkProgress/${resourceId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
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
  getAssignmentDeadline = (
    resourceId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/resource/assignment/${resourceId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
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

  getCredentials = (
    provider_name: string,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/admin/config/service-provider/get/${provider_name}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
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
  addServiceProvider = (
    name: string,
    serviceType: string,
    providerDetail: object,

    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    fetch(`/api/v1/admin/config/service-provider/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, providerDetail, serviceType }),
    }).then((result) => {
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

export default new ProgramService();
