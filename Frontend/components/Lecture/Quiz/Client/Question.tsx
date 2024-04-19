import { UserAnswerRequest } from "@/types/request.type";
import { Question } from "@/types/section.type";
import { QuizType } from "@/utils/resources";
import { set } from "lodash";
import React, { Fragment, useEffect, useState } from "react";

interface QuestionProps {
  userAnswer: UserAnswerRequest;
  updateUserAnswer: (userAnswer: UserAnswerRequest) => void;
}

function QuestionComponent(props: QuestionProps) {
  const { userAnswer, updateUserAnswer } = props;
  const [answers, setAnswers] = useState(
    userAnswer
      ? (userAnswer.question as Question).options
          ?.split("\n")
          .map((answer, index) => {
            return {
              isChecked: userAnswer.currentAnswer
                ?.split("\n")
                .includes(index.toString()),
              answerText: answer,
            };
          }) || [{ isChecked: false, answerText: "" }]
      : [{ isChecked: false, answerText: "" }]
  );
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswerOption = (index: number, typeQuestion: string) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer, i) => {
        if (typeQuestion === QuizType.SINGLE_CHOICE) {
          return { ...answer, isChecked: i === index ? true : false };
        } else {
          return {
            ...answer,
            isChecked: i === index ? !answer.isChecked : answer.isChecked,
          };
        }
      })
    );
    setIsAnswered(true);
  };
  useEffect(() => {
    if (isAnswered) {
      const currentAnswer = answers
        .map((answer, index) => (answer.isChecked ? index : null))
        .filter((index) => index !== null)
        .join("\n");
      updateUserAnswer({
        ...userAnswer,
        currentAnswer: currentAnswer,
      });
      setIsAnswered(false);
    }
  }, [isAnswered]);

  return (
    <div>
      <div
        // key={uuidv4()}
        className="w-full pl-5 m-1 ml-0 space-x-2 border-2 cursor-pointer border-black/10 rounded-xl bg-black/5"
        // onClick={() => handleAnswerOption(answer.answer, questionId)}
      >
        <div className="flex flex-col items-start w-full">
          <h4 className="mt-10 text-xl text-black/60">
            Question {(userAnswer.question as Question).ordinalNumber as number}{" "}
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
                    name={`answer-${(userAnswer.question as Question).id}`}
                    value={answer.answerText}
                    onChange={() =>
                      handleAnswerOption(
                        index,
                        (userAnswer.question as Question).quizType as QuizType
                      )
                    }
                    checked={answer.isChecked}
                    className="w-6 h-6 bg-black"
                  />
                  <p className="ml-3">{answer.answerText}</p>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default QuestionComponent;
