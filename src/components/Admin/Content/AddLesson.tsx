import { FC } from "react";
import AddAssignment from "./AddAssignment";

import styles from "@/styles/AddCourse.module.scss";
import { $Enums, ResourceContentType } from "@prisma/client";
import { IVideoLesson } from "@/types/courses/Course";
import AddVideoLesson from "./AddVideoLesson";
import { FormInstance, message } from "antd";
import { AssignmentType } from "@/types/courses/assignment";

const AddLesson: FC<{
  showResourceDrawer: boolean;
  onRefresh: () => void;
  videoLesson: IVideoLesson;
  setVideoLesson: (lesson: IVideoLesson) => void;
  setResourceDrawer: (value: boolean) => void;
  contentType: ResourceContentType;
  setCheckVideoState: (value: boolean) => void;
  currResId: number;
  onDeleteResource: (id: number, isCanceled: boolean) => void;
  isEdit: boolean;
  setEdit: (value: boolean) => void;
  form: FormInstance;
  assignmentType: AssignmentType;
}> = ({
  setResourceDrawer,
  showResourceDrawer,
  onRefresh,
  contentType,
  onDeleteResource,
  currResId,
  setCheckVideoState,
  videoLesson,
  setVideoLesson,
  isEdit,
  setEdit,
  form,
  assignmentType,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
      {contentType === $Enums.ResourceContentType.Assignment && showResourceDrawer && (
        <div className={styles.assignmentDrawerContainer}>
          <AddAssignment
            setResourceDrawer={setResourceDrawer}
            currResId={Number(currResId)}
            isEdit={isEdit}
            contentType={contentType}
            showResourceDrawer={showResourceDrawer}
            onRefresh={onRefresh}
            onDeleteResource={onDeleteResource}
            setEdit={setEdit}
            lessonType={assignmentType}
            messageApi={messageApi}
          />
        </div>
      )}
      {contentType === $Enums.ResourceContentType.Video && showResourceDrawer && (
        <AddVideoLesson
          onRefresh={onRefresh}
          currResId={currResId}
          form={form}
          onDeleteResource={onDeleteResource}
          isEdit={isEdit}
          setResourceDrawer={setResourceDrawer}
          showResourceDrawer={showResourceDrawer}
          contentType={contentType}
          videoLesson={videoLesson}
          setVideoLesson={setVideoLesson}
          setEdit={setEdit}
        />
      )}
    </>
  );
};

export default AddLesson;
