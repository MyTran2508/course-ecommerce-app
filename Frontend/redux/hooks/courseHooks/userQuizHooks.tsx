import {
  useAddUserQuizMutation,
  useUpsertUserQuizMutation,
} from "@/redux/services/userQuizApi";
import { UserAnswerRequest, UserQuizRequest } from "@/types/request.type";

export function useUserQuizHooks() {
  const [addUserQuiz] = useAddUserQuizMutation();
  const [upsertUserQuiz] = useUpsertUserQuizMutation();

  const handleAddUserQuiz = async (userQuizRequest: UserQuizRequest) => {
    return await addUserQuiz(userQuizRequest)
      .unwrap()
      .then((fulfilled) => {
        return fulfilled.data as string;
      });
  };
  const handleUpsertUserQuiz = async (
    userQuizId: string,
    isSubmit: boolean,
    data: UserAnswerRequest[]
  ) => {
    await upsertUserQuiz({
      userQuizId: userQuizId,
      isSubmit: isSubmit,
      data: data,
    })
      .unwrap()
      .then((fulfilled) => {
        console.log(fulfilled);
      });
  };

  return {
    handleAddUserQuiz,
    handleUpsertUserQuiz,
  };
}
