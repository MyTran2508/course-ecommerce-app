import { useAppSelector } from "@/redux/hooks/reduxHooks";
import {
  useSetDisLikeReviewMutation,
  useSetLikeReviewMutation,
} from "@/redux/services/reviewApi";
import { Review } from "@/types/review.type";
import { Action, ToastMessage, ToastStatus } from "@/utils/resources";
import showToast from "@/utils/showToast";
import Image from "next/image";
import React, { useState } from "react";
import { BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { FaRegStar, FaStar } from "react-icons/fa";

interface ReviewComponentProps {
  review: Review;
  setUserReactionReview: (userReactionReview: boolean) => void;
}

function ReviewComponent(props: ReviewComponentProps) {
  const { review, setUserReactionReview } = props;
  const username = useAppSelector(
    (state) => state.persistedReducer.userReducer.user.username
  );
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [setLikeReview] = useSetLikeReviewMutation();
  const [setDisLikeReview] = useSetDisLikeReviewMutation();

  const handleReactionReview = (action: Action) => {
    if (isButtonDisabled) {
      showToast(ToastStatus.WARNING, ToastMessage.PLEASE_WAIT);
      return;
    }
    setIsButtonDisabled(true);

    if (!username)
      return showToast(ToastStatus.WARNING, ToastMessage.LOGIN_REQUIRED);
    if (action === Action.LIKE) {
      if (review.isUserLiking) {
        setLikeReview({
          courseReviewId: review.id as string,
          username: username,
          isCancel: true,
        });
      } else {
        setLikeReview({
          courseReviewId: review.id as string,
          username: username,
          isCancel: false,
        });
      }
    } else {
      if (review.isUserDisliking) {
        setDisLikeReview({
          courseReviewId: review.id as string,
          username: username,
          isCancel: true,
        });
      } else {
        setDisLikeReview({
          courseReviewId: review.id as string,
          username: username,
          isCancel: false,
        });
      }
    }
    setUserReactionReview(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 2000);
  };
  return (
    <div className="ml-2">
      <div className="flex gap-2 mb-2">
        <Image
          src={
            review.userAvatar
              ? `data:image/png;base64,${review.userAvatar}`
              : "/banner.jpg"
          }
          width={400}
          height={400}
          className="w-12 h-12 rounded-full"
          alt="avatar"
        />
        <div>
          <h3 className="font-bold text-orange-500">{review.username}</h3>
          <div className="flex">
            {[...Array(5)].map((_, index) => {
              if (index < (review.rating as number)) {
                return <FaStar key={index} fill={"#ffd03f"} />;
              } else {
                return <FaRegStar key={index} fill={"#ffd03f"} />;
              }
            })}
          </div>
        </div>
      </div>
      <p className=" font-normal text-sm">{review.message}</p>
      <span className="text-xs text-gray-500 italic my-3">
        Was this review helpful?
      </span>
      <div className="flex gap-2 ">
        <button
          className="flex items-center"
          onClick={() => handleReactionReview(Action.LIKE)}
          disabled={isButtonDisabled}
        >
          {review.isUserLiking ? (
            <BiSolidLike fill="#3182ce" />
          ) : (
            <BiSolidLike />
          )}

          <p className="text-sm">({review.likeAmount})</p>
        </button>
        <button
          className="flex items-center"
          onClick={() => handleReactionReview(Action.DISLIKE)}
          disabled={isButtonDisabled}
        >
          {review.isUserDisliking ? (
            <BiSolidDislike color="#3182ce" />
          ) : (
            <BiSolidDislike />
          )}

          <p className="text-sm">({review.disLikeAmount})</p>
        </button>
      </div>
      <hr className="my-2" />
    </div>
  );
}

export default ReviewComponent;
