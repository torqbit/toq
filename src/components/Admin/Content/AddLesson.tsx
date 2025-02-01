import { FC } from "react";
import AddAssignment from "./AddAssignment";

import styles from "@/styles/AddCourse.module.scss";
import { $Enums, ResourceContentType } from "@prisma/client";
import { IVideoLesson } from "@/types/courses/Course";
import AddVideoLesson from "./AddVideoLesson";
import { FormInstance } from "antd";

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
}) => {
  return (
    <>
      {contentType === $Enums.ResourceContentType.Assignment ? (
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
          />
        </div>
      ) : (
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
