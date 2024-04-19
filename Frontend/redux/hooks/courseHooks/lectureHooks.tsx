import { Lecture, Section } from "@/types/section.type";
import {
  useAddSectionMutation,
  useAddLectureMutation,
  useUpdateLectureMutation,
  useUpdateListLectureMutation,
} from "../../services/contentApi";

export function useLectureHooks() {
  const [
    addLecture,
    { isLoading: isAddingLecture, isSuccess: addLectureSuccess },
  ] = useAddLectureMutation();

  const [
    updateLecture,
    { isLoading: isUpdatingLecture, isSuccess: updateLectureSuccess },
  ] = useUpdateLectureMutation();

  const [
    updateListLecture,
    { isLoading: isUpdatingListLecture, isSuccess: updateListLectureSuccess },
  ] = useUpdateListLectureMutation();

  const handleAddLecture = async (sectionId: string, newLecture: Lecture) => {
    await addLecture({ id: sectionId, data: newLecture })
      .unwrap()
      .then((fulfilled) => {
        console.log(fulfilled);
      });
  };
  const handleUpdateLecture = async (lecture: Lecture) => {
    await updateLecture(lecture)
      .unwrap()
      .then((fulfilled) => {
        console.log(fulfilled);
      });
  };

  const handleListUpdateLecture = async (
    sectionId: string,
    data: Lecture[]
  ) => {
    await updateListLecture({ id: sectionId, data: data })
      .unwrap()
      .then((fulfilled) => {
        console.log(fulfilled);
      });
  };

  return {
    handleAddLecture,
    handleUpdateLecture,
    handleListUpdateLecture,
  };
}
