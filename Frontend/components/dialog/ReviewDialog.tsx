import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaRegStar, FaStar } from "react-icons/fa";
import { Button } from "../ui/button";
import { useReviewHooks } from "@/redux/hooks/courseHooks/reviewHooks";
import { Review } from "@/types/review.type";
import { Course } from "@/types/course.type";
import { useAppSelector } from "@/redux/hooks/reduxHooks";
import showToast from "@/utils/showToast";
import { ToastMessage, ToastStatus } from "@/utils/resources";
import { useGetReviewByUserNameAndCourseIdQuery } from "@/redux/services/reviewApi";

interface ReviewDialogProps {
  isRating: boolean;
  setIsRating: (isRating: boolean) => void;
  course: Course;
  review?: Review;
}
function ReviewDialog(props: ReviewDialogProps) {
  const { isRating, setIsRating, course, review } = props;
  const username = useAppSelector(
    (state) => state.persistedReducer.userReducer.user.username
  );
  const avatar = useAppSelector(
    (state) => state.persistedReducer.userReducer.user.photos
  );
  const [rating, setRating] = React.useState(review?.rating || 0);
  const [message, setMessage] = React.useState(review?.message || "");
  const { handleAddReview, handleUpdateReview } = useReviewHooks();

  useEffect(() => {
    console.log(review);
    setRating(review?.rating || 0);
    setMessage(review?.message || "");
  }, [review]);

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleReview = async () => {
    console.log(avatar);
    if (!review?.rating) {
      const newReview: Review = {
        course: course,
        rating: rating,
        message: message,
        userAvatar: avatar as string,
        username,
      };
      handleAddReview(newReview);
      showToast(ToastStatus.SUCCESS, ToastMessage.REVIEW_SUCCESS);
    } else {
      const updateReview: Review = {
        ...review,
        rating: rating,
        userAvatar: avatar as string,
        message: message,
      };
      await handleUpdateReview(updateReview);
      showToast(ToastStatus.SUCCESS, ToastMessage.UPDATE_REVIEW_SUCCESS);
    }

    setIsRating(false);
  };

  return (
    <div>
      <Dialog open={isRating} onOpenChange={() => setIsRating(false)}>
        <DialogContent className="w-[500px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              How would you rate this course?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <h2 className="text-xl flex justify-center my-2 font-bold">
              Select rating
            </h2>

            <div className="flex justify-center">
              {[...Array(5)].map((_, index) => {
                if (index < rating) {
                  return (
                    <FaStar
                      key={index}
                      fill={"#ffd03f"}
                      className={"text-4xl"}
                      onClick={() => handleRatingClick(index + 1)}
                    />
                  );
                } else {
                  return (
                    <FaRegStar
                      key={index}
                      fill={"#ffd03f"}
                      className={"text-4xl"}
                      onClick={() => handleRatingClick(index + 1)}
                    />
                  );
                }
              })}
            </div>
          </DialogDescription>
          <textarea
            placeholder="Tell us about your own personal experience taking this course. Was it a good match for you?"
            className="h-[120px] my-6 border-2 border-gray-300 p-4 w-full resize-none"
            onChange={(e) => setMessage(e.target.value)}
            defaultValue={message}
          />
          <div className="flex gap-2 justify-end">
            <button
              className="bg-gray-300 text-white px-4 py-2 rounded-md mr-4"
              onClick={() => setIsRating(false)}
            >
              Cancel
            </button>

            <Button onClick={() => handleReview()}>Review</Button>
          </div>
        </DialogContent>

        <DialogFooter></DialogFooter>
      </Dialog>
    </div>
  );
}

export default ReviewDialog;
