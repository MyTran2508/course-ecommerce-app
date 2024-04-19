import React, { Fragment, useEffect, useState } from "react";
import { Question } from "@/types/section.type";
import SelectTypeQuestion from "./SelectTypeQuestion";
import ActionButtons from "../../ActionButtons";
import { Action } from "@/utils/resources";
import { useExQuizHooks } from "@/redux/hooks/courseHooks/quizHooks";

interface AddQuestionProps {
  question: Question;
  attributes?: any;
  listeners?: any;
}
function AddQuestion(props: AddQuestionProps) {
  const { question, attributes, listeners } = props;
  const [isEdit, setEdit] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const { handleUpdateQuestion } = useExQuizHooks();

  useEffect(() => {
    if (isDelete) {
      question.ordinalNumber = -1;
      handleUpdateQuestion(question);
      setDelete(false);
    }
  }, [isDelete]);
  return (
    <Fragment>
      {isEdit ? (
        <SelectTypeQuestion
          action={Action.UPDATE}
          questionData={question}
          handleOpen={setEdit}
        />
      ) : (
        <div className="flex-between gap-4 mb-2 relative group">
          <div className="flex gap-2">
            <h1>
              <strong>{question.ordinalNumber}. </strong>
            </h1>
            <p>{question.title}</p>
          </div>
          <ActionButtons
            attributes={attributes}
            listeners={listeners}
            handleEdit={setEdit}
            handleDelete={setDelete}
          />
        </div>
      )}
    </Fragment>
  );
}

export default AddQuestion;
