import { useLazyLoadFileFromCloudQuery } from "@/redux/services/courseApi";
import { useUploadSectionFilesMutation } from "@/redux/services/sectionApi";

export function useFileHooks() {
  const [
    uploadFilesForSection,
    { isLoading: isUploadFiles, isSuccess: uploadFilesSuccess },
  ] = useUploadSectionFilesMutation();
  const [loadFile, { data: fileBase64, isSuccess: loadFileSuccess }] =
    useLazyLoadFileFromCloudQuery();

  const handleUploadFilesForSection = async (files: File[]) => {
    return uploadFilesForSection(files)
      .unwrap()
      .then((fulfilled) => {
        return fulfilled;
      });
  };

  const handleLoadFile = async (url: string) => {
    return loadFile(url)
      .unwrap()
      .then((fulfilled) => {
        return fulfilled;
      });
  };

  return {
    handleUploadFilesForSection,
    isUploadFiles,
    uploadFilesSuccess,
    handleLoadFile,
  };
}
