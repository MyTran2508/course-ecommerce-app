import {
  useAddReviewMutation,
  useGetReviewByCourseIdMutation,
  useUpdateReviewMutation,
} from "@/redux/services/reviewApi";
import { SearchRequest } from "@/types/request.type";
import { Review } from "@/types/review.type";

export function useReviewHooks() {
  const [
    addReview,
    { isLoading: isAddingReview, isSuccess: addReviewSuccess },
  ] = useAddReviewMutation();

  const [updateReview, { isLoading: isUpdatingReview }] =
    useUpdateReviewMutation();

  const [getReviewByCourseId] = useGetReviewByCourseIdMutation();

  const handleGetReviewByCourseId = async (
    courseId: string,
    pageIndex: number
  ) => {
    const searchCourseRequest: SearchRequest = {
      keyword: [courseId],
      pageIndex: pageIndex,
      pageSize: 5,
    };

    return getReviewByCourseId(searchCourseRequest)
      .unwrap()
      .then((fulfilled) => {
        console.log(fulfilled);
        return fulfilled;
      });
  };

  const handleAddReview = async (review: Review) => {
    await addReview(review)
      .unwrap()
      .then((fulfilled) => {
        console.log(fulfilled);
      });
  };
  const handleUpdateReview = async (review: Review) => {
    await updateReview(review)
      .unwrap()
      .then((fulfilled) => {
        console.log(fulfilled);
      });
  };

  return {
    handleAddReview,
    handleUpdateReview,
    handleGetReviewByCourseId,
  };
}
