import React, { Fragment, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import UserDialog from "./UserDialog";
import { User } from "@/types/user.type";
import { useUpdateUserAdminMutation } from "@/redux/services/userApi";
import showToast from "@/utils/showToast";
import { ToastMessage, ToastStatus } from "@/utils/resources";
import { Course } from "@/types/course.type";
import { useAppDispatch } from "@/redux/hooks/reduxHooks";
import { updateUser } from "@/redux/features/userSlice";
import { useRouter } from "next/navigation";
import { setManageCourse } from "@/redux/features/courseSlice";

interface ActionCellProps {
  user?: User;
  course?: Course;
}

const ActionsCell = (props: ActionCellProps) => {
  const router = useRouter();
  const { user, course } = props;
  const [isOpenUserDialog, setIsOpenUserDialog] = useState(false);
  const [updateUserAdmin] = useUpdateUserAdminMutation();
  const dispatch = useAppDispatch();

  const handleUpdateUserAdmin = async (user: User) => {
    await updateUserAdmin(user)
      .unwrap()
      .then((fulfilled) => {
        console.log("dzô updateadmin");
        dispatch(updateUser());
        showToast(ToastStatus.SUCCESS, ToastMessage.UPDATE_USER_SUCCESS);
      });
  };

  const handleEditUser = () => {
    setIsOpenUserDialog(true);
  };

  const handleViewCourse = () => {
    dispatch(setManageCourse(course as Course));
    router.push(`/instructor/courses/${course?.id}/manage/content`);
  };

  const updateUserActivationStatus = (item: User) => {
    const user = { ...item, removed: !item.removed };
    handleUpdateUserAdmin(user);
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {user ? (
            <Fragment>
              <DropdownMenuItem onClick={() => handleEditUser()}>
                Xem Chi Tiết
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => updateUserActivationStatus(user)}
              >
                {user.removed ? "Khôi Phục Tài Khoản" : "Xóa Tài Khoản"}
              </DropdownMenuItem>
            </Fragment>
          ) : null}
          {course ? (
            <Fragment>
              <DropdownMenuItem onClick={() => handleViewCourse()}>
                Xem Chi Tiết
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem
                onClick={() => updateUserActivationStatus(user)}
              >
                {user.removed ? "Khôi Phục Tài Khoản" : "Xóa Tài Khoản"}
              </DropdownMenuItem> */}
            </Fragment>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      <UserDialog
        isOpen={isOpenUserDialog}
        setIsOpen={setIsOpenUserDialog}
        user={user as User}
      />
    </div>
  );
};

export default ActionsCell;
