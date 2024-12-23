import { Discussion, User } from "@prisma/client";
import { Notification } from "@prisma/client";

export interface ICommentInfo extends Discussion {
  user: User;
}

export interface INotification extends Notification {
  comment: Discussion;
  tagComment: any;

  resource: {
    resourceId: number;
    chapterId: number;
    chapter: {
      courseId: number;
      course: {
        slug: string;
      };
    };
  };
  fromUser: {
    name: string;
    image: string;
  };
  loading?: boolean;
}
