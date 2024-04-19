import { Lecture, Section } from "@/types/section.type";
import React, { Fragment, useEffect, useState } from "react";
import LectureTypeBox from "../Lecture/LectureTypeBox";
import { BiMessageSquareAdd } from "react-icons/bi";
import { IoAddOutline } from "react-icons/io5";
import Sortable from "../Lecture/DragAndDrop/Sorttable";
import { v4 as uuidv4 } from "uuid";
import { Action, Constant } from "@/utils/resources";
import { useLectureHooks } from "@/redux/hooks/courseHooks/lectureHooks";
import ActionButtons from "../Lecture/ActionButtons";
import CreateTitle from "../Lecture/CreateTitle";
import { useSectionHooks } from "@/redux/hooks/courseHooks/sectionHooks";

interface SectionProps {
  section: Section;
  index: number;
  attributes?: any;
  listeners?: any;
}

function SectionComponent(props: SectionProps) {
  const { section, index, attributes, listeners } = props;
  const [lectures, setLectures] = useState<Lecture[]>(
    section.lectures as Lecture[]
  );
  const [isUpdateListLecture, setUpdateListLecture] = useState(false);
  const [isCreatedNewLecture, setNewCreatedLecture] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const { handleListUpdateLecture } = useLectureHooks();
  const { handleUpdateSection } = useSectionHooks();

  const handleOpenOptionsAddLecture = (isOpen: boolean) => {
    setNewCreatedLecture(isOpen);
  };

  useEffect(() => {
    if (isUpdateListLecture) {
      handleListUpdateLecture(section.id as string, lectures);
      setUpdateListLecture(false);
    }
  }, [isUpdateListLecture]);

  useEffect(() => {
    if (isDelete) {
      const updatedSection = { ...section, lectures: [] };
      updatedSection.ordinalNumber = -1;
      handleUpdateSection(updatedSection);
      setDelete(false);
    }
  }, [isDelete]);

  return (
    <div
      key={section.id}
      className="bg-gray-100 flex flex-col py-4 px-3 my-4 mr-20"
    >
      {isEdit ? (
        <CreateTitle
          type={Constant.SECTION}
          action={Action.UPDATE}
          data={section}
          handleIsOpen={setEdit}
        />
      ) : (
        <div className="flex gap-5 mb-5 relative group">
          <div className="flex gap-2 w-max">
            <strong className="w-max"> {"Chương " + index}: </strong>
            {section.name}
          </div>
          <ActionButtons
            handleEdit={setEdit}
            key={section.id}
            attributes={attributes}
            listeners={listeners}
            handleDelete={setDelete}
          />
        </div>
      )}

      <div className="flex flex-col mx-10">
        <Sortable
          data={lectures}
          key={uuidv4()}
          type={Constant.LECTURE}
          onDataChange={setLectures as any}
          onDataUpdate={setUpdateListLecture}
        />
      </div>
      {isCreatedNewLecture ? (
        <Fragment>
          <div className="rounded-full border p-1 w-max border-blue-200">
            <IoAddOutline
              className="transform rotate-45 text-xl text-black hover:cursor-pointer"
              onClick={() => handleOpenOptionsAddLecture(false)}
            />
          </div>
          <div className="ml-10">
            <LectureTypeBox
              parentId={section.id as string}
              ordinalNumber={
                lectures.filter(
                  (lecture) => (lecture.ordinalNumber as number) > 0
                ).length + 1
              }
            />
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div
            className="hover:cursor-pointer flex items-center text-orange-500 gap-1 mb-5 mx-10"
            onClick={() => handleOpenOptionsAddLecture(true)}
          >
            <BiMessageSquareAdd /> Bài Học
          </div>
        </Fragment>
      )}
    </div>
  );
}

export default SectionComponent;
