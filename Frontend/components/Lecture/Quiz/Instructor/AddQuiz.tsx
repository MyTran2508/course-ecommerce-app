import { Disclosure } from "@headlessui/react";
import React, { Fragment, use, useEffect, useState } from "react";
import { HiChevronUp } from "react-icons/hi";
import { IoIosMenu } from "react-icons/io";
import { CiCircleQuestion } from "react-icons/ci";
import { Button } from "../../../ui/button";
import { IoAddOutline } from "react-icons/io5";
import SelectTypeQuestion from "./SelectTypeQuestion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/reduxHooks";
import {
  Action,
  Constant,
  LectureType,
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  QuizType,
} from "@/utils/resources";
import { setTypeQuizCreate } from "@/redux/features/quizSlice";
import Sortable from "../../DragAndDrop/Sorttable";
import { ExQuiz, Lecture, Question } from "@/types/section.type";
import ActionButtons from "../../ActionButtons";
import { v4 as uuidv4 } from "uuid";
import { useExQuizHooks } from "@/redux/hooks/courseHooks/quizHooks";
import { useGetExQuizByIdQuery } from "@/redux/services/quizApi";
import _ from "lodash";
import { useLectureHooks } from "@/redux/hooks/courseHooks/lectureHooks";
import CreateTitle from "../../CreateTitle";

interface AddQuizProps {
  lecture: Lecture;
  index: number;
  attributes?: any;
  listeners?: any;
}
function AddQuiz(props: AddQuizProps) {
  const { index, lecture, attributes, listeners } = props;
  const dispatch = useAppDispatch();
  const [isSelectTypeQuestion, setSelectTypeQuestion] = useState(false);
  const { data: exQuizData } = useGetExQuizByIdQuery({
    id: lecture.exQuiz?.id || "",
    page: { pageIndex: DEFAULT_PAGE_INDEX, pageSize: DEFAULT_PAGE_SIZE },
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isEdit, setEdit] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const quizType = useAppSelector(
    (state) => state.persistedReducer.quizReducer.typeQuizCreate
  );
  const { handleUpdateListQuestion } = useExQuizHooks();
  const { handleUpdateLecture } = useLectureHooks();

  const handleSelectType = (close: boolean = false) => {
    setSelectTypeQuestion(!isSelectTypeQuestion);
    if (close) {
      dispatch(setTypeQuizCreate(null));
    }
  };

  useEffect(() => {
    if (exQuizData) {
      setQuestions(_.cloneDeep(exQuizData?.data as Question[]));
    }
  }, [exQuizData]);

  useEffect(() => {
    if (isEdit) {
      handleUpdateListQuestion(lecture.exQuiz?.id as string, questions);
      setEdit(false);
    }
  }, [questions]);

  useEffect(() => {
    if (isDelete) {
      lecture.ordinalNumber = -1;
      handleUpdateLecture(lecture);
      setDelete(false);
    }
  }, [isDelete]);

  return (
    <div className="relative">
       {isEdit ? (
        <CreateTitle
          type={LectureType.QUIZ_TEST}
          action={Action.UPDATE}
          data={lecture}
          handleIsOpen={setEdit}
        />
      ) : (<Fragment>
      <div
        className={
          "flex w-full border border-black bg-white px-2 py-4 text-sm font-medium"
        }
      >
        <div className="flex gap-4 group w-full">
          <div className="flex w-max gap-2">
            <p>
              <strong>{index}.</strong> Quiz{" "}
            </p>
            <CiCircleQuestion className={"text-xl"} />
            <label>{lecture.name}</label>
          </div>
          <ActionButtons
            attributes={attributes}
            listeners={listeners}
            handleDelete={setDelete}
            handleEdit={setEdit}
          />
        </div>
        {isSelectTypeQuestion ? (
          <div className="right-1/4 border-b-0 border absolute py-2 px-2 border-black flex gap-2 w-[180px] justify-center items-center">
            {quizType ? (
              quizType === QuizType.MULTIPLE_CHOICE ? (
                <h1>Nhiều Lựa Chọn</h1>
              ) : (
                <h1>Một lựa chọn</h1>
              )
            ) : (
              <h1>Chọn Loại Câu Hỏi</h1>
            )}
            <IoAddOutline
              className="transform rotate-45 text-xl text-black hover:cursor-pointer"
              onClick={() => handleSelectType(true)}
            />
          </div>
        ) : null}
      </div>

      <Disclosure>
        {({ open }) => (
          <>
            <div
              className={
                !open
                  ? "border-y-0"
                  : "flex flex-col border-t-0 border border-black p-2 bg-white mb-5"
              }
            >
              {!isSelectTypeQuestion ? (
                <Disclosure.Button>
                  <div className="right-8 top-4 absolute z-20">
                    <HiChevronUp
                      className={`${
                        open ? "" : "rotate-180 transform"
                      } h-5 w-5 text-orange-500`}
                    />
                  </div>
                </Disclosure.Button>
              ) : null}
              <div className="text-sm bg-white ">
                {open ? (
                  <>
                    {isSelectTypeQuestion ? (
                      <SelectTypeQuestion
                        ordinalNumber={questions.length + 1}
                        exQuizId={lecture.exQuiz?.id as string}
                        handleOpen={setSelectTypeQuestion}
                        action={Action.CREATE}
                      />
                    ) : (
                      <Fragment>
                        <div className="mb-2">
                          <div className="flex items-center gap-2">
                            <h1>Câu hỏi:</h1>
                            <Button
                              className="bg-white hover:bg-slate-200 text-black rounded-none border border-black"
                              onClick={() => handleSelectType()}
                            >
                              Thêm Câu Hỏi
                            </Button>
                          </div>
                        </div>
                        <Sortable
                          data={questions}
                          type={Constant.QUESTION}
                          key={uuidv4()}
                          onDataChange={setQuestions}
                          onDataUpdate={setEdit}
                        />
                      </Fragment>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          </>
        )}
      </Disclosure>
      </Fragment>)}
    </div>
  );
}

export default AddQuiz;
