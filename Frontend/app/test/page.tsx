"use client";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { QuizType } from "@/utils/resources";
import DiscussionSheet from "@/components/Discussion/DiscussionSheet";

const questions = [
  {
    question: "What type of framework is Next.js?",
    quizType: QuizType.SINGLE_CHOICE,
    answerOptions: [
      { answer: "Frontend" },
      { answer: "Backend" },
      { answer: "FullStack", isCorrect: true },
      { answer: "None of the above" },
    ],
  },
  {
    question: "When was Next.js released?",
    quizType: QuizType.MULTIPLE_CHOICE,
    answerOptions: [
      { answer: "20 September 2019" },
      { answer: "14 January 2017" },
      { answer: "25 October 2016", isCorrect: true },
      { answer: "28 March 2018" },
    ],
  },
  {
    question: "Which CSS Framework are we using?",
    quizType: QuizType.MULTIPLE_CHOICE,
    answerOptions: [
      { answer: "Bootstrap" },
      { answer: "TailwindCSS", isCorrect: true },
      { answer: "Chakra UI" },
      { answer: "Bulma CSS" },
    ],
  },
  {
    question:
      "Which class in Tailwind is used to set flex direction of column?",
    answerOptions: [
      { answer: "col" },
      { answer: "col-flex" },
      { answer: "flex-col", isCorrect: true },
      { answer: "None of the above" },
    ],
  },
];

function Page() {
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: string[];
  }>({});
  const [totalScore, setTotalScore] = useState(0);

  // const handleAnswerOption = (
  //   answer: string,
  //   questionId: number,
  //   type: string = QuizType.SINGLE_CHOICE
  // ) => {
  //   setSelectedOptions((prevSelectedOptions: { [key: number]: string[] }) => {
  //     const prevSelectedOption = selectedOptions[questionId];
  //     console.log(prevSelectedOption);
  //     const updatedOptions = prevSelectedOption
  //       ? type === QuizType.MULTIPLE_CHOICE
  //         ? prevSelectedOption.includes(answer)
  //           ? prevSelectedOption.filter(
  //               (selectedAnswer) => selectedAnswer !== answer
  //             )
  //           : [...prevSelectedOption, answer]
  //         : [answer]
  //       : [answer];
  //     console.log(updatedOptions);

  //     return { ...prevSelectedOptions, [questionId]: updatedOptions };
  //   });
  // };
  // const renderQuiz = (quiz: any, idQuiz: number) => {
  //   return (
  //     <>
  //       <div className="flex flex-col w-full">
  //         <div className="flex flex-col items-start w-full">
  //           <h4 className="mt-10 text-xl text-black/60">
  //             Question {idQuiz + 1} of 5
  //           </h4>
  //           <div className="mt-4 text-2xl">{quiz.question}</div>
  //         </div>

  //         {quiz.answerOptions.map((answer: any, answerIndex: number) => {
  //           const questionId = idQuiz;
  //           const isSelected = Array.isArray(selectedOptions[questionId])
  //             ? selectedOptions[questionId].includes(answer.answer)
  //             : selectedOptions[questionId] === answer.answer;

  //           return (
  //             <div
  //               key={uuidv4()}
  //               className="flex items-center w-full py-4 pl-5 m-2 ml-0 space-x-2 border-2 cursor-pointer border-black/10 rounded-xl bg-black/5"
  //               onClick={() => handleAnswerOption(answer.answer, questionId)}
  //             >
  //               <input
  //                 type={
  //                   quiz.quizType === QuizType.MULTIPLE_CHOICE
  //                     ? "checkbox"
  //                     : "radio"
  //                 }
  //                 name={`answer-${questionId}`}
  //                 value={answer.answer}
  //                 onChange={() =>
  //                   handleAnswerOption(answer.answer, questionId, quiz.quizType)
  //                 }
  //                 checked={isSelected}
  //                 className="w-6 h-6 bg-black"
  //               />
  //               <p className="ml-6 ">{answer.answer}</p>
  //             </div>
  //           );
  //         })}
  //       </div>
  //     </>
  //   );
  // };

  // useEffect(() => {
  //   console.log(selectedOptions);
  // }, [selectedOptions]);
  useEffect(() => {
    console.log(totalScore);
  }, [totalScore]);

  const [items, setItems] = useState(Array.from({ length: 20 }));

  const fetchMoreData = () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    setTimeout(() => {
      setItems(items.concat(Array.from({ length: 20 })));
    }, 1500);
  };

  return (
    <div className="mt-10">
      <DiscussionSheet lectureId="3abb65a0-617d-4092-a105-fc78a8dc50f5" />
      {/* <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        {items.map((i, index) => (
          <div
            style={{
              // height: 30,
              // border: "1px solid green",
              margin: 6,
              padding: 8,
            }}
            key={index}
          >
            div - #{index}
          </div>
        ))}
      </InfiniteScroll> */}
      {/* <DiscussionSheet lectureId="31e97379-27c8-49db-8dbe-40fa32385f4c" /> */}
    </div>
  );
}

export default Page;
