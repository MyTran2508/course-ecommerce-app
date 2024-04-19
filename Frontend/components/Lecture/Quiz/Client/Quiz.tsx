import { useLazyGetExQuizByIdQuery } from "@/redux/services/quizApi";
import { ExQuiz, Question, UserAnswer, UserQuiz } from "@/types/section.type";
import {
  Action,
  DEFAULT_PAGE_SIZE,
  QuizType,
  StatusCode,
  ToastMessage,
  ToastStatus,
} from "@/utils/resources";
import React, { Fragment, useEffect, useState } from "react";
import { CiClock2 } from "react-icons/ci";
import QuestionComponent from "./Question";
import { UserAnswerRequest } from "@/types/request.type";
import { v4 as uuidv4 } from "uuid";
import { get, set } from "lodash";
import { useUserQuizHooks } from "@/redux/hooks/courseHooks/userQuizHooks";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/reduxHooks";
import {
  convertLongToTime,
  extractId,
  formatTime,
  getCurrentTimeInMillisecondsFromAPI,
} from "@/utils/function";
import Swal from "sweetalert2";
import { useLazyGetUserQuizByUserIdAndQuizIdQuery } from "@/redux/services/userQuizApi";
import { deleteUserQuiz, setUserQuiz } from "@/redux/features/quizSlice";
import showToast from "@/utils/showToast";
import CompleteQuiz from "./CompleteQuiz";

interface AnswerProps {
  exQuiz: ExQuiz;
}

const Answer = (props: AnswerProps) => {
  const { exQuiz } = props;
  const dispatch = useAppDispatch();
  const quizState = useAppSelector(
    (state) => state.persistedReducer.quizReducer.quiz
  )?.find((q) => q.exQuizId === exQuiz.id);
  const [getExQuizById, { data: exQuizData }] = useLazyGetExQuizByIdQuery();
  const [getUserAnswerByUserIdAndExQuizId, { data: userAnswersData }] =
    useLazyGetUserQuizByUserIdAndQuizIdQuery();
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [isStartQuiz, setStartQuiz] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<UserAnswerRequest>();
  const [userQuizId, setUserQuizId] = useState<string>(
    (quizState as any)?.userQuizId || ""
  );
  const [timeLeft, setTimeLeft] = useState((exQuiz.limitTime as number) / 1000);
  const userId = useAppSelector(
    (state) => state.persistedReducer.userReducer.user.id
  );
  const { handleAddUserQuiz, handleUpsertUserQuiz } = useUserQuizHooks();

  const percentageCompleted =
    (userAnswers.filter(
      (userAnswer) => (userAnswer.currentAnswer?.length as number) > 0
    ).length /
      (exQuiz.totalQuestion as number)) *
    100;

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn bg-blue-700 text-white px-4 py-2 rounded-md mx-2",
      cancelButton: "btn bg-red-700 text-white px-4 py-2 rounded-md",
    },
    buttonsStyling: false,
  });

  const handleChangeQuestion = (action: Action) => {
    if (action === Action.NEXT) {
      setQuestionIndex(questionIndex + 1);
    } else if (action === Action.PREVIOUS) {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const handleStartQuiz = async () => {
    const userQuizId = await handleAddUserQuiz({
      userId: userId as string,
      startTime: await getCurrentTimeInMillisecondsFromAPI(),
      limitTime: exQuiz.limitTime,
      exQuizId: exQuiz.id as string,
    });
    console.log(userQuizId, "userQuizId");
    setUserQuizId(extractId(userQuizId));
    dispatch(
      setUserQuiz({
        exQuizId: exQuiz.id as string,
        userQuizId: extractId(userQuizId),
        expiryTime: exQuiz.limitTime as number,
      })
    );
    setStartQuiz(true);
  };

  const handleSubmit = () => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        // text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, submit it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Submit!",
            icon: "success",
          });
          dispatch(deleteUserQuiz(exQuiz.id as string));
          handleUpsertUserQuiz(userQuizId, true, userAnswers);
          setStartQuiz(false);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            icon: "info",
          });
        }
      });
  };

  useEffect(() => {
    if (quizState) {
      setUserQuizId(quizState.userQuizId);
      setStartQuiz(true);
    } else {
      setUserQuizId("");
      setStartQuiz(false);
    }
    getUserAnswerByUserIdAndExQuizId({
      userId: userId as string,
      exQuizId: exQuiz.id as string,
    });
    setUserAnswers([]);
    setQuestionIndex(0);
  }, [quizState, exQuiz.id]);

  useEffect(() => {
    if (
      !timeLeft ||
      (userQuizId?.length === 0 && !isStartQuiz) ||
      Math.round(timeLeft) === 0
    ) {
      return;
    }
    if (timeLeft < 2) {
      dispatch(deleteUserQuiz(exQuiz.id as string));
      handleUpsertUserQuiz(userQuizId, true, userAnswers);
      showToast(ToastStatus.SUCCESS, ToastMessage.SUBMIT_SUCCESS);
    }
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  // useEffect(() => {
  //   const fetchQuestion = async () => {
  //     if (isStartQuiz) {
  //       await getExQuizById({
  //         id: exQuiz.id as string,
  //         page: {
  //           pageIndex: 0,
  //           pageSize: DEFAULT_PAGE_SIZE,
  //         },
  //       });
  //     }
  //   };

  //   fetchQuestion();
  // }, [isStartQuiz]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (exQuizData) {
  //       const newUserAnswers = (exQuizData.data as Question[]).map(
  //         (question) => {
  //           return {
  //             question: question,
  //             currentAnswer: "",
  //           };
  //         }
  //       );
  //       if (userAnswers.length === 0) {
  //         await handleUpsertUserQuiz(userQuizId, false, newUserAnswers);
  //         await getUserAnswerByUserIdAndExQuizId({
  //           userId: userId as string,
  //           exQuizId: exQuiz.id as string,
  //         });
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [exQuizData]);

  useEffect(() => {
    if (userAnswersData?.statusCode === StatusCode.REQUEST_SUCCESS) {
      const fetchData = async () => {
        const listUserAnswer = (userAnswersData.data as UserQuiz)
          .userAnswers as UserAnswer[];
        if (listUserAnswer.length !== 0) {
          setUserAnswers(
            (userAnswersData.data as UserQuiz).userAnswers as UserAnswer[]
          );
        }
        const startTime = (userAnswersData.data as UserQuiz).startTime;
        const limitTime = exQuiz.limitTime;
        if (startTime && limitTime) {
          const timeQuiz =
            startTime +
            limitTime -
            (await getCurrentTimeInMillisecondsFromAPI());
          if (timeQuiz > 0) {
            setTimeLeft(timeQuiz / 1000);
          } else {
            setTimeLeft(0);
            setUserAnswers([]);
            dispatch(deleteUserQuiz(exQuiz.id as string));
          }
        }
      };

      fetchData();
    }
  }, [userAnswersData]);

  useEffect(() => {
    if (userAnswer) {
      const updateUserAnswers = set(
        [...userAnswers],
        questionIndex,
        userAnswer
      );
      handleUpsertUserQuiz(userQuizId, false, updateUserAnswers);
      setUserAnswers(updateUserAnswers);
    }
  }, [userAnswer]);

  return (
    <div className="mx-20">
      {!isStartQuiz &&
        !(userAnswersData?.data as UserQuiz)?.score &&
        (userAnswersData?.data as UserQuiz)?.score !== 0 && (
          <Fragment>
            <div className="flex items-center justify-end gap-3">
              <p>
                Thời gian:{" "}
                {convertLongToTime(
                  (exQuiz.limitTime as number) / 1000,
                  true,
                  true
                )}
              </p>
              <p> Số lượng câu hỏi: {exQuiz.totalQuestion}</p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleStartQuiz()}
              >
                Start
              </button>
            </div>
          </Fragment>
        )}

      {(userAnswersData?.data as UserQuiz)?.correctAnswerCount ? (
        <Fragment>
          <CompleteQuiz userQuiz={userAnswersData?.data as UserQuiz} />
        </Fragment>
      ) : (
        <Fragment>
          {userAnswers.length > 0 && isStartQuiz && (
            <Fragment>
              <div className="flex bg-gray-300 p-2 items-center justify-center gap-2 rounded-md">
                <div>
                  {
                    userAnswers.filter(
                      (answer) => (answer.currentAnswer?.length as number) > 0
                    ).length
                  }
                  /{exQuiz.totalQuestion}
                </div>
                <div className="w-full flex">
                  <div
                    className="h-4 bg-red-500 transition-all duration-500"
                    style={{ width: `${percentageCompleted}%` }}
                  />
                  <div
                    className="h-4 bg-gray-200 transition-all duration-500"
                    style={{ width: `${100 - percentageCompleted}%` }}
                  />
                </div>
                <CiClock2 className={"text-2xl"} />
                <div className="w-max">{convertLongToTime(timeLeft)}</div>
                <button
                  className="bg-green-700 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleSubmit()}
                >
                  Submit
                </button>
              </div>
              <QuestionComponent
                userAnswer={userAnswers[questionIndex]}
                key={uuidv4()}
                updateUserAnswer={setUserAnswer}
              />
              <div className="flex-between gap-3">
                <button
                  disabled={questionIndex === 0 ? true : false}
                  onClick={() => handleChangeQuestion(Action.PREVIOUS)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Previous
                </button>
                <button
                  disabled={
                    (exQuiz.totalQuestion as number) === questionIndex + 1
                      ? true
                      : false
                  }
                  onClick={() => handleChangeQuestion(Action.NEXT)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Next
                </button>
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default Answer;
