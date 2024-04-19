import React, {
  ChangeEvent,
  Fragment,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Input } from "../ui/input";
import * as _ from "lodash";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/reduxHooks";
import { course, setStatusSaveCourse } from "@/redux/features/courseSlice";
import { BiMessageSquareAdd } from "react-icons/bi";
import {
  Action,
  Constant,
  CourseLectureField,
  LectureType,
  StatusCode,
  ToastMessage,
  ToastStatus,
} from "@/utils/resources";
import { useUpdateSectionByIdMutation } from "@/redux/services/contentApi";
import showToast from "@/utils/showToast";
import { DataResponse } from "@/types/response.type";
import { Label } from "../ui/label";
import { AiTwotoneDelete } from "react-icons/ai";
import { Lecture, Section } from "@/types/section.type";
import { useUploadSectionFilesMutation } from "@/redux/services/sectionApi";
import { handleGetDurationFormVideo } from "@/utils/function";
import { v4 as uuidv4 } from "uuid";
import { IoAddOutline } from "react-icons/io5";
import Loading from "@/app/(root)/user/personal/loading";
import LectureTypeBox from "../Lecture/LectureTypeBox";
import AddQuiz from "../Lecture/Quiz/Instructor/AddQuiz";
import Sorttable from "../Lecture/DragAndDrop/Sorttable";
import SectionComponent from "../Section/Section";
import CreateTitle from "../Lecture/CreateTitle";
import Sortable from "../Lecture/DragAndDrop/Sorttable";
import { useSectionHooks } from "@/redux/hooks/courseHooks/sectionHooks";

interface CourseSectionProps {
  contentId: string;
  sections: Section[];
}

function CourseSectionForm(props: CourseSectionProps) {
  const { contentId, sections } = props;
  const [sectionData, setSectionData] = useState<Section[]>(sections);
  const [isUpdateSection, setUpdateSection] = useState(false);
  const [isCreateNewSection, setCreateNewSection] = useState(false);
  const { handleListUpdateSection } = useSectionHooks();

  useEffect(() => {
    if (isUpdateSection) {
      handleListUpdateSection(contentId, sectionData);
      setUpdateSection(false);
    }
  }, [isUpdateSection]);

  const handleAddNewSection = () => {
    setCreateNewSection(!isCreateNewSection);
  };

  useEffect(() => {
    setSectionData(sections);
  }, [sections]);

  return (
    <div>
      <div>
        <Sortable
          data={sectionData}
          key={uuidv4()}
          type={Constant.SECTION}
          onDataChange={setSectionData}
          onDataUpdate={setUpdateSection}
        />
        {isCreateNewSection ? (
          <CreateTitle
            handleIsOpen={setCreateNewSection}
            type={Constant.SECTION}
            key={uuidv4()}
            parentId={contentId}
            ordinalNumber={
              sections.filter(
                (section) => (section.ordinalNumber as number) > 0
              ).length + 1
            }
            action={Action.CREATE}
          />
        ) : (
          <div
            className="hover: cursor-pointer flex items-center text-orange-500 gap-1 my-5"
            onClick={() => handleAddNewSection()}
          >
            <BiMessageSquareAdd /> Chương
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseSectionForm;
