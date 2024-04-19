"use client";
import CourseCard from "@/components/Card/CourseCard";
import {
  useFilterCourseMutation,
  useGetAllCourseQuery,
  useGetNewestCourseQuery,
  useGetPopularCourseQuery,
} from "@/redux/services/courseApi";
import Loading from "../user/personal/loading";
import { Course } from "@/types/course.type";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ReactTyped } from "react-typed";
import { Topic } from "@/utils/data";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
  const router = useRouter();
  const [courseNewest, setCourseNewest] = useState<Course[]>([]);
  const [coursePopular, setCoursePopular] = useState<Course[]>([]);
  const {
    data: courseNewestData,
    isLoading: isCourseNewestLoading,
    isSuccess: isCourseNewestSuccess,
  } = useGetNewestCourseQuery({
    topicId: -1,
    size: 8,
  });
  const {
    data: coursePopularData,
    isLoading: isCoursePopularLoading,
    isSuccess: isCoursePopularSuccess,
  } = useGetPopularCourseQuery({
    topicId: -1,
    size: 8,
  });

  useEffect(() => {
    if (isCourseNewestSuccess) {
      setCourseNewest(courseNewestData?.data as Course[]);
    }
    if (isCoursePopularSuccess) {
      setCoursePopular(coursePopularData?.data as Course[]);
    }
  }, [courseNewestData, coursePopularData]);

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-out-back",
      delay: 100,
      once: true,
    });
  });

  if (isCourseNewestLoading || isCoursePopularLoading)
    return (
      <Fragment>
        <Loading />
      </Fragment>
    );

  const handleSearch = (topic: any) => {
    router.push("/course/search?topicId=" + topic.id);
  };

  const renderCourse = (courseList: Course[], title: string) => {
    return (
      <Fragment>
        {courseList ? (
          <Fragment>
            <div className="flex-between">
              <h2 className="text-3xl font-bold ml-6 text-[#00df9a] ">
                {title}
              </h2>
              <button
                onClick={() => router.push("/course/search")}
                style={{
                  background:
                    " linear-gradient(349deg, rgba(122,242,131,1) 0%, rgba(193,235,185,1) 18%, rgba(81,241,234,0.3031337535014006) 95%)",
                }}
                className="hover:cursor-pointer hover:text-orange-400 xs:mr-4 rounded-2xl text-white px-4 py-2 font-medium"
              >
                Xem thêm
              </button>
            </div>

            <div className="justify-center items-center xs:justify-normal xs:items-start w-full xs:overflow-x-scroll xs:gap-5 mb-5 grid grid-cols-4">
              <Fragment>
                {courseList.map((course) => (
                  <div key={course.id}>
                    <CourseCard course={course} />
                  </div>
                ))}
              </Fragment>
            </div>
          </Fragment>
        ) : null}
      </Fragment>
    );
  };

  return (
    <main className=" max-w-screen-2xl w-full mx-auto flex-col">
      {/* <section className="nav-padding w-full flex-center">
        <div className="flex-center relative bg-banner bg-center bg-cover rounded-xl min-h-[300px] w-11/12 flex-col mb-8">
          <h1 className="sm:heading1 heading2 text-center text-white">
            EXPERT LEARNING
          </h1>
          <p className="text-white font-semibold xs:hidden">
            {text} <Cursor cursorColor="rgb(43,43,43)" cursorStyle="|" />
          </p>
        </div>
      </section> */}
      <div
        className="text-white relative flex mt-[-100px] "
        style={{
          background:
            " radial-gradient(circle, rgba(122,242,131,1) 0%, rgba(193,235,185,1) 44%, rgba(81,241,234,0.3031337535014006) 95%)",
        }}
      >
        <div className="max-w-[800px] w-full h-screen text-center flex flex-col justify-center z-10 ml-20">
          <div>
            <p
              className="text-[#00df9a] font-bold p-2 text-5xl [animation-fill-mode:both] [animation-delay:500ms] "
              data-aos="fade-up"
            >
              EXPERT LEARNING
            </p>
            <h1
              className="md:text-7xl sm:text-6xl text-4xl font-bold md:py-6 animate-background-shine bg-[linear-gradient(110deg,#939393,45%,#1e293b,55%,#939393)] bg-[length:250%_100%] bg-clip-text  text-transparent"
              data-aos="fade-up"
            >
              Grow with course
            </h1>
            <div className="flex justify-center items-center">
              <ReactTyped
                className="md:text-5xl sm:text-4xl text-xl font-bold md:pl-4 pl-2"
                strings={[
                  "We accompany you on your learning journey and personal development",
                  "Become an expert in your field with high-quality courses.",
                ]}
                typeSpeed={50}
                backSpeed={50}
                loop
              />
            </div>
            <p
              className="md:text-2xl text-xl font-bold text-gray-500 [animation-fill-mode:both] [animation-delay:500ms]"
              data-aos="fade-up"
            >
              Unleash unlimited knowledge with our online courses, invest in
              your bright future today
            </p>
            <button className="bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black">
              Get Started
            </button>
          </div>
        </div>
        <Image
          className="w-[600px] mx-auto my-4 absolute right-0 top-20"
          src={"/hero.png"}
          alt="/"
          width={700}
          height={300}
        />
      </div>
      <div className="max-w-[1240px] mx-auto grid lg:grid-cols-2 ">
        <Image
          className="w-[500px] mx-auto my-4"
          src={"/laptop-removebg.png"}
          alt="/"
          width={500}
          height={200}
          data-aos="fade-up"
        />
        <div className="flex flex-col justify-center">
          <p className="text-[#00df9a] font-bold " data-aos="fade-up">
            E-LEARNING
          </p>
          <h1
            className="md:text-4xl sm:text-3xl text-2xl font-bold py-2"
            data-aos="fade-left"
          >
            Empower Your Future: Centralized Data Analytics and Comprehensive
            Online Learning
          </h1>
          <p data-aos="fade-right">
            Explore the vast expanse of knowledge and skills with our
            comprehensive online courses, tailored to suit your learning pace
            and style. Invest in your future today, and embark on a journey of
            lifelong learning, opening doors to new opportunities and a brighter
            future
          </p>
          <button className="bg-black text-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto md:mx-0 py-3">
            Get Started
          </button>
        </div>
      </div>

      <div className="mx-10 xs:mx-0">
        {renderCourse(courseNewest, "NEW COURSES")}
      </div>
      <div className="w-full py-[10rem] px-4 ">
        <h2 className="text-3xl font-bold ml-6 text-[#00df9a] ">Topic</h2>

        <div className="grid grid-cols-4 gap-4 mx-10">
          {Topic.map((topic, index) => (
            <div
              key={index}
              className="w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300"
              style={{
                background:
                  "linear-gradient(349deg, rgba(244,250,243,1) 31%, rgba(125,247,207,0.5188200280112045) 73%)",
              }}
              data-aos="zoom-in-up"
            >
              <h2 className="text-2xl font-bold text-center py-8">
                {topic.name}
              </h2>

              <button
                className="bg-[#00df9a] w-[100px] rounded-2xl font-medium my-3 mx-auto py-3"
                onClick={() => handleSearch(topic)}
              >
                Get
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-10 xs:mx-0">
        {renderCourse(coursePopular, "POPULAR COURSES")}
      </div>
      <div className="flex-center">
        {/* <Paginate totalPage={4} key={"123123"} setPage={setPage} /> */}
        {/* {newestCourseList.length !== 0 ? (
          <Paginate totalPage={newestCourseList.length} />
        ) : null} */}
      </div>
    </main>
  );
}
