import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Constant, LectureType } from "@/utils/resources";
import AddQuestion from "../Quiz/Instructor/AddQuestion";
import SectionComponent from "../../Section/Section";
import AddQuiz from "../Quiz/Instructor/AddQuiz";
import FileLecture from "../File/FileLecture";

interface SortableItemProp {
  id: string;
  type?: LectureType | Constant;
  data?: object;
  index: number;
}

export function SortableItem(props: SortableItemProp) {
  const { id, type, data, index } = props;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    // transform: CSS.Transform.toString(transform),
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div>
      <div ref={setNodeRef} style={style}>
        {type === Constant.SECTION && (
          <SectionComponent
            section={data as object}
            index={index}
            attributes={attributes}
            listeners={listeners}
          />
        )}
        {type === LectureType.QUIZ_TEST && (
          <AddQuiz
            index={index}
            lecture={data as object}
            attributes={attributes}
            listeners={listeners}
          />
        )}
        {(type === LectureType.VIDEO || type === LectureType.DOCUMENT) && (
          <FileLecture
            data={data as object}
            index={index}
            attributes={attributes}
            listeners={listeners}
            type={type}
          />
        )}
        {type === Constant.QUESTION && (
          <AddQuestion
            question={data as object}
            attributes={attributes}
            listeners={listeners}
          />
        )}
        {/* {type === LectureType.DOCUMENT && (
          <DocumentComponent
            doc={data as object}
            attributes={attributes}
            listeners={listeners}
          />
        )} */}
      </div>
    </div>
  );
}
