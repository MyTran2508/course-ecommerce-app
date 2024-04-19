"use client";
import Loading from "@/app/(root)/user/personal/loading";
import CourseContentForm from "@/components/Form/CourseContentForm";
import { setContentId } from "@/redux/features/contentSlice";
import { setParamCourseId } from "@/redux/features/courseSlice";
import { setSections } from "@/redux/features/sectionSlice";
import { useAppDispatch } from "@/redux/hooks/reduxHooks";
import { useGetContentByCourseIdQuery } from "@/redux/services/contentApi";
import Content from "@/types/content.type";
import { Section } from "@/types/section.type";
import { useParams } from "next/navigation";
import React from "react";

function CourseContentPage() {
  const param = useParams();
  const courseId = param.id as string;
  const dispatch = useAppDispatch();
  dispatch(setParamCourseId(courseId));
  const { data, isLoading } = useGetContentByCourseIdQuery(courseId);
  const { data: contentData, isLoading: isContentLoading } =
    useGetContentByCourseIdQuery(courseId);

  if (isLoading && isContentLoading) return <Loading />;
  dispatch(setContentId((data?.data as Content).id as string));
  dispatch(setSections((contentData?.data as Content).sections as Section[]));
  console.log((contentData?.data as Content).sections as Section[]);

  return (
    <div className="mt-10 shadow-xl w-full mx-5 ">
      <div className="my-5 mx-5 flex items-center font-bold text-xl">
        Mô tả chi tiết khóa học
      </div>
      <hr />
      <div className="mt-10 ml-10"></div>
      <CourseContentForm content={data?.data as Content} courseId={courseId} />
    </div>
  );
}

export default CourseContentPage;
