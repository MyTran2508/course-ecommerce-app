"use client";
import Loading from "@/app/(root)/user/personal/loading";
import CourseSectionForm from "@/components/Form/CourseSectionForm";
import { useGetContentByCourseIdQuery } from "@/redux/services/contentApi";
import Content from "@/types/content.type";
import { Section } from "@/types/section.type";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { ToastMessage, ToastStatus } from "@/utils/resources";
import showToast from "@/utils/showToast";
import { useAppDispatch } from "@/redux/hooks/reduxHooks";
import { setSections } from "@/redux/features/sectionSlice";
import TimePicker from "react-time-picker";

function CurriculumPage() {
  const router = useRouter();
  const param = useParams();
  const dispatch = useAppDispatch();
  const courseId = param.id as string;
  const { data: contentData, isLoading: isContentLoading } =
    useGetContentByCourseIdQuery(courseId);
  let sections: Section[] = [];
  if (isContentLoading) return <Loading />;

  if (!(contentData?.data as Content).id) {
    showToast(ToastStatus.WARNING, ToastMessage.CHECK_CREATE_CONTENT);
    router.push(`/instructor/courses/${courseId}/manage/content`);
  } else {
    sections = _.cloneDeep(
      (contentData?.data as Content).sections
    ) as Section[];
    dispatch(
      setSections((contentData?.data as Content)?.sections as Section[])
    );
  }

  return (
    <div className="mt-10 shadow-xl w-full mx-5 ">
      <div className="my-5 mx-5 flex items-center font-bold text-xl">
        Chương Trình Giảng Dạy
      </div>
      <hr />
      <div className="ml-10 my-10 mr-5">
        <div>
          Bắt đầu tập hợp khóa học của bạn bằng cách tạo các phần, bài giảng và
          thực hành (câu đố, bài tập viết mã và bài tập).
        </div>
        <div>
          Bắt đầu tập hợp khóa học của bạn bằng cách tạo các phần, bài giảng và
          hoạt động thực hành (câu đố, bài tập viết mã và bài tập). Sử dụng dàn
          ý khóa học để cấu trúc nội dung và gắn nhãn các phần cũng như bài
          giảng một cách rõ ràng.
        </div>
      </div>
      <div className="mt-10 ml-10">
        <CourseSectionForm
          contentId={(contentData?.data as Content).id as string}
          sections={sections}
        />
      </div>
    </div>
  );
}

export default CurriculumPage;
