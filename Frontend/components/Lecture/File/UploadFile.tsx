import { Input } from "@/components/ui/input";
import { useFileHooks } from "@/redux/hooks/courseHooks/fileHooks";
import { Lecture } from "@/types/section.type";
import React, { Fragment, useEffect, useState } from "react";
import { handleGetDurationFormVideo } from "@/utils/function";
import { useLectureHooks } from "@/redux/hooks/courseHooks/lectureHooks";
import Loading from "@/app/(root)/user/personal/loading";
import { LectureType } from "@/utils/resources";

interface UploadFileProps {
  lecture: Lecture;
  onDisplay?: (isSelectType: boolean) => void;
  type: LectureType;
}

function UploadFile(props: UploadFileProps) {
  const { lecture, onDisplay, type } = props;
  const [isUpload, setUpload] = useState(false);
  const { handleUploadFilesForSection } = useFileHooks();
  const { handleUpdateLecture } = useLectureHooks();

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUpload(true);
      const response = await handleUploadFilesForSection([file]);
      if (response) {
        const url = (response.data as string[])[0];
        lecture.url = url;
        lecture.fileName = file.name;

        if (type === LectureType.VIDEO) {
          const videoDuration = await handleGetDurationFormVideo(file as File);
          lecture.videoDuration = videoDuration;
        }
        await handleUpdateLecture(lecture);
        onDisplay && onDisplay(false);
        setUpload(false);
      }
    }
  };

  return (
    <div>
      <h4 className="font-bold">
        {type === LectureType.VIDEO
          ? "Vui lòng chọn video: "
          : "Vui lòng chọn document"}
      </h4>
      <div className="flex gap-2">
        <strong>Lưu ý: </strong>
        <p className="mb-5">
          {type === LectureType.VIDEO
            ? "Video phải có định dạng .mp4"
            : "Tài liệu có dạng pdf"}
        </p>
      </div>
      {isUpload ? (
        <Fragment>
          <div className="flex gap-2 items-center">
            <Loading />
            <i>File đang tải lên</i>
          </div>
        </Fragment>
      ) : (
        <Input
          className="px-5"
          type="file"
          accept={type === LectureType.VIDEO ? ".mp4" : ".pdf"}
          onChange={handleVideoChange}
        />
      )}
    </div>
  );
}

export default UploadFile;
