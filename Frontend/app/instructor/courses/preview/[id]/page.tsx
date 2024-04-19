"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import CourseContentLearning from "@/components/CourseContentLearning";
import { useParams, useRouter } from "next/navigation";
import { useLazyLoadFileFromCloudQuery } from "@/redux/services/courseApi";
import { useAppSelector } from "@/redux/hooks/reduxHooks";
import { ExQuiz, Lecture, Question, Section } from "@/types/section.type";
import { useGetContentByCourseIdQuery } from "@/redux/services/contentApi";
import Content, { Description } from "@/types/content.type";
import { Course } from "@/types/course.type";
import PDFViewer from "@/components/PDF/PDFviewer";
import { handleCountFieldsInSection } from "@/utils/function";
import {
  renderDetails,
  renderRequirement,
  renderTargetConsumers,
} from "@/app/(root)/course/[id]/page";
import { LectureType } from "@/utils/resources";
import Quiz from "@/components/Lecture/Quiz/Client/Quiz";
import { useLazyGetExQuizByIdQuery } from "@/redux/services/quizApi";

function PreviewPage() {
  const param = useParams();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [courseId, setCourseId] = useState(param.id as string);
  const [course, setCourse] = useState<Course>();
  const [sections, setSections] = useState<Section[]>([]);
  const [lecture, setLecture] = useState<Lecture>();
  const [readDoc, setReadDocComplete] = useState(false);
  const [description, setDescription] = useState<Description>();
  const [loadFile, { data: fileBase64, isSuccess: loadFileSuccess }] =
    useLazyLoadFileFromCloudQuery();

  const { data: contentData, isSuccess: getContentSuccess } =
    useGetContentByCourseIdQuery(courseId);

  const [getExQuizById, { data: exQuiz }] = useLazyGetExQuizByIdQuery();
  useEffect(() => {
    if (getContentSuccess) {
      setSections(
        ((contentData?.data as Content).sections as Section[])?.filter(
          (section) => section.ordinalNumber !== -1
        )
      );
      setCourse((contentData?.data as Content).course as Course);
      setDescription((contentData?.data as Content).description);
    }
  }, [contentData]);

  useEffect(() => {
    if (
      (lecture?.url?.length as number) > 0 &&
      lecture?.lectureType === LectureType.DOCUMENT
    ) {
      loadFile(lecture?.url as string);
    }
  }, [lecture]);

  const renderCourseContent = () => {
    const { totalLectureCount } = handleCountFieldsInSection(sections);
    return (
      <div className="sticky top-[100px]  custom-scrollbar overflow-y-scroll h-2/3">
        {sections
          ?.filter((section) => section.ordinalNumber !== -1)
          .map((section) => {
            return (
              <div key={section.id} className="">
                <CourseContentLearning
                  section={section}
                  setLecture={setLecture}
                  currentProgress={totalLectureCount}
                  lectureActive={lecture?.id as string}
                />
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <div>
      <Fragment>
        <div className="bg-gray-900 text-white py-4 px-2 sticky top-0 z-20">
          <div className="text-sm flex-between gap-2">
            <div
              className="flex-start font-bold gap-1 hover:cursor-pointer"
              onClick={() =>
                router.push(`/instructor/courses/${courseId}/manage/content`)
              }
            >
              <IoIosArrowBack className="text-xl" />
              {course?.name}
            </div>
            <div className="flex gap-10 mr-10 items-center">
              {/* <div className="flex gap-2">
                <BiNotepad />
                Ghi Chú
              </div>
              <div className="flex gap-2">
                <BsQuestionCircle />
                Hướng Dẫn
              </div> */}
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="w-9/12 custom-scrollbar overflow-y-scroll h-2/3">
            <div>
              <div>
                {lecture?.videoDuration !== 0 ? (
                  <Fragment>
                    {(lecture?.url?.length as number) > 0 ? (
                      <video
                        ref={videoRef}
                        controls
                        src={
                          lecture?.url as string
                          // loadFileSuccess
                          //   ? `data:video/mp4;base64,${fileBase64}`
                          //   : ""
                        }
                        className="w-full h-[500px]"
                        autoPlay
                      />
                    ) : null}
                  </Fragment>
                ) : (
                  // <div>
                  //   <object
                  //     data={`data:application/pdf;base64,${fileBase64}#page=1&zoom=50`}
                  //     type="application/pdf"
                  //     className="w-full h-[500px]"
                  //   />
                  // </div>
                  <Fragment>
                    {lecture.lectureType === LectureType.DOCUMENT ? (
                      <PDFViewer
                        fileBase64={fileBase64 as string}
                        setReadDocComplete={setReadDocComplete}
                        lectureUrl={lecture?.url as string}
                      />
                    ) : (
                      <Fragment>
                        <div className="text-xl font-bold my-2 ml-10">
                          {"Bài Kiểm Tra: " + lecture?.name}
                        </div>
                        <Quiz exQuiz={lecture.exQuiz as ExQuiz} />
                      </Fragment>
                    )}
                  </Fragment>
                )}
              </div>

              <div className="text-xl font-bold my-2 ml-4">
                {lecture?.lectureType !== LectureType.QUIZ_TEST
                  ? lecture?.name
                  : null}
              </div>
              <hr className="border-gray-300 my-10" />
              <div className="xl:w-2/3 ml-10 xs:m-6">
                <h2 className="text-2xl font-bold">Mô tả khóa học</h2>
                <div className="text-3xl font-bold mb-6">{course?.name}</div>
                <div className="font-light mb-2">{course?.subTitle}</div>
                {renderTargetConsumers(description as Description)}
                {renderRequirement(description as Description)}
                {renderDetails(description as Description)}
              </div>
            </div>
          </div>
          <div className="w-3/12 sticky z-30">
            <div className=" py-2 ml-4 sticky top-[56px] z-30">
              Nội dung khóa học
            </div>
            {renderCourseContent()}
          </div>
        </div>
      </Fragment>
    </div>
  );
}

export default PreviewPage;
