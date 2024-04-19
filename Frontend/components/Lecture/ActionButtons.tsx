import React, { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import Swal from "sweetalert2";

interface ActionButtonsProps {
  handleEdit?: (isEdit: boolean) => void;
  handleDelete?: (isDelete: boolean) => void;
  handleMenu?: () => void;
  attributes?: any;
  listeners?: any;
}
function ActionButtons(props: ActionButtonsProps) {
  const { handleEdit, handleDelete, handleMenu, attributes, listeners } = props;

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn bg-blue-700 text-white px-4 py-2 rounded-md mx-2",
      cancelButton: "btn bg-red-700 text-white px-4 py-2 rounded-md",
    },
    buttonsStyling: false,
  });

  const handleClickDelete = () => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          handleDelete && handleDelete(true);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            icon: "error",
          });
        }
      });
  };

  return (
    <div className="hidden group-hover:block flex-grow">
      <div className="flex justify-between items-end">
        <div className="flex gap-4">
          <MdModeEditOutline
            className={"text-xl hidden group-hover:block "}
            onClick={() => {
              handleEdit && handleEdit(true);
            }}
          />
          <MdDelete
            className={"text-xl hidden group-hover:block"}
            onClick={() => handleClickDelete()}
          />
        </div>
        <div {...attributes} {...listeners}>
          <IoIosMenu className={"text-xl hidden group-hover:block"} />
        </div>
      </div>
    </div>
  );
}

export default ActionButtons;
