import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  IssueType,
  SecurityLevel,
  ToastMessage,
  ToastStatus,
} from "@/utils/resources";
import { useUpdateApprovedMutation } from "@/redux/services/courseApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/reduxHooks";
import showToast from "@/utils/showToast";
import { setManageCourse } from "@/redux/features/courseSlice";
import { Course } from "@/types/course.type";

export function Message() {
  const course = useAppSelector((state) => state.courseReducer.manageCourse);
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");
  const [selectedIssueType, setSelectedIssueType] = useState("0");
  const [selectedSecurityLevel, setSelectedSecurityLevel] = useState("HIGH");
  const [updateApproveCourse] = useUpdateApprovedMutation();

  const handleDeclineCourse = async (e: any) => {
    e.preventDefault();
    if (!message) {
      showToast(ToastStatus.WARNING, "Vui lòng nhập lỗi trước khi xác nhận");
      return;
    }
    const request = {
      courseId: course?.id as string,
      isApproved: false,
      courseIssueReport: {
        issueType: selectedIssueType,
        message: message,
        severityLevel: selectedSecurityLevel,
      },
    };
    console.log(request);
    await updateApproveCourse(request)
      .unwrap()
      .then((fulfilled) => {
        showToast(ToastStatus.SUCCESS, ToastMessage.UPDATE_COURSE_SUCCESS);
        dispatch(
          setManageCourse({ ...(course as Course), isAwaitingApproval: false })
        );
      });
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-red-600 text-white hover:bg-red-400">
            Không Chấp Nhận
          </Button>
        </DialogTrigger>
        <DialogContent className=" ">
          <DialogHeader>
            <DialogTitle>Lý Do Xét Duyệt Không Thành Công</DialogTitle>
          </DialogHeader>
          <Input
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập lỗi ..."
            required={true}
          />
          <div className="flex-between">
            <div>
              <Select
                onValueChange={(e) => setSelectedIssueType(e)}
                defaultValue="0"
              >
                <SelectTrigger
                  className={`focus-visible:ring-0 disabled:opacity-1 disabled:cursor-default w-[200px]`}
                >
                  <SelectValue
                    placeholder="Chọn Lỗi"
                    className="text-sm w-full"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Chọn Lỗi</SelectLabel>
                    <SelectItem value={"0"}>
                      {IssueType.CONTENT_FORMAT}
                    </SelectItem>
                    <SelectItem value={"1"}>{IssueType.FILE_ERROR}</SelectItem>
                    <SelectItem value={"2"}>{IssueType.OTHER}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                onValueChange={(e) => setSelectedSecurityLevel(e)}
                defaultValue="HIGH"
              >
                <SelectTrigger
                  className={`focus-visible:ring-0 disabled:opacity-1 disabled:cursor-default w-[200px]`}
                >
                  <SelectValue
                    placeholder="Chọn mức độ lỗi"
                    className="text-sm w-full"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Chọn mức độ lỗi</SelectLabel>
                    <SelectItem value={SecurityLevel.HIGH}>
                      {SecurityLevel.HIGH}
                    </SelectItem>
                    <SelectItem value={SecurityLevel.MEDIUM}>
                      {SecurityLevel.MEDIUM}
                    </SelectItem>
                    <SelectItem value={SecurityLevel.LOW}>
                      {SecurityLevel.LOW}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* <InputEditor /> */}
          <DialogFooter>
            <Button type="submit" onClick={handleDeclineCourse}>
              Xác Nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default Message;
