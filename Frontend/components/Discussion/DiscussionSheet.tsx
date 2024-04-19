import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { AiFillWechat } from "react-icons/ai";
import Comment from "../Comment";
import { useAppSelector } from "@/redux/hooks/reduxHooks";
import { useEffect, useState } from "react";
import InputEditor from "../Input/InputEditor";
import { useGetForumLectureByIdMutation } from "@/redux/services/forumApi";
import { ForumLecture } from "@/types/forumLecture";

interface DiscussionSheetProps {
  lectureId: string;
}

function DiscussionSheet(props: DiscussionSheetProps) {
  const { lectureId } = props;
  const avatar = useAppSelector(
    (state) => state.persistedReducer.userReducer.user.photos
  );
  const [getForumLectureById, { data: forumLectureData }] =
    useGetForumLectureByIdMutation();
  const [forumLecture, setForumLecture] = useState<ForumLecture[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isOpenInputEditor, setIsOpenInputEditor] = useState(false);

  useEffect(() => {
    getForumLectureById({
      keyword: [lectureId],
      pageIndex: pageIndex,
      pageSize: 10,
      isDecrease: false,
      sortBy: "created",
    });
  }, [lectureId, pageIndex, getForumLectureById]);

  useEffect(() => {
    if (forumLectureData) {
      setForumLecture((prevForumLecture) => [
        ...prevForumLecture,
        ...(forumLectureData.data as ForumLecture[]),
      ]);
      setIsLoadMore(false);
    }
  }, [forumLectureData]);

  const handleOpenComment = () => {
    setIsOpenInputEditor(true);
  };

  const fetchMoreData = () => {
    if ((forumLectureData?.totalRecords as number) > forumLecture?.length) {
      setIsLoadMore(true);
      setPageIndex((prevPageIndex) => prevPageIndex + 1);
    }
  };

  return (
    <Sheet>
      <SheetTrigger
        asChild
        className="fixed bottom-0 right-1/4 mr-5 mb-5 rounded-3xl gap-1 text-orange-500 xs:hidden "
      >
        <Button variant="outline">
          <AiFillWechat />
          Hỏi đáp
        </Button>
      </SheetTrigger>
      <SheetContent
        className="overflow-y-scroll w-7/12"
        onScroll={(e) => {
          const target = e.target as Element;
          if (
            Math.ceil(target.scrollTop) + target.clientHeight >=
            target.scrollHeight - 10
          ) {
            fetchMoreData();
          }
        }}
      >
        <SheetHeader className="flex-start flex-col ml-2">
          <SheetTitle>54 Bình Luận</SheetTitle>
          <SheetDescription className="font-sans">
            (Hãy bình luận nếu có thắc mắc)
          </SheetDescription>
        </SheetHeader>

        <div className="flex gap-2 items-center mt-10">
          <Image
            src={avatar ? `data:image/png;base64,${avatar}` : "/banner.jpg"}
            alt="avatar"
            width={50}
            height={50}
            className="rounded-full w-[50px] h-[50px]"
          />
          {!isOpenInputEditor ? (
            <p
              className="border-b-4 border-y-none w-full text-gray-400 hover:cursor-pointer"
              onClick={() => handleOpenComment()}
            >
              Bạn có thắc mắc gì
            </p>
          ) : (
            <InputEditor
              setIsOpenInputEditor={setIsOpenInputEditor}
              lectureId={lectureId}
            />
          )}
        </div>
        <div className="mt-10">
          {forumLecture?.map((item, index) => (
            <Comment key={index} data={item} />
          ))}
          {isLoadMore && <h1 className="item-center">Loading...</h1>}
          {/* <InfiniteScroll
            dataLength={forumLecture?.length as number}
            next={fetchMoreData}
            hasMore={true}
            height={"500"}
            className=""
            // style={{
            //   scrollbarWidth: "thin",
            //   scrollbarColor: "transparent transparent",
            // }}
            loader={<h1>Loading...</h1>}
          >
            {forumLecture?.map((item, index) => (
              <div
                key={index}
                // style={{
                //   height: 120,
                // }}
              >
                {forumLecture?.length}
                <Comment />
              </div>
            ))}
          </InfiniteScroll> */}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default DiscussionSheet;
