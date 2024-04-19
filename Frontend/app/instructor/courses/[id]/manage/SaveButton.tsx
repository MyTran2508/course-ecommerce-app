import { Button } from "@/components/ui/button";
import { setStatusSaveCourse } from "@/redux/features/courseSlice";
import { useAppDispatch } from "@/redux/hooks/reduxHooks";
import React, { Fragment, useState } from "react";

function SaveButton() {
  const dispatch = useAppDispatch();
  const [isOpen, setOpen] = useState(false);
  const handleClickSave = () => {
    dispatch(setStatusSaveCourse(true));
    handleClickOpen();
  };
  const handleClickOpen = () => {
    setOpen(!isOpen);
  };
  return (
    <Fragment>
      {isOpen ? (
        <Fragment>
          <div className="flex gap-2">
            <Button
              type="submit"
              className="bg-orange-400 text-black hover:bg-white"
              onClick={() => handleClickSave()}
            >
              Xác Nhận
            </Button>
            <Button
              type="submit"
              className="bg-white text-black hover:bg-white"
              onClick={() => handleClickOpen()}
            >
              Hủy
            </Button>
          </div>
        </Fragment>
      ) : (
        <Button
          type="submit"
          className="bg-white text-black hover:bg-white"
          onClick={() => handleClickOpen()}
        >
          Lưu
        </Button>
      )}
    </Fragment>
  );
}
export default SaveButton;
