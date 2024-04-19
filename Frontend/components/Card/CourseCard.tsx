"use client";
import React, { Fragment, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

import { BsPeopleFill } from "react-icons/bs";
import { Course } from "@/types/course.type";
import { useLoadFileFromCloudQuery } from "@/redux/services/courseApi";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import ReviewDialog from "../Dialog/ReviewDialog";
import { useAppSelector } from "@/redux/hooks/reduxHooks";
import {
  useGetReviewByUserNameAndCourseIdQuery,
  useLazyGetReviewByUserNameAndCourseIdQuery,
} from "@/redux/services/reviewApi";
import { Review } from "@/types/review.type";
import { v4 as uuidv4 } from "uuid";
import { useLazyGetCourseAccessQuery } from "@/redux/services/courseProcessApi";
import { useRouter } from "next/navigation";

interface CourseProps {
  course: Course;
  myCourse?: boolean;
  instructorCourse?: boolean;
}

function CourseCard(props: CourseProps) {
  const {
    course,
    myCourse: isMyCourse,
    instructorCourse: isInstructorCourse,
  } = props;
  const router = useRouter();
  const username = useAppSelector(
    (state) => state.persistedReducer.userReducer.user.username
  );
  const userId = useAppSelector(
    (state) => state.persistedReducer.userReducer.user.id
  );
  const [isRating, setIsRating] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reviewByUser, setReviewByUser] = useState<Review>();
  const { data: imageBase64 } = useLoadFileFromCloudQuery(
    course ? (course.urlCourseImages as string) : ""
  );
  const [getReviewByUserName, { data: reviewByUserData }] =
    useLazyGetReviewByUserNameAndCourseIdQuery();

  useEffect(() => {
    if (isMyCourse) {
      setTimeout(() => {
        getReviewByUserName({
          username: username,
          courseId: course.id as string,
        })
          .unwrap()
          .then((res: any) => {
            if (res.data) {
              setReviewByUser(res.data);
            }
          });
      }, 500);
    }
  }, [isMyCourse, isRating]);

  const MAX_TITLE_LENGTH = 22;
  const truncatedTitle =
    course.name.length > MAX_TITLE_LENGTH
      ? course.name.substring(0, MAX_TITLE_LENGTH) + "..."
      : course.name;

  const handleRating = () => {
    setIsRating(true);
  };
  const [
    getCourseAccess,
    { data: courseAccess, isSuccess: getCourseAccessSuccess },
  ] = useLazyGetCourseAccessQuery();

  const handleRedirectCourse = () => {
    if (userId.length === 0) {
      router.push(`/course/${course.id as string}`);
    } else {
      getCourseAccess({
        userId: userId as string,
        courseId: course.id as string,
      });
    }
  };
  useEffect(() => {
    if (getCourseAccessSuccess) {
      if ((courseAccess?.data as string) === "True") {
        router.push(`/learning/${course.id as string}`);
      } else {
        router.push(`/course/${course.id as string}`);
      }
    }
  }, [courseAccess]);
  return (
    <Fragment>
      <Card
        className="w-full max-w-fit border-0 !bg-transparent xs:max-w-[400px] m-8 hover:scale-105 duration-300 p-4 "
        key={course.id}
        style={{
          background:
            "linear-gradient(349deg, rgba(250,217,118,0.5188200280112045) 19%, rgba(228,245,237,1) 70%)",
        }}
        data-aos="flip-down"
      >
        <CardHeader className="flex flex-col gap-2.5 !p-0 hover:cursor-pointer">
          <div className="h-fit w-full relative">
            <div className="group">
              <Image
                src={
                  imageBase64
                    ? `data:image/png;base64,${imageBase64}`
                    : "/banner.jpg"
                }
                className="w-60 h-32 rounded-md"
                width={240}
                height={128}
                alt={course.name}
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 rounded-md" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  <div className="bg-white rounded-2xl py-2 px-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                    {isMyCourse ? (
                      <div onClick={() => handleRedirectCourse()}>
                        Tiếp tục học
                      </div>
                    ) : isInstructorCourse ? (
                      <Link
                        href={`/instructor/courses/${course.id}/manage/content`}
                      >
                        Quản lý khóa học
                      </Link>
                    ) : (
                      <div onClick={() => handleRedirectCourse()}>
                        Xem khóa học
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CardTitle className="text-black paragraph-semibold line-clamp-1 w-full text-left xs:text-[14px]">
            {truncatedTitle}
          </CardTitle>

          <div className="flex gap-1 justify-end items-end pr-2 pb-2 flex-col hover:cursor-pointer">
            {isMyCourse && (
              <Fragment>
                <div
                  onClick={() => handleRating()}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, index) => {
                      if (index < (reviewByUser?.rating as number)) {
                        return <FaStar key={index} fill={"#ffd03f"} />;
                      } else {
                        return <FaRegStar key={index} fill={"#ffd03f"} />;
                      }
                    })}
                  </div>
                  {reviewByUser?.rating ? (
                    <p className="text-[10px]">
                      {hovered
                        ? "Edit rated this course"
                        : "You rated this course"}
                    </p>
                  ) : (
                    <p className="text-[10px]">Leaving a rating</p>
                  )}
                </div>
              </Fragment>
            )}
          </div>
        </CardHeader>
        {isMyCourse || isInstructorCourse ? null : (
          <CardContent className=" mt-4 p-0 flex-between">
            <div className="flex items-center justify-center text-center">
              {!isMyCourse && (
                <Fragment>
                  {course.averageRating ? (
                    <Fragment>
                      <div className="mr-1 font-bold">
                        {course.averageRating}
                      </div>
                      {[...Array(5)].map((_, index) => {
                        const star = Math.floor(course.averageRating as number);
                        const halfStar =
                          (course.averageRating as number) - star;
                        if (index < star) {
                          return <FaStar key={index} fill={"#ffd03f"} />;
                        } else if (index === star && halfStar > 0) {
                          return <FaStarHalfAlt key={index} fill={"#ffd03f"} />;
                        } else {
                          return <FaRegStar key={index} fill={"#ffd03f"} />;
                        }
                      })}
                    </Fragment>
                  ) : (
                    <Fragment>
                      <div className="mr-1 font-bold">0</div>
                      {[...Array(5)].map((_, index) => {
                        return <FaRegStar key={index} fill={"#ffd03f"} />;
                      })}
                    </Fragment>
                  )}
                </Fragment>
              )}
            </div>
            <div className="flex-end mr-2">
              <div className="text-xl font-normal xs:text-sm">
                {course.price === 0 ? (
                  <span className="text-red-500 italic">
                    <span className="xs:mr-2">F</span>
                    <span className="xs:mr-2">r</span>
                    <span className="xs:mr-2">e</span>
                    <span>e</span>
                  </span>
                ) : (
                  (course.price as number).toLocaleString() + " đ"
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      {isRating && (
        <ReviewDialog
          isRating={isRating}
          setIsRating={setIsRating}
          course={course}
          review={reviewByUser}
        />
      )}
    </Fragment>
  );
}

export default CourseCard;
