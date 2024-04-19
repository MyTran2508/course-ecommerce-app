"use client";
import React, { Fragment, useEffect, useState } from "react";
import DisclosureCourseContent from "@/components/DisclosureCourseContent";
import { BsDot } from "react-icons/bs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomButton from "@/components/CustomButton";
import { GoVideo, GoInfinity } from "react-icons/go";
import { HiOutlineFilm } from "react-icons/hi";
import { GrCertificate } from "react-icons/gr";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/reduxHooks";
import { Cart } from "@/types/cart.type";
import { addToCart } from "@/redux/features/cartSlice";
import showToast from "@/utils/showToast";
import { ToastMessage, ToastStatus } from "@/utils/resources";
import { useParams } from "next/navigation";
import {
  useGetCourseByIdQuery,
  useLoadFileFromCloudQuery,
} from "@/redux/services/courseApi";
import Loading from "../../user/personal/loading";
import { Course } from "@/types/course.type";
import { useGetContentByCourseIdQuery } from "@/redux/services/contentApi";
import Content, { Description } from "@/types/content.type";
import { Section } from "@/types/section.type";
import { handleCountFieldsInSection } from "@/utils/function";
import { useRouter } from "next/navigation";
import {
  useGetCourseAccessQuery,
  useLazyGetCourseAccessQuery,
} from "@/redux/services/courseProcessApi";
import { IoCheckmarkDone } from "react-icons/io5";
import { Order, OrderStatus, ShippingMethod } from "@/types/order.type";
import { useAddOrderMutation } from "@/redux/services/orderApi";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useReviewHooks } from "@/redux/hooks/courseHooks/reviewHooks";
import { Review } from "@/types/review.type";
import ReviewComponent from "@/components/Review/ReviewComponent";
import Paginate from "@/components/Paginate/Paginate";

const initCourse: Course = {
  id: "0",
  name: "",
  language: {
    id: "0",
  },
  level: {
    id: "0",
  },
  topic: {
    id: "0",
  },
};

function CoursePage() {
  const param = useParams();
  const router = useRouter();
  const userId = useAppSelector(
    (state) => state.persistedReducer.userReducer.user.id
  );
  const [isOpenAllContent, setOpenAllContent] = useState<boolean>(false);
  const [course, setCourse] = useState(initCourse);
  const [video, setVideo] = useState("");
  const [description, setDescription] = useState<Description>();
  const [sections, setSections] = useState<Section[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReactionReview, setUserReactionReview] = useState<boolean>(false);
  const [pageReview, setPageReview] = useState(0);
  const carts = useAppSelector((state) => state.persistedReducer.cartReducer);
  const dispatch = useAppDispatch();
  const [addOrder] = useAddOrderMutation();
  const { handleGetReviewByCourseId } = useReviewHooks();
  const { data: contentData, isSuccess } = useGetContentByCourseIdQuery(
    param.id as string
  );
  const { totalDurationCourse, totalLectureCount } =
    handleCountFieldsInSection(sections);
  const user = useAppSelector(
    (state) => state.persistedReducer.userReducer.user
  );

  useEffect(() => {
    if (isSuccess) {
      setCourse((contentData?.data as Content).course as Course);
      setVideo(
        ((contentData?.data as Content).course as Course)
          ?.urlPromotionVideos as string
      );
      setSections(
        ((contentData?.data as Content).sections as Section[])?.filter(
          (section) => section.ordinalNumber !== -1
        )
      );
      setDescription((contentData?.data as Content).description);
    }
  }, [contentData]);

  useEffect(() => {
    setTimeout(() => {
      handleGetReviewByCourseId(param.id as string, pageReview).then((res) => {
        setReviews(res.data as Review[]);
      });
    }, 500);
    if (userReactionReview) {
      setUserReactionReview(false);
    }
  }, [pageReview, userReactionReview]);

  const handleClickOpenAllContent = () => {
    setOpenAllContent(!isOpenAllContent);
  };

  const renderCourseContent = () => {
    return (
      <div>
        {sections?.map((section, index) => {
          return (
            <div key={index}>
              <DisclosureCourseContent
                openAll={isOpenAllContent}
                key={uuidv4()}
                section={section}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const handleAddToCart = () => {
    const newCart: Cart = {
      id: uuidv4().toString(),
      courseId: course.id as string,
      image: course.urlCourseImages as string,
      nameCourse: course.name,
      totalSection: sections.length,
      totalDurationCourse: totalDurationCourse,
      totalLecture: totalLectureCount,
      price: course.price as number,
      checked: false,
    };

    if (
      carts.length === 0 ||
      carts.every((cart: Cart) => cart.nameCourse !== newCart.nameCourse)
    ) {
      dispatch(addToCart(newCart));
      showToast(ToastStatus.SUCCESS, ToastMessage.ADD_CART_SUCCESS);
    } else {
      showToast(ToastStatus.WARNING, ToastMessage.ADD_CART_DUPLICATE);
    }
  };

  const handleAddOrder = async (newOrder: Order) => {
    await addOrder(newOrder)
      .unwrap()
      .then((fulfilled) => {
        console.log(fulfilled);
        showToast(ToastStatus.SUCCESS, ToastMessage.REGISTER_COURSE_SUCCESS);
        router.push("/");
      });
  };

  const handleRegisterCourseFree = () => {
    if (user.id !== "") {
      const newOrder: Order = {
        totalPrice: 0,
        orderStatus: OrderStatus.PAID,
        shippingMethod: ShippingMethod.PAYPAL,
        orderItems: [
          {
            price: 0,
            courseId: course.id as string,
          },
        ],
        user: {
          id: user.id,
        },
      };
      handleAddOrder(newOrder);
    } else {
      router.push("/login");
    }
  };
  return (
    <div className="xl:flex m-2 mt-10 gap-2 font-roboto">
      <Fragment>
        <div className="xl:w-2/3 ml-8 xs:m-6">
          <div className="text-3xl font-bold mb-6"> {course?.name}</div>

          {course.averageRating ? (
            <Fragment>
              <div className="flex gap-1 items-center mb-5">
                <div
                  className="mr-1 font-bold  text-3xl"
                  style={{
                    color: "#ffaa00",
                  }}
                >
                  {course.averageRating}
                </div>
                {[...Array(5)].map((_, index) => {
                  const star = Math.floor(course.averageRating as number);
                  const halfStar = (course.averageRating as number) - star;
                  if (index < star) {
                    return (
                      <FaStar
                        key={index}
                        fill={"#ffaa00"}
                        className="text-2xl"
                      />
                    );
                  } else if (index === star && halfStar > 0) {
                    return (
                      <FaStarHalfAlt
                        key={index}
                        fill={"#ffaa00"}
                        className="text-2xl"
                      />
                    );
                  } else {
                    return (
                      <FaRegStar
                        key={index}
                        fill={"#ffaa00"}
                        className="text-2xl"
                      />
                    );
                  }
                })}
                <p className="mr-2 italic">
                  {course.totalRatings as number} reviews
                </p>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="flex gap-1 items-center mb-5">
                <div
                  className="mr-1 font-bold  text-3xl"
                  style={{
                    color: "#ffaa00",
                  }}
                >
                  0
                </div>
                {[...Array(5)].map((_, index) => {
                  return (
                    <FaRegStar
                      key={index}
                      fill={"#ffd03f"}
                      className="text-2xl"
                    />
                  );
                })}
              </div>
            </Fragment>
          )}

          <div className="font-light mb-2">{course?.subTitle}</div>
          {renderTargetConsumers(description as Description)}
          <div className="">
            {/* sticky top-[80px] z-1 */}
            <div className="text-2xl font-bold md-6 ">Nội Dung Khóa Học</div>
            <div className="flex-between my-2 xs:text-[10px]">
              <div className="flex-start xl:gap-2 xs:gap-0.5">
                <div>{sections?.length} chương</div>
                <BsDot className="text-2xl xs:text-[10px]" />
                <div>{totalLectureCount} bài học</div>
                <BsDot className="text-2xl xs:text-[10px]" />
                <div>Thời lượng {totalDurationCourse}</div>
              </div>
              <div
                onClick={() => {
                  handleClickOpenAllContent();
                }}
                className="hover:cursor-pointer text-orange-600 xs:ml-1"
              >
                {isOpenAllContent ? "Thu gọn tất cả" : "Mở rộng tất cả"}
              </div>
            </div>
          </div>
          <div className="w-full">{renderCourseContent()}</div>
          {renderRequirement(description as Description)}
          {renderDetails(description as Description)}
          <div className="border rounded-md p-5">
            <h1 className="text-2xl font-bold">REVIEWS</h1>
            {course.averageRating ? (
              <Fragment>
                <div className="flex gap-2 items-center mb-5">
                  <div className="mr-1 font-bold text-yellow-400 text-3xl">
                    {course.averageRating}
                  </div>
                  <div className="flex gap-1 text-2xl">
                    {[...Array(5)].map((_, index) => {
                      const star = Math.floor(course.averageRating as number);
                      const halfStar = (course.averageRating as number) - star;
                      if (index < star) {
                        return <FaStar key={index} fill={"#ffd03f"} />;
                      } else if (index === star && halfStar > 0) {
                        return <FaStarHalfAlt key={index} fill={"#ffd03f"} />;
                      } else {
                        return <FaRegStar key={index} fill={"#ffd03f"} />;
                      }
                    })}
                  </div>
                  <p className="mr-2 italic">
                    {course.totalRatings as number} reviews
                  </p>
                </div>
                {Object.entries(
                  course.ratingNumbersByStar as Record<string, number>
                ).map(([star, count]) => (
                  <li key={star} className="flex items-center space-x-2 mb-1">
                    <div className="flex items-center space-x-1">
                      <span>{star}</span>
                      <FaStar fill={"#00000"} />
                    </div>
                    <div className="bg-slate-400 w-[90%] h-3 rounded-lg">
                      <div
                        className="h-full bg-yellow-400 rounded-lg"
                        style={{ width: `${count}%` }}
                      ></div>
                    </div>
                    <span className="ml-auto">{count}%</span>
                  </li>
                ))}
                <div className="mt-10 space-y-4">
                  {reviews.length > 0 ? (
                    <Fragment>
                      {reviews.map((review, index) => (
                        <ReviewComponent
                          key={index}
                          review={review}
                          setUserReactionReview={setUserReactionReview}
                        />
                      ))}
                    </Fragment>
                  ) : null}
                </div>
                {(course.totalRatings as number) !== 1 && (
                  <div className="flex justify-center">
                    <Paginate
                      currentPage={pageReview}
                      setCurrentPage={setPageReview}
                      totalPage={course.totalRatings as number}
                    />
                  </div>
                )}
              </Fragment>
            ) : (
              <div className="text-2xl font-bold md-6 mt-10 mb-5 flex justify-center italic">
                No reviews yet
              </div>
            )}
          </div>
        </div>
        <div className="xl:w-1/3 flex mr-2">
          <Card
            className="p-4 max-w-md mx-auto shadow-md sticky top-[65px] z-10 max-h-[550px]"
            style={{
              background:
                "linear-gradient(349deg, rgba(244,250,243,1) 31%, rgba(151, 196, 203,0.5188200280112045) 73%)",
            }}
          >
            <CardTitle className="text-xl font-semibold mb-2 ml-2">
              {course?.name}
            </CardTitle>
            <CardHeader>
              <video
                controls
                src={course?.urlPromotionVideos}
                className="w-96 h-[200px] rounded-md"
                autoPlay
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {course?.price === 0 ? (
                  <span>Miễn Phí</span>
                ) : (
                  course?.price?.toLocaleString() + "₫"
                )}
              </div>
              <div className="flex justify-center mb-2 text-white xs:bg-red-950 xs:h-full ">
                {course?.price === 0 ? (
                  <CustomButton
                    title="Đăng Ký Học"
                    containerStyles="bg-orange-600 rounded-3xl py-2 px-4 xs:fixed xs:bottom-0 xs:w-full xs:mb-0 xs:rounded-sm xs:ml-[10px] "
                    handleClick={() => handleRegisterCourseFree()}
                  />
                ) : (
                  <CustomButton
                    title="Thêm vào giỏ hàng"
                    containerStyles="bg-orange-600 rounded-3xl py-2 px-4 xs:fixed xs:bottom-0 xs:w-full xs:mb-0 xs:rounded-sm xs:ml-[10px] "
                    handleClick={() => handleAddToCart()}
                  />
                )}
              </div>
              <div className="flex-start text-sm flex-col">
                <div className="font-semibold mb-2">Khóa Học Này Bao Gồm:</div>

                <div className="flex-start gap-4 pl-4 mb-1">
                  <GoVideo /> Thời lượng {totalDurationCourse}
                </div>
                <div className="flex-start gap-4 pl-4 mb-1">
                  <HiOutlineFilm /> Tổng số {totalLectureCount} bài học
                </div>
                <div className="flex-start gap-4 pl-4 mb-1">
                  <GrCertificate /> Chứng chỉ hoàn thành khóa học
                </div>
                <div className="flex-start gap-4 pl-4 mb-1">
                  <GoInfinity /> Truy Cập Trọn Đời
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Fragment>
    </div>
  );
}

export const renderTargetConsumers = (description: Description) => {
  if (description) {
    const targetConsumers = description.targetConsumers;
    if (targetConsumers.length === 2) {
      return null;
    }
    const targetConsumersList = targetConsumers.split("/n");

    return (
      <Fragment>
        <div className="text-2xl font-bold md-6 mt-10 mb-5">
          Bạn sẽ học được những gì?
        </div>
        <div className="grid grid-cols-2 gap-2 mb-10">
          {targetConsumersList.map((targetConsumer, index) => {
            if (targetConsumer !== "") {
              return (
                <div key={index} className="flex gap-2">
                  <IoCheckmarkDone className="text-orange-500 flex-shrink-0" />
                  {targetConsumer}
                </div>
              );
            }
            return null;
          })}
        </div>
      </Fragment>
    );
  }
  return null;
};

export const renderRequirement = (description: Description) => {
  if (description) {
    const requirements = description.requirements;
    const requirementsList = requirements.split("/n");
    if (requirements.length === 2) {
      return null;
    }
    return (
      <Fragment>
        <div className="text-2xl font-bold md-6 mt-10 mb-5">Yêu Cầu</div>

        {requirementsList.map((requirement, index) => {
          if (requirement !== "") {
            return (
              <div key={index} className="flex gap-2 mb-5">
                <IoCheckmarkDone className="text-orange-500 flex-shrink-0" />
                {requirement}
              </div>
            );
          }
          return null;
        })}
      </Fragment>
    );
  }
  return null;
};

export const renderDetails = (description: Description) => {
  if (description) {
    const details = description.details;
    const detailsList = details.split("/n");
    if (details.length === 2) {
      return null;
    }
    return (
      <Fragment>
        <div className="text-2xl font-bold md-6 mt-10 mb-5">
          Khóa học giành cho ai?
        </div>

        {detailsList.map((detail, index) => {
          if (detail !== "") {
            return (
              <div key={index} className="flex gap-2 mb-5">
                <IoCheckmarkDone className="text-orange-500  flex-shrink-0" />
                {detail}
              </div>
            );
          }
          return null;
        })}
      </Fragment>
    );
  }
  return null;
};
export default CoursePage;
