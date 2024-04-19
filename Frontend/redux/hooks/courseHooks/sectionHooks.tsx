import { Section } from "@/types/section.type";
import {
  useAddSectionMutation,
  useAddLectureMutation,
  useUpdateSectionByIdMutation,
  useUpdateListSectionMutation,
} from "../../services/contentApi";
import { useLazyLoadFileDocumentFromCloudQuery } from "@/redux/services/sectionApi";

export function useSectionHooks() {
  const [
    addSection,
    { isLoading: isAddingSection, isSuccess: addSectionSuccess },
  ] = useAddSectionMutation();

  const [updateSection] = useUpdateSectionByIdMutation();
  const [updateListSection] = useUpdateListSectionMutation();
  const [getFileDocument] = useLazyLoadFileDocumentFromCloudQuery();

  const handleAddSection = async (newSection: Section) => {
    await addSection(newSection)
      .unwrap()
      .then((fulfilled) => {
        console.log(fulfilled);
      });
  };

  const handleListUpdateSection = async (
    sectionId: string,
    data: Section[]
  ) => {
    await updateListSection({ id: sectionId, data: data })
      .unwrap()
      .then((fulfilled) => {
        console.log(fulfilled);
      });
  };

  const handleUpdateSection = async (newSection: Section) => {
    await updateSection(newSection)
      .unwrap()
      .then((fulfilled) => {
        console.log(fulfilled);
      });
  };

  const handleGetFileDocument = async (path: string) => {
    return getFileDocument(path)
      .unwrap()
      .then((fulfilled) => {
        return fulfilled;
      });
  };

  return {
    handleAddSection,
    handleUpdateSection,
    handleListUpdateSection,
    handleGetFileDocument,
  };
}
