import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/reduxHooks";
import React, { Fragment, useEffect, useState } from "react";
import Message from "./Message";
import { Course } from "@/types/course.type";
import { useUpdateApprovedMutation } from "@/redux/services/courseApi";
import showToast from "@/utils/showToast";
import { ToastMessage, ToastStatus } from "@/utils/resources";
import { setManageCourse, updateCourse } from "@/redux/features/courseSlice";

interface ApprovedButtonProps {
  course: Course;
}

function ApprovedButton(props: ApprovedButtonProps) {
  const { course } = props;
  const [isOpen, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [updateApproveCourse] = useUpdateApprovedMutation();

  const handleClickOpen = () => {
    setOpen(!isOpen);
  };

  const handleApproveCourse = async () => {
    const request = {
      courseId: course?.id as string,
      isApproved: true,
      courseIssueReport: {},
    };
    await updateApproveCourse(request)
      .unwrap()
      .then((fulfilled) => {
        showToast(ToastStatus.SUCCESS, ToastMessage.UPDATE_COURSE_SUCCESS);
        dispatch(setManageCourse({ ...(course as Course), isApproved: true }));
      });
    handleClickOpen();
  };
  return (
    <div>
      {course && course.isAwaitingApproval && !course.isApproved ? (
        <Fragment>
          {isOpen ? (
            <Fragment>
              <div className="flex gap-3">
                <Button
                  className="bg-orange-400 text-white hover:bg-orange-300"
                  onClick={handleApproveCourse}
                >
                  Chấp nhận
                </Button>
                <Message />
                <Button
                  className="bg-white text-black hover:bg-red-400"
                  onClick={handleClickOpen}
                >
                  Hủy
                </Button>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="flex gap-5">
                <Button
                  className="bg-white text-black hover:bg-white"
                  onClick={() => handleClickOpen()}
                >
                  Xét Duyệt
                </Button>
              </div>
            </Fragment>
          )}
        </Fragment>
      ) : (
        <Fragment>
          {course && course.isApproved ? (
            <div className="italic text-orange-400"> Đã Xét Duyệt</div>
          ) : null}
        </Fragment>
      )}
    </div>
  );
}

export default ApprovedButton;
