"use client";
import { Lecture, Section } from "@/types/section.type";
import {
  convertLongToTime,
  handleCountFieldsInSection,
} from "@/utils/function";
import { Disclosure } from "@headlessui/react";
import React, { useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { HiChevronUp } from "react-icons/hi";
import { IoDocumentTextSharp } from "react-icons/io5";
import { MdLockOutline, MdOutlineOndemandVideo } from "react-icons/md";

interface CourseContentLearningProps {
  section: Section;
  setLecture: React.Dispatch<React.SetStateAction<Lecture | undefined>>;
  currentProgress: number;
  lectureActive: string;
}

function CourseContentLearning(props: CourseContentLearningProps) {
  const { section, setLecture, currentProgress, lectureActive } = props;
  const { totalDurationCourse, totalLectureCount } = handleCountFieldsInSection(
    [section]
  );

  let totalLectionInSections =
    (section.lectures as Lecture[])[(section.lectures as Lecture[]).length - 1]
      ?.ordinalNumber ?? 0;
  let countLectureSuccessInSection = 0;

  if (totalLectionInSections <= currentProgress) {
    totalLectionInSections = totalLectureCount;
    countLectureSuccessInSection = totalLectionInSections;
  } else {
    countLectureSuccessInSection =
      (section.lectures as Lecture[]).length -
        (totalLectionInSections - currentProgress) >
      0
        ? (section.lectures as Lecture[]).length -
          (totalLectionInSections - currentProgress)
        : 0;
    totalLectionInSections = currentProgress;
  }

  const handleClick = (lecture: Lecture) => {
    if ((lecture.ordinalNumber as number) <= currentProgress + 1) {
      setLecture(lecture);
    }
  };
  return (
    <div>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex h-full w-full justify-between border-b-2 bg-gray-50 px-2 pt-1 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 items-center sticky top-0">
              <div className="flex flex-col pl-2">
                <span className="text-sm">
                  {section.ordinalNumber}. {section.name}
                </span>
                <div className="flex gap-1 text-[10px]">
                  <div>
                    {countLectureSuccessInSection}/{totalLectureCount} |
                  </div>
                  <div>{totalDurationCourse}</div>
                </div>
              </div>
              <HiChevronUp
                className={`${
                  open ? "rotate-180 transform" : ""
                } h-5 w-5 text-3xl`}
              />
            </Disclosure.Button>
            <div className="text-sm">
              {open ? (
                <>
                  <div>
                    {(section?.lectures as Lecture[])
                      .filter((lecture) => lecture.ordinalNumber !== -1)
                      .map((lecture, index) => {
                        let durationLecture: string = "";
                        let isVideo: boolean = false;
                        let isSuccess: boolean = false;
                        if (lecture.videoDuration !== 0) {
                          durationLecture = convertLongToTime(
                            lecture.videoDuration as number
                          );
                          isVideo = true;
                        }
                        if (
                          (lecture.ordinalNumber as number) <= currentProgress
                        ) {
                          isSuccess = true;
                        }
                        return (
                          <div
                            key={lecture.id}
                            className={`flex-between gap-3 hover:cursor-pointer pl-5 h-full  ${
                              isSuccess ||
                              (lecture.ordinalNumber as number) ==
                                currentProgress + 1
                                ? ""
                                : "text-gray-500 bg-gray-100"
                            } ${
                              lectureActive == lecture.id
                                ? "bg-orange-300"
                                : null
                            }`}
                            onClick={() => handleClick(lecture)}
                          >
                            <div className="flex items-center justify-center">
                              {isVideo ? (
                                <MdOutlineOndemandVideo />
                              ) : (
                                <IoDocumentTextSharp />
                              )}
                            </div>
                            <div className="w-full">
                              <Disclosure.Panel>
                                {lecture.ordinalNumber}. {lecture.name}
                              </Disclosure.Panel>

                              <div className="text-[11px] flex-between ">
                                {durationLecture ? (
                                  durationLecture
                                ) : (
                                  <div>doc</div>
                                )}
                                {isSuccess ? (
                                  <AiFillCheckCircle className="text-xl text-green-700 mr-6 mb-1 pl-1" />
                                ) : (lecture.ordinalNumber as number) ==
                                  currentProgress + 1 ? null : (
                                  <MdLockOutline className="text-xl text-gray-500 bg-gray-100 mr-6 mb-1 pl-1" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </>
              ) : null}
            </div>
          </>
        )}
      </Disclosure>
    </div>
  );
}

export default CourseContentLearning;
