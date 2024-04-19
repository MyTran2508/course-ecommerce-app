import Image from "next/image";
import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import { Input } from "./ui/input";
import InputEditor from "./Input/InputEditor";
import { useAppSelector } from "@/redux/hooks/reduxHooks";
import { EditorState, convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { ForumLecture } from "@/types/forumLecture";

interface CommentProps {
  data: ForumLecture;
}

function Comment(props: CommentProps) {
  const { data } = props;
  const [text, setText] = useState<EditorState>(
    data
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(data.comment || ""))
        )
      : EditorState.createEmpty()
  );

  const avatar = useAppSelector(
    (state) => state.persistedReducer.userReducer.user.photos
  );
  const [isOpenReply, setIsOpenReply] = useState(false);

  const replyComment = () => {
    setIsOpenReply(true);
  };
  useEffect(() => {}, [text]);
  return (
    <div className="flex flex-col mb-4">
      <div className="flex">
        <Image
          src="/banner.jpg"
          alt="avatar"
          width={70}
          height={65}
          className="rounded-full w-[40px] h-[40px]"
        />
        <div className="bg-gray-200 p-2 px-4 ml-4 rounded-2xl min-w-[60%]">
          <div className="font-bold">Đạt</div>
          <div className="w-full mt-2 text-sm">
            <div
              dangerouslySetInnerHTML={{
                __html: stateToHTML(text.getCurrentContent()),
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <CustomButton
          title="Trả lời"
          containerStyles="ml-16 text-sm mt-2 hover:text-orange-200"
          handleClick={() => replyComment()}
        />
      </div>
      {isOpenReply && (
        <div className="flex gap-2 items-center my-10">
          <Image
            src={avatar ? `data:image/png;base64,${avatar}` : "/banner.jpg"}
            alt="avatar"
            width={50}
            height={50}
            className="rounded-full w-[50px] h-[50px]"
          />
          <InputEditor
            setIsOpenInputEditor={setIsOpenReply}
            lectureId={data.lectureId as string}
          />
        </div>
      )}
    </div>
  );
}

export default Comment;
