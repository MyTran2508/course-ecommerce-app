import { Question, UserAnswer, UserQuiz } from "@/types/section.type";
import { QuizType } from "@/utils/resources";
import React, { Fragment } from "react";

interface CompleteQuizProps {
  userQuiz: UserQuiz;
}

function CompleteQuiz(props: CompleteQuizProps) {
  const { userQuiz } = props;
  console.log(userQuiz, "userQuiz");
  const renderAnswer = (userAnswer: UserAnswer) => {
    const answers = ((userAnswer.question as Question).options as string)
      .split("\n")
      .map((option, index) => {
        return {
          isChecked: (userAnswer.currentAnswer as string)
            ?.split("\n")
            .includes(index.toString()),
          answerText: option,
        };
      });
    return (
      <div>
        <div
          className={
            userAnswer.isCorrect
              ? `border-green-500 w-full pl-5 m-1 ml-0 space-x-2 border-2 cursor-pointer  rounded-xl bg-black/5`
              : `border-red-500 w-full pl-5 m-1 ml-0 space-x-2 border-2 cursor-pointer  rounded-xl bg-black/5`
          }
        >
          <div className="flex flex-col items-start w-full">
            <h4 className="mt-5 text-xl text-black/60">
              Question{" "}
              {(userAnswer.question as Question).ordinalNumber as number}{" "}
            </h4>
            <div className="mt-4 text-2xl">
              {(userAnswer.question as Question).title}
            </div>
          </div>
          <div className="my-4 flex justify-center flex-col">
            {answers.map((answer, index) => {
              return (
                <Fragment key={index}>
                  <div className="flex items-center mb-4">
                    <input
                      type={
                        (userAnswer.question as Question).quizType ===
                        QuizType.MULTIPLE_CHOICE
                          ? "checkbox"
                          : "radio"
                      }
                      // name={`answer-${(answer.question as Question).id}`}
                      value={answer.answerText}
                      checked={answer.isChecked}
                      disabled={true}
                      className="w-6 h-6 bg-black"
                    />
                    <p className="ml-3">{answer.answerText}</p>
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>
        <div
          className={
            userAnswer.isCorrect
              ? `bg-green-500 border rounded-md mb-10`
              : `bg-red-500  border rounded-md mb-10`
          }
        >
          <h1 className="font-bold text-md pl-3 mt-2">Đáp án: </h1>
          {(userAnswer.question as Question).answerExplanation
            ?.split("\n")
            .map((explanation, index) => {
              return (
                <div key={index} className="pl-5 pb-3">
                  {explanation}
                </div>
              );
            })}
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-col justify-end">
      <div className="flex items-center m-4 justify-end w-max  bg-blue-500 text-white text-2xl font-bold p-4 rounded-md shadow-lg">
        <span>Điểm số: </span>
        <span className="ml-2">{userQuiz.score}</span>
      </div>
      {userQuiz.userAnswers?.map((userAnswer) => {
        return renderAnswer(userAnswer);
      })}
    </div>
  );
}

export default CompleteQuiz;
