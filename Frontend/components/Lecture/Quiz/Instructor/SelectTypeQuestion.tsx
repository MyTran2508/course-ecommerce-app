import React, { Fragment, useEffect, useState } from "react";
import { CiCircleQuestion, CiSquarePlus } from "react-icons/ci";
import { v4 as uuidv4 } from "uuid";
import { Action, QuizType, ToastMessage, ToastStatus } from "@/utils/resources";
import { useAppDispatch } from "@/redux/hooks/reduxHooks";
import { setTypeQuizCreate } from "@/redux/features/quizSlice";
import showToast from "@/utils/showToast";
import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";
import { useExQuizHooks } from "@/redux/hooks/courseHooks/quizHooks";
import { Question } from "@/types/section.type";

interface SelectTypeQuizProps {
  ordinalNumber?: number;
  exQuizId?: string;
  handleOpen?: (isOpen: boolean) => void;
  questionData?: Question;
  action: Action;
}

function SelectTypeQuiz(props: SelectTypeQuizProps) {
  const { ordinalNumber, exQuizId, handleOpen, questionData, action } = props;
  const dispatch = useAppDispatch();
  const [isChoiceTypeQuestion, setIsChoiceTypeQuestion] = useState(
    action === Action.UPDATE ? true : false
  );

  const [answers, setAnswers] = useState(
    questionData
      ? questionData.options?.split("\n").map((option, index) => {
          return {
            isChecked: questionData.rightAnswer
              ?.split("\n")
              .includes(index.toString()),
            answerText: option,
            answerExplanation:
              questionData.answerExplanation?.split("\n")[index],
          };
        }) || [{ isChecked: false, answerText: "", answerExplanation: "" }]
      : [{ isChecked: false, answerText: "", answerExplanation: "" }]
  );

  const [question, setQuestion] = useState(
    action === Action.UPDATE ? questionData?.title : ""
  );
  const [typeQuestion, setTypeQuestion] = useState(
    action === Action.UPDATE ? questionData?.quizType : ""
  );
  const [countAnswer, setCountAnswer] = useState(
    action === Action.UPDATE
      ? (questionData && questionData.options?.split("\n").length) || 1
      : 1
  );
  const { handleAddQuestion, handleUpdateQuestion } = useExQuizHooks();

  const handleChoiceTypeQuestion = (type: QuizType) => {
    setIsChoiceTypeQuestion(true);
    setTypeQuestion(type);
    dispatch(setTypeQuizCreate(type));
  };

  // const handleAnswerOption = (
  //   answer: string,
  //   questionId: number,
  //   type: string = QuizType.SINGLE_CHOICE
  // ) => {
  //   setSelectedOptions((prevSelectedOptions: { [key: number]: string[] }) => {
  //     const prevSelectedOption = selectedOptions[questionId];
  //     const updatedOptions = prevSelectedOption
  //       ? type === QuizType.MULTIPLE_CHOICE
  //         ? prevSelectedOption.includes(answer)
  //           ? prevSelectedOption.filter(
  //               (selectedAnswer) => selectedAnswer !== answer
  //             )
  //           : [...prevSelectedOption, answer]
  //         : [answer]
  //       : [answer];
  //     return { ...prevSelectedOptions, [questionId]: updatedOptions };
  //   });
  // };

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
  };

  const handleSetInputValue = (value: string, index: number, field: string) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer, i) =>
        i === index ? { ...answer, [field]: value } : answer
      )
    );
  };

  const handleAddOrDeleteAnswer = (index?: number) => {
    if (index !== undefined) {
      setCountAnswer(countAnswer - 1);
      setAnswers(answers.filter((_, i) => i !== index));
    } else {
      setCountAnswer(countAnswer + 1);
      setAnswers([
        ...answers,
        { isChecked: false, answerText: "", answerExplanation: "" },
      ]);
    }
  };
  const handleSubmit = async () => {
    if (question === "") {
      showToast(ToastStatus.WARNING, ToastMessage.ENTER_QUESTION);
      return;
    }

    const emptyAnswer = answers.find((answer) => answer.answerText === "");
    if (emptyAnswer) {
      showToast(ToastStatus.WARNING, ToastMessage.ENTER_ANSWER);
      return;
    }

    const noRightAnswer = answers.every((answer) => !answer.isChecked);
    if (noRightAnswer) {
      showToast(ToastStatus.WARNING, ToastMessage.ENTER_RIGHT_ANSWER);
      return;
    }

    const emptyExplanation = answers.find(
      (answer) => answer.answerExplanation === "" && answer.isChecked
    );
    if (emptyExplanation) {
      showToast(ToastStatus.WARNING, ToastMessage.ENTER_EXPLANATION);
      return;
    }

    const options = answers.map((answer) => answer.answerText).join("\n");

    const rightAnswer = answers
      .map((answer, index) => {
        if (answer.isChecked) {
          return index;
        }
      })
      .filter((index) => index !== undefined)
      .join("\n");

    const answerExplanation = answers
      .map((answer) => {
        if (answer.isChecked) {
          return answer.answerExplanation;
        }
      })
      .filter((answerExplanation) => answerExplanation !== undefined)
      .join("\n");

    const newQuestion: Question = {
      title: question,
      options: options,
      rightAnswer: rightAnswer,
      answerExplanation: answerExplanation,
    };

    if (action === Action.UPDATE) {
      newQuestion.id = questionData?.id;
      const updatedQuestion = { ...questionData, ...newQuestion };
      handleUpdateQuestion(updatedQuestion);
    } else {
      newQuestion.ordinalNumber = ordinalNumber;
      newQuestion.quizType = typeQuestion as QuizType;
      handleAddQuestion(exQuizId as string, newQuestion);
    }

    handleOpen && handleOpen(false);
  };

  return (
    <div className="">
      {isChoiceTypeQuestion ? (
        <Fragment>
          <div>
            <strong className="mb-2">Câu hỏi:</strong>
            <input
              className="border border-black w-full h-10 pl-2"
              placeholder="Hãy ghi câu hỏi ở đây"
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
            />
          </div>
          <div className="mt-4">
            <strong className="mb-2">Câu trả lời:</strong>
            {Array.from({ length: countAnswer }).map((_, index) => {
              return (
                <div
                  className="flex flex-col gap-5 justify-center py-4 pl-5 m-2 ml-0 space-x-2"
                  key={index}
                >
                  <div className="flex gap-5 w-full items-center">
                    <input
                      type={
                        typeQuestion === QuizType.MULTIPLE_CHOICE
                          ? "checkbox"
                          : "radio"
                      }
                      className="w-6 h-6 bg-black"
                      name="options"
                      id={`${index + 1}`}
                      checked={answers[index].isChecked}
                      onChange={() =>
                        handleAnswerOption(index, typeQuestion as string)
                      }
                    />
                    <input
                      key={index}
                      className="border border-black w-full h-10 pl-2"
                      placeholder="Hãy ghi câu trả lời ở đây"
                      onChange={(e) =>
                        handleSetInputValue(e.target.value, index, "answerText")
                      }
                      value={answers[index].answerText}
                    />
                    <MdDelete
                      className={"text-2xl"}
                      onClick={() => handleAddOrDeleteAnswer(index)}
                    />
                  </div>
                  <div className="px-12 w-full">
                    <input
                      key={index}
                      className="border border-black h-10 pl-2 w-full"
                      placeholder="Tại sao đây là câu trả lời đúng?"
                      onChange={(e) =>
                        handleSetInputValue(
                          e.target.value,
                          index,
                          "answerExplanation"
                        )
                      }
                      value={answers[index].answerExplanation}
                    />
                  </div>
                </div>
              );
            })}
            <div className="flex flex-col items-end pr-2">
              <CiSquarePlus
                className={
                  "text-2xl hover:cursor-pointer hover:text-black mb-5"
                }
                onClick={() => handleAddOrDeleteAnswer()}
              />
              <div className="flex gap-5">
                <button onClick={() => handleOpen && handleOpen(false)}>
                  Hủy
                </button>

                <Button onClick={() => handleSubmit()} className="w-max">
                  {action === Action.UPDATE ? "Cập nhật" : "Thêm câu hỏi"}
                </Button>
              </div>
            </div>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className="flex items-center justify-center gap-2">
            <div
              className="border border-black p-5 pb-2 mt-2 flex flex-col items-center hover:bg-slate-500 hover:cursor-pointer w-[150px]"
              onClick={() => handleChoiceTypeQuestion(QuizType.MULTIPLE_CHOICE)}
            >
              <CiCircleQuestion className={"text-3xl ju"} />
              <p>Nhiều lựa chọn</p>
            </div>
            <div
              className="border border-black p-5 pb-2 mt-2 flex flex-col items-center hover:bg-slate-500 hover:cursor-pointer w-[150px]"
              onClick={() => handleChoiceTypeQuestion(QuizType.SINGLE_CHOICE)}
            >
              <CiCircleQuestion className={"text-3xl"} />
              <p>Một lựa chọn</p>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}

export default SelectTypeQuiz;
