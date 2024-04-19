import { Lecture, Section } from "@/types/section.type";
import { convertLongToTime } from "@/utils/function";
import { Disclosure } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { HiChevronUp } from "react-icons/hi";
import { IoDocumentTextSharp } from "react-icons/io5";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

interface DisclosureCourseContentProps {
  section: Section;
  openAll: boolean;
}

function DisclosureCourseContent(props: DisclosureCourseContentProps) {
  const { section, openAll } = props;
  const lectureCount = (section.lectures as Lecture[]).length;

  useEffect(() => {}, [openAll]);
  return (
    <div>
      <div className="mb-2">
        <Disclosure defaultOpen={openAll}>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={
                  open
                    ? "rounded-t-lg flex w-full justify-between  bg-gray-100 px-2 py-4 text-left text-sm font-medium hover:bg-orange-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                    : "flex w-full justify-between rounded-lg bg-gray-100 px-2 py-4 text-left text-sm font-medium hover:bg-orange-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                }
              >
                <div className="flex-start gap-2">
                  <HiChevronUp
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-orange-500`}
                  />
                  <span className="text-sm">
                    {section.ordinalNumber}. {section.name}
                  </span>
                </div>
                <div>{lectureCount} bài học</div>
              </Disclosure.Button>
              <div className="text-sm text-gray-500 bg-gray-50 rounded-b-lg">
                {open ? (
                  <>
                    {(section.lectures as Lecture[])
                      .filter((lecture) => lecture.ordinalNumber !== -1)
                      .map((lecture, index) => {
                        let durationLecture: string = "";
                        let isVideo: boolean = false;
                        if (lecture.videoDuration !== 0) {
                          durationLecture = convertLongToTime(
                            lecture.videoDuration as number
                          );
                          isVideo = true;
                        }

                        return (
                          <Fragment key={lecture.id}>
                            <div className="px-2 pt-4 pb-2 pl-5 flex justify-between">
                              <div className="flex gap-3">
                                {isVideo ? (
                                  <MdOutlineOndemandVideo />
                                ) : (
                                  <IoDocumentTextSharp />
                                )}
                                <Disclosure.Panel>
                                  {lecture.ordinalNumber}. {lecture.name}
                                </Disclosure.Panel>
                              </div>
                              {isVideo ? (
                                <Fragment>{durationLecture}</Fragment>
                              ) : null}
                            </div>
                            {(section.lectures as Lecture[]).length !==
                            index + 1 ? (
                              <hr className="pl-10 ml-11" />
                            ) : (
                              ""
                            )}
                          </Fragment>
                        );
                      })}
                  </>
                ) : null}
              </div>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}

export default DisclosureCourseContent;
